import { civilDate, fallbackHolidays, isNational, toIso, type CalEvent } from "@/lib/calendar";

/** MDS 2026: dia do mês (1–31) por dígito final do NIS (0–9), jan–dez. */
const CONFIRMED_2026: Record<number, number[]> = {
  1: [19, 12, 18, 16, 18, 17, 20, 18, 17, 19, 16, 10],
  2: [20, 13, 19, 17, 19, 18, 21, 19, 18, 20, 17, 11],
  3: [21, 18, 20, 20, 20, 19, 22, 20, 21, 21, 18, 14],
  4: [22, 19, 23, 22, 21, 22, 23, 21, 22, 22, 19, 15],
  5: [23, 20, 24, 23, 22, 23, 24, 24, 23, 23, 23, 16],
  6: [26, 23, 25, 24, 25, 24, 27, 25, 24, 26, 24, 17],
  7: [27, 24, 26, 27, 26, 25, 28, 26, 25, 27, 25, 18],
  8: [28, 25, 27, 28, 27, 26, 29, 27, 28, 28, 26, 21],
  9: [29, 26, 30, 29, 28, 29, 30, 28, 29, 29, 27, 22],
  0: [30, 27, 31, 30, 29, 30, 31, 31, 30, 30, 30, 23],
};

export function sanitizeNis(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 11);
}

export function nisDigit(nis: string): number | null {
  const digits = sanitizeNis(nis);
  if (!digits) return null;
  return Number(digits.at(-1));
}

function offDays(year: number): Set<string> {
  return new Set(
    fallbackHolidays(year)
      .filter((event) => isNational(event) || event.holidayKind === "facultative")
      .map((event) => event.iso),
  );
}

function isUtil(year: number, monthIndex: number, day: number, off: Set<string>): boolean {
  const date = civilDate(year, monthIndex, day);
  const dow = date.getDay();
  const iso = toIso(date);
  return dow !== 0 && dow !== 6 && !off.has(iso);
}

/** Últimos 10 dias úteis. Em dezembro, para em 23 (antecipação de Natal). */
function lastTenUtil(year: number, monthIndex: number): string[] {
  const off = offDays(year);
  const last = civilDate(year, monthIndex + 1, 0).getDate();
  const cap = monthIndex === 11 ? Math.min(23, last) : last;
  const days: string[] = [];
  for (let day = cap; day >= 1 && days.length < 10; day--) {
    if (isUtil(year, monthIndex, day, off)) days.push(toIso(civilDate(year, monthIndex, day)));
  }
  return days.reverse();
}

export function bolsaIso(
  year: number,
  monthIndex: number,
  digit: number,
): { iso: string; confirmed: boolean } {
  const known = year === 2026 ? CONFIRMED_2026[digit]?.[monthIndex] : undefined;
  if (known) {
    return { iso: toIso(civilDate(year, monthIndex, known)), confirmed: true };
  }
  const days = lastTenUtil(year, monthIndex);
  const index = digit === 0 ? 9 : digit - 1;
  const iso = days[index] ?? days.at(-1) ?? toIso(civilDate(year, monthIndex + 1, 0));
  return { iso, confirmed: false };
}

export function bolsaEvent(year: number, monthIndex: number, digit: number, nis = ""): CalEvent {
  const { iso, confirmed } = bolsaIso(year, monthIndex, digit);
  return {
    id: `bolsa-${year}-${monthIndex}`,
    iso,
    title: "Bolsa Família",
    time: "",
    source: "bolsa",
    kind: "mensal",
    confirmed,
    monthNth: digit,
    nb: nis || undefined,
  };
}

function nextUtilDay(year: number, monthIndex: number, day: number): string {
  const off = new Set([...offDays(year), ...offDays(year + 1)]);
  const cursor = civilDate(year, monthIndex, day);
  for (let i = 0; i < 10; i++) {
    const iso = toIso(cursor);
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
    cursor.setDate(cursor.getDate() + 1);
  }
  return toIso(civilDate(year, monthIndex, day));
}

/** MDS: Gás do Povo — liberação no dia 10 (próximo útil se banco fechado). */
export function gasIso(year: number, monthIndex: number): { iso: string; confirmed: boolean } {
  return {
    iso: nextUtilDay(year, monthIndex, 10),
    confirmed: year >= 2026,
  };
}

export function gasEvent(year: number, monthIndex: number, nis = ""): CalEvent {
  const { iso, confirmed } = gasIso(year, monthIndex);
  return {
    id: `gas-${year}-${monthIndex}`,
    iso,
    title: "Gás do Povo",
    time: "",
    source: "gas",
    kind: "mensal",
    confirmed,
    nb: nis || undefined,
  };
}
