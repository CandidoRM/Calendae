import { Contact, Paperclip, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useGlyphFlash } from "@/components/calendar-glyph";
import { A11yHint } from "@/components/a11y-hint";
import { DatePick } from "@/components/date-time-pick";
import { FormSlot } from "@/components/form-slot";
import { HeaderMenu } from "@/components/header-menu";
import { EVENT_KINDS, MONTHS, fromIso, occurrenceInMonth, type CalEvent, type EventKind } from "@/lib/calendar";
import { deleteBoletoFile, putBoletoFile } from "@/lib/boleto-file";
import { sanitizeAmount } from "@/lib/boleto";
import { CONTACT_MAX, fitContact, pickDeviceContact } from "@/lib/contacts";
import { cn, withTip } from "@/lib/utils";

const PAY_INTERVALS: { value: EventKind | ""; label: string }[] = [
  { value: "", label: "único" },
  ...EVENT_KINDS.map((kind) => ({ value: kind, label: kind })),
];

function intervalOf(kind: EventKind | "", days: string): Pick<CalEvent, "kind" | "everyDays"> {
  if (kind === "personalizado") {
    const step = Number(days);
    return { kind: "personalizado", everyDays: step > 0 ? step : undefined };
  }
  if (!kind) return { kind: undefined, everyDays: undefined };
  return { kind, everyDays: undefined };
}

