import { fallbackHolidays, fromIso, toIso } from "@/lib/calendar";

export type InssBracket = "minimo" | "acima";

const MONTHS = [
  "janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro",
] as const;

/** Last digit before the hyphen (DV after it). 0104-7 → 4. */
export function sanitizeInssField(raw: string): string {
  return raw.replace(/[^0-9Bb-]/g, "").replace(/b/g, "B");
}

export function parseNb(raw: string): { digits: string; digit: number } | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const hyphen = trimmed.match(/^(.*)-(\d)\s*$/);
  if (hyphen) {
    const before = hyphen[1].replace(/\D/g, "");
    if (!before) return null;
    return { digits: `${before}${hyphen[2]}`, digit: Number(before.at(-1)) };
  }
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 1) return { digits, digit: Number(digits) };
  if (digits.length >= 10) return { digits, digit: Number(digits[digits.length - 2]) };
  return { digits, digit: Number(digits.at(-1)) };
}

export function isBpcEspecie(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return digits === "87" || digits === "88";
}

type EspecieInfo = { name: string; short: string };

const ESPECIES: Record<string, EspecieInfo> = {
  "01": { name: "Pensão por morte do trabalhador rural", short: "Pens. Rural" },
  "02": { name: "Pensão por morte acidentária do trabalhador rural", short: "Pens. Rural Ac." },
  "03": { name: "Pensão por morte do empregador rural", short: "Pens. Empr. Rural" },
  "04": { name: "Aposentadoria por incapacidade permanente do trabalhador rural", short: "Ap. Rural" },
  "05": { name: "Aposentadoria por incapacidade permanente acidentária do trabalhador rural", short: "Ap. Rural Ac." },
  "06": { name: "Aposentadoria por incapacidade permanente do empregador rural", short: "Ap. Empr. Rural" },
  "07": { name: "Aposentadoria por idade do trabalhador rural", short: "Ap. Idade Rural" },
  "08": { name: "Aposentadoria por idade do empregador rural", short: "Ap. Idade Empr." },
  "10": { name: "Auxílio por incapacidade temporária acidentário do trabalhador rural", short: "Aux. Rural Ac." },
  "11": { name: "Renda mensal vitalícia por invalidez do trabalhador rural", short: "RMV Inv. Rural" },
  "12": { name: "Renda mensal vitalícia por idade do trabalhador rural", short: "RMV Idade Rural" },
  "13": { name: "Auxílio por incapacidade temporária do trabalhador rural", short: "Aux. Rural" },
  "15": { name: "Auxílio-reclusão do trabalhador rural", short: "Aux. Recl. Rural" },
  "21": { name: "Pensão por morte", short: "Pens. Morte" },
  "23": { name: "Pensão por morte de ex-combatente", short: "Pens. Ex-comb." },
  "25": { name: "Auxílio-reclusão", short: "Aux. Reclusão" },
  "27": { name: "Pensão por morte de servidor público federal", short: "Pens. Servidor" },
  "28": { name: "Pensão por morte (RGPS antigo)", short: "Pens. RGPS" },
  "29": { name: "Pensão por morte de ex-combatente marítimo", short: "Pens. Marít." },
  "30": { name: "Renda mensal vitalícia por invalidez", short: "RMV Invalidez" },
  "31": { name: "Auxílio por incapacidade temporária", short: "Aux. Incap. Temp." },
  "32": { name: "Aposentadoria por incapacidade permanente", short: "Ap. Incap. Perm." },
  "33": { name: "Aposentadoria por incapacidade permanente de aeronauta", short: "Ap. Aeronauta" },
  "34": { name: "Aposentadoria por incapacidade permanente de ex-combatente marítimo", short: "Ap. Marít." },
  "36": { name: "Auxílio-acidente", short: "Aux. Acidente" },
  "40": { name: "Renda mensal vitalícia por idade", short: "RMV Idade" },
  "41": { name: "Aposentadoria por idade", short: "Ap. Idade" },
  "42": { name: "Aposentadoria por tempo de contribuição", short: "Ap. Tempo" },
  "43": { name: "Aposentadoria por tempo de contribuição de ex-combatente", short: "Ap. Tempo Ex-c." },
  "44": { name: "Aposentadoria por tempo de contribuição de aeronauta", short: "Ap. Tempo Aer." },
  "45": { name: "Aposentadoria por tempo de contribuição de jornalista", short: "Ap. Tempo Jorn." },
  "46": { name: "Aposentadoria especial", short: "Ap. Especial" },
  "47": { name: "Abono de permanência em serviço 25%", short: "Abono 25%" },
  "48": { name: "Abono de permanência em serviço 20%", short: "Abono 20%" },
  "49": { name: "Aposentadoria por tempo de contribuição ordinária", short: "Ap. Tempo Ord." },
  "50": { name: "Auxílio por incapacidade temporária (plano básico)", short: "Aux. Plano Bás." },
  "51": { name: "Aposentadoria por incapacidade permanente (plano básico)", short: "Ap. Plano Bás." },
  "52": { name: "Aposentadoria por idade (plano básico)", short: "Ap. Idade Bás." },
  "54": { name: "Pensão especial vitalícia", short: "Pens. Especial" },
  "55": { name: "Pensão por morte (plano básico)", short: "Pens. Plano Bás." },
  "56": { name: "Pensão por síndrome de talidomida", short: "Pens. Talidom." },
  "57": { name: "Aposentadoria de professor", short: "Ap. Professor" },
  "68": { name: "Pecúlio especial de aposentadoria", short: "Pecúlio" },
  "72": { name: "Aposentadoria por tempo de contribuição de ex-combatente marítimo", short: "Ap. Tempo Mar." },
  "76": { name: "Salário-família", short: "Sal. Família" },
  "78": { name: "Aposentadoria por idade de ex-combatente marítimo", short: "Ap. Idade Mar." },
  "79": { name: "Abono de servidor aposentado", short: "Abono Servidor" },
  "80": { name: "Salário-maternidade", short: "Sal. Maternid." },
  "81": { name: "Aposentadoria por idade compulsória", short: "Ap. Compulsória" },
  "82": { name: "Aposentadoria por tempo de contribuição (Ex-SASSE)", short: "Ap. Tempo SASSE" },
  "83": { name: "Aposentadoria por incapacidade permanente (Ex-SASSE)", short: "Ap. Incap. SASSE" },
  "84": { name: "Pensão por morte (Ex-SASSE)", short: "Pens. SASSE" },
  "85": { name: "Pensão mensal vitalícia do seringueiro", short: "Pens. Sering." },
  "86": { name: "Pensão mensal vitalícia do dependente do seringueiro", short: "Pens. Dep. Ser." },
  "87": { name: "BPC à pessoa com deficiência", short: "BPC Defic." },
  "88": { name: "BPC ao idoso", short: "BPC Idoso" },
  "91": { name: "Auxílio por incapacidade temporária acidentário", short: "Aux. Incap. Ac." },
  "92": { name: "Aposentadoria por incapacidade permanente acidentária", short: "Ap. Incap. Ac." },
  "93": { name: "Pensão por morte acidentária", short: "Pens. Morte Ac." },
  "94": { name: "Auxílio-acidente", short: "Aux. Acidente" },
  "95": { name: "Auxílio-suplementar acidentário", short: "Aux. Suplem." },
};

