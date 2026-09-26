export type EventKind = "semanal" | "mensal" | "semestral" | "anual" | "personalizado" | "posicao";
export type EventSource = "local" | "holiday" | "google" | "birthday" | "benefit" | "bill" | "boleto" | "period" | "irpf" | "pis" | "ipva" | "fgts" | "bolsa" | "gas" | "licenca";
export type HolidayKind = "national" | "municipal" | "commemorative" | "election" | "facultative" | "enem" | "season" | "lunar";
export type MonthSide = "primeiros" | "ultimos";
export type IntervalRule = "ignorar" | "preceder" | "proceder" | "adiar" | "cancelar";

export type CalEvent = {
  id: string;
  iso: string;
  title: string;
  time?: string;
  place?: string;
  contact?: string;
  note?: string;
  kind?: EventKind;
  everyDays?: number;
  monthSide?: MonthSide;
  monthNth?: number;
  monthUtil?: boolean;
  intervalRule?: IntervalRule;
  durationDays?: number;
  durationMinutes?: number;
  source: EventSource;
  notify?: boolean;
  holidayKind?: HolidayKind;
  nb?: string;
  especie?: string;
  bracket?: "minimo" | "acima";
  thirteenth?: boolean;
  confirmed?: boolean;
  amount?: string;
  fileName?: string;
};

export type CalCell = {
  day: number;
  inMonth: boolean;
  isToday: boolean;
  iso: string;
  events: CalEvent[];
};

export type WeekStart = "monday" | "sunday";

export type CalTabId =
  | "holidays"
  | "destaques"
  | "agenda"
  | "birthdays"
  | "finance"
  | "history";

export const CAL_TABS: { id: CalTabId; label: string }[] = [
  { id: "holidays", label: "Feriados" },
  { id: "destaques", label: "Destaques" },
  { id: "agenda", label: "Agenda" },
  { id: "birthdays", label: "Aniversários" },
  { id: "finance", label: "Finanças" },
  { id: "history", label: "Histórico" },
];

export const DEFAULT_TABS: Record<CalTabId, boolean> = {
  holidays: true,
  destaques: true,
  agenda: true,
  birthdays: true,
  finance: true,
  history: true,
};

export type Settings = {
  theme: "clareira";
  font: "grove";
  size: "md";
  municipal: boolean;
  commemorative: boolean;
  elections: boolean;
  enem: boolean;
  irpfOn: boolean;
  seasons: boolean;
  lunar: boolean;
  hourCycle: HourCycle;
  electionSecondRound: boolean;
  electionSecondTriedYear: number | null;
  facultative: boolean;
  national: boolean;
  cityName: string;
  cityIbge: number | null;
  cityUf: string;
  electionPlace: string;
  electionZone: string;
  weekStart: WeekStart;
  saturdayTint: boolean;
  sundayTint: boolean;
  holidayTint: boolean;
  tabs: Record<CalTabId, boolean>;
  a11yNumbers: boolean;
  a11yText: boolean;
  a11ySaturated: boolean;
  a11yColorblind: boolean;
  a11yHints: boolean;
  pisBirthMonth: number | null;
  fgtsBirthMonth: number | null;
  laborMonth: number | null;
  pisOn: boolean;
  fgtsOn: boolean;
  laborTriedYear: number | null;
  bolsaNis: string;
  bolsaOn: boolean;
  gasOn: boolean;
  ipvaUf: string;
  ipvaPlate: string;
  ipvaDigit: number | null;
  ipvaOn: boolean;
  licencaOn: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  theme: "clareira",
  font: "grove",
  size: "md",
  municipal: false,
  commemorative: false,
  elections: true,
  enem: false,
  irpfOn: true,
  seasons: true,
  lunar: false,
  hourCycle: "12",
  electionSecondRound: false,
  electionSecondTriedYear: null,
  facultative: true,
  national: true,
  cityName: "",
  cityIbge: null,
  cityUf: "",
  electionPlace: "",
  electionZone: "",
  weekStart: "sunday",
  saturdayTint: false,
  sundayTint: false,
  holidayTint: true,
  tabs: DEFAULT_TABS,
  a11yNumbers: false,
  a11yText: false,
  a11ySaturated: false,
  a11yColorblind: false,
  a11yHints: false,
  pisBirthMonth: null,
  fgtsBirthMonth: null,
  laborMonth: null,
  pisOn: false,
  fgtsOn: false,
  laborTriedYear: null,
  bolsaNis: "",
  bolsaOn: false,
  gasOn: false,
  ipvaUf: "",
  ipvaPlate: "",
  ipvaDigit: null,
  ipvaOn: false,
  licencaOn: false,
};

export const EVENT_KINDS = ["semanal", "mensal", "semestral", "anual", "personalizado"] as const;

export const DOW = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"] as const;
export const DOW_SUNDAY = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"] as const;

export function weekLabels(start: WeekStart): readonly string[] {
  return start === "sunday" ? DOW_SUNDAY : DOW;
}

export const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

export const WEEKDAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
] as const;

export const SETTINGS_KEY = "calendae-settings";
export const YEAR_MIN = 1;
export const YEAR_MAX = 9999;

/** JS trata 0–99 como 1900–1999. setFullYear evita isso. */
export function civilDate(year: number, monthIndex: number, day = 1): Date {
  const date = new Date(0);
  date.setFullYear(year, monthIndex, day);
  date.setHours(0, 0, 0, 0);
  return date;
}
export const EVENTS_KEY = "calendae-events";
export const HOLIDAYS_KEY = "calendae-holidays";
export const PERIODS_KEY = "calendae-periods";
export const INSS_KEY = "calendae-inss";
export const HISTORY_KEY = "calendae-history";
export const ALMANAC_KEY = "calendae-almanac";
export const HOLIDAY_STALE_MS = 6 * 60 * 60 * 1000;

const LEGACY_SETTINGS_KEY = "almanaque-settings";
const LEGACY_EVENTS_KEY = "almanaque-events";
const LEGACY_HOLIDAYS_KEY = "almanaque-holidays";
const LEGACY_PERIODS_KEY = "almanaque-periods";

