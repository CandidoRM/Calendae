import { ALMANAC_KEY, fallbackHolidays, fromIso, takeLocal, toIso, type CalEvent } from "@/lib/calendar";
import {
  electionRaceLabel,
  firstRoundIso,
  isElectionYear,
  KNOWN_SECOND_ROUND_FEDERAL,
  secondRoundIso,
} from "@/lib/elections";
import { CONFIRMED_FGTS } from "@/lib/fgts";
import { CONFIRMED_IRPF, irpfEvent, projectedIrpfIso, projectedIrpfLots, type IrpfLot } from "@/lib/irpf";
import { CONFIRMED_PIS, standingPisMap } from "@/lib/pis";

export type SecondSource = "user" | "tse" | "wiki" | "known" | null;

export type IrpfStamp = {
  iso: string;
  confirmed: boolean;
  source: "known" | "receita" | "wiki" | null;
  lots: IrpfLot[];
};

export type LaborPisStamp = {
  byMonth: Record<number, string>;
  confirmed: boolean;
  source: "known" | "codefat" | "wiki" | null;
};

export type LaborFgtsStamp = {
  byMonth: Record<number, { iso: string; until: string }>;
  confirmed: boolean;
  source: "known" | "caixa" | "wiki" | null;
};

export type AlmanacYear = {
  year: number;
  carnival: { iso: string; title: string }[];
  election: {
    race: "Eleição Federal" | "Eleição Municipal";
    first: string;
    second: string | null;
    secondSource: SecondSource;
  } | null;
  irpf: IrpfStamp;
  thirteenth: {
    competenceMonths: number[];
    source: string;
    ruleYear: number;
  };
  pis: LaborPisStamp | null;
  fgts: LaborFgtsStamp | null;
  builtAt: number;
};

export type AlmanacStore = Record<string, AlmanacYear>;

const THIRTEENTH_DEFAULT = {
  competenceMonths: [3, 4],
  source: "antecipacao-inss-2020",
  ruleYear: 2020,
};

function carnivalRows(year: number): { iso: string; title: string }[] {
  return fallbackHolidays(year)
    .filter((event) => /carnaval|cinzas/i.test(event.title))
    .map((event) => ({ iso: event.iso, title: event.title }));
}

export function buildAlmanacYear(year: number): AlmanacYear {
  const election = isElectionYear(year)
    ? {
        race: electionRaceLabel(year) as "Eleição Federal" | "Eleição Municipal",
        first: firstRoundIso(year),
        second: KNOWN_SECOND_ROUND_FEDERAL.has(year) ? secondRoundIso(year) : null,
        secondSource: (KNOWN_SECOND_ROUND_FEDERAL.has(year) ? "known" : null) as SecondSource,
      }
    : null;
  return {
    year,
    carnival: carnivalRows(year),
    election,
    irpf: CONFIRMED_IRPF[year]
      ? {
          iso: CONFIRMED_IRPF[year],
          confirmed: true,
          source: "known",
          lots: projectedIrpfLots(year, CONFIRMED_IRPF[year]),
        }
      : {
          iso: projectedIrpfIso(year),
          confirmed: false,
          source: null,
          lots: projectedIrpfLots(year, projectedIrpfIso(year)),
        },
    thirteenth: { ...THIRTEENTH_DEFAULT },
    pis: CONFIRMED_PIS[year]
      ? { byMonth: CONFIRMED_PIS[year], confirmed: true, source: "known" }
      : year >= 2026
        ? { byMonth: standingPisMap(year), confirmed: true, source: "codefat" }
        : null,
    fgts: CONFIRMED_FGTS[year]
      ? { byMonth: CONFIRMED_FGTS[year], confirmed: true, source: "known" }
      : null,
    builtAt: Date.now(),
  };
}

export function readAlmanacStore(): AlmanacStore {
  try {
    const raw = takeLocal(ALMANAC_KEY, "almanaque-almanac");
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AlmanacStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAlmanacStore(store: AlmanacStore) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(ALMANAC_KEY, JSON.stringify(store));
  } catch {
    /* preview / SSR */
  }
}

export function readAlmanac(year: number): AlmanacYear | null {
  return readAlmanacStore()[String(year)] ?? null;
}

