import { civilDate, toIso, type CalEvent } from "@/lib/calendar";

/** Provas regulares já publicadas pelo INEP. O resto fica como os dois primeiros domingos de novembro. */
const CONFIRMED: Record<number, [string, string]> = {
  2023: ["2023-11-05", "2023-11-12"],
  2024: ["2024-11-03", "2024-11-10"],
  2025: ["2025-11-09", "2025-11-16"],
  2026: ["2026-11-08", "2026-11-15"],
};

function nthSunday(year: number, month: number, n: number): string {
  const first = civilDate(year, month, 1);
  const shift = (7 - first.getDay()) % 7;
  return toIso(civilDate(year, month, 1 + shift + (n - 1) * 7));
}

export function enemDates(year: number): CalEvent[] {
  const known = CONFIRMED[year];
  const days = known ?? [nthSunday(year, 10, 1), nthSunday(year, 10, 2)];
  const confirmed = Boolean(known);
  return days.map((iso, index) => ({
    id: `enem-${iso}`,
    iso,
    title: index === 0 ? "1º dia" : "2º dia",
    source: "holiday",
    holidayKind: "enem",
    confirmed,
  }));
}
