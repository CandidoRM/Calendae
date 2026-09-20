import { ALMANAC_KEY, fallbackHolidays, fromIso, takeLocal, toIso, type CalEvent } from "@/lib/calendar";
import {
  electionRaceLabel,
  firstRoundIso,
  isElectionYear,
  KNOWN_SECOND_ROUND_FEDERAL,
  secondRoundIso,
} from "@/lib/elections";

export type SecondSource = "user" | "tse" | "wiki" | "known" | null;

export type AlmanacYear = {
  year: number;
  carnival: { iso: string; title: string }[];
  election: {
    race: "Eleição Federal" | "Eleição Municipal";
    first: string;
    second: string | null;
    secondSource: SecondSource;
  } | null;
  thirteenth: {
    competenceMonths: number[];
    source: string;
    ruleYear: number;
  };
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
    thirteenth: { ...THIRTEENTH_DEFAULT },
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
  if (existing?.year === year && Array.isArray(existing.carnival)) return existing;
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
