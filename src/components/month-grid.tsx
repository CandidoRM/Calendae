import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import {
  cellLook,
  eventMarksGrid,
  weekLabels,
  type CalCell,
  type WeekStart,
} from "@/lib/calendar";

type MonthGridProps = {
  cells: CalCell[];
  selectedIso: string;
  today: string;
  periodIsos: Set<string>;
  weekStart: WeekStart;
  saturdayTint: boolean;
  sundayTint: boolean;
  holidayTint: boolean;
  onSelect: (iso: string) => void;
  onHold?: (iso: string) => void;
};

export function MonthGrid({
  cells,
  selectedIso,
  today,
  periodIsos,
  weekStart,
  saturdayTint,
  sundayTint,
  holidayTint,
  onSelect,
  onHold,
}: MonthGridProps) {
  const held = useRef<string | null>(null);
  const press = useRef<number | null>(null);

  function clearPress() {
    if (press.current != null) window.clearTimeout(press.current);
    press.current = null;
  }

  function holdStart(iso: string, event: ReactPointerEvent<HTMLButtonElement>) {
    if (!onHold || event.button !== 0) return;
    const startX = event.clientX;
    const startY = event.clientY;
    clearPress();
    press.current = window.setTimeout(() => {
      press.current = null;
      held.current = iso;
      onHold(iso);
    }, 1000);
    const move = (next: PointerEvent) => {
      if (Math.hypot(next.clientX - startX, next.clientY - startY) > 12) {
        clearPress();
        window.removeEventListener("pointermove", move);
      }
    };
    const up = () => {
      clearPress();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  return (
    <div className="cal-month-grid">
      {weekLabels(weekStart).map((label, i) => (
        <div key={`${label}-${i}`} className="cal-dow">
          {label}
        </div>
      ))}
      {cells.map((cell) => {
        const selected = cell.iso === selectedIso;
        const inPeriod = periodIsos.has(cell.iso) && cell.inMonth;
        const look = cellLook(cell, selected, inPeriod, saturdayTint, sundayTint, holidayTint, today);
        const hasMark = cell.events.some((event) => eventMarksGrid(event, cell.iso));
        const hasBirthday = cell.events.some((event) => event.source === "birthday");
        return (
          <button
            key={cell.iso}
            type="button"
            aria-current={cell.isToday ? "date" : undefined}
            aria-pressed={selected}
            aria-label={`${cell.day}`}
            className={cn(
              "cal-cell",
              !cell.inMonth && "is-out",
              selected && "is-selected",
              hasBirthday && "has-birthday",
              `sq-${look.square}`,
              `nm-${look.num}`,
            )}
            onPointerDown={(event) => holdStart(cell.iso, event)}
            onContextMenu={(event) => event.preventDefault()}
            onClick={() => {
              if (held.current === cell.iso) {
                held.current = null;
                return;
              }
              onSelect(cell.iso);
            }}
          >
            <span className="cal-num">{cell.day}</span>
            <span className="cal-dots" aria-hidden="true">
              {cell.inMonth && hasMark ? <span className="cal-dot" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
