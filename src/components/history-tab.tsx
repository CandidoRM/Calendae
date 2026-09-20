import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePick, TimePick } from "@/components/date-time-pick";
import { MONTHS, formatTime, fromIso, weekdayName, type CalEvent } from "@/lib/calendar";
import { A11yHint } from "@/components/a11y-hint";
import { ContactLine } from "@/components/contact-line";
import { cn, withTip } from "@/lib/utils";

type HistoryTabProps = {
  events: CalEvent[];
  openId: string | null;
  onOpen: (event: CalEvent) => void;
  onRemove: (id: string) => void;
  onReschedule: (event: CalEvent) => void;
};

export function HistoryTab({ events, openId, onOpen, onRemove, onReschedule }: HistoryTabProps) {
  const rows = [...events].sort(
    (a, b) => b.iso.localeCompare(a.iso) || (b.time ?? "").localeCompare(a.time ?? ""),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftDate, setDraftDate] = useState("");
  const [draftTime, setDraftTime] = useState("");

  useEffect(() => {
    if (openId !== editingId) setEditingId(null);
  }, [openId]);

  return (
    <section className="cal-tab">
      <div className="cal-tab-head">
        <h2 className="cal-tab-title">Histórico</h2>
      </div>
      <A11yHint>Compromissos que já passaram. Edite para remarcar e devolver à Agenda.</A11yHint>
      {rows.length === 0 ? (
        <p className="mt-3 border-t border-line pt-3 text-pretty text-sm text-muted">
          Nada no histórico.
        </p>
      ) : (
        <ul className="mt-1">
          {rows.map((event) => {
            const open = openId === event.id;
            const editing = editingId === event.id;
            const day = fromIso(event.iso);
            const year = String(day.getFullYear()).slice(2);
            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onOpen(event)}
                  className="flex w-full items-baseline gap-3 border-t border-line py-3 text-left"
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
                    <span className="capitalize">
                      {MONTHS[day.getMonth()].slice(0, 3)} {year}
                    </span>
                    {event.time ? <span>{formatTime(event.time)}</span> : null}
                  </span>
                </button>
                <div className={cn("cal-event-details", open && "is-open")}>
                  {editing ? (
                    <form
                      className="flex flex-col gap-2 pb-3"
                      onSubmit={(formEvent) => {
                        formEvent.preventDefault();
                        if (!draftDate) return;
                        onReschedule({ ...event, iso: draftDate, time: draftTime });
                        setEditingId(null);
                      }}
                    >
                      <DatePick value={draftDate} onChange={setDraftDate} />
                      <TimePick value={draftTime} onChange={setDraftTime} />
                      <Button type="submit" className="w-full">
                        Remarcar
                      </Button>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-2 pb-3">
                      <div className="min-w-0 text-sm">
                        <p className="capitalize text-muted">
                          {weekdayName(event.iso)}
                          {event.place ? ` · ${event.place}` : ""}
                        </p>
                        {event.contact ? (
                          <p className="mt-1 text-muted">
                            <ContactLine value={event.contact} />
                          </p>
                        ) : null}
                      </div>
                      <div className="cal-actions self-end text-muted">
                        <button
                          type="button"
                          aria-label={`Remarcar ${event.title}`}
                          {...withTip("Remarcar", "flex size-8 shrink-0 items-center justify-center text-muted")}
                          onClick={() => {
                            setEditingId(event.id);
                            setDraftDate(event.iso);
                            setDraftTime(event.time || "09:00");
                          }}
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Apagar ${event.title}`}
                          {...withTip("Apagar", "flex size-8 shrink-0 items-center justify-center text-muted")}
                          onClick={() => onRemove(event.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