export function takeLocal(key: string, legacy: string): string | null {
  try {
    const fresh = localStorage.getItem(key);
    if (fresh != null) {
      localStorage.removeItem(legacy);
      return fresh;
    }
    const old = localStorage.getItem(legacy);
    if (old == null) return null;
    localStorage.setItem(key, old);
    localStorage.removeItem(legacy);
    return old;
  } catch {
    return null;
  }
}

export function readSettingsRaw(): string | null {
  return takeLocal(SETTINGS_KEY, LEGACY_SETTINGS_KEY);
}

export function readEventsRaw(): string | null {
  return takeLocal(EVENTS_KEY, LEGACY_EVENTS_KEY);
}

export function readPeriodsRaw(): string | null {
  return takeLocal(PERIODS_KEY, LEGACY_PERIODS_KEY);
}

export function readHolidaysRaw(): string | null {
  return takeLocal(HOLIDAYS_KEY, LEGACY_HOLIDAYS_KEY);
}

export type HolidayYearCache = {
  events: CalEvent[];
  fetchedAt: number;
  source: "live" | "fallback";
};

export type HolidayStore = Record<string, HolidayYearCache>;

export type Period = {
  id: string;
  title: string;
  startIso: string;
  days: number;
};

export const PERIOD_PRESETS = ["Férias", "Folgas", "Licença"] as const;

export function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${String(y).padStart(4, "0")}-${m}-${d}`;
}

export function todayIso(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "01";
  return `${pick("year")}-${pick("month")}-${pick("day")}`;
}

export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return civilDate(y, m - 1, d);
}

export function shiftMonth(anchor: Date, delta: number): Date {
  return civilDate(anchor.getFullYear(), anchor.getMonth() + delta, 1);
}

export function weekdayName(iso: string): string {
  return WEEKDAYS[fromIso(iso).getDay()];
}

export type HourCycle = "12" | "24";

export function formatTime(time?: string, cycle: HourCycle = "12"): string {
  if (!time) return "";
  const [hourPart, minutePart] = time.split(":");
  const hours = Number(hourPart);
  const minutes = Number(minutePart);
  if (!Number.isFinite(hours)) return time;
  const mins = Number.isFinite(minutes) ? String(minutes).padStart(2, "0") : "00";
  if (cycle === "24") return `${String(Math.min(23, Math.max(0, hours))).padStart(2, "0")}:${mins}`;
  const suffix = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${mins} ${suffix}`;
}

