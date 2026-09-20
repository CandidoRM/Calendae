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
}: MonthGridProps) {
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
              `sq-${look.square}`,
              `nm-${look.num}`,
            )}
            onClick={() => {
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
