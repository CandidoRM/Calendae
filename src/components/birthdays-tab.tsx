import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { A11yHint } from "@/components/a11y-hint";
import { MONTHS, fromIso, weekdayName, type CalEvent } from "@/lib/calendar";
import { cn, withTip } from "@/lib/utils";

type BirthdaysTabProps = {
  year: number;
  month: number;
  today: string;
  selectedIso: string;
  openId: string | null;
  birthdays: CalEvent[];
  onAdd: (event: CalEvent) => void;
  onRemove: (id: string) => void;
  onUpdate: (event: CalEvent) => void;
  onOpen: (event: CalEvent) => void;
};

export function BirthdaysTab({
  year,
  month,
  today,
  selectedIso,
  openId,
  birthdays,
  onAdd,
  onRemove,
  onUpdate,
  onOpen,
}: BirthdaysTabProps) {
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [dateIso, setDateIso] = useState(selectedIso);
  const start = fromIso(selectedIso);

  const visible = birthdays
    .filter((event) => {
      const date = fromIso(event.iso);
      return date.getMonth() === month && year >= date.getFullYear();
    })
    .sort((a, b) => fromIso(a.iso).getDate() - fromIso(b.iso).getDate());

  function save() {
    const title = name.trim();
    if (!title) return;
    if (editingId) {
      const current = birthdays.find((event) => event.id === editingId);
      if (!current) return;
      onUpdate({ ...current, title, iso: dateIso, kind: "anual", source: "birthday" });
      setEditingId(null);
      setName("");
      return;
    }
    onAdd({
      id: `birthday-${Date.now()}`,
      iso: selectedIso,
      title,
      kind: "anual",
      source: "birthday",
    });
    setName("");
    setAdding(false);
  }

  return (
    <section className="cal-tab">
      <div className="cal-tab-head">
        <h2 className="cal-tab-title">Aniversários</h2>
        <Button
          variant="ghost"
          size="icon"
          {...withTip("Novo")}
          aria-label="Novo aniversário"
          onClick={() => {
            pingGlyph();
            setEditingId(null);
            setAdding((v) => !v);
            setName("");
          }}
        >
          <CalendarGlyph className="size-5" flash={glyphFlash} />
        </Button>
      </div>
      <A11yHint>Datas de aniversário, repetidas todo ano.</A11yHint>
      {adding ? (
        <form
          className="mt-3 flex flex-col gap-2 border-t border-line pt-3"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <p className="text-sm text-muted">
            {start.getDate()} de <span className="capitalize">{MONTHS[start.getMonth()]}</span>
            {" · "}anual
          </p>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome"
            className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
            autoFocus
          />
          <Button type="submit">Salvar</Button>
        </form>
      ) : null}
      {visible.length === 0 && !adding ? (
        <p className="mt-3 border-t border-line pt-3 text-pretty text-sm text-muted">
          Nenhum aniversário neste mês.
        </p>
      ) : (
        <ul className="cal-ruled mt-1">
          {visible.map((event) => {
            const day = fromIso(event.iso).getDate();
            const open = openId === event.id;
            const occurrence = `${year}-${event.iso.slice(5)}`;
            const past = occurrence < today;
            const editing = editingId === event.id;
            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => {
                    pingGlyph();
                    setEditingId(null);
                    onOpen(event);
                  }}
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
                    {String(day).padStart(2, "0")}
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
                      "cal-agenda-tone shrink-0 text-xs",
                      open ? "font-bold text-fg" : "text-muted",
                    )}
                  >
                    (anual)
                  </span>
                </button>
                <div className={cn("cal-event-details", open && "is-open")}>
                  <div>
                    {editing ? (
                      <form
                        className="flex flex-col gap-2 pb-3"
                        onSubmit={(formEvent) => {
                          formEvent.preventDefault();
                          save();
                        }}
                      >
                        <input
                          type="date"
                          value={dateIso}
                          onChange={(change) => setDateIso(change.target.value)}
                          className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none"
                        />
                        <input
                          value={name}
                          onChange={(change) => setName(change.target.value)}
                          placeholder="Nome"
                          className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                        />
                        <Button type="submit">Salvar</Button>
                      </form>
                    ) : (
                      <p className="min-w-0 pb-3 pl-11 text-xs capitalize text-muted">
                        {weekdayName(occurrence)}
                      </p>
                    )}
                    <div className="flex items-center justify-end pb-3">
                      <button
                        type="button"
                        aria-label={`Editar ${event.title}`}
                        {...withTip("Editar", "flex size-8 items-center justify-center text-muted")}
                        onClick={() => {
                          setAdding(false);
                          setEditingId((id) => (id === event.id ? null : event.id));
                          setName(event.title);
                          setDateIso(event.iso);
                        }}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Apagar ${event.title}`}
                        {...withTip("Apagar", "flex size-8 items-center justify-center text-muted")}
                        onClick={() => onRemove(event.id)}
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
      )}
    </section>
  );
}