export function shiftDays(date: Date, days: number): Date {
  return civilDate(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function expandPeriod(period: Period): string[] {
  const start = fromIso(period.startIso);
  const count = Math.max(1, Math.min(366, Math.floor(period.days) || 1));
  return Array.from({ length: count }, (_, i) => toIso(shiftDays(start, i)));
}

export function periodOverlapsMonth(period: Period, year: number, month: number): boolean {
  return expandPeriod(period).some((iso) => {
    const date = fromIso(iso);
    return date.getFullYear() === year && date.getMonth() === month;
  });
}

export function formatPeriodSpan(period: Period): string {
  const isos = expandPeriod(period);
  const start = fromIso(isos[0]);
  const end = fromIso(isos[isos.length - 1]);
  const startLabel = `${start.getDate()} ${MONTHS[start.getMonth()].slice(0, 3)}`;
  if (isos.length === 1) return startLabel;
  const endLabel = `${end.getDate()} ${MONTHS[end.getMonth()].slice(0, 3)}`;
  return `${startLabel} – ${endLabel}`;
}

export function periodToEvent(period: Period): CalEvent {
  return {
    id: period.id,
    iso: period.startIso,
    title: period.title,
    durationDays: Math.max(1, Math.min(366, Math.floor(period.days) || 1)),
    source: "period",
  };
}

export function isPeriodEvent(event: CalEvent): boolean {
  return event.source === "period";
}

export function eventOverlapsMonth(event: CalEvent, year: number, month: number): boolean {
  const days = Math.max(1, Math.min(366, Math.floor(event.durationDays ?? 1) || 1));
  const start = fromIso(event.iso);
  for (let i = 0; i < days; i += 1) {
    const date = shiftDays(start, i);
    if (date.getFullYear() === year && date.getMonth() === month) return true;
  }
  return false;
}

export function eventSpanIsos(event: CalEvent): string[] {
  return expandPeriod({
    id: event.id,
    title: event.title,
    startIso: event.iso,
    days: event.durationDays ?? 1,
  });
}

export function formatHolidaySync(cache: HolidayYearCache | undefined): string {
  if (!cache) return "Sincronizando feriados oficiais…";
  if (cache.source !== "live") return "Lista de segurança — reconecte para atualizar.";
  const age = Date.now() - cache.fetchedAt;
  if (age < 60_000) return "Sincronizado agora.";
  const hours = Math.max(1, Math.round(age / 3_600_000));
  if (hours < 24) return `Sincronizado há ${hours} h.`;
  const days = Math.max(1, Math.round(hours / 24));
  return `Sincronizado há ${days} d.`;
}

function lastDayOfMonth(year: number, month: number): number {
  return civilDate(year, month + 1, 0).getDate();
}

function isEveryNMonths(start: Date, date: Date, every: number): boolean {
  const diff =
    (date.getFullYear() - start.getFullYear()) * 12 + (date.getMonth() - start.getMonth());
  if (diff < 0 || diff % every !== 0) return false;
  const day = Math.min(start.getDate(), lastDayOfMonth(date.getFullYear(), date.getMonth()));
  return date.getDate() === day;
}

function isUtilDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function nationalOffIsos(year: number): Set<string> {
  return new Set(
    fallbackHolidays(year)
      .filter((event) => event.holidayKind === "national")
      .map((event) => event.iso),
  );
}

function offAround(year: number): Set<string> {
  return new Set([...nationalOffIsos(year - 1), ...nationalOffIsos(year), ...nationalOffIsos(year + 1)]);
}

function mondayOf(date: Date): Date {
  const start = civilDate(date.getFullYear(), date.getMonth(), date.getDate());
  const weekDay = start.getDay();
  start.setDate(start.getDate() - (weekDay === 0 ? 6 : weekDay - 1));
  return start;
}

function collectDays(start: Date, count: number, util: boolean, off: Set<string>): string[] {
  const days: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const date = civilDate(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const iso = toIso(date);
    if (util && (!isUtilDay(date) || off.has(iso))) continue;
    days.push(iso);
  }
  return days;
}

function yearLength(year: number): number {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 366 : 365;
}

export function usesOrdinal(event: CalEvent): boolean {
  if (!event.monthSide) return false;
  return (
    event.kind === "semanal" ||
    event.kind === "mensal" ||
    event.kind === "semestral" ||
    event.kind === "anual" ||
    event.kind === "posicao"
  );
}

export function ordinalIso(event: CalEvent, inDate: Date): string | null {
  if (!event.monthSide) return null;
  const n = event.monthNth && event.monthNth > 0 ? event.monthNth : 1;
  const year = inDate.getFullYear();
  const off = event.monthUtil ? offAround(year) : new Set<string>();
  const util = Boolean(event.monthUtil);
  let days: string[] = [];
  if (event.kind === "semanal") {
    days = collectDays(mondayOf(inDate), 7, util, off);
  } else if (event.kind === "mensal" || event.kind === "posicao") {
    const month = inDate.getMonth();
    days = collectDays(civilDate(year, month, 1), lastDayOfMonth(year, month), util, off);
  } else if (event.kind === "semestral") {
    const startMonth = inDate.getMonth() < 6 ? 0 : 6;
    const start = civilDate(year, startMonth, 1);
    const end = civilDate(year, startMonth + 6, 0);
    const count = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1;
    days = collectDays(start, count, util, off);
  } else if (event.kind === "anual") {
    days = collectDays(civilDate(year, 0, 1), yearLength(year), util, off);
  } else {
    return null;
  }
  const index = event.monthSide === "ultimos" ? days.length - n : n - 1;
  if (index < 0 || index >= days.length) return null;
  return days[index];
}

export function nthMonthIso(event: CalEvent, year: number, month: number): string | null {
  return ordinalIso({ ...event, kind: event.kind ?? "mensal" }, civilDate(year, month, 1));
}

function shiftByKind(date: Date, event: CalEvent): Date {
  if (event.kind === "semanal") {
    return civilDate(date.getFullYear(), date.getMonth(), date.getDate() + 7);
  }
  if (event.kind === "personalizado") {
    const step = event.everyDays && event.everyDays > 0 ? event.everyDays : 1;
    return civilDate(date.getFullYear(), date.getMonth(), date.getDate() + step);
  }
  const months = event.kind === "semestral" ? 6 : event.kind === "anual" ? 12 : 1;
  const day = date.getDate();
  const next = civilDate(date.getFullYear(), date.getMonth() + months, 1);
  next.setDate(Math.min(day, lastDayOfMonth(next.getFullYear(), next.getMonth())));
  return next;
}

export function postponeIso(event: CalEvent, from: string): string {
  const date = fromIso(from);
  if (!event.kind) {
    date.setDate(date.getDate() + 1);
    return toIso(date);
  }
  const shifted = shiftByKind(date, event);
  if (usesOrdinal(event)) return ordinalIso(event, shifted) ?? toIso(shifted);
  return toIso(shifted);
}

export function nextIntervalIsos(event: CalEvent, from: string, count = 4): string[] {
  if (!event.kind) return [];
  const out: string[] = [];
  let cursor = from;
  for (let i = 0; i < count; i += 1) {
    const next = postponeIso(event, cursor);
    if (!next || next <= cursor) break;
    out.push(next);
    cursor = next;
  }
  return out;
}

export function intervalFollow(
  event: CalEvent,
  from: string,
  year: number,
  month: number,
): { rest: string[]; hop: string | null } {
  if (!event.kind) return { rest: [], hop: null };
  const monthEnd = toIso(civilDate(year, month + 1, 0));
  const rest: string[] = [];
  let cursor = from;
  for (let i = 0; i < 40; i += 1) {
    const next = postponeIso(event, cursor);
    if (!next || next <= cursor) return { rest, hop: null };
    if (next > monthEnd) return { rest, hop: next };
    rest.push(next);
    cursor = next;
  }
  const hop = postponeIso(event, cursor);
  return { rest, hop: hop && hop > cursor ? hop : null };
}

function advanceKind(event: CalEvent, iso: string, steps: number): string {
  let cursor = iso;
  for (let i = 0; i < steps; i += 1) {
    const next = postponeIso(event, cursor);
    if (!next || next <= cursor) return cursor;
    cursor = next;
  }
  return cursor;
}

function freeNear(iso: string, step: number, blocked: ReadonlySet<string>): string {
  let cursor = iso;
  for (let i = 0; i < 21; i += 1) {
    const date = fromIso(cursor);
    date.setDate(date.getDate() + step);
    cursor = toIso(date);
    if (!blocked.has(cursor)) return cursor;
  }
  return cursor;
}

/** Datas do intervalo depois da regra de feriado. Ignorar devolve vazio: a série normal fica. */
export function resolvedMarks(event: CalEvent, blocked: ReadonlySet<string>, until: string): string[] {
  const rule = event.intervalRule ?? "ignorar";
  if (!event.kind || rule === "ignorar") return [];
  const out: string[] = [];
  const seen = new Set<string>();
  let cursor: string | null = event.iso;
  let delay = 0;
  for (let guard = 0; guard < 8000 && cursor; guard += 1) {
    let placed = delay > 0 ? advanceKind(event, cursor, delay) : cursor;
    if (blocked.has(placed)) {
      if (rule === "adiar") {
        delay += 1;
        placed = advanceKind(event, cursor, delay);
        let extra = 0;
        while (blocked.has(placed) && extra < 30) {
          delay += 1;
          extra += 1;
          placed = advanceKind(event, cursor, delay);
        }
        if (!blocked.has(placed)) push(placed);
      } else if (rule === "preceder") {
        push(freeNear(placed, -1, blocked));
      } else if (rule === "proceder") {
        push(freeNear(placed, 1, blocked));
      }
    } else {
      push(placed);
    }
    if (cursor > until) break;
    const next = postponeIso(event, cursor);
    if (!next || next <= cursor) break;
    cursor = next;
  }
  return out;

  function push(iso: string) {
    if (seen.has(iso)) return;
    seen.add(iso);
    out.push(iso);
  }
}

export function followResolved(
  event: CalEvent,
  blocked: ReadonlySet<string>,
  anchor: string,
  year: number,
  month: number,
): { rest: string[]; hop: string | null } {
  if (!event.kind || !event.intervalRule || event.intervalRule === "ignorar") {
    return intervalFollow(event, anchor, year, month);
  }
  const monthEnd = toIso(civilDate(year, month + 1, 0));
  const horizon = toIso(civilDate(year, month + 2, 21));
  const later = resolvedMarks(event, blocked, horizon).filter((iso) => iso > anchor);
  return {
    rest: later.filter((iso) => iso <= monthEnd),
    hop: later.find((iso) => iso > monthEnd) ?? null,
  };
}

export function eventMatchesIso(event: CalEvent, iso: string): boolean {
  if (event.source === "benefit") {
    return event.iso === iso;
  }
  if (usesOrdinal(event)) {
    if (iso < event.iso) return false;
    return ordinalIso(event, fromIso(iso)) === iso;
  }
  if (event.iso === iso) return true;
  if (iso < event.iso) return false;
  if (!event.kind) return false;
  const start = fromIso(event.iso);
  const date = fromIso(iso);
  if (event.kind === "semanal") return date.getDay() === start.getDay();
  if (event.kind === "mensal") return isEveryNMonths(start, date, 1);
  if (event.kind === "semestral") return isEveryNMonths(start, date, 6);
  if (event.kind === "anual" || event.source === "birthday") {
    return isEveryNMonths(start, date, 12);
  }
  if (event.kind === "personalizado") {
    const step = event.everyDays ?? 0;
    if (step < 1) return false;
    const diff = Math.round((date.getTime() - start.getTime()) / 86_400_000);
    return diff >= 0 && diff % step === 0;
  }
  return false;
}

export function occurrenceInMonth(event: CalEvent, year: number, month: number): string | null {
  if (usesOrdinal(event)) {
    const last = lastDayOfMonth(year, month);
    for (let day = 1; day <= last; day += 1) {
      const iso = toIso(civilDate(year, month, day));
      if (eventMatchesIso(event, iso)) return iso;
    }
    return null;
  }
  if (event.kind === "semanal") {
    const start = fromIso(event.iso);
    if (start.getFullYear() === year && start.getMonth() === month && eventMatchesIso(event, event.iso)) {
      return event.iso;
    }
    const last = lastDayOfMonth(year, month);
    for (let day = 1; day <= last; day += 1) {
      const iso = toIso(civilDate(year, month, day));
      if (eventMatchesIso(event, iso)) return iso;
    }
    return null;
  }
  const start = fromIso(event.iso);
  const day = Math.min(start.getDate(), lastDayOfMonth(year, month));
  const iso = toIso(civilDate(year, month, day));
  return eventMatchesIso(event, iso) ? iso : null;
}

export function isOffDayHoliday(event: CalEvent): boolean {
  if (event.source !== "holiday") return false;
  if (facultativeName(event.title) || event.holidayKind === "facultative") return false;
  return (
    event.holidayKind === "national" ||
    event.holidayKind === "municipal" ||
    event.holidayKind === undefined
  );
}

export function isCommemorative(event: CalEvent): boolean {
  return event.source === "holiday" && (event.holidayKind === "commemorative" || isEasterHoliday(event));
}

export function isEasterHoliday(event: CalEvent): boolean {
  const n = foldName(event.title);
  if (n.includes("pascoa") || n.includes("ressurreicao") || (n.includes("easter") && !n.includes("friday"))) {
    return true;
  }
  if (event.source !== "holiday") return false;
  return toIso(easterDate(fromIso(event.iso).getFullYear())) === event.iso;
}

export function isFacultative(event: CalEvent): boolean {
  return (
    event.source === "holiday" &&
    (event.holidayKind === "facultative" || facultativeName(event.title))
  );
}

export function isNational(event: CalEvent): boolean {
  if (event.source !== "holiday") return false;
  if (isFacultative(event) || isCommemorative(event) || isElection(event) || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar") return false;
  if (event.holidayKind === "municipal") return false;
  return event.holidayKind === "national" || event.holidayKind === undefined;
}

export function isElection(event: CalEvent): boolean {
  return event.source === "holiday" && event.holidayKind === "election";
}

export function isEnem(event: CalEvent): boolean {
  return event.source === "holiday" && event.holidayKind === "enem";
}

export function officeHolidayLabel(event: CalEvent): "Feriado Nacional" | "Feriado Municipal" | null {
  if (event.source !== "holiday") return null;
  if (isFacultative(event) || isCommemorative(event) || isElection(event) || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar") return null;
  if (event.holidayKind === "municipal") return "Feriado Municipal";
  if (event.holidayKind === "national" || event.holidayKind === undefined) return "Feriado Nacional";
  return null;
}

export function isIrpf(event: CalEvent): boolean {
  return event.source === "irpf";
}

export function isPis(event: CalEvent): boolean {
  return event.source === "pis";
}

export function isIpva(event: CalEvent): boolean {
  return event.source === "ipva";
}

export function isFgts(event: CalEvent): boolean {
  return event.source === "fgts";
}

export function isBolsa(event: CalEvent): boolean {
  return event.source === "bolsa";
}

export function isGas(event: CalEvent): boolean {
  return event.source === "gas";
}

export function isPayment(event: CalEvent): boolean {
  return event.source === "benefit" || event.source === "pis" || event.source === "irpf" || event.source === "fgts" || event.source === "bolsa" || event.source === "gas";
}

export function isLicenca(event: CalEvent): boolean {
  return event.source === "licenca";
}

export function isBill(event: CalEvent): boolean {
  return event.source === "bill";
}

export function isBoleto(event: CalEvent): boolean {
  return event.source === "boleto";
}

export function isAgendaMark(event: CalEvent): boolean {
  return event.source === "local" || event.source === "google";
}

/** Traço na grade: só a data (e o intervalo, se houver). Duração nunca pinta dia extra. */
export function eventMarksGrid(event: CalEvent, iso: string): boolean {
  if (!isAgendaMark(event)) return false;
  return eventMatchesIso(event, iso);
}

export function isOneShotEvent(event: CalEvent): boolean {
  if (event.source === "birthday" || event.source === "benefit" || event.source === "holiday" || event.source === "bill" || event.source === "boleto" || event.source === "irpf" || event.source === "pis" || event.source === "ipva" || event.source === "fgts" || event.source === "bolsa" || event.source === "gas" || event.source === "licenca") {
    return false;
  }
  return !event.kind;
}

export function timeToMinutes(time?: string): number {
  if (!time) return 0;
  const nums = time.match(/\d+/g);
  if (!nums?.length) return 0;
  const hours = Number(nums[0]);
  const minutes = nums[1] !== undefined ? Number(nums[1]) : 0;
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return 0;
  return Math.max(0, hours) * 60 + Math.max(0, minutes);
}

export function minutesToTime(mins: number): string {
  if (mins <= 0) return "";
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  if (!minutes) return `${hours}  h`;
  return `${hours}  h ${minutes} min`;
}

export function eventStartAt(event: CalEvent): Date {
  const date = fromIso(event.iso);
  if (event.time) {
    const [hours, minutes] = event.time.split(":").map(Number);
    if (Number.isFinite(hours) && Number.isFinite(minutes)) date.setHours(hours, minutes, 0, 0);
  }
  return date;
}

export function eventEndAt(event: CalEvent): Date {
  const days = event.durationDays && event.durationDays > 0 ? event.durationDays : 0;
  const mins = event.durationMinutes && event.durationMinutes > 0 ? event.durationMinutes : 0;
  if (!days && !mins) {
    const end = fromIso(event.iso);
    end.setDate(end.getDate() + 1);
    end.setHours(0, 0, 0, 0);
    return end;
  }
  if (days) {
    const end = fromIso(event.iso);
    end.setDate(end.getDate() + days);
    end.setHours(0, 0, 0, 0);
    if (mins) end.setMinutes(end.getMinutes() + mins);
    return end;
  }
  const end = eventStartAt(event);
  end.setMinutes(end.getMinutes() + mins);
  return end;
}

export function lastVisibleIso(event: CalEvent): string {
  const end = eventEndAt(event);
  if (end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0) {
    return toIso(new Date(end.getTime() - 1));
  }
  return toIso(end);
}

export function isDueForHistory(event: CalEvent, today: string, now = new Date()): boolean {
  if (!isOneShotEvent(event)) return false;
  if (!event.durationDays && !event.durationMinutes) return event.iso < today;
  return eventEndAt(event).getTime() <= now.getTime();
}

export function archiveEvent(event: CalEvent): CalEvent {
  return event.notify ? { ...event, notify: false } : event;
}

export function eventTab(event: CalEvent): CalTabId | null {
  if (event.source === "holiday") {
    if (event.holidayKind === "election" || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar") return "destaques";
    return "holidays";
  }
  if (event.source === "birthday") return "birthdays";
  if (event.source === "benefit" || event.source === "bill" || event.source === "boleto" || event.source === "irpf" || event.source === "pis" || event.source === "ipva" || event.source === "fgts" || event.source === "bolsa" || event.source === "gas" || event.source === "licenca") return "finance";
  if (event.source === "local" || event.source === "google") return "agenda";
  return null;
}

export function tabAllowsEvent(tabs: Record<CalTabId, boolean>, event: CalEvent): boolean {
  const tab = eventTab(event);
  return tab ? tabs[tab] !== false : true;
}

export function mergeEventsById(base: CalEvent[], extra: CalEvent[]): CalEvent[] {
  if (!extra.length) return base;
  const have = new Set(base.map((event) => event.id));
  const add = extra.filter((event) => !have.has(event.id));
  return add.length ? [...base, ...add] : base;
}

export type CellSquare = "today" | "election" | "holiday" | "overdue" | "birthday" | "none";
export type CellNum =
  | "pay"
  | "bill"
  | "ir"
  | "holiday"
  | "commemorative"
  | "election"
  | "enem"
  | "season"
  | "lunar"
  | "moon-new"
  | "moon-wax"
  | "moon-full"
  | "moon-wane"
  | "eclipse"
  | "today"
  | "white"
  | "fg";

export function cellLook(
  cell: CalCell,
  selected: boolean,
  inPeriod: boolean,
  saturdayTint = false,
  sundayTint = false,
  holidayTint = true,
  today = "",
): { square: CellSquare; num: CellNum } {
  const off = holidayTint && cell.events.some(isOffDayHoliday);
  const commemorative = holidayTint && cell.events.some(isCommemorative);
  const facultative = holidayTint && cell.events.some(isFacultative);
  const election = holidayTint && cell.events.some(isElection);
  const enem = cell.events.some(isEnem);
  const season = cell.events.some((event) => event.holidayKind === "season");
  const lunar = cell.events.find((event) => event.holidayKind === "lunar" && !event.title.startsWith("Eclipse"));
  const eclipse = cell.events.some((event) => event.holidayKind === "lunar" && event.title.startsWith("Eclipse"));
  const payment = cell.events.some(isPayment);
  const bill = cell.events.some(isBill) || cell.events.some(isBoleto) || cell.events.some(isIpva) || cell.events.some(isLicenca);
  const overdue = Boolean(today) && bill && cell.iso < today;
  const birthday = cell.events.some((event) => event.source === "birthday");
  const dow = fromIso(cell.iso).getDay();
  const weekend = (saturdayTint && dow === 6) || (sundayTint && dow === 0);

  let square: CellSquare = "none";
  if (cell.isToday && birthday) square = "birthday";
  else if (cell.isToday) square = "today";
  else if (overdue) square = "overdue";
  else if (election) square = "election";
  else if (off) square = "holiday";
  else if (birthday) square = "birthday";

  let num: CellNum = "fg";
  if (payment) num = "pay";
  else if (bill) num = "bill";
  else if (enem) num = "enem";
  else if (season) num = "season";
  else if (eclipse) num = "eclipse";
  else if (lunar?.title === "Lua nova") num = "moon-new";
  else if (lunar?.title === "Quarto crescente") num = "moon-wax";
  else if (lunar?.title === "Lua cheia") num = "moon-full";
  else if (lunar?.title === "Quarto minguante") num = "moon-wane";
  else if (lunar) num = "lunar";
  else if (off) num = "holiday";
  else if (commemorative) num = "commemorative";
  else if (facultative) num = "holiday";
  else if (election) num = "election";
  else if (weekend && cell.inMonth) num = "holiday";
  else if (cell.isToday) num = "today";

  if (selected && (square === "today" || square === "holiday" || square === "election" || square === "birthday")) {
    num = "white";
  }

  return { square, num };
}

export function uniqueEvents(events: CalEvent[]): CalEvent[] {
  const seen = new Set<string>();
  const out: CalEvent[] = [];
  for (const event of events) {
    const key = `${event.source}:${event.holidayKind ?? ""}:${event.iso}:${event.title}:${event.time ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(event);
  }
  return out;
}

export function buildMonthCells(
  view: Date,
  today: string,
  events: CalEvent[],
  weekStart: WeekStart = "sunday",
): CalCell[] {
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDow = civilDate(year, month, 1).getDay();
  const offset = weekStart === "sunday" ? firstDow : (firstDow + 6) % 7;
  const start = civilDate(year, month, 1 - offset);
  const cells: CalCell[] = [];

  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const iso = toIso(date);
    const inMonth = date.getMonth() === month;
    cells.push({
      day: date.getDate(),
      inMonth,
      isToday: iso === today,
      iso,
      events: inMonth ? events.filter((event) => eventMatchesIso(event, iso)) : [],
    });
  }

  if (cells.slice(35).every((cell) => !cell.inMonth)) {
    return cells.slice(0, 35);
  }
  return cells;
}

export function newEventId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function easterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return civilDate(year, month - 1, day);
}

function shiftDay(date: Date, days: number): string {
  return toIso(shiftDays(date, days));
}

function foldName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const NATIONAL_AKA_RULES: { test: (n: string) => boolean; aka: string }[] = [
  {
    test: (n) =>
      n.includes("confraternizacao") ||
      n.includes("fraternidade") ||
      n.includes("ano novo") ||
      n.includes("new year"),
    aka: "Ano Novo",
  },
  { test: (n) => n.includes("paixao") || (n.includes("sexta") && n.includes("santa")) || n.includes("good friday"), aka: "Paixão de Cristo" },
  { test: (n) => n.includes("pascoa") || n.includes("ressurreicao") || n.includes("easter"), aka: "Domingo da Ressurreição" },
  { test: (n) => n.includes("tiradentes") || n.includes("inconfidencia"), aka: "Dia da Inconfidência" },
  { test: (n) => n.includes("finados") || n.includes("dia dos mortos") || n.includes("all souls"), aka: "Dia dos Mortos" },
  { test: (n) => n.includes("natal") || n.includes("christmas") || n.includes("nascimento de cristo"), aka: "Nascimento de Cristo" },
  { test: (n) => n.includes("dia do trabalho") || n.includes("dia do trabalhador") || n.includes("1 de maio") || n.includes("1o de maio") || n.includes("labour") || n.includes("labor day"), aka: "Dia dos Trabalhadores" },
  { test: (n) => n.includes("independencia") || n.includes("dia da patria"), aka: "Dia da Pátria" },
  { test: (n) => n.includes("aparecida"), aka: "Padroeira do Brasil" },
  { test: (n) => n.includes("proclamacao") || n.includes("dia da republica"), aka: "Dia da República" },
  { test: (n) => n.includes("consciencia negra") || n.includes("zumbi"), aka: "Zumbi dos Palmares" },
];

export function nationalAka(title: string): string | null {
  const n = foldName(title);
  return NATIONAL_AKA_RULES.find((row) => row.test(n))?.aka ?? null;
}

/** Ano estimado em que a data começou a ser comemorada. Municipal fica de fora. */
const OBSERVANCE_YEAR: { test: (n: string) => boolean; year: number }[] = [
  { test: (n) => n.includes("vespera") && n.includes("natal"), year: 336 },
  { test: (n) => n.includes("vespera") && (n.includes("ano") || n.includes("reveillon")), year: 1582 },
  { test: (n) => n.includes("confraternizacao") || n.includes("ano novo") || n.includes("new year"), year: 1949 },
  { test: (n) => n.includes("paixao") || (n.includes("sexta") && n.includes("santa")) || n.includes("good friday"), year: 325 },
  { test: (n) => n.includes("tiradentes") || n.includes("inconfidencia"), year: 1890 },
  { test: (n) => n.includes("trabalho") || n.includes("trabalhador"), year: 1924 },
  { test: (n) => n.includes("independencia") || n.includes("patria"), year: 1822 },
  { test: (n) => n.includes("aparecida") || n.includes("padroeira"), year: 1717 },
  { test: (n) => n.includes("finados") || n.includes("dia dos mortos"), year: 998 },
  { test: (n) => n.includes("proclamacao") || n.includes("republica"), year: 1889 },
  { test: (n) => n.includes("consciencia negra") || n.includes("zumbi"), year: 1971 },
  { test: (n) => n.includes("natal") || n.includes("nascimento de cristo") || n.includes("christmas"), year: 336 },
  { test: (n) => n.includes("carnaval") || n.includes("momo"), year: 1723 },
  { test: (n) => n.includes("cinzas") || n.includes("quaresma"), year: 1091 },
  { test: (n) => n.includes("corpus"), year: 1264 },
  { test: (n) => n.includes("servidor") || n.includes("funcionario publico"), year: 1943 },
  { test: (n) => n.includes("reis") || n.includes("epifania"), year: 361 },
  { test: (n) => n.includes("mulher"), year: 1911 },
  { test: (n) => n.includes("mentira") || n.includes("bobos") || n.includes("april fool"), year: 1582 },
  { test: (n) => n.includes("pascoa") || n.includes("ressurreicao") || n.includes("easter"), year: 325 },
  { test: (n) => n.includes("indigena") || n.includes("indio"), year: 1943 },
  { test: (n) => n.includes("descobrimento") || n.includes("cabral"), year: 1500 },
  { test: (n) => n.includes("maes") || n.includes("maternidade"), year: 1932 },
  { test: (n) => n.includes("abolicao") || n.includes("escrav"), year: 1888 },
  { test: (n) => n.includes("namorado") || n.includes("dia do amor"), year: 1949 },
  { test: (n) => n.includes("santo antonio") || n.includes("casamenteiro"), year: 1232 },
  { test: (n) => n.includes("sao joao") || n.includes("joao batista"), year: 400 },
  { test: (n) => n.includes("lgbt") || n.includes("orgulho"), year: 1970 },
  { test: (n) => n.includes("sao pedro") || n.includes("pedro e paulo"), year: 258 },
  { test: (n) => n.includes("paternidade") || n.includes(" dia dos pais") || n.endsWith("pais"), year: 1953 },
  { test: (n) => n.includes("estudante") || n.includes("aluno"), year: 1827 },
  { test: (n) => n.includes("folclore"), year: 1846 },
  { test: (n) => n.includes("arvore"), year: 1965 },
  { test: (n) => n.includes("crianca"), year: 1925 },
  { test: (n) => n.includes("professor") || n.includes("mestre"), year: 1963 },
  { test: (n) => n.includes("halloween") || n.includes("bruxas"), year: 835 },
  { test: (n) => n.includes("festival da lua") || n.includes("meio-outono") || n.includes("meio outono"), year: 618 },
  { test: (n) => n.includes("copa") || n.includes("brasil x"), year: 1930 },
];

export function observanceYear(title: string): number | null {
  const n = foldName(title);
  return OBSERVANCE_YEAR.find((row) => row.test(n))?.year ?? null;
}

const FACULTATIVE_AKA_RULES: { test: (n: string) => boolean; aka: string }[] = [
  { test: (n) => n.includes("carnaval") || n.includes("momo"), aka: "Folia de Momo" },
  { test: (n) => n.includes("cinzas"), aka: "Quaresma" },
  { test: (n) => n.includes("corpus"), aka: "Corpo de Cristo" },
  { test: (n) => n.includes("servidor") || n.includes("funcionario publico"), aka: "Dia do Funcionário Público" },
  { test: (n) => n.includes("vespera") && n.includes("natal"), aka: "Ceia" },
  { test: (n) => n.includes("vespera") && (n.includes("ano") || n.includes("reveillon")), aka: "Réveillon" },
];

export function facultativeAka(title: string): string | null {
  const n = foldName(title);
  return FACULTATIVE_AKA_RULES.find((row) => row.test(n))?.aka ?? null;
}

const COMMEMORATIVE_AKA_RULES: { test: (n: string) => boolean; aka: string }[] = [
  { test: (n) => n.includes("reis") || n.includes("epifania"), aka: "Epifania do Senhor" },
  { test: (n) => n.includes("mulher"), aka: "Dia da Mulher" },
  { test: (n) => n.includes("mentira") || n.includes("bobos") || n.includes("april fool"), aka: "Dia dos Bobos" },
  { test: (n) => n.includes("indigena") || n.includes("indio") || n.includes("indios"), aka: "Dia do Índio" },
  { test: (n) => n.includes("descobrimento") || n.includes("cabral"), aka: "Chegada de Pedro Álvares Cabral" },
  { test: (n) => n.includes("abolicao") || n.includes("escrav"), aka: "Fim da Escravidão" },
  { test: (n) => n.includes("namorado") || n.includes("dia do amor"), aka: "Dia do Amor" },
  { test: (n) => n.includes("maes") || n.includes("maternidade"), aka: "Dia da Maternidade" },
  { test: (n) => n.includes("crianca"), aka: "Dia Mundial das Crianças" },
  { test: (n) => n.includes("lgbt") || n.includes("orgulho"), aka: "Dia Internacional do Orgulho LGBTQIA+" },
  { test: (n) => n.includes("santo antonio") || n.includes("casamenteiro"), aka: "Festa do Santo Casamenteiro" },
  { test: (n) => n.includes("sao joao") || n.includes("joao batista"), aka: "Nascimento de São João Batista" },
  { test: (n) => n.includes("sao pedro") || n.includes("pedro e paulo"), aka: "Festa de São Pedro e Paulo" },
  { test: (n) => n.includes("pais") || n.includes("paternidade"), aka: "Dia da Paternidade" },
  { test: (n) => n.includes("estudante") || n.includes("aluno"), aka: "Dia do Aluno" },
  { test: (n) => n.includes("folclore"), aka: "Dia Nacional do Folclore" },
  { test: (n) => n.includes("arvore"), aka: "Dia Nacional da Árvore" },
  { test: (n) => n.includes("professor") || n.includes("mestre"), aka: "Dia do Mestre" },
  { test: (n) => n.includes("halloween") || n.includes("bruxas"), aka: "Dia das Bruxas" },
  { test: (n) => n.includes("festival da lua") || n.includes("meio-outono") || n.includes("meio outono"), aka: "Festival do Meio-Outono" },
];

export function commemorativeAka(title: string): string | null {
  const n = foldName(title);
  return COMMEMORATIVE_AKA_RULES.find((row) => row.test(n))?.aka ?? null;
}

export function facultativeName(name: string): boolean {
  const n = foldName(name);
  return (
    n.includes("carnaval") ||
    n.includes("corpus christi") ||
    n.includes("corpus-christi") ||
    n.includes("cinzas") ||
    n.includes("vespera de natal") ||
    n.includes("vespera do natal") ||
    n.includes("vespera de ano") ||
    n.includes("servidor publico")
  );
}

export function fallbackHolidays(year: number): CalEvent[] {
  const easter = easterDate(year);
  const rows: { iso: string; title: string; holidayKind: HolidayKind }[] = [
    { iso: `${year}-01-01`, title: "Confraternização Universal", holidayKind: "national" },
    { iso: shiftDay(easter, -48), title: "Carnaval", holidayKind: "facultative" },
    { iso: shiftDay(easter, -47), title: "Carnaval", holidayKind: "facultative" },
    { iso: shiftDay(easter, -46), title: "Quarta-feira de Cinzas", holidayKind: "facultative" },
    { iso: shiftDay(easter, -2), title: "Sexta-feira Santa", holidayKind: "national" },
    { iso: `${year}-04-21`, title: "Tiradentes", holidayKind: "national" },
    { iso: `${year}-05-01`, title: "Dia do Trabalho", holidayKind: "national" },
    { iso: shiftDay(easter, 60), title: "Corpus Christi", holidayKind: "facultative" },
    { iso: `${year}-09-07`, title: "Independência do Brasil", holidayKind: "national" },
    { iso: `${year}-10-12`, title: "Nossa Senhora Aparecida", holidayKind: "national" },
    { iso: `${year}-10-28`, title: "Dia do Servidor Público", holidayKind: "facultative" },
    { iso: `${year}-11-02`, title: "Finados", holidayKind: "national" },
    { iso: `${year}-11-15`, title: "Proclamação da República", holidayKind: "national" },
    { iso: `${year}-11-20`, title: "Dia da Consciência Negra", holidayKind: "national" },
    { iso: `${year}-12-24`, title: "Véspera de Natal", holidayKind: "facultative" },
    { iso: `${year}-12-25`, title: "Natal", holidayKind: "national" },
    { iso: `${year}-12-31`, title: "Véspera de Ano-Novo", holidayKind: "facultative" },
  ];
  return rows.map((row) => ({
    id: `holiday-${row.iso}-${row.title}`,
    iso: row.iso,
    title: row.title,
    time: "",
    source: "holiday" as const,
    holidayKind: row.holidayKind,
  }));
}

export function readHolidayStore(): HolidayStore {
  try {
    const raw = readHolidaysRaw();
    if (!raw) return {};
    const parsed = JSON.parse(raw) as HolidayStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function mergeHolidayCatalog(events: CalEvent[], year: number): CalEvent[] {
  const have = new Set(events.map((event) => event.iso));
  const extra = fallbackHolidays(year).filter((row) => !have.has(row.iso));
  return extra.length ? [...events, ...extra] : events;
}

export function officialHolidayTitle(event: CalEvent): string {
  if (event.source === "holiday" && event.iso.slice(5) === "01-01") {
    return "Confraternização Universal";
  }
  if (event.source === "holiday" && event.iso.slice(5) === "12-25") {
    return "Natal";
  }
  const n = foldName(event.title);
  if (n.includes("paixao") || (n.includes("sexta") && n.includes("santa")) || n.includes("good friday")) {
    return "Sexta-feira Santa";
  }
  if (n.includes("dia do trabalho") || n.includes("dia do trabalhador") || n.includes("labour") || n.includes("labor day")) {
    return "Dia do Trabalho";
  }
  if (n.includes("finados") || n.includes("dia dos mortos") || n.includes("all souls")) {
    return "Finados";
  }
  if (n.includes("proclamacao") || n.includes("dia da republica")) {
    return "Proclamação da República";
  }
  if (n.includes("consciencia negra") || n.includes("zumbi")) {
    return "Dia da Consciência Negra";
  }
  return event.title;
}

export function holidaysForYears(store: HolidayStore, years: number[]): CalEvent[] {
  const seen = new Set<string>();
  const out: CalEvent[] = [];
  for (const year of years) {
    const events = mergeHolidayCatalog(store[String(year)]?.events ?? fallbackHolidays(year), year);
    for (const event of events) {
      const next = { ...event, title: officialHolidayTitle(event) };
      if (isEasterHoliday(next)) continue;
      const key = `${next.iso}:${next.title}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(next);
    }
  }
  return out;
}

export type GoogleEventRaw = {
  id?: string;
  summary?: string;
  title?: string;
  start?: { dateTime?: string; date?: string } | string;
};

export function parseGoogleEvents(data: unknown): CalEvent[] {
  const root = data as Record<string, unknown> | unknown[] | null;
  const list: unknown[] = Array.isArray(root)
    ? root
    : Array.isArray((root as Record<string, unknown> | null)?.items)
      ? ((root as Record<string, unknown>).items as unknown[])
      : Array.isArray((root as Record<string, unknown> | null)?.events)
        ? ((root as Record<string, unknown>).events as unknown[])
        : [];

  const out: CalEvent[] = [];
  for (const item of list) {
    const row = item as GoogleEventRaw;
    const start = row.start;
    const isoRaw =
      typeof start === "string" ? start : start?.dateTime || start?.date || "";
    if (!isoRaw) continue;
    const iso = isoRaw.slice(0, 10);
    const time =
      isoRaw.length > 10
        ? new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/Sao_Paulo",
          }).format(new Date(isoRaw))
        : "";
    const title = (row.summary || row.title || "Evento").trim();
    out.push({
      id: `google-${row.id ?? iso + title}`,
      iso,
      title,
      time,
      source: "google",
    });
  }
  return out;
}
