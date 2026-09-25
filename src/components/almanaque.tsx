import { Bell, Clock, Download, Pencil, Settings2, Trash2 } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BirthdaysTab } from "@/components/birthdays-tab";
import { BenefitsTab } from "@/components/benefits-tab";
import { CalendarGlyph } from "@/components/calendar-glyph";
import { HeaderMenu } from "@/components/header-menu";
import { HolidaysTab } from "@/components/holidays-tab";
import { MonthGrid } from "@/components/month-grid";
import { PeriodsTab } from "@/components/periods-tab";
import { Button, buttonVariants } from "@/components/ui/button";
import { redirectToLoginIfRequired, useRefetchWhenConnectorReady } from "@/lib/app-data";
import {
  DEFAULT_SETTINGS,
  EVENT_KINDS,
  EVENTS_KEY,
  HOLIDAYS_KEY,
  HOLIDAY_STALE_MS,
  MONTHS,
  PERIODS_KEY,
  SETTINGS_KEY,
  buildMonthCells,
  eventMatchesIso,
  expandPeriod,
  fallbackHolidays,
  formatTime,
  fromIso,
  holidaysForYears,
  newEventId,
  occurrenceInMonth,
  readHolidayStore,
  shiftMonth,
  todayIso,
  uniqueEvents,
  weekdayName,
  type CalEvent,
  type EventKind,
  type HolidayStore,
  type Period,
  type Settings,
} from "@/lib/calendar";
import { inssPayIso, parseNb } from "@/lib/inss";
import { commemorativeDates } from "@/lib/commemorative";
import { SHOW_DEV_BACKUP } from "@/lib/dev-flags";
import { electionDates } from "@/lib/elections";
import {
  enableReminders,
  reminderStatusLabel,
  startReminders,
} from "@/lib/reminders";
import { cn } from "@/lib/utils";

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
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      theme: "clareira",
      municipal: Boolean(parsed.municipal),
      commemorative: Boolean(parsed.commemorative),
      elections: typeof parsed.elections === "boolean" ? parsed.elections : true,
      cityName: typeof parsed.cityName === "string" ? parsed.cityName : "",
      cityIbge: typeof parsed.cityIbge === "number" ? parsed.cityIbge : null,
      cityUf: typeof parsed.cityUf === "string" ? parsed.cityUf : "",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function readLocalEvents(): CalEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CalEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readPeriods(): Period[] {
  try {
    const raw = localStorage.getItem(PERIODS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Period[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function monthBounds(view: Date) {
  const start = new Date(view.getFullYear(), view.getMonth(), 1);
  const end = new Date(view.getFullYear(), view.getMonth() + 1, 1);
  return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}

function KindMark({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-4 border border-fg", on ? "bg-fg" : "bg-transparent")}
    />
  );
}

function NotifyToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Desativar aviso" : "Ativar aviso"}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center",
        on ? "text-fg" : "text-muted",
      )}
      onClick={onToggle}
    >
      <Bell className={cn("size-4", on && "fill-current")} />
    </button>
  );
}

