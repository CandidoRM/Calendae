type ContactRow = {
  name?: string[];
  tel?: string[];
  email?: string[];
};

type ContactsPicker = {
  select: (props: string[], opts?: { multiple?: boolean }) => Promise<ContactRow[]>;
  getProperties?: () => Promise<string[]>;
};

export function formatBrPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    digits = digits.slice(2);
  }
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length > 2) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return raw.trim();
}

export function splitContact(raw: string): { name: string; phone: string; digits: string } {
  const trimmed = raw.trim();
  let collected = "";
  let i = trimmed.length - 1;
  while (i >= 0 && collected.length < 13) {
    const ch = trimmed[i];
    if (/\d/.test(ch)) collected = ch + collected;
    else if (collected.length && /[\s()\-+./]/.test(ch)) {
      /* keep walking through phone punctuation */
    } else if (collected.length) break;
    i -= 1;
  }
  const local = brLocal(collected) ?? (collected.length >= 10 ? compactPhone(collected) : "");
  if (local.length === 10 || local.length === 11) {
    const name = trimmed.slice(0, i + 1).replace(/[\s,;.\-]+$/, "").trim();
    return { name, phone: formatBrPhone(local), digits: local };
  }
  return { name: trimmed, phone: "", digits: "" };
}

/** Tira do texto a primeira sequência que parece telefone (10 a 15 dígitos). */
export function pullPhone(raw: string): { name: string; phone: string } | null {
  const re = /(?:\+|00)?[\d(][\d\s().-]{7,}\d/g;
  for (const match of raw.matchAll(re)) {
    const digits = match[0].replace(/\D/g, "").replace(/^00/, "");
    const local =
      digits.startsWith("55") && (digits.length === 12 || digits.length === 13) ? digits.slice(2) : digits;
    if (local.length < 10 || local.length > 15) continue;
    const index = match.index ?? 0;
    const name = `${raw.slice(0, index)}${raw.slice(index + match[0].length)}`
      .replace(/\s{2,}/g, " ")
      .replace(/^[\s,;|/.-]+|[\s,;|/.-]+$/g, "")
      .trim();
    const phone = local.length === 10 || local.length === 11 ? formatBrPhone(local) : `+${local}`;
    return { name, phone };
  }
  return null;
}

function brLocal(digits: string): string | null {
  const clean = digits.replace(/\D/g, "");
  if (clean.startsWith("55") && (clean.length === 12 || clean.length === 13)) return clean.slice(2);
  if (clean.length === 10 || clean.length === 11) return clean;
  return null;
}

function withCountry(digits: string): string {
  const local = brLocal(digits);
  if (local) return `55${local}`;
  const clean = digits.replace(/\D/g, "");
  return clean.length >= 8 ? clean : "";
}

export function telHref(digits: string): string {
  const local = brLocal(digits);
  if (local) return `tel:${local}`;
  const clean = digits.replace(/\D/g, "");
  return clean ? `tel:+${clean}` : "";
}

export function waHref(digits: string): string {
  const n = withCountry(digits);
  return n ? `https://wa.me/${n}` : "";
}

export const CONTACT_MAX = 35;

export function compactPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("55") && digits.length >= 12) digits = digits.slice(2);
  return digits.replace(/^0+/, "");
}

export function abbreviateName(name: string, max: number): string {
  const trimmed = name.trim().replace(/\s+/g, " ");
  if (max <= 0) return "";
  if (trimmed.length <= max) return trimmed;
  const parts = trimmed.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, max);
  const particle = (word: string) => /^(d[aeo]s?|e)$/i.test(word);
  const first = parts[0];
  const last = parts[parts.length - 1];
  const middle = parts.slice(1, -1).filter((word) => !particle(word));
  const attempts = [
    [first, ...middle.map((word) => `${word[0]?.toUpperCase()}.`), last].join(" "),
    `${first} ${last}`,
    `${first} ${last[0]?.toUpperCase()}.`,
    `${first[0]?.toUpperCase()}. ${last}`,
  ];
  for (const item of attempts) {
    if (item.length <= max) return item;
  }
  return first.length <= max ? first : trimmed.slice(0, max);
}

export function fitContact(raw: string, max = CONTACT_MAX): string {
  const { name, phone, digits } = splitContact(raw.trim());
  const pretty = phone || (digits ? formatBrPhone(digits) : "");
  const compact = compactPhone(phone || digits);
  const join = (label: string, number: string) => [label, number].filter(Boolean).join(" ");

  if (!pretty && !compact) return abbreviateName(name || raw.trim(), max);

  if (join(name, pretty).length <= max) return join(name, pretty);

  const prettyRoom = Math.max(0, max - pretty.length - (pretty ? 1 : 0));
  const shortName = abbreviateName(name, prettyRoom);
  if (join(shortName, pretty).length <= max) return join(shortName, pretty);

  const compactRoom = Math.max(0, max - compact.length - (compact ? 1 : 0));
  return join(abbreviateName(name, compactRoom), compact);
}

export async function pickDeviceContact(): Promise<string | null> {
  try {
    const picker = (navigator as Navigator & { contacts?: ContactsPicker }).contacts;
    if (!picker?.select) return null;
    const available = (await picker.getProperties?.()) ?? ["name", "tel"];
    const props = ["name", "tel"].filter((key) => available.includes(key));
    const rows = await picker.select(props.length ? props : ["name"], { multiple: false });
    const row = rows[0];
    if (!row) return null;
    const name = row.name?.[0]?.trim() ?? "";
    const tel = row.tel?.[0] ? formatBrPhone(row.tel[0]) : "";
    const raw = [name, tel].filter(Boolean).join(" ");
    return raw ? fitContact(raw) : null;
  } catch {
    return null;
  }
}