export function especieCode(raw: string | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 1) return digits.padStart(2, "0");
  return digits.slice(0, 2).padStart(2, "0");
}

export function especieInfo(raw: string | undefined): EspecieInfo | null {
  const code = especieCode(raw);
  if (!code) return null;
  return ESPECIES[code] ?? null;
}

export function withCheckHyphen(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 2) return digits;
  return `${digits.slice(0, -1)}-${digits.slice(-1)}`;
}

export function parseEspecieField(raw: string): { especie: string; nb: string | null } {
  const compact = sanitizeInssField(raw.replace(/\s+/g, ""));
  const prefix = compact.startsWith("B") ? "B" : "";
  const rest = prefix ? compact.slice(1) : compact;
  const digits = rest.replace(/\D/g, "");
  if (digits.length === 12) {
    return { especie: `${prefix}${digits.slice(0, 2)}`, nb: withCheckHyphen(digits.slice(2)) };
  }
  if (digits.length === 10) {
    return { especie: "", nb: withCheckHyphen(digits) };
  }
  if (digits.length >= 2 && !rest.includes("-")) {
    return { especie: compact, nb: null };
  }
  return { especie: compact, nb: null };
}

export function parseNbField(raw: string): { especie: string | null; nb: string } {
  const compact = sanitizeInssField(raw.replace(/\s+/g, ""));
  const prefix = compact.startsWith("B") ? "B" : "";
  const rest = prefix ? compact.slice(1) : compact;
  const digits = rest.replace(/\D/g, "");
  if (digits.length === 12) {
    return { especie: `${prefix}${digits.slice(0, 2)}`, nb: withCheckHyphen(digits.slice(2)) };
  }
  if (digits.length === 10 && !compact.includes("-")) {
    return { especie: null, nb: withCheckHyphen(digits) };
  }
  return { especie: null, nb: compact };
}

function isAutoPayTitle(title: string): boolean {
  return (
    !title ||
    /^INSS final\b/i.test(title) ||
    /\bfinal\s+\d\b/i.test(title) ||
    /^Espécie\s+\d+\b/i.test(title) ||
    /^B?\d{2}\b/.test(title)
  );
}

export function benefitPayTitle(event: { title: string; especie?: string }): string {
  const custom = event.title.trim();
  if (custom && !isAutoPayTitle(custom)) return custom;
  const info = especieInfo(event.especie);
  if (info) return info.name;
  const code = especieCode(event.especie);
  return code ? `Espécie ${code}` : custom || "Benefício";
}