function TimePick({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex h-11 w-[6rem] shrink-0 items-center justify-center rounded-xl bg-bg px-1 text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)]">
        {formatTime(value)}
      </span>
      <label className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center text-fg">
        <Clock className="size-4" />
        <input
          type="time"
          value={value}
          aria-label="Horário"
          onChange={(event) => onChange(event.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}

export function Almanaque() {
  const [today] = useState(todayIso);
  const [view, setView] = useState(() => fromIso(todayIso()));
  const [selected, setSelected] = useState(todayIso);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [localEvents, setLocalEvents] = useState<CalEvent[]>([]);
  const [holidayStore, setHolidayStore] = useState<HolidayStore>(seedHolidayStore);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [googleEvents, setGoogleEvents] = useState<CalEvent[]>([]);
  const [googleStatus, setGoogleStatus] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTime, setDraftTime] = useState("09:00");
  const [draftPlace, setDraftPlace] = useState("");
  const [draftKind, setDraftKind] = useState<EventKind | null>(null);
  const [draftNotify, setDraftNotify] = useState(false);
  const [draftDate, setDraftDate] = useState(todayIso);
  const [hydrated, setHydrated] = useState(false);
  const [openMenu, setOpenMenu] = useState<"month" | "year" | null>(null);
  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [openHolidayIso, setOpenHolidayIso] = useState<string | null>(null);
  const [openPeriodId, setOpenPeriodId] = useState<string | null>(null);
  const [openBirthdayId, setOpenBirthdayId] = useState<string | null>(null);
  const [openBenefitId, setOpenBenefitId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [reminderStatus, setReminderStatus] = useState<string | null>(null);
  const [remindersBusy, setRemindersBusy] = useState(false);
  const [municipalEvents, setMunicipalEvents] = useState<CalEvent[]>([]);
  const [backupBusy, setBackupBusy] = useState(false);
  const holidayStoreRef = useRef(holidayStore);
  holidayStoreRef.current = holidayStore;
  const viewRef = useRef(view);
  viewRef.current = view;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const swipeRef = useRef<HTMLElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const lastWheel = useRef(0);

  useLayoutEffect(() => {
    setSettings(readSettings());
    setLocalEvents(readLocalEvents());
    const store = readHolidayStore();
    const y = fromIso(todayIso()).getFullYear();
    if (!store[String(y)]?.events?.length) {
      store[String(y)] = {
        events: fallbackHolidays(y),
        fetchedAt: 0,
        source: "fallback",
      };
    }
    setHolidayStore(store);
    setPeriods(readPeriods());
    setHydrated(true);
    setReminderStatus(reminderStatusLabel());
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
    localStorage.setItem(HOLIDAYS_KEY, JSON.stringify(holidayStore));
  }, [holidayStore, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PERIODS_KEY, JSON.stringify(periods));
  }, [periods, hydrated]);

  const year = view.getFullYear();
  const todayYear = fromIso(today).getFullYear();

  const syncHolidays = useCallback(async (years: number[], force = false) => {
    const unique = [...new Set(years)];
    await Promise.all(
      unique.map(async (target) => {
        const cached = holidayStoreRef.current[String(target)];
        const fresh =
          cached?.source === "live" && Date.now() - cached.fetchedAt < HOLIDAY_STALE_MS;
        if (!force && fresh) return;
        try {
          const { getHolidays } = await import("@/lib/calendar-server");
          const result = await getHolidays({ data: { year: target } });
          setHolidayStore((prev) => {
            if (!result.live && prev[String(target)]?.source === "live") return prev;
            return {
              ...prev,
              [String(target)]: {
                events: result.events,
                fetchedAt: Date.now(),
                source: result.live ? "live" : "fallback",
              },
            };
          });
        } catch {
          setHolidayStore((prev) => {
            if (prev[String(target)]) return prev;
            return {
              ...prev,
              [String(target)]: {
                events: fallbackHolidays(target),
                fetchedAt: Date.now(),
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
    return whenIdle(() => {
      void syncHolidays([todayYear]);
    });
  }, [hydrated, todayYear, syncHolidays]);

  const syncGoogle = useCallback(async (opts?: { login?: boolean }) => {
    setGooglePending(false);
    try {
      const bounds = monthBounds(viewRef.current);
      const { getGoogleMonth } = await import("@/lib/calendar-server");
      const result = await getGoogleMonth({ data: bounds });
      if (result.pending) {
        setGooglePending(true);
        setGoogleStatus("Conectando à agenda…");
        return;
      }
      if (opts?.login && result.loginRequired) {
        redirectToLoginIfRequired({
          ok: false,
          data: null,
          loginRequired: true,
          loginUrl: result.loginUrl,
        });
        setGoogleStatus("Continue com o Grok para carregar a agenda.");
        return;
      }
      if (!result.ok) {
        const raw = (result.errorMessage ?? "").toLowerCase();
        if (raw.includes("not_connected") || raw.includes("failed_precondition")) {
          setGoogleStatus("Conecte o Google Agenda no Grok para puxar seus eventos.");
        } else if (raw.includes("missing_connector_token")) {
          setGoogleStatus("Abra o app pelo Grok para puxar a agenda.");
        } else if (raw.includes("login")) {
          setGoogleStatus("Continue com o Grok para carregar a agenda.");
        } else {
          setGoogleStatus("Não foi possível ler a agenda agora.");
        }
        return;
      }
      setGoogleEvents(result.events);
      setGoogleStatus(
        result.events.length
          ? `${result.events.length} compromisso${result.events.length === 1 ? "" : "s"} do Google.`
          : "Agenda conectada. Nenhum compromisso no período.",
      );
    } catch {
      setGoogleStatus("Não foi possível ler a agenda.");
    }
  }, []);

  useRefetchWhenConnectorReady(googlePending, () => syncGoogle());

  const holidays = useMemo(
    () => holidaysForYears(holidayStore, [year, todayYear]),
    [holidayStore, year, todayYear],
  );
  const extraHolidays = useMemo(() => {
    const list: CalEvent[] = [];
    if (settings.commemorative) list.push(...commemorativeDates(year));
    if (settings.elections) list.push(...electionDates(year));
    if (settings.municipal) list.push(...municipalEvents);
    return list;
  }, [settings.commemorative, settings.elections, settings.municipal, municipalEvents, year]);
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
        ...googleEvents,
      ]),
    [localEvents, benefitEvents, holidays, extraHolidays, googleEvents],
  );
  const cells = useMemo(() => buildMonthCells(view, today, allEvents), [view, today, allEvents]);
  const periodIsos = useMemo(() => {
    const set = new Set<string>();
    for (const period of periods) {
      for (const iso of expandPeriod(period)) set.add(iso);
    }
    return set;
  }, [periods]);
  const monthEvents = useMemo(() => {
    const month = view.getMonth();
    return allEvents
      .flatMap((event) => {
        if (event.source === "holiday" || event.source === "birthday" || event.source === "benefit")
          return [];
        if (
          event.kind === "semanal" ||
          event.kind === "mensal" ||
          event.kind === "semestral" ||
          event.kind === "anual"
        ) {
          const iso = occurrenceInMonth(event, year, month);
          return iso ? [{ event, iso }] : [];
        }
        const date = fromIso(event.iso);
        if (date.getFullYear() !== year || date.getMonth() !== month) return [];
        return [{ event, iso: event.iso }];
      })
      .sort(
        (a, b) =>
          a.iso.localeCompare(b.iso) || (a.event.time ?? "").localeCompare(b.event.time ?? ""),
      );
  }, [allEvents, view, year]);
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

  useEffect(() => {
    if (!settings.municipal || !settings.cityIbge) {
      setMunicipalEvents([]);
      return;
    }
    const ibge = settings.cityIbge;
    const city = settings.cityName;
    let cancelled = false;
    void import("@/lib/calendar-server").then(async ({ getMunicipalHolidays }) => {
      try {
        const events = await getMunicipalHolidays({
          data: { year, ibge, city: city || "Cidade" },
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
  }, [settings.municipal, settings.cityIbge, settings.cityName, year]);

  function pickCity(city: { ibge: number; name: string; uf: string }) {
    setSettings((prev) => ({
      ...prev,
      municipal: true,
      cityName: city.name,
      cityIbge: city.ibge,
      cityUf: city.uf,
    }));
  }

  function locateCity(): Promise<{ ibge: number; name: string; uf: string } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          void import("@/lib/calendar-server").then(async ({ locateMunicipio }) => {
            const city = await locateMunicipio({
              data: { lat: pos.coords.latitude, lon: pos.coords.longitude },
            });
            resolve(city ?? null);
          });
        },
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 600_000 },
      );
    });
  }

  useEffect(() => {
    if (!hydrated) return;
    return whenIdle(() => {
      startReminders([...localEvents, ...googleEvents]);
    });
  }, [hydrated, localEvents, googleEvents]);

  const monthOptions = MONTHS.map((name, index) => ({ value: index, label: name }));
  const yearOptions = Array.from({ length: 101 }, (_, i) => {
    const item = 2000 + i;
    return { value: item, label: String(item) };
  });

  function applyView(next: Date) {
    setView(next);
    const nextMonth = next.getMonth();
    const nextYear = next.getFullYear();
    const selectedDate = fromIso(selectedRef.current);
    if (selectedDate.getMonth() !== nextMonth || selectedDate.getFullYear() !== nextYear) {
      const iso = todayIso();
      const todayDate = fromIso(iso);
      if (todayDate.getMonth() === nextMonth && todayDate.getFullYear() === nextYear) {
        setSelected(iso);
      } else {
        setSelected(`${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-01`);
      }
    }
    setAdding(false);
    setOpenEventId(null);
    setOpenHolidayIso(null);
    setOpenPeriodId(null);
    setOpenBirthdayId(null);
    setOpenBenefitId(null);
    setEditingEventId(null);
  }

  function jumpTo(next: Date) {
    applyView(next);
    setOpenMenu(null);
  }

  useEffect(() => {
    const node = swipeRef.current;
    if (!node) return;
    function onPointerDown(event: PointerEvent) {
      if (
        (event.target as HTMLElement).closest("button") &&
        !(event.target as HTMLElement).closest(".cal-cell")
      ) {
        return;
      }
      pointerStart.current = { x: event.clientX, y: event.clientY };
    }
    function onPointerUp(event: PointerEvent) {
      const start = pointerStart.current;
      pointerStart.current = null;
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < 48 && absY < 48) return;
      if (absX >= absY) applyView(shiftMonth(viewRef.current, dx < 0 ? 1 : -1));
      else applyView(shiftMonth(viewRef.current, dy < 0 ? 1 : -1));
    }
    function onWheel(event: WheelEvent) {
      const now = Date.now();
      if (now - lastWheel.current < 420) {
        event.preventDefault();
        return;
      }
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX < 8 && absY < 8) return;
      event.preventDefault();
      lastWheel.current = now;
      if (absX > absY) applyView(shiftMonth(viewRef.current, event.deltaX > 0 ? 1 : -1));
      else applyView(shiftMonth(viewRef.current, event.deltaY > 0 ? 1 : -1));
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

  function addEvent() {
    const title = draftTitle.trim();
    if (!title) return;
    setLocalEvents((prev) => [
      ...prev,
      {
        id: newEventId(),
        iso: selected,
        title,
        time: draftTime,
        place: draftPlace.trim() || undefined,
        kind: draftKind ?? undefined,
        notify: draftNotify,
        source: "local",
      },
    ]);
    setDraftTitle("");
    setDraftPlace("");
    setDraftKind(null);
    setDraftNotify(false);
    setAdding(false);
  }

  function removeEvent(id: string) {
    setLocalEvents((prev) => prev.filter((event) => event.id !== id));
  }

  function updateEvent(id: string, patch: Partial<CalEvent>) {
    setLocalEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...patch } : event)),
    );
  }

  function selectFromGrid(iso: string) {
    setSelected(iso);
    const hits = allEvents.filter((event) => eventMatchesIso(event, iso));
    const agenda = hits.find((event) => event.source === "local" || event.source === "google");
    const holiday = hits.find((event) => event.source === "holiday");
    const birthday = hits.find((event) => event.source === "birthday");
    const benefit = hits.find((event) => event.source === "benefit");
    const period = periods.find((item) => expandPeriod(item).includes(iso));
    setOpenEventId(agenda?.id ?? null);
    setOpenHolidayIso(holiday?.id ?? null);
    setOpenPeriodId(period?.id ?? null);
    setOpenBirthdayId(birthday?.id ?? null);
    setOpenBenefitId(benefit?.id ?? null);
    setEditingEventId(null);
  }

  function openAgendaItem(event: CalEvent, iso = event.iso) {
    setSelected(iso);
    const date = fromIso(iso);
    setView(new Date(date.getFullYear(), date.getMonth(), 1));
    setOpenEventId((id) => (id === event.id ? null : event.id));
    setEditingEventId(null);
    setOpenHolidayIso(null);
    setOpenPeriodId(null);
    setOpenBirthdayId(null);
    setOpenBenefitId(null);
  }

  function beginEditEvent(event: CalEvent, iso: string) {
    setEditingEventId((id) => (id === event.id ? null : event.id));
    setDraftTitle(event.title);
    setDraftPlace(event.place ?? "");
    setDraftTime(event.time ?? "09:00");
    setDraftKind(event.kind ?? null);
    setDraftNotify(Boolean(event.notify));
    setDraftDate(iso);
    setAdding(false);
  }

  function saveEditEvent() {
    const title = draftTitle.trim();
    if (!title || !editingEventId) return;
    updateEvent(editingEventId, {
      title,
      iso: draftDate,
      time: draftTime,
      place: draftPlace.trim() || undefined,
      kind: draftKind ?? undefined,
      notify: draftNotify,
    });
    setEditingEventId(null);
    setSelected(draftDate);
    const date = fromIso(draftDate);
    setView(new Date(date.getFullYear(), date.getMonth(), 1));
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

  async function downloadProjectBackup() {
    if (backupBusy) return;
    setBackupBusy(true);
    try {
      const res = await fetch("/api/backup");
      if (!res.ok) throw new Error("backup");
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = "calendae-backup.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 4000);
    } catch {
      window.alert("Por aqui o preview não deixa salvar no PC. Baixe o arquivo que aparece no chat.");
    } finally {
      setBackupBusy(false);
    }
  }

  return (
    <div data-theme="clareira" className="cal-app min-h-dvh bg-bg font-body text-fg">
      <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col">
        <header className="px-5 pt-[max(1.1rem,env(safe-area-inset-top))] pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-end gap-5">
              <HeaderMenu
                label="Escolher mês"
                value={view.getMonth()}
                options={monthOptions}
                open={openMenu === "month"}
                wide
                buttonClassName="cal-month-btn capitalize"
                onOpen={() => setOpenMenu("month")}
                onClose={() => setOpenMenu(null)}
                onPick={(month) => jumpTo(new Date(year, month, 1))}
              />
              <HeaderMenu
                label="Escolher ano"
                value={year}
                options={yearOptions}
                open={openMenu === "year"}
                buttonClassName="cal-year-btn"
                onOpen={() => setOpenMenu("year")}
                onClose={() => setOpenMenu(null)}
                onPick={(nextYear) => jumpTo(new Date(nextYear, view.getMonth(), 1))}
              />
            </div>
            <div className="flex shrink-0 items-center">
              {SHOW_DEV_BACKUP ? (
                <a
                  href="/calendae-backup.zip"
                  download="calendae-backup.zip"
                  aria-label="Baixar backup"
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                >
                  <Download className="size-5" />
                </a>
              ) : null}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Ajustes"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings2 className="size-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex w-full flex-1 flex-col gap-3 overflow-y-auto px-4 pb-[max(1.1rem,env(safe-area-inset-bottom))]">
          <section
            ref={swipeRef}
            className="cal-swipe overflow-hidden rounded-panel bg-surface shadow-panel"
          >
            <MonthGrid
              cells={cells}
              selectedIso={selected}
              today={today}
              periodIsos={periodIsos}
              weekStart="sunday"
              saturdayTint={false}
              sundayTint={false}
              holidayTint={true}
              onSelect={selectFromGrid}
            />
          </section>

          <HolidaysTab
            year={year}
            month={view.getMonth()}
            today={today}
            openId={openHolidayIso}
            cache={holidayStore[String(year)]}
            extras={extraHolidays}
            municipal={settings.municipal}
            commemorative={settings.commemorative}
            elections={settings.elections}
            cityName={settings.cityName}
            cityUf={settings.cityUf}
            cityIbge={settings.cityIbge}
            onToggleMunicipal={(on) => {
              setSettings((prev) => ({ ...prev, municipal: on }));
            }}
            onToggleCommemorative={(on) => {
              setSettings((prev) => ({ ...prev, commemorative: on }));
            }}
            onToggleElections={(on) => {
              setSettings((prev) => ({ ...prev, elections: on }));
            }}
            onSearchCity={async (query, uf) => {
              const { searchMunicipio } = await import("@/lib/calendar-server");
              return searchMunicipio({ data: { query, uf } });
            }}
            onPickCity={pickCity}
            onLocate={locateCity}
            onOpen={(event) => {
              setSelected(event.iso);
              setOpenHolidayIso((cur) => (cur === event.id ? null : event.id));
              setOpenEventId(null);
              setOpenPeriodId(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
            }}
          />

          <section className="cal-tab">
            <div className="cal-tab-head">
              <h2 className="cal-tab-title">Agenda</h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Novo compromisso"
                onClick={() => {
                  setDraftNotify(false);
                  setAdding((v) => !v);
                }}
              >
                <CalendarGlyph className="size-5" />
              </Button>
            </div>

            {adding ? (
              <form
                className="mt-3 flex flex-col gap-2 border-t border-line pt-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  addEvent();
                }}
              >
                <p className="text-sm text-muted">
                  Em {fromIso(selected).getDate()} de{" "}
                  <span className="capitalize">{MONTHS[fromIso(selected).getMonth()]}</span>
                </p>
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="Compromisso"
                  className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                  autoFocus
                />
                <input
                  value={draftPlace}
                  onChange={(event) => setDraftPlace(event.target.value)}
                  placeholder="Local"
                  className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                />
                <p className="text-xs text-muted">Tipo</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {EVENT_KINDS.map((kind) => {
                    const on = draftKind === kind;
                    return (
                      <button
                        key={kind}
                        type="button"
                        aria-pressed={on}
                        className="flex h-11 items-center gap-2 text-sm text-fg"
                        onClick={() => setDraftKind(on ? null : kind)}
                      >
                        {kind}
                        <KindMark on={on} />
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-end">
                  <TimePick value={draftTime} onChange={setDraftTime} />
                  <NotifyToggle on={draftNotify} onToggle={() => void armNotify(!draftNotify)} />
                </div>
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
                  return (
                    <li key={event.id}>
                      <button
                        type="button"
                        onClick={() => openAgendaItem(event, iso)}
                        className={cn(
                          "flex w-full items-baseline gap-3 border-t border-line py-3 text-left",
                          past && "opacity-55",
                        )}
                      >
                        <span
                          className={cn(
                            "cal-agenda-tone w-8 shrink-0 tabular-nums text-sm",
                            open ? "text-today" : "text-muted",
                          )}
                        >
                          {String(day.getDate()).padStart(2, "0")}
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
                          {event.kind ? <span>({event.kind})</span> : null}
                          {event.time ? (
                            <span>{formatTime(event.time)}</span>
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
                                saveEditEvent();
                              }}
                            >
                              <input
                                value={draftTitle}
                                onChange={(change) => setDraftTitle(change.target.value)}
                                placeholder="Compromisso"
                                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                              />
                              <input
                                value={draftPlace}
                                onChange={(change) => setDraftPlace(change.target.value)}
                                placeholder="Local"
                                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                              />
                              <input
                                type="date"
                                value={draftDate}
                                onChange={(change) => setDraftDate(change.target.value)}
                                className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none"
                              />
                              <p className="text-xs text-muted">Tipo</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {EVENT_KINDS.map((kind) => {
                                  const on = draftKind === kind;
                                  return (
                                    <button
                                      key={kind}
                                      type="button"
                                      aria-pressed={on}
                                      className="flex h-11 items-center gap-2 text-sm text-fg"
                                      onClick={() => setDraftKind(on ? null : kind)}
                                    >
                                      {kind}
                                      <KindMark on={on} />
                                    </button>
                                  );
                                })}
                              </div>
                                <div className="flex items-center justify-end">
                                  <TimePick value={draftTime} onChange={setDraftTime} />
                                  <NotifyToggle
                                    on={draftNotify}
                                    onToggle={() => void armNotify(!draftNotify)}
                                  />
                                </div>
                                <Button type="submit" className="w-full">
                                  Anotar
                                </Button>
                            </form>
                          ) : (
                            <p className="min-w-0 pb-3 pl-11 text-xs text-muted">
                              {[
                                event.place,
                                weekdayName(iso),
                                event.kind ? `(${event.kind})` : "",
                                event.time ? formatTime(event.time) : "",
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                          {event.source === "local" ? (
                            <div className="flex items-center justify-end pb-3">
                              <NotifyToggle
                                on={Boolean(event.notify)}
                                onToggle={() => void toggleEventNotify(event)}
                              />
                              <button
                                type="button"
                                aria-label={`Editar ${event.title}`}
                                className="flex size-8 shrink-0 items-center justify-center text-muted"
                                onClick={() => beginEditEvent(event, iso)}
                              >
                                <Pencil className="size-4" />
                              </button>
                              <button
                                type="button"
                                aria-label={`Apagar ${event.title}`}
                                className="flex size-8 shrink-0 items-center justify-center text-muted"
                                onClick={() => {
                                  removeEvent(event.id);
                                  setOpenEventId(null);
                                  setEditingEventId(null);
                                }}
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <PeriodsTab
            year={year}
            month={view.getMonth()}
            selectedIso={selected}
            openId={openPeriodId}
            periods={periods}
            onAdd={(period) => setPeriods((prev) => [...prev, period])}
            onRemove={(id) => {
              setPeriods((prev) => prev.filter((item) => item.id !== id));
              setOpenPeriodId(null);
            }}
            onUpdate={(period) => {
              setPeriods((prev) => prev.map((item) => (item.id === period.id ? period : item)));
              setSelected(period.startIso);
            }}
            onOpen={(id, iso) => {
              setSelected(iso);
              setOpenPeriodId((cur) => (cur === id ? null : id));
              setOpenEventId(null);
              setOpenHolidayIso(null);
              setOpenBirthdayId(null);
              setOpenBenefitId(null);
            }}
          />

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
              setOpenPeriodId(null);
              setOpenBenefitId(null);
            }}
          />

          <BenefitsTab
            year={year}
            month={view.getMonth()}
            today={today}
            openId={openBenefitId}
            benefits={benefits}
            onAdd={(event) => setLocalEvents((prev) => [...prev, event])}
            onRemove={(id) => {
              removeEvent(id);
              setOpenBenefitId(null);
            }}
            onUpdate={(event) => {
              updateEvent(event.id, event);
            }}
            onOpen={(event, iso) => {
              const date = fromIso(iso);
              setView(new Date(date.getFullYear(), date.getMonth(), 1));
              setSelected(iso);
              setOpenBenefitId((cur) => (cur === event.id ? null : event.id));
              setOpenEventId(null);
              setOpenHolidayIso(null);
              setOpenPeriodId(null);
              setOpenBirthdayId(null);
            }}
          />
        </div>

        {settingsOpen ? (
          <Suspense fallback={null}>
            <SettingsPanel
              onClose={() => setSettingsOpen(false)}
              googleStatus={googleStatus}
              holidayCache={holidayStore[String(year)]}
              reminderStatus={reminderStatus}
              remindersBusy={remindersBusy}
              onSyncGoogle={() => {
                void syncGoogle({ login: true });
              }}
              onEnableReminders={() => {
                setRemindersBusy(true);
                setReminderStatus("Pedindo permissão no celular…");
                void enableReminders()
                  .then((message) => {
                    setReminderStatus(message);
                    startReminders([...localEvents, ...googleEvents]);
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
