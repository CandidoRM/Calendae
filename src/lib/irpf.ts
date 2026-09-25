import { civilDate, fallbackHolidays, isNational, toIso, type CalEvent } from "@/lib/calendar";

/** Exercício (ano da entrega) → prazo oficial já publicado. */
export const CONFIRMED_IRPF: Record<number, string> = {
  2018: "2018-04-30",
  2019: "2019-04-30",
  2020: "2020-06-30",
  2021: "2021-05-31",
  2022: "2022-05-31",
  2023: "2023-05-31",
  2024: "2024-05-31",
  2025: "2025-05-30",
  2026: "2026-05-29",
};

/** Lotes oficiais de restituição (data do crédito). */
export const CONFIRMED_IRPF_LOTS: Record<number, string[]> = {
  2025: ["2025-05-30", "2025-06-30", "2025-07-31", "2025-08-29", "2025-09-30"],
  2026: ["2026-05-29", "2026-06-30", "2026-07-31", "2026-08-28"],
};

export type IrpfLot = {
  n: number;
  iso: string;
  confirmed: boolean;
};

const MONTHS_PT: Record<string, number> = {
  janeiro: 0,
  fevereiro: 1,
  marco: 2,
  março: 2,
  abril: 3,
  maio: 4,
  junho: 5,
  julho: 6,
  agosto: 7,
  setembro: 8,
  outubro: 9,
  novembro: 10,
  dezembro: 11,
};

function lastUtilOfMonth(year: number, monthIndex: number): string {
  const off = new Set(
    fallbackHolidays(year)
      .filter((event) => isNational(event) || event.holidayKind === "facultative")
      .map((event) => event.iso),
  );
  const cursor = civilDate(year, monthIndex + 1, 0);
  while (cursor.getMonth() === monthIndex) {
    const dow = cursor.getDay();
    const iso = toIso(cursor);
    if (dow !== 0 && dow !== 6 && !off.has(iso)) return iso;
    cursor.setDate(cursor.getDate() - 1);
  }
  return toIso(civilDate(year, monthIndex + 1, 0));
}

export function projectedIrpfIso(year: number): string {
  return lastUtilOfMonth(year, 4);
}

export function projectedIrpfLots(year: number, deadlineIso: string): IrpfLot[] {
  const known = CONFIRMED_IRPF_LOTS[year];
  if (known?.length) {
    return known.map((iso, i) => ({ n: i + 1, iso, confirmed: true }));
  }
  const months = [4, 5, 6, 7];
  return months.map((month, i) => {
    const iso = i === 0 ? deadlineIso : lastUtilOfMonth(year, month);
    return { n: i + 1, iso, confirmed: false };
  });
}

export function parseIrpfDeadline(text: string, year: number): string | null {
  const fold = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const re = new RegExp(
    `(\\d{1,2})\\s+de\\s+(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\\s+de\\s+${year}`,
    "g",
  );
  let hit: string | null = null;
  let match: RegExpExecArray | null;
  while ((match = re.exec(fold))) {
    const day = Number(match[1]);
    const month = MONTHS_PT[match[2]];
    if (!Number.isFinite(day) || month === undefined || month < 4) continue;
    hit = toIso(civilDate(year, month, day));
  }
  return hit;
}

export function parseIrpfLots(text: string, year: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const re = new RegExp(`(\\d{1,2})\\s*[\\/.-]\\s*(\\d{1,2})\\s*[\\/.-]\\s*${year}`, "g");
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    const day = Number(match[1]);
    const month = Number(match[2]);
    if (month < 5 || month > 9 || day < 1 || day > 31) continue;
    const iso = toIso(civilDate(year, month - 1, day));
    if (seen.has(iso)) continue;
    seen.add(iso);
    out.push(iso);
  }
  return out.sort();
}

export function irpfEvent(year: number, iso: string, confirmed: boolean): CalEvent {
  return {
    id: `irpf-${year}`,
    iso,
    title: "Declaração de Imposto de Renda",
    time: "",
    source: "irpf",
    confirmed,
  };
}

export function lotLabel(n: number): string {
  return `(${n}º lote)`;
}