export function benefitThirteenthTitle(event: { title: string; especie?: string }): string {
  const custom = event.title.trim();
  if (custom && !isAutoPayTitle(custom)) return `13º ${custom}`;
  const info = especieInfo(event.especie);
  if (info) return `13º ${info.short}`;
  const pay = benefitPayTitle(event);
  return pay === "Benefício" ? "13º" : `13º ${pay}`;
}

export function formatNb(digits: string): string {
  const clean = digits.replace(/\D/g, "");
  if (clean.length < 2) return clean;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  const grouped = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${grouped}-${dv}`;
}

function holidaySet(...years: number[]): Set<string> {
  return new Set(years.flatMap((year) => fallbackHolidays(year).map((event) => event.iso)));
}

function isInssOff(date: Date, holidays: Set<string>): boolean {
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return true;
  if (holidays.has(toIso(date))) return true;
  if (date.getMonth() === 11 && (date.getDate() === 24 || date.getDate() === 31)) return true;
  return false;
}

function lastBankingDays(year: number, month: number, count: number): Date[] {
  const holidays = holidaySet(year - 1, year);
  const dates: Date[] = [];
  const cursor = new Date(year, month + 1, 0);
  while (dates.length < count) {
    if (!isInssOff(cursor, holidays)) dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }
  return dates.reverse();
}

function firstBankingDays(year: number, month: number, count: number): Date[] {
  const holidays = holidaySet(year, year + 1);
  const dates: Date[] = [];
  const cursor = new Date(year, month, 1);
  while (dates.length < count) {
    if (!isInssOff(cursor, holidays)) dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

function acimaIndex(digit: number): number {
  if (digit === 1 || digit === 6) return 0;
  if (digit === 2 || digit === 7) return 1;
  if (digit === 3 || digit === 8) return 2;
  if (digit === 4 || digit === 9) return 3;
  return 4;
}

export type InssYearTable = {
  minimo: Record<number, string[]>;
  acima: Record<number, string[]>;
};

const published = new Map<number, InssYearTable>();

export function rememberInssTable(year: number, table: InssYearTable | null) {
  if (!table) published.delete(year);
  else published.set(year, table);
}

function snapBanking(iso: string): string {
  const date = fromIso(iso);
  const holidays = holidaySet(date.getFullYear() - 1, date.getFullYear(), date.getFullYear() + 1);
  for (let i = 0; i < 6 && isInssOff(date, holidays); i += 1) {
    date.setDate(date.getDate() + 1);
  }
  return toIso(date);
}

/**
 * Deposit date for this competence month (may fall in the next calendar month).
 * Prefers a published Agência Brasil table when synced; otherwise 10 banking days.
 * Weekend/holiday cells in the PDF snap to the next banking day (real deposit).
 */
export function inssCompetencePay(
  year: number,
  competenceMonth: number,
  digit: number,
  bracket: InssBracket = "minimo",
): string {
  const d = ((digit % 10) + 10) % 10;
  const publishedIso = published.get(year)?.[bracket]?.[d]?.[competenceMonth];
  if (publishedIso) return snapBanking(publishedIso);
  if (bracket === "minimo" && d >= 1 && d <= 5) {
    return toIso(lastBankingDays(year, competenceMonth, 5)[d - 1]);
  }
  const next =
    competenceMonth === 11
      ? { year: year + 1, month: 0 }
      : { year, month: competenceMonth + 1 };
  const index = bracket === "acima" ? acimaIndex(d) : d === 0 ? 4 : d - 6;
  return toIso(firstBankingDays(next.year, next.month, 5)[index]);
}

/** INSS 13º has been paid with April + May deposits since 2020 (antecipação). Not BPC. */
export function inssThirteenth(
  year: number,
  digit: number,
  bracket: InssBracket = "minimo",
  competenceMonths: number[] = [3, 4],
): { iso: string; label: string }[] {
  const months = competenceMonths.length ? competenceMonths : [3, 4];
  return months.map((competence, index) => ({
    iso: inssCompetencePay(year, competence, digit, bracket),
    label: `${index + 1}ª parcela`,
  }));
}

/** Deposit that actually lands on this calendar month (previous competence may spill in). */
export function inssPayIso(
  year: number,
  month: number,
  digit: number,
  bracket: InssBracket = "minimo",
): string | null {
  const here = [
    inssCompetencePay(year, month, digit, bracket),
    inssCompetencePay(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, digit, bracket),
  ];
  return (
    here.find((iso) => {
      const date = fromIso(iso);
      return date.getFullYear() === year && date.getMonth() === month;
    }) ?? null
  );
}

export function inssCompetenceLabel(payIso: string, digit: number, bracket: InssBracket): string {
  const date = fromIso(payIso);
  for (const delta of [0, -1, -2, 1]) {
    const probe = new Date(date.getFullYear(), date.getMonth() + delta, 1);
    const iso = inssCompetencePay(probe.getFullYear(), probe.getMonth(), digit, bracket);
    if (iso === payIso) {
      const label = MONTHS[probe.getMonth()];
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
  }
  return "";
}

export function formatPayDay(iso: string): string {
  return String(fromIso(iso).getDate()).padStart(2, "0");
}
