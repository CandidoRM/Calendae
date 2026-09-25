import { civilDate, fallbackHolidays, isNational, toIso, type CalEvent } from "@/lib/calendar";

export type IpvaParcel = {
  n: number;
  iso: string;
  confirmed: boolean;
  label: string;
};

const LABELS = ["1ª parcela", "2ª parcela", "3ª parcela", "4ª parcela", "5ª parcela"];

/** Placa BR: até 7 letras/números; hífen opcional (ABC-1234). Sem outros caracteres. */
export function sanitizePlate(raw: string): string {
  let out = "";
  let alnum = 0;
  let hyphen = false;
  for (const ch of raw.toUpperCase()) {
    if (ch === "-") {
      if (hyphen || alnum !== 3) continue;
      hyphen = true;
      out += "-";
      continue;
    }
    if (!/[A-Z0-9]/.test(ch)) continue;
    if (alnum >= 7) continue;
    out += ch;
    alnum += 1;
  }
  return out;
}

export function plateDigit(plate: string): number | null {
  const digits = plate.replace(/\D/g, "");
  if (!digits) return null;
  return Number(digits[digits.length - 1]);
}

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

function prDays(digit: number): [number, number, number, number, number] {
  if (digit === 1 || digit === 2) return [9, 9, 9, 9, 11];
  if (digit === 3 || digit === 4) return [12, 10, 10, 10, 12];
  if (digit === 5 || digit === 6) return [13, 11, 11, 13, 13];
  if (digit === 7 || digit === 8) return [14, 12, 12, 14, 14];
  return [15, 13, 13, 15, 15];
}

function spDays(digit: number): number {
  if (digit === 0) return 23;
  if (digit === 1) return 12;
  if (digit === 2) return 13;
  if (digit === 3) return 14;
  if (digit === 4) return 15;
  if (digit === 5) return 16;
  if (digit === 6) return 19;
  if (digit === 7) return 20;
  if (digit === 8) return 21;
  return 22;
}

/** Datas oficiais 2026 (SEFA-PR / SEFAZ-SP, automóveis). */
export const CONFIRMED_IPVA: Record<string, Record<number, Record<number, string[]>>> = {
  PR: {
    2026: {
      1: ["2026-01-09", "2026-02-09", "2026-03-09", "2026-04-09", "2026-05-11"],
      2: ["2026-01-09", "2026-02-09", "2026-03-09", "2026-04-09", "2026-05-11"],
      3: ["2026-01-12", "2026-02-10", "2026-03-10", "2026-04-10", "2026-05-12"],
      4: ["2026-01-12", "2026-02-10", "2026-03-10", "2026-04-10", "2026-05-12"],
      5: ["2026-01-13", "2026-02-11", "2026-03-11", "2026-04-13", "2026-05-13"],
      6: ["2026-01-13", "2026-02-11", "2026-03-11", "2026-04-13", "2026-05-13"],
      7: ["2026-01-14", "2026-02-12", "2026-03-12", "2026-04-14", "2026-05-14"],
      8: ["2026-01-14", "2026-02-12", "2026-03-12", "2026-04-14", "2026-05-14"],
      9: ["2026-01-15", "2026-02-13", "2026-03-13", "2026-04-15", "2026-05-15"],
      0: ["2026-01-15", "2026-02-13", "2026-03-13", "2026-04-15", "2026-05-15"],
    },
  },
  SP: {
    2026: {
      1: ["2026-01-12", "2026-02-12", "2026-03-12", "2026-04-12", "2026-05-12"],
      2: ["2026-01-13", "2026-02-13", "2026-03-13", "2026-04-13", "2026-05-13"],
      3: ["2026-01-14", "2026-02-14", "2026-03-14", "2026-04-14", "2026-05-14"],
      4: ["2026-01-15", "2026-02-15", "2026-03-15", "2026-04-15", "2026-05-15"],
      5: ["2026-01-16", "2026-02-16", "2026-03-16", "2026-04-16", "2026-05-16"],
      6: ["2026-01-19", "2026-02-19", "2026-03-19", "2026-04-19", "2026-05-19"],
      7: ["2026-01-20", "2026-02-20", "2026-03-20", "2026-04-20", "2026-05-20"],
      8: ["2026-01-21", "2026-02-21", "2026-03-21", "2026-04-21", "2026-05-21"],
      9: ["2026-01-22", "2026-02-22", "2026-03-22", "2026-04-22", "2026-05-22"],
      0: ["2026-01-23", "2026-02-23", "2026-03-23", "2026-04-23", "2026-05-23"],
    },
  },
};

export function normalizeUf(raw: string): string {
  return raw.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
}

function projected(year: number, uf: string, digit: number): string[] | null {
  if (uf === "PR") {
    const days = prDays(digit);
    return days.map((day, i) => nextUtil(year, i, day));
  }
  if (uf === "SP") {
    const day = spDays(digit);
    return [0, 1, 2, 3, 4].map((i) => nextUtil(year, i, day));
  }
  return null;
}

export function ipvaParcels(year: number, uf: string, digit: number): IpvaParcel[] | null {
  const state = normalizeUf(uf);
  if (!state || digit < 0 || digit > 9) return null;
  const known = CONFIRMED_IPVA[state]?.[year]?.[digit];
  const isos = known ?? projected(year, state, digit);
  if (!isos) return null;
  const confirmed = Boolean(known);
  return isos.map((iso, i) => ({
    n: i + 1,
    iso,
    confirmed,
    label: i === 0 ? "à vista / 1ª" : LABELS[i],
  }));
}

export function ipvaEvent(year: number, uf: string, digit: number): CalEvent | null {
  const parcels = ipvaParcels(year, uf, digit);
  if (!parcels?.length) return null;
  return {
    id: `ipva-${year}`,
    iso: parcels[0].iso,
    title: "IPVA",
    time: "",
    source: "ipva",
    kind: "anual",
    confirmed: parcels[0].confirmed,
  };
}

export function ipvaMarks(year: number, uf: string, digit: number): CalEvent[] {
  const parcels = ipvaParcels(year, uf, digit);
  if (!parcels) return [];
  return parcels.map((parcel) => ({
    id: `ipva-${year}-${parcel.n}`,
    iso: parcel.iso,
    title: "IPVA",
    time: "",
    source: "ipva" as const,
    kind: "anual" as const,
    confirmed: parcel.confirmed,
  }));
}
