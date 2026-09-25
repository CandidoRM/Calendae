import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BarcodeScanButton } from "@/components/barcode-scan";
import { DatePick } from "@/components/date-time-pick";
import { useGlyphFlash } from "@/components/calendar-glyph";
import {
  boletoHasData,
  parseBoleto,
  sanitizeAmount,
  sanitizeBank,
  sanitizeBarcode,
} from "@/lib/boleto";
import { fromIso, weekdayName, type CalEvent } from "@/lib/calendar";
import { cn, withTip } from "@/lib/utils";

type BoletosBlockProps = {
  adding: boolean;
  year: number;
  month: number;
  today: string;
  selectedIso: string;
  openId: string | null;
  boletos: CalEvent[];
  onAdd: (event: CalEvent) => void;
  onRemove: (id: string) => void;
  onUpdate: (event: CalEvent) => void;
  onOpen: (event: CalEvent, iso: string) => void;
};

export function BoletosBlock({
  adding,
  year,
  month,
  today,
  selectedIso,
  openId,
  boletos,
  onAdd,
  onRemove,
  onUpdate,
  onOpen,
}: BoletosBlockProps) {
  const [, pingGlyph] = useGlyphFlash();
  const [code, setCode] = useState("");
  const [due, setDue] = useState(selectedIso);
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editDue, setEditDue] = useState(selectedIso);
  const [editAmount, setEditAmount] = useState("");
  const [editBank, setEditBank] = useState("");
  const draftId = useRef<string | null>(null);

  useEffect(() => {
    if (adding) {
      setDue(selectedIso);
      return;
    }
    if (draftId.current && !boletoHasData(code, amount, bank, due, selectedIso)) {
      onRemove(draftId.current);
      draftId.current = null;
    }
    setCode("");
    setAmount("");
    setBank("");
    setDue(selectedIso);
  }, [adding]);

  function applyParse(
    digits: string,
    setA: (v: string) => void,
    setB: (v: string) => void,
    setD: (v: string) => void,
  ) {
    const parsed = parseBoleto(digits);
    if (parsed.amount) setA(parsed.amount);
    if (parsed.bank) setB(parsed.bank);
    if (parsed.iso) setD(parsed.iso);
    return parsed;
  }

  function persist(
    nextCode: string,
    nextDue: string,
    nextAmount: string,
    nextBank: string,
  ) {
    const digits = sanitizeBarcode(nextCode);
    if (!boletoHasData(digits, nextAmount, nextBank, nextDue, selectedIso)) {
      if (draftId.current) {
        onRemove(draftId.current);
        draftId.current = null;
      }
      return;
    }
    const parsed = parseBoleto(digits);
    const iso = nextDue || parsed.iso || selectedIso;
    const title = nextBank.trim() || parsed.bank || "Boleto";
    const body: CalEvent = {
      id: draftId.current ?? `boleto-${Date.now()}`,
      iso,
      title,
      source: "boleto",
      nb: digits || undefined,
      place: nextBank.trim() || undefined,
      amount: nextAmount.trim() || undefined,
    };
    if (draftId.current) {
      onUpdate(body);
      return;
    }
    draftId.current = body.id;
    onAdd(body);
  }

  function fillCode(digits: string) {
    setCode(digits);
    if (!digits) {
      setAmount("");
      setBank("");
      setDue(selectedIso);
      persist("", selectedIso, "", "");
      return;
    }
    const parsed = applyParse(digits, setAmount, setBank, setDue);
    persist(digits, parsed.iso || due, parsed.amount ?? amount, parsed.bank ?? bank);
  }

  const visible = boletos
    .filter((event) => {
      const date = fromIso(event.iso);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .sort((a, b) => a.iso.localeCompare(b.iso) || a.title.localeCompare(b.title));

  return (
    <>
      {adding ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
          <p className="text-sm font-medium text-fg">Boletos</p>
          <div className="flex items-center">
            <input
              value={code}
              inputMode="numeric"
              autoCorrect="off"
              spellCheck={false}
              maxLength={48}
              aria-label="Código de Barras"
              placeholder="Código de Barras"
              className="cal-num-field h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
              onChange={(event) => fillCode(sanitizeBarcode(event.target.value))}
            />
            <BarcodeScanButton onRead={fillCode} />
          </div>
          <input
            value={bank}
            autoCorrect="off"
            spellCheck={false}
            maxLength={40}
            aria-label="Banco"
            placeholder="Banco"
            className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
            onChange={(event) => {
              const next = sanitizeBank(event.target.value);
              setBank(next);
              persist(code, due, amount, next);
            }}
          />
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
              persist(code, due, next, bank);
            }}
          />
          <p className="text-sm text-muted">Vencimento</p>
          <DatePick value={due} onChange={(iso) => { setDue(iso); persist(code, iso, amount, bank); }} />
        </div>
      ) : null}
      {visible.map((event) => {
        const open = openId === event.id;
        const editing = editingId === event.id;
        const overdue = event.iso < today;
        return (
          <div key={event.id} className="mt-1">
            <button
              type="button"
              onClick={() => {
                pingGlyph();
                setEditingId(null);
                onOpen(event, event.iso);
              }}
              className={cn(
                "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
                overdue && "opacity-55",
              )}
            >
              <span
                className={cn(
                  "cal-agenda-tone cal-dmy text-[0.8rem]",
                  open ? "text-today" : "text-muted",
                )}
              >
                <span>{String(fromIso(event.iso).getDate()).padStart(2, "0")}</span>
                <span>/</span>
                <span>{String(fromIso(event.iso).getMonth() + 1).padStart(2, "0")}</span>
              </span>
              <span className={cn("cal-agenda-tone min-w-0 text-sm", open ? "font-bold" : "font-medium")}>
                {event.title}
              </span>
              <span
                className={cn(
                  "cal-agenda-tone text-right text-xs",
                  open ? "font-bold text-fg" : "font-normal text-muted",
                )}
              >
                {overdue ? "(vencido)" : event.amount ? `R$ ${event.amount}` : ""}
              </span>
              <span
                className={cn(
                  "cal-agenda-tone text-xs capitalize",
                  open ? "font-bold text-fg" : "font-normal text-muted",
                )}
              >
                {weekdayName(event.iso).slice(0, 3)}
              </span>
            </button>
            <div className={cn("cal-event-details", open && "is-open")}>
              <div>
                {editing ? (
                  <div className="flex flex-col gap-2 pb-3">
                    <div className="flex items-center">
                      <input
                        value={editCode}
                        inputMode="numeric"
                        autoCorrect="off"
                        spellCheck={false}
                        maxLength={48}
                        placeholder="Código de Barras"
                        className="cal-num-field h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                        onChange={(change) => {
                          const digits = sanitizeBarcode(change.target.value);
                          setEditCode(digits);
                          const parsed = applyParse(digits, setEditAmount, setEditBank, setEditDue);
                          onUpdate({
                            ...event,
                            nb: digits || undefined,
                            iso: parsed.iso || editDue,
                            title: parsed.bank || editBank || event.title,
                            place: parsed.bank || editBank || undefined,
                            amount: parsed.amount ?? editAmount,
                          });
                        }}
                      />
                      <BarcodeScanButton
                        onRead={(digits) => {
                          setEditCode(digits);
                          const parsed = applyParse(digits, setEditAmount, setEditBank, setEditDue);
                          onUpdate({
                            ...event,
                            nb: digits || undefined,
                            iso: parsed.iso || editDue,
                            title: parsed.bank || editBank || event.title,
                            place: parsed.bank || editBank || undefined,
                            amount: parsed.amount ?? editAmount,
                          });
                        }}
                      />
                    </div>
                    <input
                      value={editBank}
                      maxLength={40}
                      placeholder="Banco"
                      className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                      onChange={(change) => {
                        const next = sanitizeBank(change.target.value);
                        setEditBank(next);
                        onUpdate({ ...event, title: next || "Boleto", place: next || undefined });
                      }}
                    />
                    <input
                      value={editAmount}
                      inputMode="decimal"
                      placeholder="Valor"
                      className="cal-num-field h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                      onChange={(change) => {
                        const next = sanitizeAmount(change.target.value);
                        setEditAmount(next);
                        onUpdate({ ...event, amount: next || undefined });
                      }}
                    />
                    <p className="text-sm text-muted">Vencimento</p>
                    <DatePick
                      value={editDue}
                      onChange={(iso) => {
                        setEditDue(iso);
                        onUpdate({ ...event, iso });
                      }}
                    />
                  </div>
                ) : (
                  <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
                    <span />
                    <span className="col-span-2 break-all">
                      {event.amount ? `R$ ${event.amount}` : "Boleto"}
                      {event.nb ? ` · ${event.nb}` : ""}
                    </span>
                  </p>
                )}
                <div className="flex items-center justify-end pb-3">
                  <button
                    type="button"
                    aria-label={`Editar ${event.title}`}
                    {...withTip("Editar", "flex size-8 items-center justify-center text-muted")}
                    onClick={() => {
                      setEditingId((id) => (id === event.id ? null : event.id));
                      setEditCode(event.nb ?? "");
                      setEditDue(event.iso);
                      setEditAmount(event.amount ?? "");
                      setEditBank(event.place || event.title);
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
          </div>
        );
      })}
    </>
  );
}
