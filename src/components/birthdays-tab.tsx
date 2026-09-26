import { Bell, Contact, FileImage, Paperclip, Pencil, Smile, Trash2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { A11yHint } from "@/components/a11y-hint";
import { DatePick } from "@/components/date-time-pick";
import { ContactLine } from "@/components/contact-line";
import { birthdayIso, fromIso, type CalEvent, type WeekStart } from "@/lib/calendar";
import { pickDeviceContact, pullPhone, splitContact } from "@/lib/contacts";
import { deleteBoletoFile, getBoletoFile, putBoletoFile } from "@/lib/boleto-file";
import { cn, withTip } from "@/lib/utils";

const BASIC_EMOJIS = ["🎂", "🎉", "❤️", "😊", "🎁", "🌸", "⭐", "🙏", "💐"];

function countdownLabel(today: string, occurrence: string): string {
  const days = Math.round((fromIso(occurrence).getTime() - fromIso(today).getTime()) / 86_400_000);
  if (days === 0) return "Hoje";
  if (days === 1) return "Falta 1 dia";
  if (days > 1) return `Faltam ${days} dias`;
  const ago = -days;
  return ago === 1 ? "Há 1 dia" : `Há ${ago} dias`;
}

function currentAge(birthIso: string, today: string): number {
  const birthYear = Number(birthIso.slice(0, 4));
  const todayYear = Number(today.slice(0, 4));
  let age = todayYear - birthYear;
  if (today < birthdayIso(birthIso, todayYear)) age -= 1;
  return Math.max(0, age);
}

function agesLabel(thenAge: number, nowAge: number): string {
  const then = Math.max(0, thenAge);
  const now = Math.max(0, nowAge);
  if (then === now) return then === 1 ? "1 ano" : `${then} anos`;
  const unit = then === 1 && now === 1 ? "ano" : "anos";
  return `${then}-${now} ${unit}`;
}

const WEEKDAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"] as const;

function ageWithWeekday(thenAge: number, nowAge: number, iso: string): string {
  return `(${agesLabel(thenAge, nowAge)}) ${WEEKDAY_SHORT[fromIso(iso).getDay()]}`;
}

function NotifyMark({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={on ? "Desligar aviso" : "Ligar aviso"}
      aria-pressed={on}
      {...withTip(
        on ? "Aviso ligado" : "Aviso",
        cn("flex size-8 shrink-0 items-center justify-center", on ? "text-fg" : "text-muted"),
      )}
      onClick={onToggle}
    >
      <Bell className="size-4" />
    </button>
  );
}

function MessageField({
  value,
  onChange,
  onAttach,
}: {
  value: string;
  onChange: (next: string) => void;
  onAttach: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!open) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    const pop = popRef.current?.getBoundingClientRect();
    if (!rect) return;
    const frame =
      document.querySelector(".cal-app")?.getBoundingClientRect() ??
      ({ top: 0, bottom: window.innerHeight, left: 0, right: window.innerWidth } as DOMRect);
    const gap = 6;
    const pad = 8;
    const width = pop?.width || 120;
    const height = pop?.height || 120;
    const below = frame.bottom - rect.bottom - gap - pad;
    const above = rect.top - frame.top - gap - pad;
    const openUp = below < height && above > below;
    const top = openUp
      ? Math.max(frame.top + pad, rect.top - gap - height)
      : Math.min(rect.bottom + gap, frame.bottom - pad - height);
    let left = rect.right - width;
    if (left + width > frame.right - pad) left = frame.right - pad - width;
    if (left < frame.left + pad) left = frame.left + pad;
    setBox({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function close(event: PointerEvent) {
      const node = event.target as Node;
      if (wrapRef.current?.contains(node) || popRef.current?.contains(node)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function insert(emoji: string) {
    const area = areaRef.current;
    const start = area?.selectionStart ?? value.length;
    const end = area?.selectionEnd ?? value.length;
    const next = `${value.slice(0, start)}${emoji}${value.slice(end)}`;
    onChange(next);
    const caret = start + emoji.length;
    setOpen(false);
    requestAnimationFrame(() => {
      area?.focus();
      area?.setSelectionRange(caret, caret);
    });
  }

  return (
    <div ref={wrapRef} className="relative flex items-start">
      <textarea
        ref={areaRef}
        value={value}
        rows={2}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Mensagem"
        className="min-w-0 flex-1 resize-none rounded-xl bg-bg px-3 py-2 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
      />
      <div className="-mt-1.5 flex flex-col">
        <button
          ref={buttonRef}
          type="button"
          aria-label="Inserir emoticon"
          {...withTip("Emoticons", "flex size-8 shrink-0 items-center justify-center text-fg")}
          onClick={() => setOpen((current) => !current)}
        >
          <Smile className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Anexar"
          {...withTip("Anexar", "flex size-8 shrink-0 items-center justify-center text-fg")}
          onClick={onAttach}
        >
          <Paperclip className="size-4" />
        </button>
      </div>
      {open
        ? createPortal(
            <div
              ref={popRef}
              className="cal-pick-menu is-fixed grid !max-h-none !w-auto grid-cols-3 gap-0.5 p-1.5"
              style={{ position: "fixed", top: box.top, left: box.left, zIndex: 80 }}
            >
              {BASIC_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="flex size-8 items-center justify-center text-lg leading-none"
                  onClick={() => insert(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

type BirthdaysTabProps = {
  year: number;
  month: number;
  today: string;
  selectedIso: string;
  weekStart: WeekStart;
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
  weekStart,
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
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [notify, setNotify] = useState(false);
  const [fileName, setFileName] = useState("");
  const [viewing, setViewing] = useState<{ url: string; name: string; type: string } | null>(null);
  const [dateIso, setDateIso] = useState(selectedIso);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<File | null>(null);

  function onName(next: string) {
    setName(next);
  }

  function finishName(value: string) {
    const pulled = pullPhone(value);
    if (!pulled) return;
    setName(pulled.name);
    setPhone(pulled.phone);
  }

  function onPhone(next: string) {
    const clean = next.replace(/[^\d+()\s.-]/g, "");
    const pulled = pullPhone(clean);
    setPhone(pulled?.phone || clean);
  }

  function keepFile(file: File) {
    if (file.size > 12 * 1024 * 1024) return;
    setFileName(file.name);
    const id = editingId || draftId.current;
    if (id) {
      pendingFile.current = null;
      void putBoletoFile(id, file);
      return;
    }
    pendingFile.current = file;
  }

  function closeView() {
    setViewing((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
  }

  function viewAttachment(id: string) {
    void getBoletoFile(id).then((record) => {
      if (!record) return;
      const url = URL.createObjectURL(record.blob);
      setViewing((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return { url, name: record.name, type: record.type };
      });
    });
  }

  function fillFromContacts() {
    void pickDeviceContact().then((picked) => {
      if (!picked) return;
      const parts = splitContact(picked);
      if (parts.name) setName(parts.name);
      else setName(picked);
      if (parts.phone) setPhone(parts.phone);
    });
  }

  const onAddRef = useRef(onAdd);
  const onUpdateRef = useRef(onUpdate);
  const onRemoveRef = useRef(onRemove);
  const birthdaysRef = useRef(birthdays);
  const draftId = useRef<string | null>(null);
  onAddRef.current = onAdd;
  onUpdateRef.current = onUpdate;
  onRemoveRef.current = onRemove;
  birthdaysRef.current = birthdays;

  useEffect(() => {
    if (!adding) return;
    const title = name.trim();
    if (!title) {
      if (draftId.current) {
        onRemoveRef.current(draftId.current);
        draftId.current = null;
      }
      return;
    }
    const next: CalEvent = {
      id: draftId.current ?? `birthday-${Date.now()}`,
      iso: dateIso,
      title,
      note: message.trim() || undefined,
      contact: phone.trim() || undefined,
      kind: "anual",
      source: "birthday",
      notify,
      fileName: fileName || undefined,
    };
    if (!draftId.current) {
      draftId.current = next.id;
      onAddRef.current(next);
      if (pendingFile.current) {
        void putBoletoFile(next.id, pendingFile.current);
        pendingFile.current = null;
      }
      return;
    }
    onUpdateRef.current(next);
  }, [adding, name, message, phone, dateIso, notify, fileName]);

  useEffect(() => {
    if (!editingId || adding) return;
    const title = name.trim();
    if (!title) return;
    const current = birthdaysRef.current.find((event) => event.id === editingId);
    if (!current) return;
    onUpdateRef.current({
      ...current,
      title,
      iso: dateIso,
      note: message.trim() || undefined,
      contact: phone.trim() || undefined,
      kind: "anual",
      source: "birthday",
      notify,
      fileName: fileName || undefined,
    });
  }, [editingId, adding, name, message, phone, dateIso, notify, fileName]);

  const visible = birthdays
    .filter((event) => {
      const born = Number(event.iso.slice(0, 4));
      if (!Number.isFinite(born) || year < born) return false;
      return birthdayIso(event.iso, year).slice(5, 7) === String(month + 1).padStart(2, "0");
    })
    .sort((a, b) => birthdayIso(a.iso, year).localeCompare(birthdayIso(b.iso, year)));

  return (
    <section className="cal-tab" data-cal-tab="birthdays">
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
            setAdding((open) => {
              if (open) draftId.current = null;
              return !open;
            });
            setName("");
            setMessage("");
            setPhone("");
            setNotify(false);
            setFileName("");
            pendingFile.current = null;
            setDateIso(selectedIso);
          }}
        >
          <CalendarGlyph className="size-5" flash={glyphFlash} />
        </Button>
      </div>
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
      <A11yHint>Datas de aniversário, repetidas todo ano.</A11yHint>
      {adding ? (
        <div className="mb-3 mt-3 flex flex-col gap-2 border-t border-line pt-3">
          <A11yHint>O ano na data define a idade. A mensagem e o WhatsApp ficam no dia.</A11yHint>
          <div className="flex items-center">
            <input
              value={name}
              onChange={(event) => onName(event.target.value)}
              onBlur={(event) => finishName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") finishName(event.currentTarget.value);
              }}
              placeholder="Nome"
              className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
              autoFocus
            />
            <button
              type="button"
              aria-label="Abrir contatos do celular"
              {...withTip("Contatos", "flex size-8 shrink-0 items-center justify-center text-fg")}
              onClick={fillFromContacts}
            >
              <Contact className="size-4" />
            </button>
          </div>
          <MessageField value={message} onChange={setMessage} onAttach={() => fileRef.current?.click()} />
          <div className="flex items-center gap-2">
            <DatePick value={dateIso} weekStart={weekStart} onChange={setDateIso} />
            <div className="flex min-w-0 flex-1 items-center">
              <input
                value={phone}
                onChange={(event) => onPhone(event.target.value)}
                placeholder="WhatsApp"
                inputMode="tel"
                aria-label="Número do WhatsApp"
                className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-2 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
              />
              <NotifyMark on={notify} onToggle={() => setNotify((on) => !on)} />
            </div>
          </div>
          {fileName ? <p className="truncate text-xs text-muted">{fileName}</p> : null}
        </div>
      ) : null}
      {visible.length === 0 && !adding ? (
        <p className="mt-3 border-t border-line pt-3 text-pretty text-sm text-muted">
          Nenhum aniversário neste mês.
        </p>
      ) : (
        <ul className="mt-1">
          {visible.map((event) => {
            const birthYear = Number(event.iso.slice(0, 4));
            const occurrence = birthdayIso(event.iso, year);
            const shown = fromIso(occurrence);
            const age = year - birthYear;
            const open = openId === event.id;
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
                  )}
                >
                  <span
                    className={cn(
                      "cal-agenda-tone cal-dmy text-[0.8rem]",
                      open ? "text-today" : "text-muted",
                    )}
                  >
                    <span>{String(shown.getDate()).padStart(2, "0")}</span>
                    <span>/</span>
                    <span>{String(shown.getMonth() + 1).padStart(2, "0")}</span>
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
                    {ageWithWeekday(age, currentAge(event.iso, today), occurrence)}
                  </span>
                </button>
                <div className={cn("cal-event-details", open && "is-open")}>
                  <div>
                    {editing ? (
                      <div className="flex flex-col gap-2 pb-3">
                        <A11yHint>O ano na data define a idade. A mensagem e o WhatsApp ficam no dia.</A11yHint>
                        <div className="flex items-center">
                          <input
                            value={name}
                            onChange={(change) => onName(change.target.value)}
                            onBlur={(change) => finishName(change.target.value)}
                            onKeyDown={(change) => {
                              if (change.key === "Enter") finishName(change.currentTarget.value);
                            }}
                            placeholder="Nome"
                            className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                          />
                          <button
                            type="button"
                            aria-label="Abrir contatos do celular"
                            {...withTip("Contatos", "flex size-8 shrink-0 items-center justify-center text-fg")}
                            onClick={fillFromContacts}
                          >
                            <Contact className="size-4" />
                          </button>
                        </div>
                        <MessageField value={message} onChange={setMessage} onAttach={() => fileRef.current?.click()} />
                        <div className="flex items-center gap-2">
                          <DatePick value={dateIso} weekStart={weekStart} onChange={setDateIso} />
                          <div className="flex min-w-0 flex-1 items-center">
                            <input
                              value={phone}
                              onChange={(change) => onPhone(change.target.value)}
                              placeholder="WhatsApp"
                              inputMode="tel"
                              aria-label="Número do WhatsApp"
                              className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-2 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                            />
                            <NotifyMark on={notify} onToggle={() => setNotify((on) => !on)} />
                          </div>
                        </div>
                        {fileName ? <p className="truncate text-xs text-muted">{fileName}</p> : null}
                      </div>
                    ) : (
                      <div className="cal-agenda-follow pb-1">
                        <span />
                        <div className="flex min-w-0 flex-col gap-1">
                          <p className="m-0 text-xs text-muted">{countdownLabel(today, occurrence)}</p>
                          {event.contact ? (
                            <p className="m-0 min-w-0 text-xs text-muted">
                              <ContactLine value={event.contact} />
                            </p>
                          ) : null}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-end pb-3">
                      {event.fileName ? (
                        <button
                          type="button"
                          aria-label="Visualizar anexo"
                          {...withTip("Visualizar", "flex size-8 shrink-0 items-center justify-center text-muted")}
                          onClick={() => viewAttachment(event.id)}
                        >
                          <FileImage className="size-4" />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        aria-label={event.notify ? "Desligar aviso" : "Ligar aviso"}
                        aria-pressed={Boolean(event.notify)}
                        {...withTip(
                          event.notify ? "Aviso ligado" : "Aviso",
                          cn("flex size-8 shrink-0 items-center justify-center", event.notify ? "text-fg" : "text-muted"),
                        )}
                        onClick={() => onUpdate({ ...event, notify: !event.notify })}
                      >
                        <Bell className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Editar ${event.title}`}
                        {...withTip("Editar", "flex size-8 items-center justify-center text-muted")}
                        onClick={() => {
                          setAdding(false);
                          setEditingId((id) => (id === event.id ? null : event.id));
                          setName(event.title);
                          setMessage(event.note ?? "");
                          setPhone(event.contact ?? "");
                          setNotify(Boolean(event.notify));
                          setFileName(event.fileName ?? "");
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
      {viewing ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4"
          onClick={closeView}
        >
          <div
            className="flex max-h-full max-w-full flex-col gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="m-0 truncate text-center text-xs text-white">{viewing.name}</p>
            {viewing.type.startsWith("image/") ? (
              <img src={viewing.url} alt={viewing.name} className="max-h-[78vh] max-w-full object-contain" />
            ) : (
              <iframe title={viewing.name} src={viewing.url} className="h-[78vh] w-[86vw] max-w-3xl bg-white" />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
