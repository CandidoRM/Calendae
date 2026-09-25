import { civilDate, fallbackHolidays, isNational, toIso, type CalEvent } from "@/lib/calendar";

/** Caixa: início e prazo do saque-aniversário (mês de nascimento 1–12). */
export const CONFIRMED_FGTS: Record<number, Record<number, { iso: string; until: string }>> = {
  2026: {
    1: { iso: "2026-01-02", until: "2026-03-31" },
    2: { iso: "2026-02-02", until: "2026-04-30" },
    3: { iso: "2026-03-02", until: "2026-05-29" },
    4: { iso: "2026-04-01", until: "2026-06-30" },
    5: { iso: "2026-05-04", until: "2026-07-31" },
    6: { iso: "2026-06-01", until: "2026-08-31" },
    7: { iso: "2026-07-01", until: "2026-09-30" },
    8: { iso: "2026-08-03", until: "2026-10-30" },
    9: { iso: "2026-09-01", until: "2026-11-30" },
    10: { iso: "2026-10-01", until: "2026-12-30" },
    11: { iso: "2026-11-02", until: "2027-01-29" },
    12: { iso: "2026-12-01", until: "2027-02-26" },
  },
};

function offDays(year: number): Set<string> {
  return new Set(
    fallbackHolidays(year)
      .filter((event) => isNational(event) || event.holidayKind === "facultative")
      .map((event) => event.iso),
  );
}

function isUtil(iso: string, off: Set<string>): boolean {
  const dow = fromDow(iso);
  return dow !== 0 && dow !== 6 && !off.has(iso);
}

function fromDow(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return civilDate(y, m - 1, d).getDay();
}

function firstUtil(year: number, monthIndex: number): string {
  const off = new Set([...offDays(year), ...offDays(year + 1)]);
  const cursor = civilDate(year, monthIndex, 1);
  for (let i = 0; i < 12; i++) {
    const iso = toIso(cursor);
    if (isUtil(iso, off)) return iso;
    cursor.setDate(cursor.getDate() + 1);
  }
  return toIso(civilDate(year, monthIndex, 1));
}

function lastUtil(year: number, monthIndex: number): string {
  const off = new Set([...offDays(year), ...offDays(year + 1), ...offDays(year - 1)]);
  const cursor = civilDate(year, monthIndex + 1, 0);
  for (let i = 0; i < 12; i++) {
    const iso = toIso(cursor);
    if (isUtil(iso, off)) return iso;
    cursor.setDate(cursor.getDate() - 1);
  }
  return toIso(civilDate(year, monthIndex + 1, 0));
}

/** Prazo: último dia útil do mês de nascimento + 2. */
function projectedUntil(year: number, birthMonth: number): string {
  const start = civilDate(year, birthMonth - 1, 1);
  start.setMonth(start.getMonth() + 2);
  return lastUtil(start.getFullYear(), start.getMonth());
}

export function fgtsWindow(
  year: number,
  birthMonth: number,
): { iso: string; until: string; confirmed: boolean } {
  const known = CONFIRMED_FGTS[year]?.[birthMonth];
  if (known) return { ...known, confirmed: true };
  return {
    iso: firstUtil(year, birthMonth - 1),
    until: projectedUntil(year, birthMonth),
    confirmed: false,
  };
}

const PT_MONTHS = [
  "janeiro","fevereiro","marco","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro",
] as const;

function fold(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function readDate(chunk: string, fallbackYear: number): string | null {
  const iso = chunk.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const slash = chunk.match(/(\d{1,2})\s*[\/\-]\s*(\d{1,2})(?:\s*[\/\-]\s*(\d{2,4}))?/);
  if (slash) {
    const year = slash[3] ? (slash[3].length === 2 ? 2000 + Number(slash[3]) : Number(slash[3])) : fallbackYear;
    return toIso(civilDate(year, Number(slash[2]) - 1, Number(slash[1])));
  }
  const named = chunk.match(
    /(\d{1,2})\s+de\s+(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de\s+(\d{4}))?/,
  );
  if (!named) return null;
  const year = named[3] ? Number(named[3]) : fallbackYear;
  return toIso(civilDate(year, PT_MONTHS.indexOf(named[2] as (typeof PT_MONTHS)[number]), Number(named[1])));
}

export function parseFgtsCalendar(
  text: string,
  year: number,
): Record<number, { iso: string; until: string }> | null {
  const body = fold(text);
  const found: Record<number, { iso: string; until: string }> = {};
  const dateRe =
    /(\d{4}-\d{2}-\d{2}|\d{1,2}\s+de\s+(?:janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de\s+\d{4})?|\d{1,2}\s*[\/\-]\s*\d{1,2}(?:\s*[\/\-]\s*\d{2,4})?)/g;
  for (let i = 0; i < 12; i++) {
    const label = PT_MONTHS[i];
    const idx = body.indexOf(` ${label}`) >= 0 ? body.indexOf(` ${label}`) : body.indexOf(label);
    if (idx < 0) continue;
    const window = body.slice(idx, idx + 320);
    const hits: string[] = [];
    for (const row of window.matchAll(dateRe)) {
      const iso = readDate(row[0], year);
      if (iso && !hits.includes(iso)) hits.push(iso);
      if (hits.length >= 2) break;
    }
    if (!hits.length) continue;
    found[i + 1] = { iso: hits[0], until: hits[1] ?? projectedUntil(year, i + 1) };
  }
  return Object.keys(found).length >= 8 ? found : null;
}

export function fgtsEvent(year: number, birthMonth: number): CalEvent {
  const { iso, confirmed } = fgtsWindow(year, birthMonth);
  return {
    id: `fgts-${year}`,
    iso,
    title: "Saque-aniversário FGTS",
    time: "",
    source: "fgts",
    kind: "anual",
    confirmed,
    monthNth: birthMonth,
  };
}
