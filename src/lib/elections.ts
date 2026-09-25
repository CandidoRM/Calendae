import { civilDate, toIso, YEAR_MAX, YEAR_MIN, type CalEvent } from "@/lib/calendar";

function firstWeekday(year: number, month: number, weekday: number): string {
  const first = civilDate(year, month, 1);
  const shift = (weekday - first.getDay() + 7) % 7;
  return toIso(civilDate(year, month, 1 + shift));
}

function lastWeekday(year: number, month: number, weekday: number): string {
  const last = civilDate(year, month + 1, 0);
  const shift = (last.getDay() - weekday + 7) % 7;
  return toIso(civilDate(year, month, last.getDate() - shift));
}

export function isElectionYear(year: number): boolean {
  return year >= YEAR_MIN && year <= YEAR_MAX && year % 2 === 0;
}

/** General (president, congress, governors) vs mayors / city council. */
export function electionRaceLabel(year: number): string {
  return year % 4 === 2 ? "Eleição Federal" : "Eleição Municipal";
}

export function firstRoundIso(year: number): string {
  return firstWeekday(year, 9, 0);
}

export function secondRoundIso(year: number): string {
  return lastWeekday(year, 9, 0);
}

/** Presidential races that already had a confirmed second round. */
export const KNOWN_SECOND_ROUND_FEDERAL = new Set([2002, 2006, 2010, 2014, 2018, 2022]);

function row(iso: string, title: string): CalEvent {
  return {
    id: `election-${iso}-${title}`,
    iso,
    title,
    time: "",
    source: "holiday",
    holidayKind: "election",
  };
}

export function electionDates(year: number, secondRound = false): CalEvent[] {
  if (!isElectionYear(year)) return [];
  const first = firstRoundIso(year);
  const second = secondRoundIso(year);
  const out = [row(first, "1º turno")];
  if (secondRound && second !== first) out.push(row(second, "2º turno"));
  return out;
}
