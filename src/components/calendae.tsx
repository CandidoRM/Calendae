import { Bell, CalendarPlus, Contact, Pencil, Settings2, SquareCheckBig, Trash2 } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { A11yHint } from "@/components/a11y-hint";
import { BirthdaysTab } from "@/components/birthdays-tab";
import { FinancesTab } from "@/components/finances-tab";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { DatePick, TimePick } from "@/components/date-time-pick";
import { ContactLine } from "@/components/contact-line";
import { HeaderMenu } from "@/components/header-menu";
import { HistoryTab } from "@/components/history-tab";
import { HolidaysTab } from "@/components/holidays-tab";
import { MonthGrid } from "@/components/month-grid";
import { Button } from "@/components/ui/button";
import { redirectToLoginIfRequired, useRefetchWhenConnectorReady } from "@/lib/app-data";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { pullCloud, pushCloud } from "@/lib/cloud";
import { packCalendae } from "@/lib/guardar";
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
  buildMonthCells,
  eventOverlapsMonth,
  eventSpanIsos,
  fallbackHolidays,
  formatTime,
  fromIso,
  holidaysForYears,
  isDueForHistory,
  archiveEvent,
  isFacultative,
  isNational,
  isPeriodEvent,
  lastVisibleIso,
  mergeEventsById,
  eventMatchesIso,
  minutesToTime,
  newEventId,
  intervalFollow,
  occurrenceInMonth,
  officeHolidayLabel,
  periodToEvent,
  postponeIso,
  readEventsRaw,
  readHolidayStore,
  readPeriodsRaw,
  readSettingsRaw,
  shiftMonth,
  tabAllowsEvent,
  timeToMinutes,
  todayIso,
  toIso,
  uniqueEvents,
  weekdayName,
  type CalEvent,
  type EventKind,
  type HolidayStore,
  type MonthSide,
  type Period,
  type Settings,
} from "@/lib/calendar";
import { inssPayIso, parseNb, rememberInssTable, type InssYearTable } from "@/lib/inss";
import { commemorativeDates } from "@/lib/commemorative";
import { electionDates, firstRoundIso, secondRoundIso } from "@/lib/elections";
import {
  dayAfter,
  ensureAlmanac,
  showElectionSecond,
  stampSecondRound,
} from "@/lib/almanac";
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

const SIDE_OPTIONS: { value: MonthSide; label: string }[] = [
  { value: "primeiros", label: "primeiros" },
  { value: "ultimos", label: "últimos" },
];

function HojeIcon({ day }: { day: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
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
      {kind === "personalizado" ? (
        <input
          value={everyDays}
          onChange={(event) => onEveryDays(event.target.value.replace(/\D/g, "").slice(0, 3))}
          placeholder="dias"
          inputMode="numeric"
          aria-label="Intervalo em dias"
          className="cal-field-sm h-11 rounded-xl bg-bg px-2 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
        />
      ) : null}
    </div>
  );
}