export function ensureAlmanac(year: number): AlmanacYear {
  const store = readAlmanacStore();
  const key = String(year);
  const existing = store[key];
  if (existing?.year === year && Array.isArray(existing.carnival)) {
    if (!existing.irpf?.iso) {
      existing.irpf = CONFIRMED_IRPF[year]
        ? {
            iso: CONFIRMED_IRPF[year],
            confirmed: true,
            source: "known",
            lots: projectedIrpfLots(year, CONFIRMED_IRPF[year]),
          }
        : {
            iso: projectedIrpfIso(year),
            confirmed: false,
            source: null,
            lots: projectedIrpfLots(year, projectedIrpfIso(year)),
          };
      store[key] = existing;
      writeAlmanacStore(store);
    } else if (!existing.irpf.lots?.length) {
      existing.irpf.lots = projectedIrpfLots(year, existing.irpf.iso);
      store[key] = existing;
      writeAlmanacStore(store);
    }
    return existing;
  }
  const next = buildAlmanacYear(year);
  store[key] = next;
  writeAlmanacStore(store);
  return next;
}

export function stampSecondRound(year: number, second: string | null, source: SecondSource) {
  const store = readAlmanacStore();
  const pack = store[String(year)] ?? buildAlmanacYear(year);
  if (!pack.election) {
    store[String(year)] = pack;
    writeAlmanacStore(store);
    return pack;
  }
  pack.election.second = second;
  pack.election.secondSource = second ? source : null;
  store[String(year)] = pack;
  writeAlmanacStore(store);
  return pack;
}

export function stampIrpf(year: number, iso: string, source: IrpfStamp["source"], lots?: IrpfLot[]) {
  const store = readAlmanacStore();
  const pack = store[String(year)] ?? buildAlmanacYear(year);
  pack.irpf = {
    iso,
    confirmed: true,
    source,
    lots: lots?.length ? lots : pack.irpf?.lots?.length ? pack.irpf.lots : projectedIrpfLots(year, iso),
  };
  store[String(year)] = pack;
  writeAlmanacStore(store);
  return pack;
}

export function irpfForYear(year: number): CalEvent {
  const row = ensureAlmanac(year).irpf;
  return irpfEvent(year, row.iso, row.confirmed);
}

export function stampIrpfLots(year: number, lots: IrpfLot[]) {
  const store = readAlmanacStore();
  const pack = store[String(year)] ?? buildAlmanacYear(year);
  pack.irpf = { ...pack.irpf, lots };
  store[String(year)] = pack;
  writeAlmanacStore(store);
  return pack;
}

export function irpfLotsForYear(year: number): IrpfLot[] {
  const row = ensureAlmanac(year).irpf;
  if (row.lots?.length) return row.lots;
  return projectedIrpfLots(year, row.iso);
}

export function stampPis(
  year: number,
  byMonth: Record<number, string>,
  source: LaborPisStamp["source"],
  confirmed = true,
) {
  const store = readAlmanacStore();
  const pack = store[String(year)] ?? buildAlmanacYear(year);
  pack.pis = { byMonth, confirmed, source };
  store[String(year)] = pack;
  writeAlmanacStore(store);
  return pack;
}

export function stampFgts(
  year: number,
  byMonth: Record<number, { iso: string; until: string }>,
  source: LaborFgtsStamp["source"],
  confirmed = true,
) {
  const store = readAlmanacStore();
  const pack = store[String(year)] ?? buildAlmanacYear(year);
  pack.fgts = { byMonth, confirmed, source };
  store[String(year)] = pack;
  writeAlmanacStore(store);
  return pack;
}

export function showElectionSecond(year: number, userOn: boolean): boolean {
  if (userOn) return true;
  return Boolean(ensureAlmanac(year).election?.second);
}

export function thirteenthMonths(year: number): number[] {
  const months = ensureAlmanac(year).thirteenth.competenceMonths;
  return months.length ? months : THIRTEENTH_DEFAULT.competenceMonths;
}

export function carnivalEvents(year: number): CalEvent[] {
  const rows = readAlmanac(year)?.carnival ?? carnivalRows(year);
  return rows.map((row) => ({
    id: `holiday-${row.iso}-${row.title}`,
    iso: row.iso,
    title: row.title,
    time: "",
    source: "holiday" as const,
    holidayKind: "facultative" as const,
  }));
}

export function dayAfter(iso: string): string {
  const date = fromIso(iso);
  return toIso(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1));
}
