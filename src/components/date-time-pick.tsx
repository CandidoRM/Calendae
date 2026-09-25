import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { MONTHS, civilDate, fromIso, toIso, weekLabels, YEAR_MAX, YEAR_MIN } from "@/lib/calendar";
import { cn, withTip } from "@/lib/utils";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function validDate(year: number, month: number, day: number): string | null {
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  if (year < YEAR_MIN || year > YEAR_MAX || month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = civilDate(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return toIso(date);
}

function split12(time: string): { hour: string; minute: string; ap: "am" | "pm" } {
  const [hRaw, mRaw] = time.split(":");
  const hours24 = Number(hRaw);
  const minutes = Number(mRaw ?? 0);
  const ap: "am" | "pm" = hours24 >= 12 ? "pm" : "am";
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return { hour: pad(hour12), minute: pad(Number.isFinite(minutes) ? minutes : 0), ap };
}

function join12(hour: string, minute: string, ap: "am" | "pm"): string | null {
  if (hour.length < 2 || minute.length < 2) return null;
  let hours = Number(hour);
  const mins = Number(minute);
  if (!Number.isFinite(hours) || !Number.isFinite(mins) || mins > 59) return null;
  if (hours < 1 || hours > 12) return null;
  if (ap === "am") hours = hours === 12 ? 0 : hours;
  else hours = hours === 12 ? 12 : hours + 12;
  return `${pad(hours)}:${pad(mins)}`;
}

function selectAll(el: HTMLInputElement | null) {
  if (!el) return;
  el.focus();
  el.setSelectionRange(0, el.value.length);
}

function nextFormInput(from: HTMLElement, selector: string): HTMLElement | null {
  const form = from.closest("form") ?? document.body;
  const nodes = [...form.querySelectorAll<HTMLElement>(selector)];
  const i = nodes.indexOf(from);
  return i >= 0 ? nodes[i + 1] ?? null : null;
}

function PickerPop({
  anchor,
  children,
  onClose,
}: {
  anchor: HTMLElement | null;
  children: ReactNode;
  onClose: () => void;
}) {
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const box = anchor?.getBoundingClientRect();
    const pop = popRef.current?.getBoundingClientRect();
    if (!box) return;
    const height = pop?.height ?? 220;
    const width = pop?.width ?? 220;
    const below = box.bottom + 8;
    const top = below + height > window.innerHeight - 12 ? Math.max(12, box.top - height - 8) : below;
    const left = Math.min(Math.max(12, box.left), window.innerWidth - width - 12);
    setPos({ top, left });
  }, [anchor]);

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      const node = event.target as Node;
      if (popRef.current?.contains(node) || anchor?.contains(node)) return;
      onClose();
    }
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [anchor, onClose]);

  return createPortal(
    <div ref={popRef} className="cal-dt-pop" style={{ top: pos.top, left: pos.left }} role="dialog">
      {children}
    </div>,
    document.body,
  );
}

