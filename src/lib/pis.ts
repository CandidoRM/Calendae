import { civilDate, fallbackHolidays, isNational, toIso, type CalEvent } from "@/lib/calendar";

/** Mês de nascimento (1–12) → ISO oficial já publicado. */
export const CONFIRMED_PIS: Record<number, Record<number, string>> = {
  2026: {
    1: "2026-02-16",
    2: "2026-03-16",
    3: "2026-04-15",
    4: "2026-04-15",
    5: "2026-05-15",
    6: "2026-05-15",
    7: "2026-06-15",
    8: "2026-06-15",
    9: "2026-07-15",
    10: "2026-07-15",
    11: "2026-08-17",
    12: "2026-08-17",
  },
};

function payMonthIndex(birthMonth: number): number {
  if (birthMonth <= 2) return birthMonth;
  if (birthMonth <= 4) return 3;
  if (birthMonth <= 6) return 4;
  if (birthMonth <= 8) return 5;
  if (birthMonth <= 10) return 6;
  return 7;
}

function nextUtil(year: number, monthIndex: number, day: number): string {
  const off = new Set(
    fallbackHolidays(year)
      .filter((event) => isNational(event) || event.holidayKind === "facultative")
      .map((event) => event.iso),
  );
  const cursor = civilDate(year, monthIndex, day);
  for (let i = 0; i < 10; i++) {
    const dow = cursor.getDay();
    const iso = toIso(cursor);
    if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
    cursor.setDate(cursor.getDate() + 1);
  }
  return toIso(civilDate(year, monthIndex, day));
}

export function projectedPisIso(year: number, birthMonth: number): string {
  return nextUtil(year, payMonthIndex(birthMonth), 15);
}

const PT_MONTHS = [
  "janeiro","fevereiro","marco","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro",
] as const;

function fold(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isoFromParts(year: number, monthIndex: number, day: number): string | null {
  if (monthIndex < 0 || monthIndex > 11 || day < 1 || day > 31) return null;
  return toIso(civilDate(year, monthIndex, day));
}

/** Extracts birth-month → pay ISO from a Codefat/wiki page. */
export function parsePisCalendar(text: string, year: number): Record<number, string> | null {
  const body = fold(text);
  const found: Record<number, string> = {};
  const groups: [number[], string][] = [
    [[1], "janeiro"],
    [[2], "fevereiro"],
    [[3, 4], "marco"],
    [[5, 6], "maio"],
    [[7, 8], "julho"],
    [[9, 10], "setembro"],
    [[11, 12], "novembro"],
  ];
  for (const [births, label] of groups) {
    const idx = body.indexOf(label);
    if (idx < 0) continue;
    const window = body.slice(idx, idx + 220);
    const slash = window.match(/(\d{1,2})\s*[\/\-]\s*(\d{1,2})(?:\s*[\/\-]\s*(\d{2,4}))?/);
    const named = window.match(/(\d{1,2})\s+de\s+(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/);
    let iso: string | null = null;
    if (named) {
      iso = isoFromParts(year, PT_MONTHS.indexOf(named[2] as (typeof PT_MONTHS)[number]), Number(named[1]));
    } else if (slash) {
      iso = isoFromParts(year, Number(slash[2]) - 1, Number(slash[1]));
    }
    if (!iso) continue;
    for (const birth of births) found[birth] = iso;
  }
  return Object.keys(found).length >= 6 ? found : null;
}

export function standingPisMap(year: number): Record<number, string> {
  const out: Record<number, string> = {};
  for (let month = 1; month <= 12; month++) out[month] = projectedPisIso(year, month);
  return out;
}

export function pisIso(year: number, birthMonth: number): { iso: string; confirmed: boolean } {
  const known = CONFIRMED_PIS[year]?.[birthMonth];
  if (known) return { iso: known, confirmed: true };
  /** Codefat (dez/2025): calendário fixo a partir de 2026, dia 15 (próximo útil se banco fechado). */
  if (year >= 2026) return { iso: projectedPisIso(year, birthMonth), confirmed: true };
  return { iso: projectedPisIso(year, birthMonth), confirmed: false };
}

export function pisEvent(year: number, birthMonth: number): CalEvent {
  const { iso, confirmed } = pisIso(year, birthMonth);
  return {
    id: `pis-${year}`,
    iso,
    title: "Abono PIS/Pasep",
    time: "",
    source: "pis",
    kind: "anual",
    confirmed,
    monthNth: birthMonth,
  };
}
