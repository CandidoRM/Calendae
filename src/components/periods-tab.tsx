import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { A11yHint } from "@/components/a11y-hint";
import {
  MONTHS,
  PERIOD_PRESETS,
  expandPeriod,
  formatPeriodSpan,
  fromIso,
  periodOverlapsMonth,
  type Period,
} from "@/lib/calendar";
import { cn, withTip } from "@/lib/utils";

type PeriodsTabProps = {
  year: number;
  month: number;
  selectedIso: string;
  openId: string | null;
  periods: Period[];
  onAdd: (period: Period) => void;
  onRemove: (id: string) => void;
  onUpdate: (period: Period) => void;
  onOpen: (id: string, iso: string) => void;
};

export function PeriodsTab({
  year,
  month,
  selectedIso,
  openId,
  periods,
  onAdd,
  onRemove,
  onUpdate,
  onOpen,
}: PeriodsTabProps) {
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>(PERIOD_PRESETS[0]);
  const [custom, setCustom] = useState("");
  const [days, setDays] = useState(7);
  const [startIso, setStartIso] = useState(selectedIso);
  const start = fromIso(adding || !editingId ? selectedIso : startIso);

  const visible = periods
    .filter((period) => periodOverlapsMonth(period, year, month))
    .sort((a, b) => a.startIso.localeCompare(b.startIso));

  function resetForm() {
    setCustom("");
    setDays(7);
    setTitle(PERIOD_PRESETS[0]);
    setStartIso(selectedIso);
  }

  function save() {
    const name = (title === "Outro" ? custom : title).trim();
    const count = Math.max(1, Math.min(366, Math.floor(days) || 1));
    if (!name) return;
    if (editingId) {
      onUpdate({ id: editingId, title: name, startIso, days: count });
      setEditingId(null);
      resetForm();
      return;
    }
    onAdd({ id: `period-${Date.now()}`, title: name, startIso: selectedIso, days: count });
    setAdding(false);
    resetForm();
  }

  function beginEdit(period: Period) {
    setAdding(false);
    setEditingId((id) => (id === period.id ? null : period.id));
    const preset = PERIOD_PRESETS.find((name) => name === period.title);
    setTitle(preset ?? "Outro");
    setCustom(preset ? "" : period.title);
    setDays(period.days);
    setStartIso(period.startIso);
  }

  return (
    <section className="cal-tab">
      <div className="cal-tab-head">
        <h2 className="cal-tab-title">Períodos</h2>
        <Button
          variant="ghost"
          size="icon"
          {...withTip("Novo")}
          aria-label="Novo período"
          onClick={() => {
            pingGlyph();
            setEditingId(null);
            setAdding((v) => !v);
            resetForm();
          }}
        >
          <CalendarGlyph className="size-5" flash={glyphFlash} />
        </Button>
      </div>
      <A11yHint>Marca vários dias seguidos, como férias ou folgas.</A11yHint>
      {adding ? (
        <form
          className="mt-3 flex flex-col gap-3 border-t border-line pt-3"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <div className="flex gap-2">
            {[...PERIOD_PRESETS, "Outro"].map((name) => (
              <button
                key={name}
                type="button"
                className={cn(
                  "h-11 min-w-0 flex-1 rounded-xl px-2 text-sm",
                  title === name ? "bg-accent text-accent-fg" : "text-fg shadow-[0_0_0_1px_var(--c-line)]",
                )}
                onClick={() => setTitle(name)}
              >
                {name}
              </button>
            ))}
          </div>
          {title === "Outro" ? (
            <input
              value={custom}
              onChange={(event) => setCustom(event.target.value)}
              placeholder="Nome do período"
              className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
              autoFocus
            />
          ) : null}
          <p className="text-sm text-muted">
            A partir de {start.getDate()} de {MONTHS[start.getMonth()]}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Dias</span>
            <input
              type="number"
              min={1}
              max={366}
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className="h-11 w-24 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none"
            />
          </label>
          <Button type="submit">Marcar período</Button>
        </form>
      ) : null}
      {visible.length === 0 && !adding ? (
        <p className="mt-3 border-t border-line pt-3 text-pretty text-sm text-muted">
          Nenhum período neste mês.
        </p>
      ) : (
        <ul className="cal-ruled mt-1">
          {visible.map((period) => {
            const isos = expandPeriod(period);
            const open = openId === period.id;
            const editing = editingId === period.id;
            return (
              <li key={period.id}>
                <button
                  type="button"
                  className="flex w-full items-baseline justify-between gap-3 border-t border-line py-3 text-left"
                  onClick={() => {
                    pingGlyph();
                    setEditingId(null);
                    onOpen(period.id, period.startIso);
                  }}
                >
                  <span className="min-w-0 flex-1">
                    <p className={cn("cal-agenda-tone truncate text-sm", open ? "font-bold" : "font-medium")}>
                      {period.title}
                    </p>
                    <p
                      className={cn(
                        "cal-agenda-tone text-xs capitalize",
                        open ? "font-bold text-fg" : "text-muted",
                      )}
                    >
                      {formatPeriodSpan(period)} · {isos.length} d
                    </p>
                  </span>
                </button>
                <div className={cn("cal-event-details", open && "is-open")}>
                  <div>
                    {editing ? (
                      <form
                        className="flex flex-col gap-3 pb-3"
                        onSubmit={(event) => {
                          event.preventDefault();
                          save();
                        }}
                      >
                        <input
                          type="date"
                          value={startIso}
                          onChange={(event) => setStartIso(event.target.value)}
                          className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none"
                        />
                        <input
                          value={title === "Outro" ? custom : title}
                          onChange={(event) => {
                            setTitle("Outro");
                            setCustom(event.target.value);
                          }}
                          className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none"
                        />
                        <label className="flex items-center gap-2 text-sm">
                          <span className="text-muted">Dias</span>
                          <input
                            type="number"
                            min={1}
                            max={366}
                            value={days}
                            onChange={(event) => setDays(Number(event.target.value))}
                            className="h-11 w-24 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none"
                          />
                        </label>
                        <Button type="submit">Salvar</Button>
                      </form>
                    ) : null}
                    <div className="flex items-center justify-end pb-3">
                      <button
                        type="button"
                        aria-label={`Editar ${period.title}`}
                        {...withTip("Editar", "flex size-8 items-center justify-center text-muted")}
                        onClick={() => beginEdit(period)}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Apagar ${period.title}`}
                        {...withTip("Apagar", "flex size-8 items-center justify-center text-muted")}
                        onClick={() => onRemove(period.id)}
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
