import { Bell, CalendarPlus, Contact, Pencil, Search, Settings2, SquareCheckBig, Trash2 } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { A11yHint } from "@/components/a11y-hint";
import { BirthdaysTab } from "@/components/birthdays-tab";
import { FinancesTab } from "@/components/finances-tab";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { DatePick, TimePick, YearSeg } from "@/components/date-time-pick";
import { ContactLine } from "@/components/contact-line";
import { HeaderMenu } from "@/components/header-menu";
import { HistoryTab } from "@/components/history-tab";
import { HolidaysTab } from "@/components/holidays-tab";
import { IconTips } from "@/components/icon-tips";
import { DestaquesTab } from "@/components/destaques-tab";
import { MonthGrid } from "@/components/month-grid";
import { SearchPanel, type SearchItem } from "@/components/search-panel";
import { Button } from "@/components/ui/button";
import { redirectToLoginIfRequired } from "@/lib/app-data";
import { setCalendaeLoginOff, useCalendaeSession } from "@/lib/calendae-auth";
import { pullCloud, pushCloud } from "@/lib/cloud";
import { applyNotebook, clearLocalCalendae, notebookPrint, packNotebook } from "@/lib/guardar";
import { signOut } from "@/lib/auth/client";
import { CONTACT_MAX, fitContact, pickDeviceContact } from "@/lib/contacts";
import {
  DEFAULT_SETTINGS,
  EVENT_KINDS,
  EVENTS_KEY,
  HISTORY_KEY,
  HOLIDAYS_KEY,
  INSS_KEY,
  MONTHS,
  SETTINGS_KEY,
  birthdayIso,
  buildMonthCells,
  eventOverlapsMonth,
  eventSpanIsos,
  fallbackHolidays,
  formatTime,
  fromIso,
  holidaysForYears,
  isDueForHistory,
  archiveEvent,
  civilDate,
  isFacultative,
  isNational,
  isPeriodEvent,
  lastVisibleIso,
  mergeEventsById,
  eventMatchesIso,
  eventTab,
  minutesToTime,
  newEventId,
  intervalFollow,
  followResolved,
  occurrenceInMonth,
  officeHolidayLabel,
  postponeIso,
  readEventsRaw,
  readHolidayStore,
  readPeriodsRaw,
  readSettingsRaw,
  resolvedMarks,
  shiftMonth,
  tabAllowsEvent,
  timeToMinutes,
  todayIso,
  toIso,
  uniqueEvents,
  weekdayName,
  YEAR_MAX,
  YEAR_MIN,
  type CalCell,
  type CalEvent,
  type EventKind,
  type HolidayStore,
  type IntervalRule,
  type MonthSide,
  type Period,
  type Settings,
} from "@/lib/calendar";
import { inssPayIso, parseNb, rememberInssTable, type InssYearTable } from "@/lib/inss";
import { commemorativeDates } from "@/lib/commemorative";
import {
  markMoonFestivalTried,
  moonFestivalTriedYear,
  rememberMoonFestival,
} from "@/lib/moon-festival";
import { electionDates, firstRoundIso, secondRoundIso } from "@/lib/elections";
import { enemDates } from "@/lib/enem";
import { seasonDates } from "@/lib/seasons";
import { lunarDates } from "@/lib/lunar";
import {
  dayAfter,
  ensureAlmanac,
  irpfForYear,
  irpfLotsForYear,
  showElectionSecond,
  stampFgts,
  stampIrpf,
  stampIrpfLots,
  stampPis,
  stampSecondRound,
} from "@/lib/almanac";
import { pisEvent } from "@/lib/pis";
import { fgtsEvent, fgtsWindow } from "@/lib/fgts";
import { bolsaEvent, gasEvent, nisDigit, sanitizeNis } from "@/lib/bolsa";
import { ipvaEvent, ipvaMarks, ipvaParcels, normalizeUf, plateDigit, sanitizePlate } from "@/lib/ipva";
import { licencaEvent } from "@/lib/licenciamento";
import {
  enableReminders,
  reminderStatusLabel,
  startReminders,
} from "@/lib/reminders";
import { cn, withTip } from "@/lib/utils";

const SettingsPanel = lazy(() =>
  import("@/components/settings-panel").then((mod) => ({ default: mod.SettingsPanel })),
);

function whenIdle(fn: () => void) {
  if (typeof window === "undefined") return () => {};
  const ric = window.requestIdleCallback?.bind(window);
  if (ric) {
    const id = ric(fn, { timeout: 900 });
    return () => window.cancelIdleCallback(id);
  }
  const timer = window.setTimeout(fn, 1);
  return () => window.clearTimeout(timer);
}

function seedHolidayStore(): HolidayStore {
  const year = fromIso(todayIso()).getFullYear();
  return {
    [String(year)]: {
      events: fallbackHolidays(year),
      fetchedAt: 0,
      source: "fallback",
    },
  };
}

function readSettings(): Settings {
  try {
    const raw = readSettingsRaw();
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings> & { weekendTint?: string };
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      theme: "clareira",
      municipal: Boolean(parsed.municipal),
      commemorative: Boolean(parsed.commemorative),
      elections: typeof parsed.elections === "boolean" ? parsed.elections : true,
      enem: Boolean(parsed.enem),
      irpfOn: parsed.irpfOn !== false,
      seasons: parsed.seasons !== false,
      lunar: parsed.lunar === true,
      hourCycle: parsed.hourCycle === "24" ? "24" : "12",
      electionSecondRound: Boolean(parsed.electionSecondRound),
      electionSecondTriedYear:
        typeof parsed.electionSecondTriedYear === "number" ? parsed.electionSecondTriedYear : null,
      facultative: parsed.facultative !== false,
      national: parsed.national !== false,
      cityName: typeof parsed.cityName === "string" ? parsed.cityName : "",
      cityIbge: typeof parsed.cityIbge === "number" ? parsed.cityIbge : null,
      cityUf: typeof parsed.cityUf === "string" ? parsed.cityUf : "",
      electionPlace: typeof parsed.electionPlace === "string" ? parsed.electionPlace : "",
      electionZone: typeof parsed.electionZone === "string" ? parsed.electionZone : "",
      weekStart: parsed.weekStart === "monday" ? "monday" : "sunday",
      saturdayTint:
        Boolean(parsed.saturdayTint) || parsed.weekendTint === "uteis",
      sundayTint:
        Boolean(parsed.sundayTint) ||
        parsed.weekendTint === "uteis" ||
        parsed.weekendTint === "domingos",
      holidayTint: parsed.holidayTint !== false,
      tabs: (() => {
        const raw = (parsed.tabs ?? {}) as Record<string, boolean>;
        const finance =
          typeof raw.finance === "boolean"
            ? raw.finance
            : raw.benefits !== false || raw.bills !== false;
        const { benefits: _benefits, bills: _bills, periods: _periods, ...rest } = raw;
        return { ...DEFAULT_SETTINGS.tabs, ...rest, finance };
      })(),
      a11yNumbers: Boolean(parsed.a11yNumbers),
      a11yText: Boolean(parsed.a11yText),
      a11ySaturated: Boolean(parsed.a11ySaturated),
      a11yColorblind: Boolean(parsed.a11yColorblind),
      a11yHints: Boolean(parsed.a11yHints),
      pisBirthMonth:
        typeof parsed.pisBirthMonth === "number" && parsed.pisBirthMonth >= 1 && parsed.pisBirthMonth <= 12
          ? parsed.pisBirthMonth
          : null,
      fgtsBirthMonth:
        typeof parsed.fgtsBirthMonth === "number" && parsed.fgtsBirthMonth >= 1 && parsed.fgtsBirthMonth <= 12
          ? parsed.fgtsBirthMonth
          : null,
      laborMonth: (() => {
        const n = parsed.laborMonth ?? parsed.pisBirthMonth ?? parsed.fgtsBirthMonth;
        return typeof n === "number" && n >= 1 && n <= 12 ? n : null;
      })(),
      pisOn: typeof parsed.pisOn === "boolean" ? parsed.pisOn : Boolean(parsed.pisBirthMonth),
      fgtsOn:
        typeof parsed.fgtsOn === "boolean"
          ? parsed.fgtsOn
          : Boolean(parsed.fgtsBirthMonth ?? parsed.pisBirthMonth),
      laborTriedYear:
        typeof parsed.laborTriedYear === "number" ? parsed.laborTriedYear : null,
      bolsaNis: typeof parsed.bolsaNis === "string" ? parsed.bolsaNis.replace(/\D/g, "").slice(0, 11) : "",
      bolsaOn:
        typeof parsed.bolsaOn === "boolean"
          ? parsed.bolsaOn
          : Boolean(typeof parsed.bolsaNis === "string" && parsed.bolsaNis.replace(/\D/g, "")),
      gasOn: Boolean(parsed.gasOn),
      ipvaUf: typeof parsed.ipvaUf === "string" ? parsed.ipvaUf.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase() : "",
      ipvaPlate: (() => {
        if (typeof parsed.ipvaPlate === "string" && parsed.ipvaPlate) return sanitizePlate(parsed.ipvaPlate);
        if (typeof parsed.ipvaDigit === "number") return String(parsed.ipvaDigit);
        return "";
      })(),
      ipvaDigit: (() => {
        const plate =
          typeof parsed.ipvaPlate === "string" && parsed.ipvaPlate
            ? sanitizePlate(parsed.ipvaPlate)
            : "";
        const fromPlate = plateDigit(plate);
        if (fromPlate !== null) return fromPlate;
        return typeof parsed.ipvaDigit === "number" && parsed.ipvaDigit >= 0 && parsed.ipvaDigit <= 9
          ? parsed.ipvaDigit
          : null;
      })(),
      ipvaOn:
        typeof parsed.ipvaOn === "boolean"
          ? parsed.ipvaOn
          : Boolean(
              (typeof parsed.ipvaPlate === "string" && parsed.ipvaPlate) ||
                typeof parsed.ipvaDigit === "number",
            ),
      licencaOn:
        typeof parsed.licencaOn === "boolean"
          ? parsed.licencaOn
          : Boolean(
              (typeof parsed.ipvaPlate === "string" && parsed.ipvaPlate) ||
                typeof parsed.ipvaDigit === "number",
            ),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function readLocalEvents(): CalEvent[] {
  try {
    const raw = readEventsRaw();
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CalEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readPeriods(): Period[] {
  try {
    const raw = readPeriodsRaw();
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Period[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readHistory(): CalEvent[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CalEvent[];
    return Array.isArray(parsed) ? parsed.map(archiveEvent) : [];
  } catch {
    return [];
  }
}

type InssStore = Record<string, { table: InssYearTable; fetchedAt: number }>;

function readInssStore(): InssStore {
  try {
    const raw = localStorage.getItem(INSS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as InssStore;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function applyInssStore(store: InssStore) {
  for (const [year, row] of Object.entries(store)) {
    if (row?.table) rememberInssTable(Number(year), row.table);
  }
}

const KIND_OPTIONS: { value: EventKind | ""; label: string }[] = [
  { value: "", label: "único" },
  ...EVENT_KINDS.map((kind) => ({ value: kind, label: kind })),
];

const SIDE_OPTIONS: { value: MonthSide | ""; label: string }[] = [
  { value: "", label: "Qualquer dia" },
  { value: "primeiros", label: "Primeiro dia" },
  { value: "ultimos", label: "Último dia" },
];

const RULE_OPTIONS: { value: IntervalRule; label: string }[] = [
  { value: "ignorar", label: "Ignorar" },
  { value: "preceder", label: "Preceder" },
  { value: "proceder", label: "Proceder" },
  { value: "adiar", label: "Adiar" },
  { value: "cancelar", label: "Cancelar" },
];

function upcomingBirthday(iso: string, today: string): string {
  const year = Number(today.slice(0, 4));
  const thisYear = birthdayIso(iso, year);
  return thisYear >= today ? thisYear : birthdayIso(iso, year + 1);
}

function searchKind(event: CalEvent): string {
  if (event.holidayKind === "election") return "Eleição";
  if (event.holidayKind === "enem") return "ENEM";
  if (event.holidayKind === "season") return "Estação";
  if (event.holidayKind === "lunar") return "Lua";
  if (event.source === "birthday") return "Aniversário";
  if (event.source === "holiday") return "Feriado";
  if (event.source === "benefit") return "INSS";
  if (event.source === "bill") return "Pagamento";
  if (event.source === "boleto") return "Boleto";
  if (event.source === "irpf") return "Declaração";
  if (event.source === "pis") return "PIS";
  if (event.source === "fgts") return "FGTS";
  if (event.source === "bolsa") return "Bolsa Família";
  if (event.source === "gas") return "Gás";
  if (event.source === "ipva") return "IPVA";
  if (event.source === "licenca") return "Licença";
  if (event.source === "period") return "Período";
  return "Compromisso";
}

function searchSlot(event: CalEvent, forced?: string): SearchItem["slot"] {
  if (forced === "Histórico") return "history";
  const tab = eventTab(event);
  if (tab === "destaques") return "highlight";
  if (tab === "holidays") return "holiday";
  if (tab === "birthdays") return "birthday";
  if (event.source === "period") return "period";
  if (event.source === "benefit") return "benefit";
  if (event.source === "bill" || event.source === "boleto") return "bill";
  if (event.source === "irpf") return "irpf";
  if (event.source === "pis") return "pis";
  if (event.source === "fgts") return "fgts";
  if (event.source === "bolsa") return "bolsa";
  if (event.source === "gas") return "gas";
  if (event.source === "ipva") return "ipva";
  if (event.source === "licenca") return "licenca";
  return "event";
}

function HojeIcon({ day, flash }: { day: number; flash?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("cal-glyph size-5", flash && "is-flash")}
      aria-hidden="true"
    >
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <path d="M8 3.5v3.5M16 3.5v3.5M3.5 10h17" />
      <text
        x="12"
        y="18.2"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontSize="8"
        fontWeight="600"
        fontFamily="Figtree, ui-sans-serif, sans-serif"
      >
        {day}
      </text>
    </svg>
  );
}

function KindMark({ on }: { on: boolean }) {
  return <span aria-hidden="true" className={cn("cal-kind", on && "is-on")} />;
}

function KindPick({
  kind,
  everyDays,
  open,
  onOpen,
  onClose,
  onKind,
  onEveryDays,
}: {
  kind: EventKind | null;
  everyDays: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onKind: (next: EventKind | null) => void;
  onEveryDays: (next: string) => void;
}) {
  return (
    <div className="cal-kind-pick flex items-center gap-2">
      <HeaderMenu
        label="Intervalo"
        value={kind ?? ""}
        options={KIND_OPTIONS}
        open={open}
        wide
        fixed
        soft
        buttonClassName="cal-kind-btn"
        optionClassName="cal-kind-option"
        onOpen={onOpen}
        onClose={onClose}
        onPick={(next) => {
          onKind(next === "" ? null : next);
          onClose();
        }}
      />
      <input
        value={!kind || kind === "personalizado" ? everyDays : ""}
        disabled={Boolean(kind && kind !== "personalizado")}
        readOnly={Boolean(kind && kind !== "personalizado")}
        onChange={(event) => {
          if (kind && kind !== "personalizado") return;
          const next = event.target.value.replace(/\D/g, "").slice(0, 3);
          onEveryDays(next);
          if (next && !kind) onKind("personalizado");
        }}
        placeholder="dias"
        inputMode="numeric"
        aria-label="Intervalo em dias"
        className={cn(
          "cal-field-sm h-11 rounded-xl bg-bg px-2 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
          kind && kind !== "personalizado" && "cursor-not-allowed opacity-45",
        )}
      />
    </div>
  );
}

function PlacePick({
  side,
  util,
  open,
  locked,
  onOpen,
  onClose,
  onSide,
  onUtil,
}: {
  side: MonthSide | "";
  util: boolean;
  open: boolean;
  locked?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSide: (next: MonthSide | "") => void;
  onUtil: () => void;
}) {
  return (
    <div className="cal-kind-pick flex flex-wrap items-center gap-2">
      <HeaderMenu
        label="Posição no mês"
        value={side}
        options={SIDE_OPTIONS}
        open={open && !locked}
        wide
        fixed
        soft
        disabled={locked}
        buttonClassName="cal-kind-btn"
        optionClassName="cal-kind-option"
        onOpen={onOpen}
        onClose={onClose}
        onPick={(next) => {
          if (locked) return;
          onSide(next);
          onClose();
        }}
      />
      <button
        type="button"
        aria-pressed={locked ? false : util}
        disabled={locked}
        className={cn("flex h-11 items-center gap-2 text-sm text-fg", locked && "cursor-not-allowed opacity-45")}
        onClick={() => {
          if (locked) return;
          onUtil();
        }}
      >
        útil
        <KindMark on={locked ? false : util} />
      </button>
    </div>
  );
}

function RulePick({
  rule,
  open,
  locked,
  onOpen,
  onClose,
  onRule,
}: {
  rule: IntervalRule;
  open: boolean;
  locked?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onRule: (next: IntervalRule) => void;
}) {
  return (
    <HeaderMenu
      label="Se cair em feriado"
      value={rule}
      options={RULE_OPTIONS}
      open={open && !locked}
      wide
      fixed
      soft
      disabled={locked}
      buttonClassName="cal-kind-btn"
      optionClassName="cal-kind-option"
      onOpen={onOpen}
      onClose={onClose}
      onPick={(next) => {
        if (locked) return;
        onRule(next);
        onClose();
      }}
    />
  );
}

function NotifyToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={on ? "Desligar aviso" : "Ligar aviso"}
      aria-pressed={on}
      {...withTip(on ? "Aviso ligado" : "Aviso", cn("flex size-8 shrink-0 items-center justify-center", on ? "text-fg" : "text-muted"))}
      onClick={onToggle}
    >
      <Bell className="size-4" />
    </button>
  );
}

function DurationPick({
  time,
  days,
  onTime,
  onDays,
}: {
  time: string;
  days: string;
  onTime: (next: string) => void;
  onDays: (next: string) => void;
}) {
  const hoursRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = hoursRef.current;
    const pos = caretRef.current;
    if (!el || pos == null) return;
    el.setSelectionRange(pos, pos);
    caretRef.current = null;
  }, [time]);

  return (
    <div>
      <p className="mb-1 text-xs text-muted">Duração da Marcação</p>
      <A11yHint>Por quanto tempo a data fica marcada. Em branco, sai no dia seguinte.</A11yHint>
      <div className="flex items-center gap-2">
        <input
          ref={hoursRef}
          type="text"
          inputMode="numeric"
          value={time}
          placeholder={"0  h"}
          aria-label="Duração em horas e minutos"
          onChange={(event) => {
            const raw = event.target.value;
            if (!raw.trim()) {
              onTime("");
              return;
            }
            const nums = raw.match(/\d+/g) ?? [];
            let hours = Number((nums[0] ?? "").slice(0, 3));
            const minutes = (nums[1] ?? "").slice(0, 2);
            if (!Number.isFinite(hours)) hours = 0;
            if (!hours && !minutes) {
              onTime("");
              return;
            }
            if (hours > 23) {
              const extra = Math.floor(hours / 24);
              hours = hours % 24;
              const current = Number(days.replace(/\D/g, "")) || 0;
              onDays(String(current + extra));
            }
            if (!hours && !minutes) {
              onTime("");
              caretRef.current = 0;
              return;
            }
            const hourLabel = String(hours);
            const next = minutes ? `${hourLabel}  h ${Number(minutes)} min` : `${hourLabel}  h`;
            caretRef.current = minutes ? next.lastIndexOf(" min") : hourLabel.length;
            onTime(next);
          }}
          className="cal-field-sm h-11 rounded-xl bg-bg px-2 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
        />
        <input
          value={days}
          onChange={(event) => onDays(event.target.value.replace(/\D/g, "").slice(0, 3))}
          placeholder="dias"
          inputMode="numeric"
          aria-label="Duração em dias"
          className="cal-field-sm h-11 rounded-xl bg-bg px-3 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
        />
      </div>
    </div>
  );
}

function HolidayNote({ iso, events }: { iso: string; events: CalEvent[] }) {
  let label: "Feriado Nacional" | "Feriado Municipal" | null = null;
  for (const event of events) {
    if (event.iso !== iso) continue;
    const next = officeHolidayLabel(event);
    if (next === "Feriado Nacional") {
      label = next;
      break;
    }
    if (next) label = next;
  }
  if (!label) return null;
  return <p className="cal-holiday-note">{label}</p>;
}

function ArquivoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="3.8" width="14" height="16.4" rx="1" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5 9.2h14M5 14.4h14" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10.6 6.4h2.8M10.6 11.7h2.8M10.6 16.9h2.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function foldPt(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function titleHits(title: string, query: string) {
  const q = foldPt(query);
  if (q.length < 2) return false;
  const folded = foldPt(title);
  if (folded.startsWith(q)) return true;
  return folded.split(/[^a-z0-9]+/).some((word) => word.startsWith(q));
}

function newestTitleMatch(list: CalEvent[], query: string, skipId?: string | null) {
  const hits = list.filter((event) => event.id !== skipId && titleHits(event.title, query));
  if (!hits.length) return null;
  hits.sort((a, b) => (a.iso < b.iso ? 1 : a.iso > b.iso ? -1 : 0));
  return hits[0];
}

function recallFromArchive(
  query: string,
  agenda: CalEvent[],
  historyList: CalEvent[],
  skipId?: string | null,
) {
  const q = query.trim();
  if (foldPt(q).length < 2) return null;
  const live = agenda.filter(
    (event) => event.source === "local" || event.source === "period" || event.source === "google",
  );
  const birthdays = agenda.filter((event) => event.source === "birthday");
  return (
    newestTitleMatch(live, q, skipId) ??
    newestTitleMatch(historyList, q, skipId) ??
    newestTitleMatch(birthdays, q, skipId)
  );
}

function YearType({ year, onYear }: { year: number; onYear: (next: number) => void }) {
  const [text, setText] = useState(String(year).padStart(4, "0"));
  const [flash, setFlash] = useState(false);
  const [pick, setPick] = useState(false);
  const flashT = useRef(0);
  useEffect(() => {
    setText(String(year).padStart(4, "0"));
  }, [year]);

  function commit(raw: string) {
    if (raw.length !== 4) {
      setText(String(year).padStart(4, "0"));
      return;
    }
    const next = Number(raw);
    if (!Number.isFinite(next) || next < YEAR_MIN || next > YEAR_MAX) {
      setText(String(year).padStart(4, "0"));
      return;
    }
    if (next !== year) onYear(next);
    else setText(String(next).padStart(4, "0"));
  }

  function ping() {
    setPick(true);
    setFlash(false);
    requestAnimationFrame(() => setFlash(true));
    window.clearTimeout(flashT.current);
    flashT.current = window.setTimeout(() => setFlash(false), 1250);
  }

  return (
    <span
      className={cn("cal-year-btn cal-year-type", flash && "is-flash", pick && "is-pick")}
      onPointerDown={ping}
      onBlurCapture={() => setPick(false)}
    >
      <YearSeg value={text} className="cal-year-seg" onChange={setText} onComplete={commit} />
    </span>
  );
}

function ContactField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex items-center">
      <input
        value={value}
        maxLength={CONTACT_MAX}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next.length > CONTACT_MAX ? fitContact(next) : next);
        }}
        placeholder="Contato"
        className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
      />
      <button
        type="button"
        aria-label="Abrir contatos do celular"
        {...withTip("Contatos", "flex size-8 shrink-0 items-center justify-center text-fg")}
        onClick={() => {
          void pickDeviceContact().then((picked) => {
            if (picked) onChange(fitContact(picked));
          });
        }}
      >
        <Contact className="size-4" />
      </button>
    </div>
  );
}