function DateCal({
  value,
  weekStart = "sunday",
  onPick,
}: {
  value: string;
  weekStart?: "sunday" | "monday";
  onPick: (iso: string) => void;
}) {
  const selected = fromIso(value);
  const [cursor, setCursor] = useState(() => civilDate(selected.getFullYear(), selected.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDow = civilDate(year, month, 1).getDay();
  const offset = weekStart === "sunday" ? firstDow : (firstDow + 6) % 7;
  const last = civilDate(year, month + 1, 0).getDate();
  const cells = [...Array(offset).fill(null), ...Array.from({ length: last }, (_, i) => i + 1)];

  return (
    <div className="cal-dt-cal">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button type="button" className="cal-dt-nav" aria-label="Mês anterior" onClick={() => setCursor(civilDate(year, month - 1, 1))}>
          <ChevronLeft className="size-4" />
        </button>
        <p className="m-0 flex-1 text-center text-sm capitalize text-fg">
          {MONTHS[month]} {year}
        </p>
        <button type="button" className="cal-dt-nav" aria-label="Próximo mês" onClick={() => setCursor(civilDate(year, month + 1, 1))}>
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="cal-dt-mini">
        {weekLabels(weekStart).map((label) => (
          <span key={label} className="cal-dt-dow">
            {label}
          </span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`e-${i}`} />;
          const iso = toIso(civilDate(year, month, day));
          return (
            <button
              key={iso}
              type="button"
              className={cn("cal-dt-day", iso === value && "is-on")}
              onClick={() => onPick(iso)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TimeCal({ value, onPick }: { value: string; onPick: (time: string) => void }) {
  const parts = split12(value);
  const hourRef = useRef<HTMLButtonElement>(null);
  const minuteRef = useRef<HTMLButtonElement>(null);
  const apRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    for (const el of [hourRef.current, minuteRef.current, apRef.current]) {
      const col = el?.parentElement;
      if (!col || !el) continue;
      col.scrollTop = el.offsetTop - col.clientHeight / 2 + el.offsetHeight / 2;
    }
  }, []);

  function pick(hour: string, minute: string, ap: "am" | "pm") {
    const joined = join12(hour, minute, ap);
    if (joined) onPick(joined);
  }

  return (
    <div className="cal-dt-clock">
      <div className="cal-dt-col">
        {Array.from({ length: 12 }, (_, i) => {
          const h = pad(i + 1);
          return (
            <button
              key={h}
              type="button"
              ref={h === parts.hour ? hourRef : undefined}
              className={cn("cal-dt-tick", h === parts.hour && "is-on")}
              onClick={() => pick(h, parts.minute, parts.ap)}
            >
              {h}
            </button>
          );
        })}
      </div>
      <div className="cal-dt-col">
        {Array.from({ length: 60 }, (_, m) => (
          <button
            key={m}
            type="button"
            ref={pad(m) === parts.minute ? minuteRef : undefined}
            className={cn("cal-dt-tick", pad(m) === parts.minute && "is-on")}
            onClick={() => pick(parts.hour, pad(m), parts.ap)}
          >
            {pad(m)}
          </button>
        ))}
      </div>
      <div className="cal-dt-col cal-dt-col-ap">
        {(["am", "pm"] as const).map((mer) => (
          <button
            key={mer}
            type="button"
            ref={mer === parts.ap ? apRef : undefined}
            className={cn("cal-dt-tick", mer === parts.ap && "is-on")}
            onClick={() => pick(parts.hour, parts.minute, mer)}
          >
            {mer}
          </button>
        ))}
      </div>
    </div>
  );
}

type SegKind = "day" | "month" | "year" | "hour" | "minute";

function earlyPad(kind: SegKind, digit: string): string | null {
  const n = Number(digit);
  if (!Number.isFinite(n)) return null;
  if (kind === "day" && n >= 4) return pad(n);
  if (kind === "month" && n >= 2) return pad(n);
  if (kind === "hour" && n >= 2) return pad(n);
  if (kind === "minute" && n >= 6) return pad(n);
  return null;
}

function clampSeg(kind: SegKind, raw: string): string {
  const n = Number(raw);
  if (kind === "day") return pad(Math.min(31, Math.max(1, n || 1)));
  if (kind === "month") return pad(Math.min(12, Math.max(1, n || 1)));
  if (kind === "hour") return pad(Math.min(12, Math.max(1, n || 1)));
  if (kind === "minute") return pad(Math.min(59, Math.max(0, Number.isFinite(n) ? n : 0)));
  return raw.replace(/\D/g, "").slice(0, 4).padStart(4, "0");
}

export function YearSeg({
  value,
  label = "Ano",
  className,
  onChange,
  onComplete,
}: {
  value: string;
  label?: string;
  className?: string;
  onChange: (next: string) => void;
  onComplete?: (next: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Seg
      value={value}
      max={4}
      kind="year"
      label={label}
      wide
      className={className}
      inputRef={ref}
      onChange={(next) => {
        onChange(next);
        if (next.length >= 4) onComplete?.(next);
      }}
      onFull={() => {}}
      onBack={() => {
        const el = ref.current;
        if (el) el.setSelectionRange(0, el.value.length);
      }}
    />
  );
}

function Seg({
  value,
  max,
  kind,
  label,
  wide,
  className,
  inputRef,
  onChange,
  onFull,
  onBack,
}: {
  value: string;
  max: number;
  kind: SegKind;
  label: string;
  wide?: boolean;
  className?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (next: string) => void;
  onFull: () => void;
  onBack: () => void;
}) {
  const liveRef = useRef(value);
  const eatenRef = useRef(false);
  useEffect(() => {
    liveRef.current = value;
  }, [value]);

  function selectAllHere(el: HTMLInputElement) {
    el.setSelectionRange(0, el.value.length);
  }

  function applyDigit(digit: string) {
    const current = liveRef.current.replace(/\D/g, "");
    const el = inputRef.current;
    const allSelected = !el || (el.selectionStart === 0 && el.selectionEnd === el.value.length);
    const startFresh = allSelected || current.length >= max;

    if (startFresh) {
      const early = earlyPad(kind, digit);
      if (early) {
        liveRef.current = early;
        onChange(early);
        queueMicrotask(onFull);
        return;
      }
      liveRef.current = digit;
      onChange(digit);
      return;
    }

    const next = (current + digit).slice(0, max);
    if (next.length >= max) {
      const done = clampSeg(kind, next);
      liveRef.current = done;
      onChange(done);
      queueMicrotask(onFull);
      return;
    }
    liveRef.current = next;
    onChange(next);
  }

  function onKey(event: KeyboardEvent<HTMLInputElement>) {
    if (["/", ":", ".", "-", " ", "Delete"].includes(event.key)) {
      event.preventDefault();
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      onBack();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onFull();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onBack();
      return;
    }
    if (/^\d$/.test(event.key)) {
      event.preventDefault();
      if (!eatenRef.current) applyDigit(event.key);
      eatenRef.current = false;
    }
  }

  return (
    <input
      ref={inputRef}
      value={value}
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      aria-label={label}
      className={cn("cal-seg", wide && "is-year", className)}
      onFocus={(event) => {
        const el = event.currentTarget;
        requestAnimationFrame(() => {
          if (document.activeElement === el) selectAllHere(el);
        });
      }}
      onPointerUp={(event) => selectAllHere(event.currentTarget)}
      onBlur={() => {
        if (liveRef.current.length < max && liveRef.current.length > 0) {
          const done = clampSeg(kind, liveRef.current);
          liveRef.current = done;
          onChange(done);
        }
      }}
      onCut={(event) => event.preventDefault()}
      onPaste={(event) => event.preventDefault()}
      onBeforeInput={(event) => {
        event.preventDefault();
        const type = event.nativeEvent.inputType ?? "";
        const data = event.nativeEvent.data ?? "";
        if (type.startsWith("delete")) return;
        if (data && /^\d+$/.test(data)) {
          eatenRef.current = true;
          for (const ch of data) applyDigit(ch);
        }
      }}
      onChange={() => {
        /* digits handled in onBeforeInput */
      }}
      onKeyDown={onKey}
    />
  );
}

export function DatePick({
  value,
  weekStart = "sunday",
  onChange,
}: {
  value: string;
  weekStart?: "sunday" | "monday";
  onChange: (next: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const date = fromIso(value);
  const [day, setDay] = useState(() => pad(date.getDate()));
  const [month, setMonth] = useState(() => pad(date.getMonth() + 1));
  const [year, setYear] = useState(() => String(date.getFullYear()));

  useEffect(() => {
    const next = fromIso(value);
    setDay(pad(next.getDate()));
    setMonth(pad(next.getMonth() + 1));
    setYear(String(next.getFullYear()));
  }, [value]);

  function emit(d: string, m: string, y: string) {
    if (d.length < 2 || m.length < 2 || y.length < 4) return;
    const iso = validDate(Number(y), Number(m), Number(d));
    if (iso) onChange(iso);
  }

  function jumpTime() {
    const hour = nextFormInput(yearRef.current ?? wrapRef.current!, "input.cal-seg");
    if (hour) selectAll(hour as HTMLInputElement);
  }

  return (
    <div ref={wrapRef} className="cal-date-wrap">
      <span className="cal-date-shell" aria-hidden="true" />
      <div className="cal-date-text">
        <Seg
          value={day}
          max={2}
          kind="day"
          label="Dia"
          inputRef={dayRef}
          onChange={(next) => {
            setDay(next);
            emit(next, month, year);
          }}
          onFull={() => monthRef.current?.focus()}
          onBack={() => dayRef.current?.focus()}
        />
        <span className="cal-sep" aria-hidden="true">
          /
        </span>
        <Seg
          value={month}
          max={2}
          kind="month"
          label="Mês"
          inputRef={monthRef}
          onChange={(next) => {
            setMonth(next);
            emit(day, next, year);
          }}
          onFull={() => yearRef.current?.focus()}
          onBack={() => dayRef.current?.focus()}
        />
        <span className="cal-sep" aria-hidden="true">
          /
        </span>
        <Seg
          value={year}
          max={4}
          kind="year"
          label="Ano"
          wide
          inputRef={yearRef}
          onChange={(next) => {
            setYear(next);
            emit(day, month, next);
          }}
          onFull={jumpTime}
          onBack={() => monthRef.current?.focus()}
        />
      </div>
      <button type="button" {...withTip("Data", "cal-date-icon")} aria-label="Escolher data" onClick={() => setOpen((v) => !v)}>
        <Calendar className="size-4" />
      </button>
      {open ? (
        <PickerPop anchor={wrapRef.current} onClose={() => setOpen(false)}>
          <DateCal
            value={value}
            weekStart={weekStart}
            onPick={(iso) => {
              onChange(iso);
              setOpen(false);
            }}
          />
        </PickerPop>
      ) : null}
    </div>
  );
}

export function TimePick({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const apRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const parts = split12(value);
  const [hour, setHour] = useState(parts.hour);
  const [minute, setMinute] = useState(parts.minute);
  const [ap, setAp] = useState<"am" | "pm">(parts.ap);

  useEffect(() => {
    if (wrapRef.current?.contains(document.activeElement)) return;
    const next = split12(value);
    setHour(next.hour);
    setMinute(next.minute);
    setAp(next.ap);
  }, [value]);

  function emit(h: string, m: string, mer: "am" | "pm") {
    const joined = join12(h, m, mer);
    if (joined) onChange(joined);
  }

  return (
    <div ref={wrapRef} className="cal-time-wrap">
      <span className="cal-time-shell" aria-hidden="true" />
      <div className="cal-time-text">
        <Seg
          value={hour}
          max={2}
          kind="hour"
          label="Hora"
          inputRef={hourRef}
          onChange={(next) => {
            setHour(next);
            emit(next, minute, ap);
          }}
          onFull={() => minuteRef.current?.focus()}
          onBack={() => hourRef.current?.focus()}
        />
        <span className="cal-sep" aria-hidden="true">
          :
        </span>
        <Seg
          value={minute}
          max={2}
          kind="minute"
          label="Minuto"
          inputRef={minuteRef}
          onChange={(next) => {
            setMinute(next);
            emit(hour, next, ap);
          }}
          onFull={() => apRef.current?.focus()}
          onBack={() => hourRef.current?.focus()}
        />
        <button
          ref={apRef}
          type="button"
          className="cal-ap"
          aria-label="AM ou PM"
          onClick={() => {
            const next = ap === "am" ? "pm" : "am";
            setAp(next);
            emit(hour, minute, next);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              selectAll(minuteRef.current);
            }
            if (event.key === "a" || event.key === "A") {
              event.preventDefault();
              setAp("am");
              emit(hour, minute, "am");
            }
            if (event.key === "p" || event.key === "P") {
              event.preventDefault();
              setAp("pm");
              emit(hour, minute, "pm");
            }
            if (event.key === " " || event.key === "Enter" || event.key === "ArrowUp" || event.key === "ArrowDown") {
              event.preventDefault();
              const next = ap === "am" ? "pm" : "am";
              setAp(next);
              emit(hour, minute, next);
            }
          }}
        >
          {ap}
        </button>
      </div>
      <button type="button" {...withTip("Horário", "cal-time-icon")} aria-label="Escolher horário" onClick={() => setOpen((v) => !v)}>
        <Clock className="size-4" />
      </button>
      {open ? (
        <PickerPop anchor={wrapRef.current} onClose={() => setOpen(false)}>
          <TimeCal
            value={value}
            onPick={(time) => {
              onChange(time);
            }}
          />
        </PickerPop>
      ) : null}
    </div>
  );
}