function intervalTag(event: CalEvent): string {
  if (event.kind === "personalizado" && event.everyDays) return `(${event.everyDays} dias)`;
  if (event.kind) return `(${event.kind})`;
  return "(único)";
}

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
  formSlot?: string | null;
  afterName?: ReactNode;
  extra?: ReactNode;
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
  formSlot = null,
  afterName = null,
  extra = null,
}: PaymentsTabProps) {
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [creditor, setCreditor] = useState("");
  const [amount, setAmount] = useState("");
  const [due, setDue] = useState(selectedIso);
  const [kind, setKind] = useState<EventKind | "">("mensal");
  const [everyDays, setEveryDays] = useState("");
  const [kindMenu, setKindMenu] = useState(false);
  const [fileName, setFileName] = useState("");
  const [editName, setEditName] = useState("");
  const [editCreditor, setEditCreditor] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editKind, setEditKind] = useState<EventKind | "">("mensal");
  const [editEveryDays, setEditEveryDays] = useState("");
  const [editKindMenu, setEditKindMenu] = useState(false);
  const [dateIso, setDateIso] = useState(selectedIso);
  const draftIdRef = useRef<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const start = fromIso(due || selectedIso);

  useEffect(() => {
    if (!adding) return;
    setDue(selectedIso);
  }, [adding, selectedIso]);

  useEffect(() => {
    if (adding) return;
    if (draftIdRef.current && !name.trim() && !creditor.trim() && !amount.trim() && !fileName) {
      void deleteBoletoFile(draftIdRef.current);
      onRemove(draftIdRef.current);
    }
    setName("");
    setCreditor("");
    setAmount("");
    setKind("mensal");
    setEveryDays("");
    setKindMenu(false);
    setFileName("");
    draftIdRef.current = null;
  }, [adding]);

  function persistNew(
    title: string,
    person: string,
    value: string,
    nextKind = kind,
    nextDays = everyDays,
    file = fileName,
    nextDue = due,
  ) {
    const next = title.trim().slice(0, 45);
    const who = person.trim().slice(0, CONTACT_MAX);
    const money = value.trim();
    const target = draftIdRef.current;
    if (!next && !who && !money && !file) {
      if (target) {
        void deleteBoletoFile(target);
        onRemove(target);
        draftIdRef.current = null;
      }
      return null;
    }
    const body: CalEvent = {
      id: target ?? `bill-${Date.now()}`,
      iso: nextDue || selectedIso,
      title: next || who || "Dívida",
      contact: who || undefined,
      amount: money || undefined,
      fileName: file || undefined,
      ...intervalOf(nextKind, nextDays),
      source: "bill",
    };
    if (target) {
      onUpdate(body);
      return target;
    }
    draftIdRef.current = body.id;
    onAdd(body);
    return body.id;
  }

  function keepFile(file: File) {
    if (file.size > 12 * 1024 * 1024) return;
    const id = persistNew(name, creditor, amount, kind, everyDays, file.name);
    if (!id) return;
    setFileName(file.name);
    void putBoletoFile(id, file);
  }

  function persistEdit(
    title: string,
    iso: string,
    person = editCreditor,
    value = editAmount,
    nextKind = editKind,
    nextDays = editEveryDays,
  ) {
    if (!editingId) return;
    const next = title.trim();
    if (!next && !person.trim() && !value.trim()) return;
    const current = payments.find((event) => event.id === editingId);
    if (!current) return;
    onUpdate({
      ...current,
      title: next || person.trim() || "Dívida",
      iso,
      contact: person.trim() || undefined,
      amount: value.trim() || undefined,
      ...intervalOf(nextKind, nextDays),
      source: "bill",
    });
  }

  const visible = payments
    .map((event) => {
      const iso = occurrenceInMonth(event, year, month);
      return iso ? { event, iso } : null;
    })
    .filter((row): row is { event: CalEvent; iso: string } => row !== null)
    .sort((a, b) => a.iso.localeCompare(b.iso) || a.event.title.localeCompare(b.event.title));

  const body = (
    <>
      <FormSlot id={formSlot}>
      {framed || adding ? (
      <div className="cal-tab-head">
        <h2 className={framed ? "cal-tab-title" : "translate-y-1/2 text-sm font-medium text-fg"}>Pagamentos</h2>
      </div>
      ) : null}
      {framed || adding ? <A11yHint>Contas a pagar no mês. Repetem sozinhas no mês seguinte.</A11yHint> : null}
      {adding ? (
      <div className="mt-3 flex flex-col gap-2 pt-3">
        <p className="text-sm text-muted">
          {start.getDate()} de <span className="capitalize">{MONTHS[start.getMonth()]}</span>
        </p>
        <div className="flex items-center">
          <input
            value={name}
            maxLength={45}
            onChange={(event) => {
              const next = event.target.value.slice(0, 45);
              setName(next);
              persistNew(next, creditor, amount);
            }}
            placeholder="Nome da Dívida"
            aria-label="Nome da Dívida"
            className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
          />
          <button
            type="button"
            aria-label="Anexar"
            {...withTip("Anexar", "flex size-8 shrink-0 items-center justify-center text-fg")}
            onClick={() => fileRef.current?.click()}
          >
            <Paperclip className="size-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf,.pdf"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) keepFile(file);
            }}
          />
        </div>
        {fileName ? <p className="truncate text-xs text-muted">{fileName}</p> : null}
        <div className="flex items-center">
          <input
            value={creditor}
            maxLength={CONTACT_MAX}
            onChange={(event) => {
              const next = event.target.value;
              const fitted = next.length > CONTACT_MAX ? fitContact(next) : next;
              setCreditor(fitted);
              persistNew(name, fitted, amount);
            }}
            placeholder="Credor"
            aria-label="Credor"
            className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
          />
          <button
            type="button"
            aria-label="Abrir contatos do celular"
            {...withTip("Contatos", "flex size-8 shrink-0 items-center justify-center text-fg")}
            onClick={() => {
              void pickDeviceContact().then((picked) => {
                if (!picked) return;
                const next = fitContact(picked);
                setCreditor(next);
                persistNew(name, next, amount);
              });
            }}
          >
            <Contact className="size-4" />
          </button>
        </div>
        <input
          value={amount}
          inputMode="decimal"
          autoCorrect="off"
          spellCheck={false}
          aria-label="Valor"
          placeholder="Valor"
          className="cal-num-field h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
          onChange={(event) => {
            const next = sanitizeAmount(event.target.value);
            setAmount(next);
            persistNew(name, creditor, next);
          }}
        />
        <DatePick
          value={due || selectedIso}
          onChange={(iso) => {
            setDue(iso);
            persistNew(name, creditor, amount, kind, everyDays, fileName, iso);
          }}
        />
        <div className="cal-kind-pick flex items-center gap-2">
          <HeaderMenu
            label="Intervalo"
            value={kind}
            options={PAY_INTERVALS}
            open={kindMenu}
            wide
            fixed
            soft
            buttonClassName="cal-kind-btn"
            optionClassName="cal-kind-option"
            onOpen={() => setKindMenu(true)}
            onClose={() => setKindMenu(false)}
            onPick={(next) => {
              const picked = next === "" ? "" : (next as EventKind);
              const days = picked && picked !== "personalizado" ? "" : everyDays;
              setKind(picked);
              if (days !== everyDays) setEveryDays(days);
              setKindMenu(false);
              persistNew(name, creditor, amount, picked, days);
            }}
          />
          <input
            value={!kind || kind === "personalizado" ? everyDays : ""}
            disabled={Boolean(kind && kind !== "personalizado")}
            readOnly={Boolean(kind && kind !== "personalizado")}
            onChange={(event) => {
              if (kind && kind !== "personalizado") return;
              const next = event.target.value.replace(/\D/g, "").slice(0, 3);
              const picked: EventKind | "" = next ? "personalizado" : kind;
              setEveryDays(next);
              if (picked !== kind) setKind(picked);
              persistNew(name, creditor, amount, picked, next);
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
        {afterName}
      </div>
      ) : null}
      </FormSlot>
      {extra}
      {visible.length === 0 ? null : (
        <ul className="mt-1">
          {visible.map(({ event, iso }) => {
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
                  className={cn(
                    "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
                    overdue && "opacity-55",
                  )}
                >
                  <span className={cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted")}>
                    <span>{String(fromIso(iso).getDate()).padStart(2, "0")}</span>
                    <span>/</span>
                    <span>{String(fromIso(iso).getMonth() + 1).padStart(2, "0")}</span>
                  </span>
                  <span className={cn("cal-agenda-tone min-w-0 text-sm", open ? "font-bold" : "font-medium")}>
                    {event.title}
                  </span>
                  <span
                    className={cn(
                      "cal-agenda-tone col-span-2 text-right text-xs",
                      open ? "font-bold text-fg" : "font-normal text-muted",
                    )}
                  >
                    {event.amount ? `R$ ${event.amount} ` : ""}
                    {overdue ? "(vencido)" : intervalTag(event)}
                  </span>
                </button>
                <div className={cn("cal-event-details", open && "is-open")}>
                  <div>
                    {!editing && event.contact && event.contact !== event.title ? (
                      <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
                        <span />
                        <span className="col-span-2">{event.contact}</span>
                      </p>
                    ) : null}
                    {editing ? (
                      <div className="flex flex-col gap-2 pb-3">
                        <input
                          value={editName}
                          onChange={(change) => {
                            setEditName(change.target.value);
                            persistEdit(change.target.value, dateIso);
                          }}
                          placeholder="Nome da Dívida"
                          aria-label="Nome da Dívida"
                          className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                        />
                        <input
                          value={editCreditor}
                          maxLength={CONTACT_MAX}
                          onChange={(change) => {
                            const next = change.target.value.slice(0, CONTACT_MAX);
                            setEditCreditor(next);
                            persistEdit(editName, dateIso, next, editAmount);
                          }}
                          placeholder="Credor"
                          className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                        />
                        <input
                          value={editAmount}
                          inputMode="decimal"
                          onChange={(change) => {
                            const next = sanitizeAmount(change.target.value);
                            setEditAmount(next);
                            persistEdit(editName, dateIso, editCreditor, next);
                          }}
                          placeholder="Valor"
                          className="cal-num-field h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                        />
                        <DatePick
                          value={dateIso}
                          onChange={(iso) => {
                            setDateIso(iso);
                            persistEdit(editName, iso, editCreditor, editAmount);
                          }}
                        />
                        <div className="cal-kind-pick flex items-center gap-2">
                          <HeaderMenu
                            label="Intervalo"
                            value={editKind}
                            options={PAY_INTERVALS}
                            open={editKindMenu}
                            wide
                            fixed
                            soft
                            buttonClassName="cal-kind-btn"
                            optionClassName="cal-kind-option"
                            onOpen={() => setEditKindMenu(true)}
                            onClose={() => setEditKindMenu(false)}
                            onPick={(next) => {
                              const picked = next === "" ? "" : (next as EventKind);
                              const days = picked && picked !== "personalizado" ? "" : editEveryDays;
                              setEditKind(picked);
                              if (days !== editEveryDays) setEditEveryDays(days);
                              setEditKindMenu(false);
                              persistEdit(editName, dateIso, editCreditor, editAmount, picked, days);
                            }}
                          />
                          <input
                            value={!editKind || editKind === "personalizado" ? editEveryDays : ""}
                            disabled={Boolean(editKind && editKind !== "personalizado")}
                            readOnly={Boolean(editKind && editKind !== "personalizado")}
                            onChange={(event) => {
                              if (editKind && editKind !== "personalizado") return;
                              const next = event.target.value.replace(/\D/g, "").slice(0, 3);
                              const picked: EventKind | "" = next ? "personalizado" : editKind;
                              setEditEveryDays(next);
                              if (picked !== editKind) setEditKind(picked);
                              persistEdit(editName, dateIso, editCreditor, editAmount, picked, next);
                            }}
                            placeholder="dias"
                            inputMode="numeric"
                            aria-label="Intervalo em dias"
                            className={cn(
                              "cal-field-sm h-11 rounded-xl bg-bg px-2 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
                              editKind && editKind !== "personalizado" && "cursor-not-allowed opacity-45",
                            )}
                          />
                        </div>
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
                          setEditCreditor(event.contact ?? "");
                          setEditAmount(event.amount ?? "");
                          setEditKind(event.kind ?? "");
                          setEditEveryDays(event.everyDays ? String(event.everyDays) : "");
                          setDateIso(event.iso);
                        }}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Apagar ${event.title}`}
                        {...withTip("Apagar", "flex size-8 items-center justify-center text-muted")}
                        onClick={() => {
                          void deleteBoletoFile(event.id);
                          onRemove(event.id);
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
      )}
    </>
  );

  if (!framed) return body;
  return <section className="cal-tab">{body}</section>;
}