/** Uma puxada da nuvem por login, sobrevive a remount. Não zera no flicker da sessão. */
let cloudOnceFor = "";

export function Calendae() {
  const [today, setToday] = useState(todayIso);
  const [view, setView] = useState(() => fromIso(todayIso()));
  const [selected, setSelected] = useState(todayIso);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [localEvents, setLocalEvents] = useState<CalEvent[]>([]);
  const [history, setHistory] = useState<CalEvent[]>([]);
  const [holidayStore, setHolidayStore] = useState<HolidayStore>(seedHolidayStore);
  const [googleEvents, setGoogleEvents] = useState<CalEvent[]>([]);
  const [googleStatus, setGoogleStatus] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTime, setDraftTime] = useState("09:00");
  const [draftPlace, setDraftPlace] = useState("");
  const [draftContact, setDraftContact] = useState("");
  const [draftKind, setDraftKind] = useState<EventKind | null>(null);
  const [draftEveryDays, setDraftEveryDays] = useState("");
  const [kindMenu, setKindMenu] = useState(false);
  const [draftMonthSide, setDraftMonthSide] = useState<MonthSide | "">("");
  const [draftMonthNth, setDraftMonthNth] = useState("");
  const [draftMonthUtil, setDraftMonthUtil] = useState(false);
  const [draftIntervalRule, setDraftIntervalRule] = useState<IntervalRule>("ignorar");
  const [sideMenu, setSideMenu] = useState(false);
  const [ruleMenu, setRuleMenu] = useState(false);
  const [draftNotify, setDraftNotify] = useState(false);
  const [draftDurTime, setDraftDurTime] = useState("");
  const [draftDurDays, setDraftDurDays] = useState("");
  const [draftDate, setDraftDate] = useState(todayIso);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [hydrated, setHydrated] = useState(false);
  const [openMenu, setOpenMenu] = useState<"month" | null>(null);
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [openHolidayIso, setOpenHolidayIso] = useState<string | null>(null);
  const [openHighlightId, setOpenHighlightId] = useState<string | null>(null);
  const [openBirthdayId, setOpenBirthdayId] = useState<string | null>(null);
  const [openBenefitId, setOpenBenefitId] = useState<string | null>(null);
  const [openBillId, setOpenBillId] = useState<string | null>(null);
  const [openIrpfId, setOpenIrpfId] = useState<string | null>(null);
  const [openPisId, setOpenPisId] = useState<string | null>(null);
  const [openIpvaId, setOpenIpvaId] = useState<string | null>(null);
  const [openFgtsId, setOpenFgtsId] = useState<string | null>(null);
  const [openBolsaId, setOpenBolsaId] = useState<string | null>(null);
  const [openGasId, setOpenGasId] = useState<string | null>(null);
  const [openLicencaId, setOpenLicencaId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [periodMenu, setPeriodMenu] = useState(false);
  const [periodTitle, setPeriodTitle] = useState("Folgas");
  const [periodNote, setPeriodNote] = useState("");
  const [periodDate, setPeriodDate] = useState(todayIso);
  const [periodDays, setPeriodDays] = useState("1");
  const [periodDirty, setPeriodDirty] = useState(false);
  const [periodEditingId, setPeriodEditingId] = useState<string | null>(null);
  const [openPeriodId, setOpenPeriodId] = useState<string | null>(null);
  const periodDraftId = useRef<string | null>(null);
  const searchOpenRef = useRef(false);
  searchOpenRef.current = searchOpen;
  const [irpfRev, setIrpfRev] = useState(0);
  const [moonRev, setMoonRev] = useState(0);
  const [laborRev, setLaborRev] = useState(0);
  const [openHistoryId, setOpenHistoryId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);
  const [remindersBusy, setRemindersBusy] = useState(false);
  const [municipalEvents, setMunicipalEvents] = useState<CalEvent[]>([]);
  const [inssStore, setInssStore] = useState<InssStore>({});
  const holidayStoreRef = useRef(holidayStore);
  holidayStoreRef.current = holidayStore;
  const viewRef = useRef(view);
  const cellsRef = useRef<CalCell[]>([]);
  const leaveSeq = useRef(0);
  const playingRef = useRef(false);
  type MonthMotion = "sopro" | "lupa" | "onda" | "queda" | "queda-up" | "gaveta" | "lamina" | "lamina-left" | "fileiras";
  type MonthStep = {
    id: number;
    cells: CalCell[];
    motion: MonthMotion;
    next: Date;
    selectIso?: string;
    rush: boolean;
  };
  const queueRef = useRef<MonthStep[]>([]);
  if (!playingRef.current && queueRef.current.length === 0) viewRef.current = view;
  const [leave, setLeave] = useState<{ id: number; cells: CalCell[]; motion: MonthMotion; rush?: boolean } | null>(null);
  const [arrive, setArrive] = useState(true);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const agendaDraftId = useRef<string | null>(null);
  const swipeRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const tabFlash = useRef(0);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastWheel = useRef(0);
  const skipGridClick = useRef(false);
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [hojeFlash, pingHoje] = useGlyphFlash();
  const [findFlash, pingFind] = useGlyphFlash();
  const [gearFlash, pingGear] = useGlyphFlash();
  const [endFlash, pingEnd] = useGlyphFlash();
  const [startFlash, pingStart] = useGlyphFlash();
  const [downHiding, setDownHiding] = useState(false);
  const [upHiding, setUpHiding] = useState(false);
  const hideDownTimer = useRef(0);
  const hideUpTimer = useRef(0);
  const firstLaunch = useRef(false);
  const pulledFor = useRef<string | null>(null);
  const lastPushPrint = useRef("");
  const [cloudStatus, setCloudStatus] = useState<string | null>(null);
  const { user } = useCalendaeSession();
  const userId = user?.id ?? null;

  useLayoutEffect(() => {
    firstLaunch.current = !readSettingsRaw();
    setSettings(
      firstLaunch.current ? { ...readSettings(), municipal: true } : readSettings(),
    );
    const day = todayIso();
    const loaded = readLocalEvents();
    const live: CalEvent[] = [];
    const archived: CalEvent[] = [];
    for (const raw of loaded) {
      const event =
        raw.source === "period" && raw.kind ? { ...raw, kind: undefined, everyDays: undefined } : raw;
      if (isDueForHistory(event, day)) archived.push(archiveEvent(event));
      else live.push(event);
    }
    setToday(day);
    setLocalEvents(live);
    setHistory(mergeEventsById(readHistory(), archived));
    const store = readHolidayStore();
    const y = fromIso(day).getFullYear();
    if (!store[String(y)]?.events?.length) {
      store[String(y)] = {
        events: fallbackHolidays(y),
        fetchedAt: 0,
        source: "fallback",
      };
    }
    setHolidayStore(store);
    const inss = readInssStore();
    applyInssStore(inss);
    setInssStore(inss);
    setHydrated(true);
    setReminderStatus(reminderStatusLabel());
  }, []);

  useEffect(() => {
    function down(event: globalThis.PointerEvent) {
      const el = (event.target as HTMLElement | null)?.closest(".cal-icon-tip") as HTMLElement | null;
      if (!el) return;
      const wait = window.setTimeout(() => {
        el.classList.add("is-tip");
        el.dataset.held = "1";
      }, 480);
      function up() {
        window.clearTimeout(wait);
        window.setTimeout(() => el.classList.remove("is-tip"), 800);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
      }
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    }
    function click(event: MouseEvent) {
      const el = (event.target as HTMLElement | null)?.closest(".cal-icon-tip") as HTMLElement | null;
      if (el?.dataset.held === "1") {
        event.preventDefault();
        event.stopPropagation();
        delete el.dataset.held;
      }
    }
    document.addEventListener("pointerdown", down);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("click", click, true);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(localEvents));
  }, [localEvents, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(HOLIDAYS_KEY, JSON.stringify(holidayStore));
  }, [holidayStore, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(INSS_KEY, JSON.stringify(inssStore));
  }, [inssStore, hydrated]);

  useEffect(() => {
    if (!userId) {
      pulledFor.current = null;
      lastPushPrint.current = "";
    }
  }, [userId]);

  useEffect(() => {
    if (!hydrated || !userId || pulledFor.current !== userId) return;
    const print = notebookPrint(settings, localEvents, history);
    if (print === lastPushPrint.current) return;
    const wait = window.setTimeout(() => {
      if (print === lastPushPrint.current) return;
      lastPushPrint.current = print;
      void pushCloud({
        data: packNotebook({ settings, events: localEvents, history }),
      }).catch(() => setCloudStatus("Nuvem falhou."));
    }, 1500);
    return () => window.clearTimeout(wait);
  }, [settings, localEvents, history, hydrated, userId]);

  useEffect(() => {
    const tick = () => {
      setToday(todayIso());
      setNowMs(Date.now());
    };
    const id = window.setInterval(tick, 15_000);
    let midnight = 0;
    const armMidnight = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      midnight = window.setTimeout(() => {
        tick();
        armMidnight();
      }, Math.max(0, next.getTime() - now.getTime()) + 30);
    };
    armMidnight();
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(midnight);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setLocalEvents((prev) => {
      const keep: CalEvent[] = [];
      const move: CalEvent[] = [];
      for (const event of prev) {
        if (isDueForHistory(event, today, new Date(nowMs))) move.push(event);
        else keep.push(event);
      }
      if (!move.length) return prev;
      setHistory((hist) => mergeEventsById(hist, move.map(archiveEvent)));
      return keep;
    });
    setGoogleEvents((prev) => {
      const keep: CalEvent[] = [];
      const move: CalEvent[] = [];
      for (const event of prev) {
        if (isDueForHistory(event, today, new Date(nowMs))) move.push(event);
        else keep.push(event);
      }
      if (!move.length) return prev;
      setHistory((hist) => mergeEventsById(hist, move.map(archiveEvent)));
      return keep;
    });
  }, [hydrated, today, nowMs]);

  const year = view.getFullYear();
  const todayYear = fromIso(today).getFullYear();

  const syncHolidays = useCallback(async (years: number[], force = false) => {
    const unique = [...new Set(years)];
    await Promise.all(
      unique.map(async (target) => {
        const cached = holidayStoreRef.current[String(target)];
        if (!force && cached?.source === "live" && cached.events.length) return;
        try {
          const { getHolidays } = await import("@/lib/calendar-server");
          const row = await getHolidays({ data: { year: target } });
          setHolidayStore((prev) => ({
            ...prev,
            [String(target)]: {
              events: row.events.length ? row.events : fallbackHolidays(target),
              fetchedAt: Date.now(),
              source: row.events.length ? "live" : "fallback",
            },
          }));
        } catch {
          setHolidayStore((prev) => {
            if (prev[String(target)]?.events?.length) return prev;
            return {
              ...prev,
              [String(target)]: {
                events: fallbackHolidays(target),
                fetchedAt: 0,
                source: "fallback",
              },
            };
          });
        }
      }),
    );
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void syncHolidays([year, todayYear]);
  }, [hydrated, year, todayYear, syncHolidays]);

  useEffect(() => {
    if (!hydrated) return;
    ensureAlmanac(year - 1);
    ensureAlmanac(year);
    ensureAlmanac(year + 1);
    ensureAlmanac(todayYear);
  }, [hydrated, year, todayYear]);

  useEffect(() => {
    if (!hydrated) return;
    if (!settings.elections || settings.electionSecondRound) return;
    if (year % 4 !== 2) return;
    if (settings.electionSecondTriedYear === year) return;
    if (showElectionSecond(year, false)) return;
    const first = firstRoundIso(year);
    if (today < dayAfter(first)) return;
    let cancelled = false;
    void import("@/lib/calendar-server").then(async ({ confirmElectionSecondRound }) => {
      try {
        const row = await confirmElectionSecondRound({ data: { year } });
        if (cancelled) return;
        if (row.confirmed) {
          stampSecondRound(year, secondRoundIso(year), row.source ?? "wiki");
        }
        setSettings((prev) => ({
          ...prev,
          electionSecondTriedYear: year,
          electionSecondRound: row.confirmed ? true : prev.electionSecondRound,
        }));
      } catch {
        if (cancelled) return;
        setSettings((prev) => ({ ...prev, electionSecondTriedYear: year }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, settings.elections, settings.electionSecondRound, settings.electionSecondTriedYear, year, today]);

  useEffect(() => {
    if (!hydrated) return;
    const row = ensureAlmanac(year).irpf;
    if (row?.confirmed && row.lots?.some((lot) => lot.confirmed)) return;
    let cancelled = false;
    void import("@/lib/calendar-server").then(async ({ confirmIrpfDeadline }) => {
      try {
        const hit = await confirmIrpfDeadline({ data: { year } });
        if (cancelled) return;
        if (hit.confirmed && hit.iso) {
          stampIrpf(year, hit.iso, hit.source ?? "receita", hit.lots);
          setIrpfRev((n) => n + 1);
        } else if (hit.lots?.some((lot) => lot.confirmed)) {
          stampIrpfLots(year, hit.lots);
          setIrpfRev((n) => n + 1);
        }
      } catch {
        /* keeps the May projection without (confirmado) */
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hydrated, year]);

  useEffect(() => {
    if (!hydrated) return;
    if (settings.laborTriedYear === todayYear) return;
    let cancelled = false;
    const stop = whenIdle(() => {
      void import("@/lib/calendar-server").then(async ({ confirmLaborYear }) => {
        try {
          const hit = await confirmLaborYear({ data: { year: todayYear } });
          if (cancelled) return;
          if (hit.pis) stampPis(todayYear, hit.pis.byMonth, hit.pis.source, hit.pis.confirmed);
          if (hit.fgts) stampFgts(todayYear, hit.fgts.byMonth, hit.fgts.source, hit.fgts.confirmed);
          if (hit.pis || hit.fgts) setLaborRev((n) => n + 1);
        } catch {
          /* keeps built-in / previsto */
        }
        if (!cancelled) {
          setSettings((prev) =>
            prev.laborTriedYear === todayYear ? prev : { ...prev, laborTriedYear: todayYear },
          );
        }
      });
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, [hydrated, settings.laborTriedYear, todayYear]);

  useEffect(() => {
    if (!hydrated) return;
    if (moonFestivalTriedYear() === todayYear) return;
    let cancelled = false;
    const stop = whenIdle(() => {
      void import("@/lib/calendar-server").then(async ({ confirmMoonFestival }) => {
        try {
          const hit = await confirmMoonFestival({ data: { year: todayYear } });
          if (cancelled) return;
          if (hit.iso) rememberMoonFestival(todayYear, hit.iso, todayYear);
          else markMoonFestivalTried(todayYear);
          setMoonRev((n) => n + 1);
        } catch {
          if (!cancelled) markMoonFestivalTried(todayYear);
        }
      });
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, [hydrated, todayYear]);

  useEffect(() => {
    if (!hydrated) return;
    const y = year;
    if (inssStore[String(y)]?.table) {
      rememberInssTable(y, inssStore[String(y)].table);
      return;
    }
    return whenIdle(() => {
      void import("@/lib/calendar-server").then(async ({ getInssCalendar }) => {
        try {
          const row = await getInssCalendar({ data: { year: y } });
          if (!row.table) return;
          rememberInssTable(y, row.table);
          setInssStore((prev) => ({
            ...prev,
            [String(y)]: { table: row.table!, fetchedAt: Date.now() },
          }));
        } catch {
          /* keep fallback */
        }
      });
    });
  }, [hydrated, year, inssStore]);

  const holidays = useMemo(() => {
    const list = holidaysForYears(holidayStore, [year, todayYear]);
    return list.filter((event) => {
      if (!settings.facultative && isFacultative(event)) return false;
      if (!settings.national && isNational(event)) return false;
      return true;
    });
  }, [holidayStore, year, todayYear, settings.facultative, settings.national]);
  const holidayPool = useMemo(
    () =>
      uniqueEvents([
        ...holidaysForYears(holidayStore, [year]),
        ...commemorativeDates(year),
        ...electionDates(year, true),
        ...municipalEvents,
      ]),
    [holidayStore, year, municipalEvents, moonRev],
  );
  const irpfEvent = useMemo(() => (settings.irpfOn ? irpfForYear(year) : null), [year, irpfRev, settings.irpfOn]);
  const irpfLots = useMemo(() => irpfLotsForYear(year), [year, irpfRev]);
  const laborMonth = settings.laborMonth;
  const pis = useMemo(() => {
    if (!laborMonth || !settings.pisOn) return null;
    const base = pisEvent(year, laborMonth);
    const stamp = ensureAlmanac(year).pis;
    const iso = stamp?.byMonth?.[laborMonth];
    if (!iso) return base;
    return { ...base, iso, confirmed: stamp.confirmed };
  }, [year, laborMonth, settings.pisOn, laborRev]);
  const fgts = useMemo(() => {
    if (!laborMonth || !settings.fgtsOn) return null;
    const base = fgtsEvent(year, laborMonth);
    const stamp = ensureAlmanac(year).fgts;
    const row = stamp?.byMonth?.[laborMonth];
    if (!row) return base;
    return { ...base, iso: row.iso, confirmed: stamp.confirmed };
  }, [year, laborMonth, settings.fgtsOn, laborRev]);
  const fgtsUntil = useMemo(() => {
    if (!laborMonth || !settings.fgtsOn) return null;
    const stamp = ensureAlmanac(year).fgts?.byMonth?.[laborMonth];
    if (stamp?.until) return stamp.until;
    return fgtsWindow(year, laborMonth).until;
  }, [year, laborMonth, settings.fgtsOn, laborRev]);
  const bolsaDigit = nisDigit(settings.bolsaNis);
  const bolsa = useMemo(
    () =>
      bolsaDigit !== null && settings.bolsaOn
        ? bolsaEvent(year, view.getMonth(), bolsaDigit, settings.bolsaNis)
        : null,
    [year, view, bolsaDigit, settings.bolsaNis, settings.bolsaOn],
  );
  const gas = useMemo(
    () =>
      bolsaDigit !== null && settings.gasOn ? gasEvent(year, view.getMonth(), settings.bolsaNis) : null,
    [year, view, bolsaDigit, settings.bolsaNis, settings.gasOn],
  );
  const ipvaUf = settings.ipvaUf || settings.cityUf;
  const ipva = useMemo(
    () =>
      settings.ipvaOn && settings.ipvaDigit !== null ? ipvaEvent(year, ipvaUf, settings.ipvaDigit) : null,
    [year, ipvaUf, settings.ipvaDigit, settings.ipvaOn],
  );
  const ipvaLots = useMemo(
    () =>
      settings.ipvaOn && settings.ipvaDigit !== null
        ? ipvaParcels(year, ipvaUf, settings.ipvaDigit) ?? []
        : [],
    [year, ipvaUf, settings.ipvaDigit, settings.ipvaOn],
  );
  const ipvaGrid = useMemo(
    () =>
      settings.ipvaOn && settings.ipvaDigit !== null ? ipvaMarks(year, ipvaUf, settings.ipvaDigit) : [],
    [year, ipvaUf, settings.ipvaDigit, settings.ipvaOn],
  );
  const licenca = useMemo(
    () =>
      settings.licencaOn && settings.ipvaDigit !== null
        ? licencaEvent(year, ipvaUf, settings.ipvaDigit)
        : null,
    [year, ipvaUf, settings.ipvaDigit, settings.licencaOn],
  );
  const extraHolidays = useMemo(() => {
    const list: CalEvent[] = [];
    if (settings.commemorative) list.push(...commemorativeDates(year));
    if (settings.municipal) list.push(...municipalEvents);
    return list;
  }, [settings.commemorative, settings.municipal, municipalEvents, year, moonRev]);
  const highlights = useMemo(() => {
    const list: CalEvent[] = [];
    if (settings.elections) list.push(...electionDates(year, showElectionSecond(year, settings.electionSecondRound)));
    if (settings.enem) list.push(...enemDates(year));
    if (settings.seasons) list.push(...seasonDates(year));
    if (settings.lunar) list.push(...lunarDates(year));
    return list;
  }, [settings.elections, settings.electionSecondRound, settings.enem, settings.seasons, settings.lunar, year]);
  const searchItems = useMemo(() => {
    if (!searchOpen) return [] as SearchItem[];
    const items: SearchItem[] = [];
    const pushEvent = (event: CalEvent, iso = event.iso, kind?: string) => {
      if (!event.title || !iso) return;
      items.push({
        id: event.id,
        title: event.title,
        text: [event.title, event.place, event.contact, event.note].filter(Boolean).join(" "),
        iso,
        kind: kind ?? searchKind(event),
        slot: searchSlot(event, kind),
      });
    };
    for (const event of localEvents) {
      const iso = event.source === "birthday" ? upcomingBirthday(event.iso, today) : event.iso;
      pushEvent(event, iso);
    }
    for (const event of googleEvents) pushEvent(event);
    for (const event of history) pushEvent(event, event.iso, "Histórico");
    const years: number[] = [];
    for (let next = todayYear - 1; next <= todayYear + 15; next += 1) years.push(next);
    for (const event of holidaysForYears(holidayStore, years)) pushEvent(event);
    for (const event of extraHolidays) pushEvent(event);
    for (const target of years) {
      if (settings.elections) {
        for (const event of electionDates(target, showElectionSecond(target, settings.electionSecondRound))) pushEvent(event);
      }
      if (settings.enem) for (const event of enemDates(target)) pushEvent(event);
      if (settings.seasons) for (const event of seasonDates(target)) pushEvent(event);
      if (settings.lunar) for (const event of lunarDates(target)) pushEvent(event);
    }
    for (const event of [irpfEvent, pis, fgts, bolsa, gas, licenca, ipva]) {
      if (event) pushEvent(event);
    }
    return items;
  }, [
    searchOpen,
    localEvents,
    googleEvents,
    history,
    today,
    todayYear,
    holidayStore,
    extraHolidays,
    settings.elections,
    settings.electionSecondRound,
    settings.enem,
    settings.seasons,
    settings.lunar,
    irpfEvent,
    pis,
    fgts,
    bolsa,
    gas,
    licenca,
    ipva,
  ]);
  const benefitEvents = useMemo(() => {
    const month = view.getMonth();
    return localEvents.flatMap((event) => {
      if (event.source !== "benefit") return [];
      const parsed = parseNb(event.nb ?? "");
      if (!parsed) return [];
      const iso = inssPayIso(year, month, parsed.digit, event.bracket ?? "minimo");
      return iso ? [{ ...event, iso, kind: "mensal" as const }] : [];
    });
  }, [localEvents, year, view]);
  const allEvents = useMemo(
    () =>
      uniqueEvents([
        ...localEvents.filter((event) => event.source !== "benefit" && event.source !== "period"),
        ...benefitEvents,
        ...holidays,
        ...extraHolidays,
        ...highlights,
        ...(irpfEvent ? [irpfEvent] : []),
        ...(pis ? [pis] : []),
        ...(fgts ? [fgts] : []),
        ...(bolsa ? [bolsa] : []),
        ...(gas ? [gas] : []),
        ...(licenca ? [licenca] : []),
        ...ipvaGrid,
        ...googleEvents.filter((event) => !isDueForHistory(event, today)),
      ]).filter((event) => tabAllowsEvent(settings.tabs, event)),
    [localEvents, benefitEvents, holidays, extraHolidays, highlights, irpfEvent, pis, fgts, bolsa, gas, licenca, ipvaGrid, googleEvents, today, settings.tabs],
  );
  const blockedHolidays = useMemo(() => {
    const set = new Set<string>();
    for (const event of [...holidays, ...extraHolidays]) {
      if (event.holidayKind === "election" || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar") continue;
      set.add(event.iso);
    }
    return set;
  }, [holidays, extraHolidays]);
  const gridEvents = useMemo(() => {
    const month = view.getMonth();
    const start = toIso(civilDate(year, month, 1));
    const end = toIso(civilDate(year, month + 1, 0));
    const horizon = toIso(civilDate(year, month + 1, 21));
    return allEvents.flatMap((event) => {
      if (!event.kind || !event.intervalRule || event.intervalRule === "ignorar") return [event];
      return resolvedMarks(event, blockedHolidays, horizon)
        .filter((iso) => iso >= start && iso <= end)
        .map((iso) => ({ ...event, iso, kind: undefined, everyDays: undefined, monthSide: undefined }));
    });
  }, [allEvents, blockedHolidays, view, year]);
  const cells = useMemo(
    () => buildMonthCells(view, today, gridEvents, settings.weekStart),
    [view, today, gridEvents, settings.weekStart],
  );
  cellsRef.current = cells;
  const periodIsos = useMemo(() => {
    const set = new Set<string>();
    for (const event of localEvents) {
      if (event.source !== "period" || isDueForHistory(event, today, new Date(nowMs))) continue;
      for (const iso of eventSpanIsos(event)) set.add(iso);
    }
    return set;
  }, [localEvents, today, nowMs]);
  const monthEvents = useMemo(() => {
    const month = view.getMonth();
    return allEvents
      .flatMap((event) => {
        if (event.source === "holiday" || event.source === "birthday" || event.source === "benefit" || event.source === "bill" || event.source === "boleto" || event.source === "irpf" || event.source === "pis" || event.source === "ipva" || event.source === "fgts" || event.source === "bolsa" || event.source === "gas" || event.source === "licenca" || event.source === "period" || isPeriodEvent(event))
          return [];
        if (event.kind && event.intervalRule && event.intervalRule !== "ignorar") {
          const start = toIso(civilDate(year, month, 1));
          const end = toIso(civilDate(year, month + 1, 0));
          const horizon = toIso(civilDate(year, month + 1, 21));
          const marks = resolvedMarks(event, blockedHolidays, horizon).filter((iso) => iso >= start && iso <= end);
          return marks[0] ? [{ event, iso: marks[0] }] : [];
        }
        if (
          event.kind === "semanal" ||
          event.kind === "mensal" ||
          event.kind === "semestral" ||
          event.kind === "anual" ||
          event.kind === "posicao"
        ) {
          const iso = occurrenceInMonth(event, year, month);
          return iso ? [{ event, iso }] : [];
        }
        if (event.kind === "personalizado") {
          const last = civilDate(year, month + 1, 0).getDate();
          const rows: { event: CalEvent; iso: string }[] = [];
          for (let day = 1; day <= last; day += 1) {
            const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            if (eventMatchesIso(event, iso)) rows.push({ event, iso });
          }
          return rows;
        }
        if (isDueForHistory(event, today, new Date(nowMs))) return [];
        const last = lastVisibleIso(event);
        const monthStart = toIso(civilDate(year, month, 1));
        const monthEnd = toIso(civilDate(year, month + 1, 0));
        if (last < monthStart || event.iso > monthEnd) return [];
        return [{ event, iso: event.iso }];
      })
      .sort(
        (a, b) =>
          a.iso.localeCompare(b.iso) || (a.event.time ?? "").localeCompare(b.event.time ?? ""),
      );
  }, [allEvents, blockedHolidays, view, year, today, nowMs]);
  const monthPeriods = useMemo(
    () =>
      localEvents
        .filter(
          (event) =>
            event.source === "period" &&
            eventOverlapsMonth(event, year, view.getMonth()) &&
            !isDueForHistory(event, today, new Date(nowMs)),
        )
        .sort((a, b) => a.iso.localeCompare(b.iso) || a.title.localeCompare(b.title)),
    [localEvents, year, view, today, nowMs],
  );
  const birthdays = useMemo(
    () =>
      localEvents
        .filter((event) => event.source === "birthday")
        .map((event) => ({ ...event, kind: "anual" as const })),
    [localEvents],
  );
  const benefits = useMemo(
    () => localEvents.filter((event) => event.source === "benefit"),
    [localEvents],
  );
  const bills = useMemo(
    () => localEvents.filter((event) => event.source === "bill"),
    [localEvents],
  );
  const boletos = useMemo(
    () => localEvents.filter((event) => event.source === "boleto"),
    [localEvents],
  );

  useEffect(() => {
    if (!settings.cityIbge) {
      setMunicipalEvents([]);
      return;
    }
    if (!settings.municipal) return;
    const ibge = settings.cityIbge;
    const city = settings.cityName;
    const uf = settings.cityUf;
    let cancelled = false;
    void import("@/lib/calendar-server").then(async ({ getMunicipalHolidays }) => {
      try {
        const events = await getMunicipalHolidays({
          data: { year, ibge, city: city || "Cidade", uf: uf || undefined },
        });
        if (cancelled) return;
        setMunicipalEvents(events);
      } catch {
        if (cancelled) return;
        setMunicipalEvents([]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [settings.municipal, settings.cityIbge, settings.cityName, settings.cityUf, year]);

  const syncGoogle = useCallback(async ({ login = false }: { login?: boolean } = {}) => {
    setGooglePending(true);
    try {
      const start = civilDate(viewRef.current.getFullYear(), viewRef.current.getMonth(), 1);
      const end = civilDate(viewRef.current.getFullYear(), viewRef.current.getMonth() + 1, 1);
      const { getGoogleMonth } = await import("@/lib/calendar-server");
      const row = await getGoogleMonth({
        data: { timeMin: start.toISOString(), timeMax: end.toISOString() },
      });
      if (row.loginRequired) {
        if (login) {
          redirectToLoginIfRequired({
            ok: false,
            data: null,
            loginRequired: true,
            loginUrl: row.loginUrl,
          });
        }
        setGoogleStatus("Conecte o Google Agenda no Grok para puxar seus eventos.");
        setGoogleEvents([]);
        return;
      }
      if (!row.ok) {
        setGoogleStatus(row.errorMessage || "Não deu para puxar a agenda.");
        return;
      }
      setGoogleEvents(row.events.filter((event) => !isDueForHistory(event, todayIso())));
      const archived = row.events.filter((event) => isDueForHistory(event, todayIso()));
      if (archived.length) setHistory((hist) => mergeEventsById(hist, archived.map(archiveEvent)));
      setGoogleStatus(
        row.events.length
          ? `Agenda conectada. ${row.events.length} compromisso(s).`
          : "Agenda conectada. Nenhum compromisso no período.",
      );
    } catch {
      setGoogleStatus("Não deu para puxar a agenda.");
    } finally {
      setGooglePending(false);
    }
  }, []);

  async function locateCity() {
    try {
      const { locateMunicipio } = await import("@/lib/calendar-server");
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 });
      });
      const city = await locateMunicipio({
        data: { lat: pos.coords.latitude, lon: pos.coords.longitude },
      });
      return city;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (!hydrated) return;
    startReminders(
      [...localEvents, ...googleEvents].filter((event) => tabAllowsEvent(settings.tabs, event)),
      settings.hourCycle,
    );
  }, [hydrated, localEvents, googleEvents, settings.tabs, settings.hourCycle]);

  const monthOptions = MONTHS.map((label, value) => ({ value, label }));

  function motionMs(motion: MonthMotion, rush: boolean) {
    if (rush) return motion === "lamina" || motion === "lamina-left" ? 280 : 340;
    if (motion === "lamina" || motion === "lamina-left") return 550;
    if (motion === "lupa") return 800;
    if (motion === "sopro") return 850;
    if (motion === "onda" || motion === "fileiras") return 900;
    return 700;
  }

  function cellsForMonth(date: Date) {
    const month = date.getMonth();
    const y = date.getFullYear();
    const anchor = civilDate(y, month, 1);
    const start = toIso(anchor);
    const end = toIso(civilDate(y, month + 1, 0));
    const horizon = toIso(civilDate(y, month + 1, 21));
    const events = allEvents.flatMap((event) => {
      if (!event.kind || !event.intervalRule || event.intervalRule === "ignorar") return [event];
      return resolvedMarks(event, blockedHolidays, horizon)
        .filter((iso) => iso >= start && iso <= end)
        .map((iso) => ({ ...event, iso, kind: undefined, everyDays: undefined, monthSide: undefined }));
    });
    return buildMonthCells(anchor, today, events, settings.weekStart);
  }

  function applyStep(step: MonthStep) {
    playingRef.current = true;
    setLeave({ id: step.id, cells: step.cells, motion: step.motion, rush: step.rush });
    setArrive(false);
    setView(step.next);
    if (step.selectIso) {
      setSelected(step.selectIso);
      return;
    }
    const day = fromIso(selectedRef.current).getDate();
    const last = civilDate(step.next.getFullYear(), step.next.getMonth() + 1, 0).getDate();
    const iso = `${step.next.getFullYear()}-${String(step.next.getMonth() + 1).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
    setSelected(iso);
  }

  function jumpTo(next: Date, selectIso?: string, motion?: MonthMotion) {
    const y = next.getFullYear();
    if (y < YEAR_MIN) next = civilDate(YEAR_MIN, next.getMonth(), 1);
    if (y > YEAR_MAX) next = civilDate(YEAR_MAX, next.getMonth(), 1);
    const prev = viewRef.current;
    const changed = prev.getFullYear() !== next.getFullYear() || prev.getMonth() !== next.getMonth();
    if (motion && changed) {
      leaveSeq.current += 1;
      const step: MonthStep = {
        id: leaveSeq.current,
        cells: cellsForMonth(prev),
        motion,
        next,
        selectIso,
        rush: playingRef.current,
      };
      viewRef.current = next;
      setOpenMenu(null);
      if (playingRef.current) queueRef.current.push(step);
      else applyStep(step);
      return;
    }
    queueRef.current = [];
    playingRef.current = false;
    setLeave(null);
    viewRef.current = next;
    setView(next);
    if (selectIso) {
      setSelected(selectIso);
    } else {
      const day = fromIso(selectedRef.current).getDate();
      const last = civilDate(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      const iso = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
      setSelected(iso);
    }
    setOpenMenu(null);
  }

  function focusMonth(iso: string) {
    const date = fromIso(iso);
    const next = civilDate(date.getFullYear(), date.getMonth(), 1);
    const prev = viewRef.current;
    const nextAbs = next.getFullYear() * 12 + next.getMonth();
    const prevAbs = prev.getFullYear() * 12 + prev.getMonth();
    jumpTo(next, iso, nextAbs === prevAbs ? undefined : nextAbs > prevAbs ? "queda-up" : "queda");
  }

  const watchedMonth = useRef<number | null>(null);
  useEffect(() => {
    const date = fromIso(today);
    const abs = date.getFullYear() * 12 + date.getMonth();
    const prevAbs = watchedMonth.current;
    watchedMonth.current = abs;
    if (prevAbs == null || prevAbs === abs) return;
    const viewNow = viewRef.current;
    const viewAbs = viewNow.getFullYear() * 12 + viewNow.getMonth();
    if (viewAbs !== prevAbs) return;
    jumpTo(civilDate(date.getFullYear(), date.getMonth(), 1), today, abs > prevAbs ? "queda-up" : "queda");
  }, [today]);

  function openFound(item: SearchItem) {
    setSearchOpen(false);
    const date = fromIso(item.iso);
    const next = civilDate(date.getFullYear(), date.getMonth(), 1);
    const prev = viewRef.current;
    const changed = prev.getFullYear() !== next.getFullYear() || prev.getMonth() !== next.getMonth();
    jumpTo(next, item.iso, changed ? "lupa" : undefined);
    setOpenEventId(item.slot === "event" ? item.id : null);
    setOpenHolidayIso(item.slot === "holiday" ? item.id : null);
    setOpenHighlightId(item.slot === "highlight" ? item.id : null);
    setOpenBirthdayId(item.slot === "birthday" ? item.id : null);
    setOpenBenefitId(item.slot === "benefit" ? item.id : null);
    setOpenBillId(item.slot === "bill" ? item.id : null);
    setOpenHistoryId(item.slot === "history" ? item.id : null);
    setOpenIrpfId(item.slot === "irpf" ? item.id : null);
    setOpenPisId(item.slot === "pis" ? item.id : null);
    setOpenIpvaId(item.slot === "ipva" ? item.id : null);
    setOpenFgtsId(item.slot === "fgts" ? item.id : null);
    setOpenBolsaId(item.slot === "bolsa" ? item.id : null);
    setOpenGasId(item.slot === "gas" ? item.id : null);
    setOpenLicencaId(item.slot === "licenca" ? item.id : null);
    setOpenPeriodId(item.slot === "period" ? item.id : null);
    const tab =
      item.slot === "holiday"
        ? "holidays"
        : item.slot === "highlight"
          ? "destaques"
          : item.slot === "birthday"
            ? "birthdays"
            : item.slot === "history"
              ? "history"
              : item.slot === "event" || item.slot === "period"
                ? "agenda"
                : "finance";
    window.setTimeout(() => {
      const page = pageRef.current;
      const node = page?.querySelector(`[data-cal-tab="${tab}"]`);
      if (!page || !(node instanceof HTMLElement)) return;
      const top = node.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 8;
      page.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }, 80);
  }

  function selectFromGrid(iso: string) {
    if (skipGridClick.current) {
      skipGridClick.current = false;
      return;
    }
    const date = fromIso(iso);
    if (date.getMonth() !== view.getMonth() || date.getFullYear() !== year) {
      const clicked = date.getFullYear() * 12 + date.getMonth();
      const current = year * 12 + view.getMonth();
      jumpTo(
        civilDate(date.getFullYear(), date.getMonth(), 1),
        iso,
        clicked === current ? undefined : clicked > current ? "queda-up" : "queda",
      );
    } else {
      setSelected(iso);
    }
    setDraftDate(iso);
    setOpenEventId(null);
    setOpenHolidayIso(null);
    setOpenHighlightId(null);

    setOpenBirthdayId(null);
    setOpenBenefitId(null);
    setOpenHistoryId(null);
    setOpenBillId(null);
    setOpenIrpfId(null);
    setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
  }

  function scrollToTab(tab: string) {
    window.setTimeout(() => {
      const page = pageRef.current;
      const node = page?.querySelector(`[data-cal-tab="${tab}"]`);
      if (!page || !(node instanceof HTMLElement)) return;
      const top = node.getBoundingClientRect().top - page.getBoundingClientRect().top + page.scrollTop - 8;
      page.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      page.querySelectorAll(".cal-tab.is-held").forEach((item) => item.classList.remove("is-held"));
      window.clearTimeout(tabFlash.current);
      void node.offsetWidth;
      node.classList.add("is-held");
      tabFlash.current = window.setTimeout(() => node.classList.remove("is-held"), 280);
    }, 80);
  }

  function showOnly(next: {
    event?: string;
    holiday?: string;
    highlight?: string;
    birthday?: string;
    benefit?: string;
    bill?: string;
    irpf?: string;
    pis?: string;
    ipva?: string;
    fgts?: string;
    bolsa?: string;
    gas?: string;
    licenca?: string;
  }) {
    setOpenEventId(next.event ?? null);
    setOpenHolidayIso(next.holiday ?? null);
    setOpenHighlightId(next.highlight ?? null);
    setOpenBirthdayId(next.birthday ?? null);
    setOpenBenefitId(next.benefit ?? null);
    setOpenHistoryId(null);
    setOpenBillId(next.bill ?? null);
    setOpenIrpfId(next.irpf ?? null);
    setOpenPisId(next.pis ?? null);
    setOpenIpvaId(next.ipva ?? null);
    setOpenFgtsId(next.fgts ?? null);
    setOpenBolsaId(next.bolsa ?? null);
    setOpenGasId(next.gas ?? null);
    setOpenLicencaId(next.licenca ?? null);
    setOpenPeriodId(null);
  }

  function startAgenda(iso: string) {
    agendaDraftId.current = null;
    setDraftTitle("");
    setDraftPlace("");
    setDraftContact("");
    setDraftTime("09:00");
    setDraftKind(null);
    setDraftEveryDays("");
    setDraftMonthSide("");
    setDraftMonthNth("");
    setDraftMonthUtil(false);
    setDraftIntervalRule("ignorar");
    setDraftNotify(false);
    setDraftDurTime("");
    setDraftDurDays("");
    setDraftDate(iso);
    setKindMenu(false);
    setSideMenu(false);
    setRuleMenu(false);
    setEditingEventId(null);
    setAdding(true);
    showOnly({});
    scrollToTab("agenda");
  }

  function revealHeld(event: CalEvent) {
    setAdding(false);
    setEditingEventId(null);
    const id = event.id;
    const tab = eventTab(event) ?? "agenda";
    if (event.source === "holiday") {
      const destaque =
        event.holidayKind === "election" || event.holidayKind === "enem" || event.holidayKind === "season" || event.holidayKind === "lunar";
      showOnly(destaque ? { highlight: id } : { holiday: id });
    } else if (event.source === "birthday") showOnly({ birthday: id });
    else if (event.source === "benefit") showOnly({ benefit: id });
    else if (event.source === "bill" || event.source === "boleto") showOnly({ bill: id });
    else if (event.source === "irpf") showOnly({ irpf: id });
    else if (event.source === "pis") showOnly({ pis: id });
    else if (event.source === "ipva") showOnly({ ipva: id });
    else if (event.source === "fgts") showOnly({ fgts: id });
    else if (event.source === "bolsa") showOnly({ bolsa: id });
    else if (event.source === "gas") showOnly({ gas: id });
    else if (event.source === "licenca") showOnly({ licenca: id });
    else if (event.source === "period") {
      showOnly({});
      setOpenPeriodId(id);
    } else showOnly({ event: id });
    scrollToTab(tab);
  }

  function holdFromGrid(iso: string) {
    const date = fromIso(iso);
    if (date.getMonth() !== view.getMonth() || date.getFullYear() !== year) {
      focusMonth(iso);
    } else {
      setSelected(iso);
    }
    setDraftDate(iso);
    const marked = [
      ...gridEvents.filter((event) => eventMatchesIso(event, iso) && tabAllowsEvent(settings.tabs, event)),
      ...localEvents.filter(
        (event) => event.source === "period" && eventSpanIsos(event).includes(iso),
      ),
    ];
    const chosen = marked[0];
    if (!chosen) {
      if (settings.tabs.agenda !== false) startAgenda(iso);
      return;
    }
    revealHeld(chosen);
  }

  function pickCity(city: { ibge: number; name: string; uf: string }) {
    setSettings((prev) => ({
      ...prev,
      municipal: true,
      cityName: city.name,
      cityIbge: city.ibge,
      cityUf: city.uf,
    }));
  }

  function kindPatch(): {
    kind?: EventKind;
    everyDays?: number;
    monthSide?: MonthSide;
    monthNth?: number;
    monthUtil?: boolean;
    intervalRule?: IntervalRule;
  } {
    const rule = draftKind ? { intervalRule: draftIntervalRule } : { intervalRule: undefined };
    const ordinalKinds: EventKind[] = ["semanal", "mensal", "semestral", "anual"];
    if (draftKind && ordinalKinds.includes(draftKind)) {
      const n = Number(draftMonthNth);
      const hasNth = Number.isFinite(n) && n > 0;
      if (draftMonthSide === "primeiros" || draftMonthSide === "ultimos") {
        return {
          kind: draftKind,
          everyDays: undefined,
          monthSide: draftMonthSide,
          monthNth: hasNth ? n : 1,
          monthUtil: draftMonthUtil,
          ...rule,
        };
      }
      return {
        kind: draftKind,
        everyDays: undefined,
        monthSide: undefined,
        monthNth: undefined,
        monthUtil: undefined,
        ...rule,
      };
    }
    if (draftKind !== "personalizado") {
      return { kind: draftKind ?? undefined, everyDays: undefined, monthSide: undefined, monthNth: undefined, monthUtil: undefined, ...rule };
    }
    const step = Number(draftEveryDays);
    if (!Number.isFinite(step) || step < 1) {
      return { kind: undefined, everyDays: undefined, monthSide: undefined, monthNth: undefined, monthUtil: undefined, ...rule };
    }
    return { kind: "personalizado", everyDays: step, monthSide: undefined, monthNth: undefined, monthUtil: undefined, ...rule };
  }

  function durationPatch(): { durationDays?: number; durationMinutes?: number } {
    const days = Number(draftDurDays);
    const mins = timeToMinutes(draftDurTime);
    return {
      durationDays: Number.isFinite(days) && days > 0 ? days : undefined,
      durationMinutes: mins > 0 ? mins : undefined,
    };
  }

  function recallDraft() {
    const found = recallFromArchive(
      draftTitle,
      [...localEvents, ...googleEvents],
      history,
      editingEventId,
    );
    if (!found) return;
    setDraftTitle(found.title.slice(0, 45));
    if (found.place) setDraftPlace(found.place.slice(0, 45));
    if (found.contact) setDraftContact(found.contact);
  }

  function addEvent() {
    const title = draftTitle.trim();
    if (!title) return;
    const event: CalEvent = {
      id: newEventId(),
      iso: draftDate || selected,
      title: title.slice(0, 45),
      time: draftTime,
      place: draftPlace.trim().slice(0, 45) || undefined,
      contact: draftContact.trim() ? fitContact(draftContact) : undefined,
      ...kindPatch(),
      ...durationPatch(),
      source: "local",
      notify: draftNotify,
    };
    if (isDueForHistory(event, today, new Date(nowMs))) {
      setHistory((prev) => mergeEventsById(prev, [archiveEvent(event)]));
    } else {
      setLocalEvents((prev) => [...prev, event]);
    }
    setDraftTitle("");
    setDraftPlace("");
    setDraftContact("");
    setDraftKind(null);
    setDraftEveryDays("");
    setDraftMonthSide("");
    setDraftMonthNth("");
    setDraftMonthUtil(false);
    setDraftDurTime("");
    setDraftDurDays("");
    setDraftNotify(false);
    setAdding(false);
  }

  function updateEvent(id: string, patch: Partial<CalEvent>) {
    setLocalEvents((prev) => prev.map((event) => (event.id === id ? { ...event, ...patch } : event)));
  }

  function removeEvent(id: string) {
    setLocalEvents((prev) => prev.filter((event) => event.id !== id));
  }

  function postponeEvent(event: CalEvent, iso: string) {
    if (event.source !== "local" && event.source !== "period") return;
    const nextIso = postponeIso(event, iso);
    updateEvent(event.id, { iso: nextIso });
    focusMonth(nextIso);
  }

  function markDone(event: CalEvent, iso: string) {
    if (event.source !== "local" && event.source !== "period") return;
    const snapshot = archiveEvent({
      ...event,
      id: event.kind ? newEventId() : event.id,
      iso,
      kind: undefined,
      everyDays: undefined,
      monthSide: undefined,
      monthNth: undefined,
      monthUtil: undefined,
      durationDays: undefined,
      durationMinutes: undefined,
    });
    setHistory((prev) => mergeEventsById(prev, [snapshot]));
    if (event.kind) {
      const nextIso = postponeIso(event, iso);
      updateEvent(event.id, { iso: nextIso });
    } else {
      removeEvent(event.id);
    }
    setOpenEventId(null);
    setEditingEventId(null);
  }

  function openAgendaItem(event: CalEvent, iso = event.iso) {
    pingGlyph();
    setSelected(iso);
    setOpenEventId((cur) => (cur === event.id ? null : event.id));
    setEditingEventId(null);
    setOpenHolidayIso(null);
    setOpenHighlightId(null);

    setOpenBirthdayId(null);
    setOpenBenefitId(null);
    setOpenHistoryId(null);
    setOpenBillId(null);
    setOpenIrpfId(null);
    setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
  }

  function saveEditEvent() {
    if (!editingEventId) return;
    const title = draftTitle.trim();
    if (!title) return;
    const current = localEvents.find((event) => event.id === editingEventId);
    const next: CalEvent = {
      ...(current ?? {
        id: editingEventId,
        source: "local" as const,
      }),
      title: title.slice(0, 45),
      iso: draftDate,
      time: draftTime,
      place: draftPlace.trim().slice(0, 45) || undefined,
      contact: draftContact.trim() ? fitContact(draftContact) : undefined,
      ...kindPatch(),
      ...durationPatch(),
      source:
        current?.source === "birthday" || current?.source === "google" ? current.source : "local",
      notify: draftNotify,
    };
    if (isDueForHistory(next, today, new Date(nowMs))) {
      setLocalEvents((prev) => prev.filter((event) => event.id !== editingEventId));
      setHistory((prev) => mergeEventsById(prev, [archiveEvent(next)]));
    } else {
      updateEvent(editingEventId, {
        title: title.slice(0, 45),
        iso: draftDate,
        time: draftTime,
        place: draftPlace.trim().slice(0, 45) || undefined,
        contact: draftContact.trim() ? fitContact(draftContact) : undefined,
        ...kindPatch(),
        ...durationPatch(),
        source: next.source,
        notify: draftNotify,
      });
    }
    setSelected(draftDate);
    setEditingEventId(null);
  }

  useEffect(() => {
    if (!adding) return;
    const title = draftTitle.trim();
    if (!title) {
      if (agendaDraftId.current) {
        const id = agendaDraftId.current;
        agendaDraftId.current = null;
        setLocalEvents((prev) => prev.filter((event) => event.id !== id));
      }
      return;
    }
    if (!agendaDraftId.current) agendaDraftId.current = newEventId();
    const id = agendaDraftId.current;
    const next: CalEvent = {
      id,
      iso: draftDate || selected,
      title: title.slice(0, 45),
      time: draftTime,
      place: draftPlace.trim().slice(0, 45) || undefined,
      contact: draftContact.trim() ? fitContact(draftContact) : undefined,
      ...kindPatch(),
      ...durationPatch(),
      source: "local",
      notify: draftNotify,
    };
    setLocalEvents((prev) => {
      const index = prev.findIndex((event) => event.id === id);
      if (index < 0) return [...prev, next];
      const copy = [...prev];
      copy[index] = { ...copy[index], ...next };
      return copy;
    });
  }, [
    adding,
    draftTitle,
    draftPlace,
    draftContact,
    draftTime,
    draftDate,
    draftKind,
    draftEveryDays,
    draftMonthSide,
    draftMonthNth,
    draftMonthUtil,
    draftIntervalRule,
    draftNotify,
    draftDurTime,
    draftDurDays,
    selected,
  ]);

  useEffect(() => {
    if (!periodOpen) return;
    const days = Math.max(1, Math.min(366, Math.floor(Number(periodDays)) || 1));
    const note = periodNote.trim().slice(0, 45) || undefined;
    if (periodEditingId) {
      setLocalEvents((prev) =>
        prev.map((event) =>
          event.id === periodEditingId
            ? { ...event, title: periodTitle, iso: periodDate, durationDays: days, note, source: "period", kind: undefined, everyDays: undefined }
            : event,
        ),
      );
      return;
    }
    if (!periodDirty) return;
    if (!periodDraftId.current) periodDraftId.current = newEventId();
    const id = periodDraftId.current;
    const next: CalEvent = {
      id,
      title: periodTitle,
      iso: periodDate,
      durationDays: days,
      note,
      source: "period",
    };
    setLocalEvents((prev) => {
      const index = prev.findIndex((event) => event.id === id);
      if (index < 0) return [...prev, next];
      const copy = [...prev];
      copy[index] = { ...copy[index], ...next };
      return copy;
    });
  }, [periodOpen, periodDirty, periodEditingId, periodTitle, periodNote, periodDate, periodDays]);

  useEffect(() => {
    if (!editingEventId) return;
    const title = draftTitle.trim();
    if (!title) return;
    const current = localEvents.find((event) => event.id === editingEventId);
    const source =
      current?.source === "birthday" || current?.source === "google" ? current.source : "local";
    updateEvent(editingEventId, {
      title: title.slice(0, 45),
      iso: draftDate,
      time: draftTime,
      place: draftPlace.trim().slice(0, 45) || undefined,
      contact: draftContact.trim() ? fitContact(draftContact) : undefined,
      ...kindPatch(),
      ...durationPatch(),
      source,
      notify: draftNotify,
    });
  }, [
    editingEventId,
    draftTitle,
    draftPlace,
    draftContact,
    draftTime,
    draftDate,
    draftKind,
    draftEveryDays,
    draftMonthSide,
    draftMonthNth,
    draftMonthUtil,
    draftIntervalRule,
    draftNotify,
    draftDurTime,
    draftDurDays,
  ]);

  async function armNotify(next: boolean) {
    setDraftNotify(next);
    if (!next) return;
    setRemindersBusy(true);
    const message = await enableReminders();
    setReminderStatus(message);
    setRemindersBusy(false);
  }

  async function toggleEventNotify(event: CalEvent) {
    const next = !event.notify;
    updateEvent(event.id, { notify: next });
    if (!next) return;
    setRemindersBusy(true);
    const message = await enableReminders();
    setReminderStatus(message);
    setRemindersBusy(false);
  }

  const goMonth = useRef<(step: number, axis: "x" | "y") => void>(() => {});
  goMonth.current = (step, axis) => {
    let motion: MonthMotion | undefined;
    if (axis === "x") motion = step > 0 ? "lamina-left" : "lamina";
    if (axis === "y") motion = step > 0 ? "queda-up" : "queda";
    jumpTo(shiftMonth(viewRef.current, step), undefined, motion);
  };

  useEffect(() => {
    const id = window.setTimeout(() => setArrive(false), 1100);
    return () => window.clearTimeout(id);
  }, []);

  const advanceRef = useRef<() => void>(() => {});
  advanceRef.current = () => {
    const nextStep = queueRef.current.shift();
    if (!nextStep) {
      playingRef.current = false;
      setLeave(null);
      return;
    }
    nextStep.rush = queueRef.current.length > 0;
    applyStep(nextStep);
  };

  useEffect(() => {
    if (!leave) return;
    const id = window.setTimeout(() => advanceRef.current(), motionMs(leave.motion, Boolean(leave.rush)) + 30);
    return () => window.clearTimeout(id);
  }, [leave]);

  useEffect(() => {
    const node = swipeRef.current;
    if (!node) return;
    function onPointerDown(event: globalThis.PointerEvent) {
      pointerStart.current = { x: event.clientX, y: event.clientY };
    }
    function onPointerUp(event: globalThis.PointerEvent) {
      if (searchOpenRef.current) return;
      const start = pointerStart.current;
      pointerStart.current = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < 40 && Math.abs(dy) < 40) return;
      skipGridClick.current = true;
      if (Math.abs(dx) >= Math.abs(dy)) goMonth.current(dx < 0 ? 1 : -1, "x");
      else goMonth.current(dy < 0 ? 1 : -1, "y");
    }
    function onWheel(event: WheelEvent) {
      if (searchOpenRef.current) return;
      if ((event.target as HTMLElement | null)?.closest(".cal-pick-menu")) return;
      event.preventDefault();
      const now = Date.now();
      if (now - lastWheel.current < 280) return;
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const delta = horizontal ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 12) return;
      lastWheel.current = now;
      goMonth.current(delta > 0 ? 1 : -1, horizontal ? "x" : "y");
    }
    node.addEventListener("pointerdown", onPointerDown);
    node.addEventListener("pointerup", onPointerUp);
    node.addEventListener("pointercancel", onPointerUp);
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointerup", onPointerUp);
      node.removeEventListener("pointercancel", onPointerUp);
      node.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    function onPageWheel(event: WheelEvent) {
      if ((event.target as HTMLElement | null)?.closest(".cal-pick-menu")) return;
      const page = pageRef.current;
      if (!page) return;
      const grid = document.querySelector(".cal-month-grid");
      if (grid && grid.contains(event.target as Node)) return;
      if (page.scrollHeight <= page.clientHeight + 1) return;
      page.scrollTop += event.deltaY;
    }
    window.addEventListener("wheel", onPageWheel, { passive: true });
    return () => window.removeEventListener("wheel", onPageWheel);
  }, []);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    function holdHide(
      show: boolean,
      setShow: (next: boolean) => void,
      setHiding: (next: boolean) => void,
      timer: { current: number },
    ) {
      if (show) {
        window.clearTimeout(timer.current);
        timer.current = 0;
        setHiding(false);
        setShow(true);
        return;
      }
      if (timer.current) return;
      setHiding(true);
      timer.current = window.setTimeout(() => {
        timer.current = 0;
        setShow(false);
        setHiding(false);
      }, 1250);
    }
    function check() {
      const node = pageRef.current;
      if (!node) return;
      holdHide(
        node.scrollHeight - node.clientHeight - node.scrollTop > 16,
        setCanScrollDown,
        setDownHiding,
        hideDownTimer,
      );
      holdHide(node.scrollTop > 16, setCanScrollUp, setUpHiding, hideUpTimer);
    }
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      ro.disconnect();
      window.clearTimeout(hideDownTimer.current);
      window.clearTimeout(hideUpTimer.current);
    };
  }, [settingsOpen, openEventId, adding, view, settings.tabs]);

  return (
    <div
      data-theme="clareira"
      className={cn(
        "cal-app bg-bg font-body text-fg",
        settings.a11yNumbers && "a11y-num",
        settings.a11yText && "a11y-text",
        settings.a11ySaturated && "a11y-sat",
        settings.a11yColorblind && "a11y-cb",
        settings.a11yHints && "a11y-hints",
      )}
    >
      <IconTips />
      <div className="relative mx-auto flex min-h-0 w-full flex-1 flex-col">
        <header className="shrink-0 px-5 pt-[max(1.1rem,env(safe-area-inset-top))] pb-3">
          <div className="flex items-end justify-between gap-2">
            <div className="flex min-w-0 items-end gap-5">
              <HeaderMenu
                label="Escolher mês"
                value={view.getMonth()}
                options={monthOptions}
                open={openMenu === "month"}
                wide
                soft
                buttonClassName="cal-month-btn capitalize"
                optionClassName="cal-month-option"
                onOpen={() => setOpenMenu("month")}
                onClose={() => setOpenMenu(null)}
                onPick={(month) => jumpTo(civilDate(year, month, 1), undefined, month === view.getMonth() ? undefined : "fileiras")}
              />
              <YearType year={year} onYear={(nextYear) => jumpTo(civilDate(nextYear, view.getMonth(), 1))} />
            </div>
            <div className="flex shrink-0 items-end">
              <div className="cal-head-nav flex items-end">
              {view.getMonth() !== fromIso(today).getMonth() || year !== fromIso(today).getFullYear() ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="cal-icon-tip cal-ajustes cal-head-hoje"
                  data-tip="Hoje"
                  aria-label="Hoje"
                  onClick={() => {
                    pingHoje();
                    setSearchOpen(false);
                    jumpTo(fromIso(today), today, "onda");
                  }}
                >
                  <HojeIcon day={fromIso(today).getDate()} flash={hojeFlash} />
                </Button>
              ) : null}
              <Button
                variant="ghost"
                size="icon"
                className="cal-icon-tip cal-ajustes"
                data-tip="Procurar"
                aria-label="Procurar"
                aria-pressed={searchOpen}
                onClick={() => {
                  pingFind();
                  setSearchOpen((open) => !open);
                }}
              >
                <Search className={cn("cal-glyph size-5", findFlash && "is-flash")} />
              </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="cal-icon-tip cal-ajustes"
                data-tip="Ajustes"
                aria-label="Ajustes"
                onClick={() => {
                  pingGear();
                  setSettingsOpen(true);
                }}
              >
                <Settings2 className={cn("cal-glyph size-5", gearFlash && "is-flash")} />
              </Button>
            </div>
          </div>
        </header>

        <div className="relative min-h-0 w-full flex-1">
        <div
          ref={pageRef}
          className="cal-page flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))]"
        >
          <section
            ref={swipeRef}
            className="cal-swipe relative shrink-0 overflow-hidden rounded-panel bg-surface shadow-panel"
          >
            <div
              className={cn(searchOpen && "invisible pointer-events-none", arrive && "is-arrive")}
              aria-hidden={searchOpen || undefined}
            >
            <MonthGrid
              cells={cells}
              selectedIso={selected}
              today={today}
              periodIsos={periodIsos}
              weekStart={settings.weekStart}
              saturdayTint={settings.saturdayTint}
              sundayTint={settings.sundayTint}
              holidayTint={settings.holidayTint}
              onSelect={selectFromGrid}
              onHold={holdFromGrid}
            />
            </div>
            {leave && !searchOpen ? (
              <div key={leave.id} className={cn("cal-month-leave", `is-${leave.motion}`, leave.rush && "is-rush")} aria-hidden="true">
                <MonthGrid
                  cells={leave.cells}
                  selectedIso={selected}
                  today={today}
                  periodIsos={periodIsos}
                  weekStart={settings.weekStart}
                  saturdayTint={settings.saturdayTint}
                  sundayTint={settings.sundayTint}
                  holidayTint={settings.holidayTint}
                  onSelect={() => {}}
                />
              </div>
            ) : null}
            {searchOpen ? (
              <div className="absolute inset-0">
                <SearchPanel query={searchQuery} items={searchItems} onQuery={setSearchQuery} onPick={openFound} />
              </div>
            ) : null}
          </section>

          {settings.tabs.holidays ? (
          <HolidaysTab
            year={year}
            month={view.getMonth()}
            today={today}
            openId={openHolidayIso}
            catalog={holidays}
            extras={extraHolidays}
            pool={holidayPool}
            municipal={settings.municipal}
            commemorative={settings.commemorative}
            facultative={settings.facultative}
            national={settings.national}
            cityName={settings.cityName}
            cityUf={settings.cityUf}
            cityIbge={settings.cityIbge}
            onToggleMunicipal={(on) => {
              setSettings((prev) => ({ ...prev, municipal: on }));
            }}
            onToggleCommemorative={(on) => {
              setSettings((prev) => ({ ...prev, commemorative: on }));
            }}
            onToggleFacultative={(on) => {
              setSettings((prev) => ({ ...prev, facultative: on }));
            }}
            onToggleNational={(on) => {
              setSettings((prev) => ({ ...prev, national: on }));
            }}
            onSearchCity={async (query, uf) => {
              const { searchMunicipio } = await import("@/lib/calendar-server");
              return searchMunicipio({ data: { query, uf } });
            }}
            onPickCity={pickCity}
            onLocate={locateCity}
            onOpen={(event) => {
              pingGlyph();
              setSelected(event.iso);
              setOpenHolidayIso((cur) => (cur === event.id ? null : event.id));
              setOpenHighlightId(null);
              setOpenEventId(null);
          
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
    setOpenBillId(null);
    setOpenIrpfId(null);
    setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
          />
          ) : null}

          {settings.tabs.destaques ? (
          <DestaquesTab
            year={year}
            month={view.getMonth()}
            today={today}
            openId={openHighlightId}
            events={highlights}
            elections={settings.elections}
            electionSecondRound={showElectionSecond(year, settings.electionSecondRound)}
            enem={settings.enem}
            seasons={settings.seasons}
            lunar={settings.lunar}
            electionPlace={settings.electionPlace}
            electionZone={settings.electionZone}
            onToggleElections={(on) => setSettings((prev) => ({ ...prev, elections: on }))}
            onToggleSecondRound={(on) => {
              stampSecondRound(year, on ? secondRoundIso(year) : null, on ? "user" : null);
              setSettings((prev) => ({
                ...prev,
                electionSecondRound: on,
                electionSecondTriedYear: on ? prev.electionSecondTriedYear : year,
              }));
            }}
            onToggleEnem={(on) => setSettings((prev) => ({ ...prev, enem: on }))}
            onToggleSeasons={(on) => setSettings((prev) => ({ ...prev, seasons: on }))}
            onToggleLunar={(on) => setSettings((prev) => ({ ...prev, lunar: on }))}
            onElectionPlace={(value) => setSettings((prev) => ({ ...prev, electionPlace: value }))}
            onElectionZone={(value) => setSettings((prev) => ({ ...prev, electionZone: value }))}
            onOpen={(event) => {
              pingGlyph();
              setSelected(event.iso);
              setOpenHighlightId((cur) => (cur === event.id ? null : event.id));
              setOpenHolidayIso(null);
              setOpenEventId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
              setOpenIrpfId(null);
              setOpenPisId(null);
              setOpenIpvaId(null);
              setOpenFgtsId(null);
              setOpenBolsaId(null);
              setOpenGasId(null);
              setOpenLicencaId(null);
            }}
          />
          ) : null}

          {settings.tabs.agenda ? (
          <section className="cal-tab cal-tab-agenda" data-cal-tab="agenda">
            <div className="cal-tab-head">
              <h2 className="cal-tab-title">Agenda</h2>
              <Button
                variant="ghost"
                size="icon"
                {...withTip("Novo")}
                aria-label="Novo compromisso"
                onClick={() => {
                  pingGlyph();
                  if (!adding) {
                    agendaDraftId.current = null;
                    setDraftTitle("");
                    setDraftPlace("");
                    setDraftContact("");
                    setDraftTime("09:00");
                    setDraftKind(null);
                    setDraftEveryDays("");
                    setDraftMonthSide("");
                    setDraftMonthNth("");
                    setDraftMonthUtil(false);
                    setDraftIntervalRule("ignorar");
                    setDraftNotify(false);
                    setDraftDurTime("");
                    setDraftDurDays("");
                    setDraftDate(selected);
                    setKindMenu(false);
                    setSideMenu(false);
                    setRuleMenu(false);
                    setEditingEventId(null);
                  }
                  setAdding((v) => !v);
                }}
              >
                <CalendarGlyph className="size-5" flash={glyphFlash} />
              </Button>
            </div>
            <A11yHint>Compromissos do mês. Toque para ver detalhes, editar ou apagar.</A11yHint>
            <div className="mt-3 border-t border-line" />

            {adding ? (
              <form
                className="flex flex-col gap-2 pt-3"
                onSubmit={(event) => {
                  event.preventDefault();
                }}
              >
                <div className="flex items-center">
                  <input
                    value={draftTitle}
                    maxLength={45}
                    onChange={(event) => setDraftTitle(event.target.value.slice(0, 45))}
                    placeholder="Compromisso"
                    className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                    autoFocus
                  />
                  <button
                    type="button"
                    aria-label="Arquivo"
                    {...withTip("Arquivo", "flex size-8 shrink-0 items-center justify-center text-fg")}
                    onClick={recallDraft}
                  >
                    <ArquivoIcon className="size-5" />
                  </button>
                </div>
                <div className="flex items-center">
                  <input
                    value={draftPlace}
                    maxLength={45}
                    onChange={(event) => setDraftPlace(event.target.value.slice(0, 45))}
                    placeholder="Local"
                    className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                  />
                  <span className="size-8 shrink-0" aria-hidden="true" />
                </div>
                <ContactField value={draftContact} onChange={setDraftContact} />
                <DatePick
                  value={draftDate}
                  weekStart={settings.weekStart}
                  onChange={(next) => {
                    setDraftDate(next);
                    setSelected(next);
                  }}
                />
                <HolidayNote iso={draftDate} events={[...holidays, ...extraHolidays]} />
                <div className="flex items-center">
                  <TimePick value={draftTime} cycle={settings.hourCycle} onChange={setDraftTime} />
                  <NotifyToggle on={draftNotify} onToggle={() => void armNotify(!draftNotify)} />
                </div>
                <DurationPick
                  time={draftDurTime}
                  days={draftDurDays}
                  onTime={setDraftDurTime}
                  onDays={setDraftDurDays}
                />
                <p className="text-xs text-muted">Intervalo</p>
                <A11yHint>Se marcar, o compromisso volta sozinho na semana, mês, semestre, ano ou a cada X dias.</A11yHint>
                <KindPick
                  kind={draftKind}
                  everyDays={draftEveryDays}
                  open={kindMenu}
                  onOpen={() => setKindMenu(true)}
                  onClose={() => setKindMenu(false)}
                  onKind={(next) => {
                    setDraftKind(next);
                    if (!next || next === "personalizado") {
                      setDraftMonthNth("");
                      if (!next) {
                        setDraftMonthUtil(false);
                        setSideMenu(false);
                      }
                    }
                  }}
                  onEveryDays={setDraftEveryDays}
                />
                <PlacePick
                  side={draftMonthSide}
                  util={draftMonthUtil}
                  open={sideMenu}
                  locked={!draftKind}
                  onOpen={() => setSideMenu(true)}
                  onClose={() => setSideMenu(false)}
                  onSide={setDraftMonthSide}
                  onUtil={() => setDraftMonthUtil((v) => !v)}
                />
                <p className="text-xs text-muted">Feriados</p>
                <A11yHint>O que fazer quando uma data do intervalo cair em feriado.</A11yHint>
                <RulePick
                  rule={draftIntervalRule}
                  open={ruleMenu}
                  locked={!draftKind}
                  onOpen={() => setRuleMenu(true)}
                  onClose={() => setRuleMenu(false)}
                  onRule={setDraftIntervalRule}
                />
              </form>
            ) : null}

            {monthEvents.length === 0 && !adding ? (
              <p className="pt-3 text-pretty text-sm text-muted">Agenda aberta.</p>
            ) : (
              <ul>
                {monthEvents.map(({ event, iso }) => {
                  const past = iso < today;
                  const open = openEventId === event.id;
                  const day = fromIso(iso);
                  const follow =
                    event.intervalRule && event.intervalRule !== "ignorar"
                      ? followResolved(event, blockedHolidays, iso, year, view.getMonth())
                      : intervalFollow(event, iso, year, view.getMonth());
                  const nextDates = follow.rest;
                  const hop = follow.hop;
                  const hopLabel = hop
                    ? MONTHS[fromIso(hop).getMonth()].slice(0, 3).replace(/^./, (c) => c.toUpperCase())
                    : null;
                  return (
                    <li key={`${event.id}-${iso}`} className="[&:first-child>button]:border-t-0">
                      <button
                        type="button"
                        onClick={() => openAgendaItem(event, iso)}
                        className={cn(
                          "cal-agenda-line w-full border-t border-line py-3 text-left",
                          past && "opacity-55",
                        )}
                      >
                        <span
                          className={cn(
                            "cal-agenda-tone cal-dmy text-[0.8rem]",
                            open ? "text-today" : "text-muted",
                          )}
                        >
                          <span>{String(day.getDate()).padStart(2, "0")}</span>
                          <span>/</span>
                          <span>{String(day.getMonth() + 1).padStart(2, "0")}</span>
                        </span>
                        <span
                          className={cn(
                            "cal-agenda-tone min-w-0 flex-1 truncate text-sm",
                            open ? "font-bold" : "font-medium",
                          )}
                        >
                          {event.title}
                        </span>
                        <span
                          className={cn(
                            "cal-agenda-tone flex shrink-0 items-baseline gap-2.5 text-xs",
                            open ? "font-bold text-fg" : "font-normal text-muted",
                          )}
                        >
                          {event.kind ? (
                            <span>
                              (
                              {event.kind === "personalizado" && event.everyDays
                                ? `${event.everyDays} dias`
                                : event.monthSide
                                  ? [
                                      event.monthSide === "ultimos" ? "último dia" : "primeiro dia",
                                      event.monthNth && event.monthNth > 1 ? event.monthNth : null,
                                      event.monthUtil ? "útil" : null,
                                    ]
                                      .filter(Boolean)
                                      .join(" ")
                                  : event.kind}
                              )
                            </span>
                          ) : null}
                          {event.time ? (
                            <span>{formatTime(event.time, settings.hourCycle)}</span>
                          ) : event.kind ? null : (
                            <span>{weekdayName(iso).slice(0, 3)}</span>
                          )}
                        </span>
                      </button>
                      <div className={cn("cal-event-details", open && "is-open")}>
                        <div>
                          {editingEventId === event.id ? (
                            <form
                              className="flex flex-col gap-2 pb-3"
                              onSubmit={(formEvent) => {
                                formEvent.preventDefault();
                              }}
                            >
                              <div className="flex items-center">
                                <input
                                  value={draftTitle}
                                  maxLength={45}
                                  onChange={(e) => setDraftTitle(e.target.value.slice(0, 45))}
                                  placeholder="Compromisso"
                                  className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                                />
                                <button
                                  type="button"
                                  aria-label="Arquivo"
                                  {...withTip("Arquivo", "flex size-8 shrink-0 items-center justify-center text-fg")}
                                  onClick={recallDraft}
                                >
                                  <ArquivoIcon className="size-5" />
                                </button>
                              </div>
                              <div className="flex items-center">
                                <input
                                  value={draftPlace}
                                  maxLength={45}
                                  onChange={(e) => setDraftPlace(e.target.value.slice(0, 45))}
                                  placeholder="Local"
                                  className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                                />
                                <span className="size-8 shrink-0" aria-hidden="true" />
                              </div>
                              <ContactField value={draftContact} onChange={setDraftContact} />
                              <DatePick value={draftDate} weekStart={settings.weekStart} onChange={setDraftDate} />
                              <HolidayNote iso={draftDate} events={[...holidays, ...extraHolidays]} />
                              <div className="flex items-center">
                                <TimePick value={draftTime} cycle={settings.hourCycle} onChange={setDraftTime} />
                                <NotifyToggle
                                  on={draftNotify}
                                  onToggle={() => void armNotify(!draftNotify)}
                                />
                              </div>
                              <DurationPick
                                time={draftDurTime}
                                days={draftDurDays}
                                onTime={setDraftDurTime}
                                onDays={setDraftDurDays}
                              />
                              <KindPick
                                kind={draftKind}
                                everyDays={draftEveryDays}
                                open={kindMenu}
                                onOpen={() => setKindMenu(true)}
                                onClose={() => setKindMenu(false)}
                                onKind={(next) => {
                                  setDraftKind(next);
                                  if (!next || next === "personalizado") {
                                    setDraftMonthNth("");
                                    if (!next) {
                                      setDraftMonthUtil(false);
                                      setSideMenu(false);
                                    }
                                  }
                                }}
                                onEveryDays={setDraftEveryDays}
                              />
                              <PlacePick
                                side={draftMonthSide}
                                util={draftMonthUtil}
                                open={sideMenu}
                                locked={!draftKind}
                                onOpen={() => setSideMenu(true)}
                                onClose={() => setSideMenu(false)}
                                onSide={setDraftMonthSide}
                                onUtil={() => setDraftMonthUtil((v) => !v)}
                              />
                              <p className="text-xs text-muted">Feriados</p>
                              <A11yHint>O que fazer quando uma data do intervalo cair em feriado.</A11yHint>
                              <RulePick
                                rule={draftIntervalRule}
                                open={ruleMenu}
                                locked={!draftKind}
                                onOpen={() => setRuleMenu(true)}
                                onClose={() => setRuleMenu(false)}
                                onRule={setDraftIntervalRule}
                              />
                            </form>
                          ) : (
                            <div className="cal-agenda-follow pb-1">
                              <span className="flex flex-col items-start gap-0.5">
                                {nextDates.map((next) => {
                                  const d = fromIso(next);
                                  return (
                                    <button
                                      key={next}
                                      type="button"
                                      className="cal-dmy border-0 bg-transparent p-0 text-[0.7rem] leading-tight text-muted"
                                      onClick={() => {
                                        if (
                                          d.getMonth() !== view.getMonth() ||
                                          d.getFullYear() !== year
                                        ) {
                                          focusMonth(next);
                                        } else {
                                          setSelected(next);
                                        }
                                        setDraftDate(next);
                                      }}
                                    >
                                      <span>{String(d.getDate()).padStart(2, "0")}</span>
                                      <span>/</span>
                                      <span>{String(d.getMonth() + 1).padStart(2, "0")}</span>
                                    </button>
                                  );
                                })}
                                {hop && hopLabel ? (
                                  <button
                                    type="button"
                                    className="flex w-[2.85rem] justify-center border-0 bg-transparent p-0 text-[0.65rem] leading-tight text-muted"
                                    onClick={() => {
                                      focusMonth(hop);
                                      setDraftDate(hop);
                                    }}
                                  >
                                    {hopLabel}
                                  </button>
                                ) : null}
                              </span>
                              <div className="flex min-w-0 flex-1 flex-col gap-2">
                              <p className="m-0 min-w-0 text-xs text-muted">
                                {event.place ?? ""}
                                {event.contact ? (
                                  <>
                                    {event.place ? <br /> : null}
                                    <ContactLine value={event.contact} />
                                  </>
                                ) : null}
                              </p>
                              <div className="cal-actions self-end text-muted">
                                {event.source === "local" ? (
                                  <>
                                    <button
                                      type="button"
                                      aria-label="Feito"
                                      {...withTip("Feito", "flex size-8 shrink-0 items-center justify-center text-muted")}
                                      onClick={() => markDone(event, iso)}
                                    >
                                      <SquareCheckBig className="size-4" />
                                    </button>
                                    <button
                                      type="button"
                                      aria-label="Adiar"
                                      {...withTip("Adiar", "flex size-8 shrink-0 items-center justify-center text-muted")}
                                      onClick={() => postponeEvent(event, iso)}
                                    >
                                      <CalendarPlus className="size-4" />
                                    </button>
                                  </>
                                ) : null}
                                <NotifyToggle
                                  on={Boolean(event.notify)}
                                  onToggle={() => void toggleEventNotify(event)}
                                />
                                <button
                                  type="button"
                                  aria-label={`Editar ${event.title}`}
                                  {...withTip("Editar", "flex size-8 shrink-0 items-center justify-center text-muted")}
                                  onClick={() => {
                                    setEditingEventId(event.id);
                                    setDraftTitle(event.title);
                                    setDraftPlace(event.place ?? "");
                                    setDraftContact(event.contact ?? "");
                                    setDraftTime(event.time || "09:00");
                                    setDraftKind(
                                      event.kind === "posicao" ? "mensal" : event.kind ?? null,
                                    );
                                    setDraftEveryDays(event.everyDays ? String(event.everyDays) : "");
                                    setDraftMonthSide(event.monthSide ?? "");
                                    setDraftMonthNth(
                                      event.monthNth && event.monthNth > 0 ? String(event.monthNth) : "",
                                    );
                                    setDraftMonthUtil(Boolean(event.monthUtil));
                                    setDraftIntervalRule(event.intervalRule ?? "ignorar");
                                    setDraftDurTime(
                                      event.durationMinutes ? minutesToTime(event.durationMinutes) : "",
                                    );
                                    setDraftDurDays(
                                      event.durationDays && event.durationDays > 0 ? String(event.durationDays) : "",
                                    );
                                    setDraftNotify(Boolean(event.notify));
                                    setDraftDate(iso);
                                  }}
                                >
                                  <Pencil className="size-4" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Apagar ${event.title}`}
                                  {...withTip("Apagar", "flex size-8 shrink-0 items-center justify-center text-muted")}
                                  onClick={() => {
                                    removeEvent(event.id);
                                    setOpenEventId(null);
                                    setEditingEventId(null);
                                  }}
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            {adding || periodOpen ? (
            <div className="mt-3 border-t border-line">
              <button
                type="button"
                className="flex w-full items-baseline py-3 text-left"
                aria-expanded={periodOpen}
                onClick={() => {
                  setPeriodOpen((open) => !open);
                  if (periodOpen) {
                    setPeriodMenu(false);
                    setPeriodEditingId(null);
                    setPeriodDirty(false);
                    periodDraftId.current = null;
                    setPeriodTitle("Folgas");
                    setPeriodNote("");
                    setPeriodDays("1");
                    setPeriodDate(selected);
                  }
                }}
              >
                <span className="text-sm font-medium text-fg">Períodos</span>
              </button>
              {periodOpen ? (
                <div className="flex flex-col gap-2 pb-3">
                  <A11yHint>Marca vários dias seguidos, a partir da data, como férias ou folgas.</A11yHint>
                  <div className="flex items-center gap-2">
                    <div className="cal-kind-pick min-w-0 flex-1">
                      <HeaderMenu
                        label="Período"
                        value={periodTitle}
                        options={["Folgas", "Férias", "Licenças", "Contratos", "Outros"].map((label) => ({
                          value: label,
                          label,
                        }))}
                        open={periodMenu}
                        wide
                        fixed
                        soft
                        buttonClassName="cal-kind-btn"
                        optionClassName="cal-kind-option"
                        onOpen={() => setPeriodMenu(true)}
                        onClose={() => setPeriodMenu(false)}
                        onPick={(next) => {
                          setPeriodTitle(next);
                          setPeriodDirty(true);
                          setPeriodMenu(false);
                        }}
                      />
                    </div>
                    <input
                      value={periodNote}
                      maxLength={45}
                      placeholder="Complementos"
                      aria-label="Complementos"
                      className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                      onChange={(event) => {
                        setPeriodNote(event.target.value);
                        setPeriodDirty(true);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <DatePick
                        value={periodDate}
                        weekStart={settings.weekStart}
                        onChange={(next) => {
                          setPeriodDate(next);
                          setSelected(next);
                          setPeriodDirty(true);
                        }}
                      />
                    </div>
                    <label className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-muted">Quantidade</span>
                      <input
                        value={periodDays}
                        inputMode="numeric"
                        aria-label="Quantidade de dias"
                        className="cal-num-field h-11 w-16 rounded-xl bg-bg px-2 text-center text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none"
                        onChange={(event) => {
                          setPeriodDays(event.target.value.replace(/\D/g, "").slice(0, 3));
                          setPeriodDirty(true);
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : null}
            </div>
            ) : null}
            {monthPeriods.length ? (
                <ul>
                  {monthPeriods.map((event) => {
                    const open = openPeriodId === event.id;
                    const day = fromIso(event.iso);
                    return (
                      <li key={event.id}>
                        <button
                          type="button"
                          className="cal-agenda-line w-full border-t border-line py-3 text-left"
                          onClick={() => {
                            setSelected(event.iso);
                            setOpenPeriodId((current) => (current === event.id ? null : event.id));
                            setOpenEventId(null);
                          }}
                        >
                          <span className={cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted")}>
                            <span>{String(day.getDate()).padStart(2, "0")}</span>
                            <span>/</span>
                            <span>{String(day.getMonth() + 1).padStart(2, "0")}</span>
                          </span>
                          <span className={cn("cal-agenda-tone min-w-0 flex-1 truncate text-sm", open ? "font-bold" : "font-medium")}>
                            {event.title}
                          </span>
                          <span className="cal-agenda-tone text-xs text-muted">{event.durationDays ?? 1} d</span>
                        </button>
                        <div className={cn("cal-event-details", open && "is-open")}>
                          <div>
                            {event.note ? <p className="pb-2 text-sm text-muted">{event.note}</p> : null}
                            <div className="flex items-center justify-end pb-3">
                              <button
                                type="button"
                                aria-label={`Editar ${event.title}`}
                                {...withTip("Editar", "flex size-8 shrink-0 items-center justify-center text-muted")}
                                onClick={() => {
                                  setPeriodEditingId(event.id);
                                  setPeriodTitle(event.title);
                                  setPeriodNote(event.note ?? "");
                                  setPeriodDate(event.iso);
                                  setPeriodDays(String(event.durationDays ?? 1));
                                  setPeriodDirty(true);
                                  setPeriodOpen(true);
                                  periodDraftId.current = null;
                                }}
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Apagar ${event.title}`}
                                {...withTip("Apagar", "flex size-8 shrink-0 items-center justify-center text-muted")}
                                onClick={() => {
                                  removeEvent(event.id);
                                  setOpenPeriodId(null);
                                  if (periodEditingId === event.id) setPeriodEditingId(null);
                                }}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
          </section>
          ) : null}

          {settings.tabs.birthdays ? (
          <BirthdaysTab
            year={year}
            month={view.getMonth()}
            today={today}
            selectedIso={selected}
            weekStart={settings.weekStart}
            openId={openBirthdayId}
            birthdays={birthdays}
            onAdd={(event) => setLocalEvents((prev) => [...prev, event])}
            onRemove={(id) => {
              removeEvent(id);
              setOpenBirthdayId(null);
            }}
            onUpdate={(event) => {
              updateEvent(event.id, event);
              setSelected(`${year}-${event.iso.slice(5)}`);
            }}
            onOpen={(event) => {
              setSelected(`${year}-${event.iso.slice(5)}`);
              setOpenBirthdayId((cur) => (cur === event.id ? null : event.id));
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
          
              setOpenBenefitId(null);
              setOpenHistoryId(null);
    setOpenBillId(null);
    setOpenIrpfId(null);
    setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
          />
          ) : null}

          {settings.tabs.finance ? (
          <FinancesTab
            year={year}
            month={view.getMonth()}
            today={today}
            selectedIso={selected}
            openBenefitId={openBenefitId}
            openBillId={openBillId}
            benefits={benefits}
            bills={bills}
            boletos={boletos}
            irpf={irpfEvent}
            irpfOn={settings.irpfOn}
            onIrpf={(irpfOn) => setSettings((prev) => ({ ...prev, irpfOn }))}
            irpfLots={irpfLots}
            irpfOpen={Boolean(irpfEvent && openIrpfId === irpfEvent.id)}
            pis={pis}
            pisOpen={Boolean(pis && openPisId === pis.id)}
            laborMonth={laborMonth}
            onLaborMonth={(month) =>
              setSettings((prev) => ({
                ...prev,
                laborMonth: month,
                pisBirthMonth: month,
                fgtsBirthMonth: month,
              }))
            }
            pisOn={settings.pisOn}
            fgtsOn={settings.fgtsOn}
            onPisOn={(on) => setSettings((prev) => ({ ...prev, pisOn: on }))}
            onFgtsOn={(on) => setSettings((prev) => ({ ...prev, fgtsOn: on }))}
            fgts={fgts}
            fgtsOpen={Boolean(fgts && openFgtsId === fgts.id)}
            fgtsUntil={fgtsUntil}
            onOpenFgts={(event) => {
              const closing = openFgtsId === event.id;
              setOpenFgtsId(closing ? null : event.id);
              if (!closing) {
                focusMonth(event.iso);
              }
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
              setOpenIrpfId(null);
              setOpenPisId(null);
              setOpenIpvaId(null);
              setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
            bolsa={bolsa}
            bolsaOpen={Boolean(bolsa && openBolsaId === bolsa.id)}
            bolsaNis={settings.bolsaNis}
            bolsaOn={settings.bolsaOn}
            gasOn={settings.gasOn}
            onBolsaNis={(nis) => setSettings((prev) => ({ ...prev, bolsaNis: sanitizeNis(nis) }))}
            onBolsaOn={(on) => setSettings((prev) => ({ ...prev, bolsaOn: on }))}
            onGasOn={(on) => setSettings((prev) => ({ ...prev, gasOn: on }))}
            onOpenBolsa={(event) => {
              const closing = openBolsaId === event.id;
              setOpenBolsaId(closing ? null : event.id);
              if (!closing) {
                focusMonth(event.iso);
              }
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
              setOpenIrpfId(null);
              setOpenPisId(null);
              setOpenIpvaId(null);
              setOpenFgtsId(null);
              setOpenGasId(null);
            }}
            gas={gas}
            gasOpen={Boolean(gas && openGasId === gas.id)}
            onOpenGas={(event) => {
              const closing = openGasId === event.id;
              setOpenGasId(closing ? null : event.id);
              if (!closing) {
                focusMonth(event.iso);
              }
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
              setOpenIrpfId(null);
              setOpenPisId(null);
              setOpenIpvaId(null);
              setOpenFgtsId(null);
              setOpenBolsaId(null);
              setOpenLicencaId(null);
            }}
            ipva={ipva}
            ipvaOpen={Boolean(ipva && openIpvaId === ipva.id)}
            ipvaLots={ipvaLots}
            ipvaUf={settings.ipvaUf}
            ipvaPlate={settings.ipvaPlate}
            ipvaOn={settings.ipvaOn}
            licencaOn={settings.licencaOn}
            onIpvaUf={(uf) => setSettings((prev) => ({ ...prev, ipvaUf: normalizeUf(uf) }))}
            onIpvaPlate={(plate) => {
              const next = sanitizePlate(plate);
              setSettings((prev) => ({ ...prev, ipvaPlate: next, ipvaDigit: plateDigit(next) }));
            }}
            onIpvaOn={(on) => setSettings((prev) => ({ ...prev, ipvaOn: on }))}
            onLicencaOn={(on) => setSettings((prev) => ({ ...prev, licencaOn: on }))}
            onAdd={(event) => setLocalEvents((prev) => [...prev, event])}
            onRemoveBenefit={(id) => {
              removeEvent(id);
              setOpenBenefitId(null);
            }}
            onRemoveBill={(id) => {
              removeEvent(id);
              setOpenBillId(null);
    setOpenIrpfId(null);
    setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
            onUpdate={(event) => {
              updateEvent(event.id, event);
              if (event.source === "bill" || event.source === "boleto") setSelected(event.iso);
            }}
            onOpenBenefit={(event, iso) => {
              focusMonth(iso);
              setOpenBenefitId((cur) => (cur === event.id ? null : event.id));
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
          
              setOpenBirthdayId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
    setOpenIrpfId(null);
    setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
            onOpenBill={(event, iso) => {
              setSelected(iso);
              setOpenBillId((cur) => (cur === event.id ? null : event.id));
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
              setOpenIrpfId(null);
    setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
            onOpenIrpf={(event) => {
              const closing = openIrpfId === event.id;
              setOpenIrpfId(closing ? null : event.id);
              if (!closing) {
                focusMonth(event.iso);
              }
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
              setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
            onOpenLot={(iso) => {
              focusMonth(iso);
            }}
            onOpenPis={(event) => {
              const closing = openPisId === event.id;
              setOpenPisId(closing ? null : event.id);
              if (!closing) {
                focusMonth(event.iso);
              }
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
              setOpenIrpfId(null);
              setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
            onOpenIpva={(event) => {
              const closing = openIpvaId === event.id;
              setOpenIpvaId(closing ? null : event.id);
              if (!closing) {
                focusMonth(event.iso);
              }
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
              setOpenIrpfId(null);
              setOpenPisId(null);
              setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
            licenca={licenca}
            licencaOpen={Boolean(licenca && openLicencaId === licenca.id)}
            onOpenLicenca={(event) => {
              const closing = openLicencaId === event.id;
              setOpenLicencaId(closing ? null : event.id);
              if (!closing) {
                focusMonth(event.iso);
              }
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
              setOpenIrpfId(null);
              setOpenPisId(null);
              setOpenIpvaId(null);
              setOpenFgtsId(null);
              setOpenBolsaId(null);
    setOpenGasId(null);
            }}
          />
          ) : null}

          {settings.tabs.history ? (
          <HistoryTab
            events={history}
            hourCycle={settings.hourCycle}
            openId={openHistoryId}
            onOpen={(event) => {
              focusMonth(event.iso);
              setOpenHistoryId((cur) => (cur === event.id ? null : event.id));
              setOpenEventId(null);
              setOpenHolidayIso(null);
    setOpenHighlightId(null);
          
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenBillId(null);
    setOpenIrpfId(null);
    setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
            onRemove={(id) => {
              setHistory((prev) => prev.filter((event) => event.id !== id));
              setOpenHistoryId(null);
              setOpenBillId(null);
    setOpenIrpfId(null);
    setOpenPisId(null);
    setOpenIpvaId(null);
    setOpenFgtsId(null);
    setOpenBolsaId(null);
    setOpenGasId(null);
    setOpenLicencaId(null);
            }}
            onReschedule={(event) => {
              const next = { ...event, notify: false };
              if (isDueForHistory(next, today, new Date(nowMs))) {
                setHistory((prev) => prev.map((item) => (item.id === next.id ? next : item)));
              } else {
                setHistory((prev) => prev.filter((item) => item.id !== next.id));
                setLocalEvents((prev) => [...prev, next]);
                setOpenHistoryId(null);
              }
              focusMonth(next.iso);
            }}
          />
          ) : null}
        </div>

        {canScrollUp ? (
          <div className="cal-scroll-start-wrap">
            <button
              type="button"
              aria-label="Ir ao início"
              {...withTip("Ir ao início", cn("cal-scroll-end", upHiding && "is-hiding"))}
              onClick={() => {
                pingStart();
                const node = pageRef.current;
                if (!node) return;
                node.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className={startFlash ? "cal-glyph is-flash" : "cal-glyph"}
              >
                <path d="M12 20.5v-11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path
                  d="M6 12.5 12 5 18 12.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : null}

        {canScrollDown ? (
          <div className="cal-scroll-end-wrap">
            <button
              type="button"
              aria-label="Ir ao final"
              {...withTip("Ir ao final", cn("cal-scroll-end", downHiding && "is-hiding"))}
              onClick={() => {
                pingEnd();
                const node = pageRef.current;
                if (!node) return;
                node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className={endFlash ? "cal-glyph is-flash" : "cal-glyph"}
              >
                <path d="M12 3.5v11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path
                  d="M6 11.5 12 19 18 11.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : null}
        </div>

        {settingsOpen ? (
          <Suspense fallback={null}>
            <SettingsPanel
              onClose={() => setSettingsOpen(false)}
              holidayCache={holidayStore[String(year)]}
              reminderStatus={reminderStatus}
              remindersBusy={remindersBusy}
              weekStart={settings.weekStart}
              saturdayTint={settings.saturdayTint}
              sundayTint={settings.sundayTint}
              holidayTint={settings.holidayTint}
              hourCycle={settings.hourCycle}
              onWeekStart={(weekStart) => setSettings((prev) => ({ ...prev, weekStart }))}
              onSaturdayTint={(saturdayTint) => setSettings((prev) => ({ ...prev, saturdayTint }))}
              onSundayTint={(sundayTint) => setSettings((prev) => ({ ...prev, sundayTint }))}
              onHolidayTint={(holidayTint) => setSettings((prev) => ({ ...prev, holidayTint }))}
              onHourCycle={(hourCycle) => setSettings((prev) => ({ ...prev, hourCycle }))}
              tabs={settings.tabs}
              onToggleTab={(id, next) =>
                setSettings((prev) => ({ ...prev, tabs: { ...prev.tabs, [id]: next } }))
              }
              a11yNumbers={settings.a11yNumbers}
              a11yText={settings.a11yText}
              a11ySaturated={settings.a11ySaturated}
              a11yColorblind={settings.a11yColorblind}
              a11yHints={settings.a11yHints}
              onA11yNumbers={(a11yNumbers) => setSettings((prev) => ({ ...prev, a11yNumbers }))}
              onA11yText={(a11yText) => setSettings((prev) => ({ ...prev, a11yText }))}
              onA11ySaturated={(a11ySaturated) => setSettings((prev) => ({ ...prev, a11ySaturated }))}
              onA11yColorblind={(a11yColorblind) => setSettings((prev) => ({ ...prev, a11yColorblind }))}
              onA11yHints={(a11yHints) => setSettings((prev) => ({ ...prev, a11yHints }))}
              onSyncGoogle={() => {
                void syncGoogle({ login: true });
              }}
              onEnableReminders={() => {
                setRemindersBusy(true);
                setReminderStatus("Pedindo permissão no celular…");
                void enableReminders()
                  .then((message) => {
                    setReminderStatus(message);
                    startReminders(
                      [...localEvents, ...googleEvents].filter((event) =>
                        tabAllowsEvent(settings.tabs, event),
                      ),
                      settings.hourCycle,
                    );
                  })
                  .finally(() => setRemindersBusy(false));
              }}
              cloudStatus={cloudStatus}
              onLeaveAccount={async () => {
                try {
                  await pushCloud({
                    data: packNotebook({ settings, events: localEvents, history }),
                  });
                } catch {
                  /* still leave the device */
                }
                clearLocalCalendae();
                setSettings(DEFAULT_SETTINGS);
                setLocalEvents([]);
                setHistory([]);
                setGoogleEvents([]);
                setHolidayStore(seedHolidayStore());
                setInssStore({});
                setCloudStatus(null);
                pulledFor.current = null;
                lastPushPrint.current = "";
                cloudOnceFor = "";
                setCalendaeLoginOff(true);
                await signOut();
              }}
            />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
