import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGlyphFlash } from "@/components/calendar-glyph";
import { A11yHint } from "@/components/a11y-hint";
import { MONTHS, fromIso, occurrenceInMonth, type CalEvent } from "@/lib/calendar";
import { cn, withTip } from "@/lib/utils";

type PaymentsTabProps = {
  year: number;
  month: number;
  selectedIso: string;
  today: string;
  openId: string | null;
  payments: CalEvent[];
  onAdd: (event: CalEvent) => void;
  onRemove: (id: string) => void;
  onUpdate: (event: CalEvent) => void;
  onOpen: (event: CalEvent, iso: string) => void;
  framed?: boolean;
  adding?: boolean;
};

export function PaymentsTab({
  year,
  month,
  selectedIso,
  today,
  openId,
  payments,
  onAdd,
  onRemove,
  onUpdate,
  onOpen,
  framed = true,
  adding = false,
}: PaymentsTabProps) {
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");
  const [dateIso, setDateIso] = useState(selectedIso);
  const draftIdRef = useRef<string | null>(null);
  const start = fromIso(selectedIso);

  useEffect(() => {
    if (adding) return;
    if (draftIdRef.current && !name.trim()) onRemove(draftIdRef.current);
    setName("");
    draftIdRef.current = null;
  }, [adding]);

  function persistNew(title: string) {
    const next = title.trim();
    const target = draftIdRef.current;
    if (!next) {
      if (target) {
        onRemove(target);
        draftIdRef.current = null;
      }
      return;
    }
    if (target) {
      const current = payments.find((event) => event.id === target);
      if (current) onUpdate({ ...current, title: next, iso: selectedIso, kind: "mensal", source: "bill" });
      return;
    }
    const id = `bill-${Date.now()}`;
    draftIdRef.current = id;
    onAdd({
      id,
      iso: selectedIso,
      title: next,
      kind: "mensal",
      source: "bill",
    });
  }

  function persistEdit(title: string, iso: string) {
    if (!editingId) return;
    const next = title.trim();
    if (!next) return;
    const current = payments.find((event) => event.id === editingId);
    if (!current) return;
    onUpdate({ ...current, title: next, iso, kind: "mensal", source: "bill" });
  }

  const visible = payments
    .map((event) => {
      const iso = occurrenceInMonth({ ...event, kind: event.kind ?? "mensal" }, year, month);
      return iso ? { event, iso } : null;
    })
    .filter((row): row is { event: CalEvent; iso: string } => row !== null)
    .sort((a, b) => a.iso.localeCompare(b.iso) || a.event.title.localeCompare(b.event.title));

  const body = (
    <>
      <div className="cal-tab-head">
        <h2 className={framed ? "cal-tab-title" : "text-sm font-medium text-fg"}>Pagamentos</h2>
      </div>
      {framed ? <A11yHint>Contas a pagar no mês. Repetem sozinhas no mês seguinte.</A11yHint> : null}
      {adding ? (
      <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
        <p className="text-sm text-muted">
          {start.getDate()} de <span className="capitalize">{MONTHS[start.getMonth()]}</span>
        </p>
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            persistNew(event.target.value);
          }}
          placeholder="Nome"
          className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
        />
      </div>
      ) : null}
      {visible.length === 0 && !adding ? (
        <p className="mt-3 border-t border-line pt-3 text-pretty text-sm text-muted">
          Nenhum pagamento neste mês.
        </p>
      ) : (
        <ul className="cal-ruled mt-1">
          {visible.map(({ event, iso }) => {
            const day = fromIso(iso).getDate();
            const open = openId === event.id;
            const editing = editingId === event.id;
            const overdue = iso < today;
            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => {
                    pingGlyph();
                    setEditingId(null);
                    onOpen(event, iso);
                  }}
                  className="flex w-full items-baseline gap-3 border-t border-line py-3 text-left"
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
                    {overdue ? "(vencido)" : "(mensal)"}
                  </span>
                </button>
                <div className={cn("cal-event-details", open && "is-open")}>
                  <div>
                    {editing ? (
                      <div className="flex flex-col gap-2 pb-3">
                        <input
                          type="date"
                          value={dateIso}
                          onChange={(change) => {
                            setDateIso(change.target.value);
                            persistEdit(editName, change.target.value);
                          }}
                          className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none"
                        />
                        <input
                          value={editName}
                          onChange={(change) => {
                            setEditName(change.target.value);
                            persistEdit(change.target.value, dateIso);
                          }}
                          placeholder="Nome"
                          className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                        />
                      </div>
                    ) : null}
                    <div className="flex items-center justify-end pb-3">
                      <button
                        type="button"
                        aria-label={`Editar ${event.title}`}
                        {...withTip("Editar", "flex size-8 items-center justify-center text-muted")}
                        onClick={() => {
                          setEditingId((id) => (id === event.id ? null : event.id));
                          setEditName(event.title);
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
    </>
  );

  if (!framed) return body;
  return <section className="cal-tab">{body}</section>;
}
