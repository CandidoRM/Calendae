import { lunarPhaseInstant } from "@/lib/lunar";
import { septemberEquinox } from "@/lib/seasons";
import type { CalEvent } from "@/lib/calendar";

const KEY = "calendae-moon-festival";

type Store = { triedYear: number | null; dates: Record<string, string> };

function empty(): Store {
  return { triedYear: null, dates: {} };
}

function readStore(): Store {
  if (typeof localStorage === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as Partial<Store>;
    return {
      triedYear: typeof parsed.triedYear === "number" ? parsed.triedYear : null,
      dates: parsed.dates && typeof parsed.dates === "object" ? parsed.dates : {},
    };
  } catch {
    return empty();
  }
}

function writeStore(store: Store) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(store));
}

function shanghaiIso(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDays(iso: string, days: number): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Festival da Lua = 15º dia do 8º mês lunar.
 * O 8º mês é o que contém o equinócio de setembro.
 * O dia civil é o da China (UTC+8), que é a data oficial do festival.
 */
export function computedMoonFestivalIso(year: number): string {
  const equinox = septemberEquinox(year);
  const k0 = Math.floor((year - 2000) * 12.3685);
  let start: Date | null = null;
  for (let k = k0 - 3; k <= k0 + 16; k += 1) {
    const moon = lunarPhaseInstant(k, 0);
    if (moon.getTime() <= equinox.getTime()) start = moon;
    else if (start) break;
  }
  if (!start) return `${year}-09-15`;
  return addDays(shanghaiIso(start), 14);
}

export function moonFestivalIso(year: number): string {
  return readStore().dates[String(year)] || computedMoonFestivalIso(year);
}

export function moonFestivalTriedYear(): number | null {
  return readStore().triedYear;
}

export function rememberMoonFestival(year: number, iso: string, triedYear: number) {
  const store = readStore();
  store.dates[String(year)] = iso;
  store.triedYear = triedYear;
  writeStore(store);
}

export function markMoonFestivalTried(year: number) {
  const store = readStore();
  store.triedYear = year;
  writeStore(store);
}

const MONTH_INDEX: Record<string, string> = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

function isoFromParts(year: number, day: string, monthName: string): string | null {
  const month = MONTH_INDEX[monthName.toLowerCase()];
  if (!month) return null;
  const iso = `${year}-${month}-${day.padStart(2, "0")}`;
  if (month === "09" || (month === "10" && Number(day) <= 15)) return iso;
  return null;
}

/** Lê a data do ano no infobox ou na lista da Wikipedia. */
export function parseMoonFestivalHtml(html: string, year: number): string | null {
  const month = "January|February|March|April|May|June|July|August|September|October|November|December";
  const infobox = new RegExp(
    `${year}(?:<[^>]+>|&nbsp;|\\s)*date</th>\\s*<td[^>]*>\\s*(\\d{1,2})\\s+(${month})`,
    "i",
  );
  const listed = new RegExp(`${year}:\\s*[A-Za-z]+\\s+(\\d{1,2})\\s+(${month})`, "i");
  const hit = html.match(infobox) ?? html.match(listed);
  if (!hit) return null;
  return isoFromParts(year, hit[1], hit[2]);
}

export function moonFestivalEvent(year: number): CalEvent {
  const iso = moonFestivalIso(year);
  return {
    id: `com-${iso}-Festival da Lua`,
    iso,
    title: "Festival da Lua",
    time: "",
    source: "holiday",
    holidayKind: "commemorative",
  };
}
