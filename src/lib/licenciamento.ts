import { civilDate, fallbackHolidays, isNational, toIso, type CalEvent } from "@/lib/calendar";
import { normalizeUf } from "@/lib/ipva";

/** DETRAN: vencimento do licenciamento por final de placa. */
const CONFIRMED: Record<string, Record<number, Record<number, string>>> = {
  PR: {
    2026: {
      1: "2026-08-14",
      2: "2026-08-28",
      3: "2026-09-09",
      4: "2026-09-18",
      5: "2026-09-28",
      6: "2026-10-09",
      7: "2026-10-20",
      8: "2026-10-30",
      9: "2026-11-13",
      0: "2026-11-27",
    },
  },
  SP: {
    2026: {
      1: "2026-07-31",
      2: "2026-07-31",
      3: "2026-08-31",
      4: "2026-08-31",
      5: "2026-09-30",
      6: "2026-09-30",
      7: "2026-10-31",
      8: "2026-10-31",
      9: "2026-11-30",
      0: "2026-12-31",
    },
  },
};

const PR_PATTERN: Record<number, [number, number]> = {
  1: [7, 14],
  2: [7, 28],
  3: [8, 9],
  4: [8, 18],
  5: [8, 28],
  6: [9, 9],
  7: [9, 20],
  8: [9, 30],
  9: [10, 13],
  0: [10, 27],
};

const SP_MONTH: Record<number, number> = {
  1: 6,
  2: 6,
  3: 7,
  4: 7,
  5: 8,
  6: 8,
  7: 9,
  8: 9,
  9: 10,
  0: 11,
};

function nextUtil(year: number, monthIndex: number, day: number): string {
  const off = new Set(
    fallbackHolidays(year)
      .filter((event) => isNational(event) || event.holidayKind === "facultative")
      .map((event) => event.iso),
  );
  const last = civilDate(year, monthIndex + 1, 0).getDate();
  const cursor = civilDate(year, monthIndex, Math.min(day, last));
  for (let i = 0; i < 12; i++) {
    const dow = cursor.getDay();
    const iso = toIso(cursor);
    if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
    cursor.setDate(cursor.getDate() + 1);
  }
  return toIso(civilDate(year, monthIndex, Math.min(day, last)));
}

function lastUtil(year: number, monthIndex: number): string {
  const off = new Set(
    fallbackHolidays(year)
      .filter((event) => isNational(event) || event.holidayKind === "facultative")
      .map((event) => event.iso),
  );
  const cursor = civilDate(year, monthIndex + 1, 0);
  for (let i = 0; i < 12; i++) {
    const dow = cursor.getDay();
    const iso = toIso(cursor);
    if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
    cursor.setDate(cursor.getDate() - 1);
  }
  return toIso(civilDate(year, monthIndex + 1, 0));
}

export function licencaIso(
  year: number,
  uf: string,
  digit: number,
): { iso: string; confirmed: boolean } | null {
  const state = normalizeUf(uf);
  if (!state || digit < 0 || digit > 9) return null;
  const known = CONFIRMED[state]?.[year]?.[digit];
  if (known) return { iso: known, confirmed: true };
  if (state === "PR") {
    const [monthIndex, day] = PR_PATTERN[digit];
    return { iso: nextUtil(year, monthIndex, day), confirmed: false };
  }
  if (state === "SP") {
    return { iso: lastUtil(year, SP_MONTH[digit]), confirmed: false };
  }
  return null;
}

export function licencaEvent(year: number, uf: string, digit: number): CalEvent | null {
  const hit = licencaIso(year, uf, digit);
  if (!hit) return null;
  return {
    id: `licenca-${year}`,
    iso: hit.iso,
    title: "Licenciamento",
    time: "",
    source: "licenca",
    kind: "anual",
    confirmed: hit.confirmed,
  };
}