function PlacePick({
  side,
  nth,
  util,
  open,
  locked,
  onOpen,
  onClose,
  onSide,
  onNth,
  onUtil,
}: {
  side: MonthSide;
  nth: string;
  util: boolean;
  open: boolean;
  locked?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSide: (next: MonthSide) => void;
  onNth: (next: string) => void;
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
      <input
        value={locked ? "" : nth}
        readOnly={locked}
        disabled={locked}
        onChange={(event) => {
          if (locked) return;
          onNth(event.target.value.replace(/\D/g, "").slice(0, 2));
        }}
        placeholder="dias"
        inputMode="numeric"
        aria-label="Quantos dias"
        className={cn(
          "cal-field-sm h-11 rounded-xl bg-bg px-2 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
          locked && "cursor-not-allowed opacity-45",
        )}
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
      <p className="mb-1 text-xs text-muted">Duração</p>
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
  const [sideMenu, setSideMenu] = useState(false);
  const [draftNotify, setDraftNotify] = useState(false);
  const [draftDurTime, setDraftDurTime] = useState("");
  const [draftDurDays, setDraftDurDays] = useState("");
  const [draftDate, setDraftDate] = useState(todayIso);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [hydrated, setHydrated] = useState(false);
  const [openMenu, setOpenMenu] = useState<"month" | "year" | null>(null);
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [openHolidayIso, setOpenHolidayIso] = useState<string | null>(null);
  const [openBirthdayId, setOpenBirthdayId] = useState<string | null>(null);
  const [openBenefitId, setOpenBenefitId] = useState<string | null>(null);
  const [openBillId, setOpenBillId] = useState<string | null>(null);
  const [openHistoryId, setOpenHistoryId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);
  const [remindersBusy, setRemindersBusy] = useState(false);
  const [municipalEvents, setMunicipalEvents] = useState<CalEvent[]>([]);
  const [inssStore, setInssStore] = useState<InssStore>({});
  const holidayStoreRef = useRef(holidayStore);
  holidayStoreRef.current = holidayStore;
  const viewRef = useRef(view);
  viewRef.current = view;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const swipeRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastWheel = useRef(0);
  const skipGridClick = useRef(false);
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [endFlash, pingEnd] = useGlyphFlash();
  const [startFlash, pingStart] = useGlyphFlash();
  const [downHiding, setDownHiding] = useState(false);
  const [upHiding, setUpHiding] = useState(false);
  const hideDownTimer = useRef(0);
  const hideUpTimer = useRef(0);
  const firstLaunch = useRef(false);
  const cloudOnce = useRef(false);
  const { user, isPending: authPending } = useCurrentUserState();

  useLayoutEffect(() => {
    firstLaunch.current = !readSettingsRaw();
    setSettings(
      firstLaunch.current ? { ...readSettings(), municipal: true } : readSettings(),
    );
    const day = todayIso();
    const loaded = readLocalEvents();
    const live: CalEvent[] = [];
    const archived: CalEvent[] = [];
    for (const event of loaded) {
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
    const storedPeriods = readPeriods();
    setLocalEvents(mergeEventsById(live, storedPeriods.map(periodToEvent)));
    if (storedPeriods.length) localStorage.setItem("calendae-periods", "[]");
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
    if (!hydrated || authPending || !user || cloudOnce.current) return;
    cloudOnce.current = true;
    void (async () => {
      try {
        const cloud = await pullCloud();
        const live = packCalendae({
          settings,
          events: localEvents,
          history,
          holidays: holidayStore,
        });
        if (!cloud) {
          await pushCloud({ data: live });
          return;
        }
        const cloudEvents = Array.isArray(cloud.events) ? (cloud.events as CalEvent[]) : [];
        const cloudHist = Array.isArray(cloud.history) ? (cloud.history as CalEvent[]) : [];
        const mergedEvents = mergeEventsById(localEvents, cloudEvents);
        const mergedHist = mergeEventsById(history, cloudHist);
        setLocalEvents(mergedEvents);
        setHistory(mergedHist);
        await pushCloud({
          data: packCalendae({
            settings,
            events: mergedEvents,
            history: mergedHist,
            holidays: holidayStore,
          }),
        });
      } catch {
        cloudOnce.current = false;
      }
    })();
  }, [hydrated, authPending, user]);

  useEffect(() => {
    if (!hydrated || !user || !cloudOnce.current) return;
    const wait = window.setTimeout(() => {
      void pushCloud({ data: packCalendae() }).catch(() => {});
    }, 900);
    return () => window.clearTimeout(wait);
  }, [localEvents, history, settings, hydrated, user]);

  useEffect(() => {
    const tick = () => {
      setToday(todayIso());
      setNowMs(Date.now());
    };
    const id = window.setInterval(tick, 15_000);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
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
    [holidayStore, year, municipalEvents],
  );
  const extraHolidays = useMemo(() => {
    const list: CalEvent[] = [];
    if (settings.commemorative) list.push(...commemorativeDates(year));
    if (settings.elections) list.push(...electionDates(year, showElectionSecond(year, settings.electionSecondRound)));
    if (settings.municipal) list.push(...municipalEvents);
    return list;
  }, [settings.commemorative, settings.elections, settings.electionSecondRound, settings.municipal, municipalEvents, year]);
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
        ...localEvents.filter((event) => event.source !== "benefit"),
        ...benefitEvents,
        ...holidays,
        ...extraHolidays,
        ...googleEvents.filter((event) => !isDueForHistory(event, today)),
      ]).filter((event) => tabAllowsEvent(settings.tabs, event)),
    [localEvents, benefitEvents, holidays, extraHolidays, googleEvents, today, settings.tabs],
  );
  const cells = useMemo(
    () => buildMonthCells(view, today, allEvents, settings.weekStart),
    [view, today, allEvents, settings.weekStart],
  );
  const periodIsos = useMemo(() => {
    const set = new Set<string>();
    if (!settings.tabs.agenda) return set;
    for (const event of localEvents) {
      if (!isPeriodEvent(event)) continue;
      for (const iso of eventSpanIsos(event)) set.add(iso);
    }
    return set;
  }, [localEvents, settings.tabs.agenda]);
  const monthEvents = useMemo(() => {
    const month = view.getMonth();
    return allEvents
      .flatMap((event) => {
        if (event.source === "holiday" || event.source === "birthday" || event.source === "benefit" || event.source === "bill")
          return [];
        if (isPeriodEvent(event)) {
          return eventOverlapsMonth(event, year, month) ? [{ event, iso: event.iso }] : [];
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
          const last = new Date(year, month + 1, 0).getDate();
          const rows: { event: CalEvent; iso: string }[] = [];
          for (let day = 1; day <= last; day += 1) {
            const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            if (eventMatchesIso(event, iso)) rows.push({ event, iso });
          }
          return rows;
        }
        if (isDueForHistory(event, today, new Date(nowMs))) return [];
        const last = lastVisibleIso(event);
        const monthStart = toIso(new Date(year, month, 1));
        const monthEnd = toIso(new Date(year, month + 1, 0));
        if (last < monthStart || event.iso > monthEnd) return [];
        return [{ event, iso: event.iso }];
      })
      .sort(
        (a, b) =>
          a.iso.localeCompare(b.iso) || (a.event.time ?? "").localeCompare(b.event.time ?? ""),
      );
  }, [allEvents, view, year, today, nowMs]);
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
      const start = new Date(viewRef.current.getFullYear(), viewRef.current.getMonth(), 1);
      const end = new Date(viewRef.current.getFullYear(), viewRef.current.getMonth() + 1, 1);
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

  useRefetchWhenConnectorReady(googlePending, () => {
    void syncGoogle();
  });

  useEffect(() => {
    if (!hydrated) return;
    void syncGoogle();
  }, [hydrated, year, view, syncGoogle]);

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
    if (!hydrated || !firstLaunch.current) return;
    firstLaunch.current = false;
    void locateCity().then((city) => {
      if (!city) {
        setSettings((prev) => ({ ...prev, municipal: false }));
        return;
      }
      setSettings((prev) => ({
        ...prev,
        municipal: true,
        cityName: city.name,
        cityIbge: city.ibge,
        cityUf: city.uf,
      }));
    });
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    startReminders(
      [...localEvents, ...googleEvents].filter((event) => tabAllowsEvent(settings.tabs, event)),
    );
  }, [hydrated, localEvents, googleEvents, settings.tabs]);

  const monthOptions = MONTHS.map((label, value) => ({ value, label }));
  const yearOptions = Array.from({ length: 51 }, (_, i) => {
    const item = 2000 + i;
    return { value: item, label: String(item) };
  });

  function jumpTo(next: Date, selectIso?: string) {
    setView(next);
    if (selectIso) {
      setSelected(selectIso);
    } else {
      const day = fromIso(selectedRef.current).getDate();
      const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      const iso = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(Math.min(day, last)).padStart(2, "0")}`;
      setSelected(iso);
    }
    setOpenMenu(null);
  }

  function selectFromGrid(iso: string) {
    if (skipGridClick.current) {
      skipGridClick.current = false;
      return;
    }
    const date = fromIso(iso);
    if (date.getMonth() !== view.getMonth() || date.getFullYear() !== year) {
      jumpTo(new Date(date.getFullYear(), date.getMonth(), 1), iso);
    } else {
      setSelected(iso);
    }
    setDraftDate(iso);
    setOpenEventId(null);
    setOpenHolidayIso(null);

    setOpenBirthdayId(null);
    setOpenBenefitId(null);
    setOpenHistoryId(null);
    setOpenBillId(null);
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
  } {
    const ordinalKinds: EventKind[] = ["semanal", "mensal", "semestral", "anual"];
    if (draftKind && ordinalKinds.includes(draftKind)) {
      const n = Number(draftMonthNth);
      const hasNth = Number.isFinite(n) && n > 0;
      const side = draftMonthSide === "ultimos" ? "ultimos" : "primeiros";
      const usesPlace = draftMonthSide === "ultimos" || draftMonthUtil || hasNth;
      if (usesPlace) {
        return {
          kind: draftKind,
          everyDays: undefined,
          monthSide: side,
          monthNth: hasNth ? n : 1,
          monthUtil: draftMonthUtil,
        };
      }
      return {
        kind: draftKind,
        everyDays: undefined,
        monthSide: undefined,
        monthNth: undefined,
        monthUtil: undefined,
      };
    }
    if (draftKind !== "personalizado") {
      return { kind: draftKind ?? undefined, everyDays: undefined, monthSide: undefined, monthNth: undefined, monthUtil: undefined };
    }
    const step = Number(draftEveryDays);
    if (!Number.isFinite(step) || step < 1) {
      return { kind: undefined, everyDays: undefined, monthSide: undefined, monthNth: undefined, monthUtil: undefined };
    }
    return { kind: "personalizado", everyDays: step, monthSide: undefined, monthNth: undefined, monthUtil: undefined };
  }

  function durationPatch(): { durationDays?: number; durationMinutes?: number } {
    const days = Number(draftDurDays);
    const mins = timeToMinutes(draftDurTime);
    return {
      durationDays: Number.isFinite(days) && days > 0 ? days : undefined,
      durationMinutes: mins > 0 ? mins : undefined,
    };
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
      source: !kindPatch().kind && Number(draftDurDays) > 0 ? "period" : "local",
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
    const next = fromIso(nextIso);
    updateEvent(event.id, { iso: nextIso });
    jumpTo(new Date(next.getFullYear(), next.getMonth(), 1), nextIso);
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

    setOpenBirthdayId(null);
    setOpenBenefitId(null);
    setOpenHistoryId(null);
    setOpenBillId(null);
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
        current?.source === "birthday" || current?.source === "google"
          ? current.source
          : !kindPatch().kind && Number(draftDurDays) > 0
            ? "period"
            : "local",
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

  useEffect(() => {
    const node = swipeRef.current;
    if (!node) return;
    function onPointerDown(event: globalThis.PointerEvent) {
      pointerStart.current = { x: event.clientX, y: event.clientY };
    }
    function onPointerUp(event: globalThis.PointerEvent) {
      const start = pointerStart.current;
      pointerStart.current = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dx) < 40 && Math.abs(dy) < 40) return;
      skipGridClick.current = true;
      if (Math.abs(dx) >= Math.abs(dy)) jumpTo(shiftMonth(viewRef.current, dx < 0 ? 1 : -1));
      else jumpTo(shiftMonth(viewRef.current, dy < 0 ? 1 : -1));
    }
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const now = Date.now();
      if (now - lastWheel.current < 420) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(delta) < 12) return;
      lastWheel.current = now;
      jumpTo(shiftMonth(viewRef.current, delta > 0 ? 1 : -1));
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
                onPick={(month) => jumpTo(new Date(year, month, 1))}
              />
              <HeaderMenu
                label="Escolher ano"
                value={year}
                options={yearOptions}
                open={openMenu === "year"}
                soft
                buttonClassName="cal-year-btn"
                optionClassName="cal-year-option"
                onOpen={() => setOpenMenu("year")}
                onClose={() => setOpenMenu(null)}
                onPick={(nextYear) => jumpTo(new Date(nextYear, view.getMonth(), 1))}
              />
            </div>
            <div className="flex shrink-0 items-end">
              {view.getMonth() !== fromIso(today).getMonth() || year !== fromIso(today).getFullYear() ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="cal-icon-tip cal-ajustes"
                  data-tip="Hoje"
                  aria-label="Hoje"
                  onClick={() => jumpTo(fromIso(today), today)}
                >
                  <HojeIcon day={fromIso(today).getDate()} />
                </Button>
              ) : null}
              <Button
                variant="ghost"
                size="icon"
                className="cal-icon-tip cal-ajustes"
                data-tip="Ajustes"
                aria-label="Ajustes"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings2 className="size-5" />
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
            className="cal-swipe shrink-0 overflow-hidden rounded-panel bg-surface shadow-panel"
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
            />
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
            elections={settings.elections}
            electionSecondRound={showElectionSecond(year, settings.electionSecondRound)}
            facultative={settings.facultative}
            national={settings.national}
            cityName={settings.cityName}
            cityUf={settings.cityUf}
            cityIbge={settings.cityIbge}
            electionPlace={settings.electionPlace}
            electionZone={settings.electionZone}
            onToggleMunicipal={(on) => {
              setSettings((prev) => ({ ...prev, municipal: on }));
            }}
            onToggleCommemorative={(on) => {
              setSettings((prev) => ({ ...prev, commemorative: on }));
            }}
            onToggleElections={(on) => {
              setSettings((prev) => ({ ...prev, elections: on }));
            }}
            onToggleSecondRound={(on) => {
              stampSecondRound(year, on ? secondRoundIso(year) : null, on ? "user" : null);
              setSettings((prev) => ({
                ...prev,
                electionSecondRound: on,
                electionSecondTriedYear: on ? prev.electionSecondTriedYear : year,
              }));
            }}
            onToggleFacultative={(on) => {
              setSettings((prev) => ({ ...prev, facultative: on }));
            }}
            onToggleNational={(on) => {
              setSettings((prev) => ({ ...prev, national: on }));
            }}
            onElectionPlace={(value) => {
              setSettings((prev) => ({ ...prev, electionPlace: value }));
            }}
            onElectionZone={(value) => {
              setSettings((prev) => ({ ...prev, electionZone: value }));
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
              setOpenEventId(null);
          
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
    setOpenBillId(null);
            }}
          />
          ) : null}

          {settings.tabs.agenda ? (
          <section className="cal-tab cal-tab-agenda">
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
                    setDraftTitle("");
                    setDraftPlace("");
                    setDraftContact("");
                    setDraftTime("09:00");
                    setDraftKind(null);
                    setDraftEveryDays("");
                    setDraftMonthSide("");
                    setDraftMonthNth("");
                    setDraftMonthUtil(false);
                    setDraftNotify(false);
                    setDraftDurTime("");
                    setDraftDurDays("");
                    setDraftDate(selected);
                    setKindMenu(false);
                    setSideMenu(false);
                    setEditingEventId(null);
                  }
                  setAdding((v) => !v);
                }}
              >
                <CalendarGlyph className="size-5" flash={glyphFlash} />
              </Button>
            </div>
            <A11yHint>Compromissos do mês. Toque para ver detalhes, editar ou apagar.</A11yHint>

            {adding ? (
              <form
                className="mt-3 flex flex-col gap-2 border-t border-line pt-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  addEvent();
                }}
              >
                <input
                  value={draftTitle}
                  maxLength={45}
                  onChange={(event) => setDraftTitle(event.target.value.slice(0, 45))}
                  placeholder="Compromisso"
                  className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                  autoFocus
                />
                <input
                  value={draftPlace}
                  maxLength={45}
                  onChange={(event) => setDraftPlace(event.target.value.slice(0, 45))}
                  placeholder="Local"
                  className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                />
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
                  <TimePick value={draftTime} onChange={setDraftTime} />
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
                    } else {
                      setDraftMonthSide((side) => side || "primeiros");
                    }
                  }}
                  onEveryDays={setDraftEveryDays}
                />
                <PlacePick
                  side={draftMonthSide === "ultimos" ? "ultimos" : "primeiros"}
                  nth={draftMonthNth}
                  util={draftMonthUtil}
                  open={sideMenu}
                  locked={!draftKind}
                  onOpen={() => setSideMenu(true)}
                  onClose={() => setSideMenu(false)}
                  onSide={setDraftMonthSide}
                  onNth={setDraftMonthNth}
                  onUtil={() => setDraftMonthUtil((v) => !v)}
                />
                <Button type="submit" className="w-full">
                  Anotar
                </Button>
              </form>
            ) : null}

            {monthEvents.length === 0 && !adding ? (
              <p className="mt-3 text-pretty text-sm text-muted">Agenda aberta.</p>
            ) : (
              <ul className="mt-1">
                {monthEvents.map(({ event, iso }) => {
                  const past = iso < today;
                  const open = openEventId === event.id;
                  const day = fromIso(iso);
                  const follow = intervalFollow(event, iso, year, view.getMonth());
                  const nextDates = follow.rest;
                  const hop = follow.hop;
                  const hopLabel = hop
                    ? MONTHS[fromIso(hop).getMonth()].slice(0, 3).replace(/^./, (c) => c.toUpperCase())
                    : null;
                  return (
                    <li key={`${event.id}-${iso}`}>
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
                          {isPeriodEvent(event) ? (
                            <span>(período)</span>
                          ) : event.kind ? (
                            <span>
                              (
                              {event.kind === "personalizado" && event.everyDays
                                ? `${event.everyDays} dias`
                                : event.monthSide
                                  ? [
                                      event.monthSide === "ultimos" ? "último" : "primeiro",
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
                            <span>{formatTime(event.time)}</span>
                          ) : event.kind || isPeriodEvent(event) ? null : (
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
                                saveEditEvent();
                              }}
                            >
                              <input
                                value={draftTitle}
                                maxLength={45}
                                onChange={(e) => setDraftTitle(e.target.value.slice(0, 45))}
                                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none"
                              />
                              <input
                                value={draftPlace}
                                maxLength={45}
                                onChange={(e) => setDraftPlace(e.target.value.slice(0, 45))}
                                placeholder="Local"
                                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                              />
                              <ContactField value={draftContact} onChange={setDraftContact} />
                              <DatePick value={draftDate} weekStart={settings.weekStart} onChange={setDraftDate} />
                              <HolidayNote iso={draftDate} events={[...holidays, ...extraHolidays]} />
                              <div className="flex items-center">
                                <TimePick value={draftTime} onChange={setDraftTime} />
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
                                  } else {
                                    setDraftMonthSide((side) => side || "primeiros");
                                  }
                                }}
                                onEveryDays={setDraftEveryDays}
                              />
                              <PlacePick
                                side={draftMonthSide === "ultimos" ? "ultimos" : "primeiros"}
                                nth={draftMonthNth}
                                util={draftMonthUtil}
                                open={sideMenu}
                                locked={!draftKind}
                                onOpen={() => setSideMenu(true)}
                                onClose={() => setSideMenu(false)}
                                onSide={setDraftMonthSide}
                                onNth={setDraftMonthNth}
                                onUtil={() => setDraftMonthUtil((v) => !v)}
                              />
                              <Button type="submit" className="w-full">
                                Anotar
                              </Button>
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
                                          jumpTo(new Date(d.getFullYear(), d.getMonth(), 1), next);
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
                                      const d = fromIso(hop);
                                      jumpTo(new Date(d.getFullYear(), d.getMonth(), 1), hop);
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
                                    setDraftMonthSide(event.monthSide ?? (event.kind === "mensal" ? "primeiros" : ""));
                                    setDraftMonthNth(
                                      event.monthNth && event.monthNth > 0 ? String(event.monthNth) : "",
                                    );
                                    setDraftMonthUtil(Boolean(event.monthUtil));
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
          </section>
          ) : null}

          {settings.tabs.birthdays ? (
          <BirthdaysTab
            year={year}
            month={view.getMonth()}
            today={today}
            selectedIso={selected}
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
          
              setOpenBenefitId(null);
              setOpenHistoryId(null);
    setOpenBillId(null);
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
            onAdd={(event) => setLocalEvents((prev) => [...prev, event])}
            onRemoveBenefit={(id) => {
              removeEvent(id);
              setOpenBenefitId(null);
            }}
            onRemoveBill={(id) => {
              removeEvent(id);
              setOpenBillId(null);
            }}
            onUpdate={(event) => {
              updateEvent(event.id, event);
              if (event.source === "bill") setSelected(event.iso);
            }}
            onOpenBenefit={(event, iso) => {
              const date = fromIso(iso);
              setView(new Date(date.getFullYear(), date.getMonth(), 1));
              setSelected(iso);
              setOpenBenefitId((cur) => (cur === event.id ? null : event.id));
              setOpenEventId(null);
              setOpenHolidayIso(null);
          
              setOpenBirthdayId(null);
              setOpenHistoryId(null);
              setOpenBillId(null);
            }}
            onOpenBill={(event, iso) => {
              setSelected(iso);
              setOpenBillId((cur) => (cur === event.id ? null : event.id));
              setOpenEventId(null);
              setOpenHolidayIso(null);
          
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenHistoryId(null);
            }}
          />
          ) : null}

          {settings.tabs.history ? (
          <HistoryTab
            events={history}
            openId={openHistoryId}
            onOpen={(event) => {
              const date = fromIso(event.iso);
              setView(new Date(date.getFullYear(), date.getMonth(), 1));
              setSelected(event.iso);
              setOpenHistoryId((cur) => (cur === event.id ? null : event.id));
              setOpenEventId(null);
              setOpenHolidayIso(null);
          
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
              setOpenBillId(null);
            }}
            onRemove={(id) => {
              setHistory((prev) => prev.filter((event) => event.id !== id));
              setOpenHistoryId(null);
              setOpenBillId(null);
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
              const date = fromIso(next.iso);
              jumpTo(new Date(date.getFullYear(), date.getMonth(), 1), next.iso);
            }}
          />
          ) : null}
        </div>

        {canScrollUp ? (
          <div className="cal-scroll-start-wrap">
            <button
              type="button"
              aria-label="Ir ao início"
              className={cn("cal-scroll-end", upHiding && "is-hiding")}
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
              className={cn("cal-scroll-end", downHiding && "is-hiding")}
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
              onWeekStart={(weekStart) => setSettings((prev) => ({ ...prev, weekStart }))}
              onSaturdayTint={(saturdayTint) => setSettings((prev) => ({ ...prev, saturdayTint }))}
              onSundayTint={(sundayTint) => setSettings((prev) => ({ ...prev, sundayTint }))}
              onHolidayTint={(holidayTint) => setSettings((prev) => ({ ...prev, holidayTint }))}
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
                    );
                  })
                  .finally(() => setRemindersBusy(false));
              }}
            />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
