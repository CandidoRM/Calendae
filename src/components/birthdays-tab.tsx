import { Contact, Pencil, Smile, Trash2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { A11yHint } from "@/components/a11y-hint";
import { DatePick } from "@/components/date-time-pick";
import { fromIso, weekdayName, type CalEvent, type WeekStart } from "@/lib/calendar";
import { pickDeviceContact, pullPhone, splitContact } from "@/lib/contacts";
import { cn, withTip } from "@/lib/utils";

const BASIC_EMOJIS = ["😀", "😊", "🥳", "😍", "👍", "❤️", "🎉", "🎂", "🙏"];

function MessageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
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
      <button
        ref={buttonRef}
        type="button"
        aria-label="Inserir emoticon"
        {...withTip("Emoticons", "mt-0.5 flex size-8 shrink-0 items-center justify-center text-fg")}
        onClick={() => setOpen((current) => !current)}
      >
        <Smile className="size-4" />
      </button>
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
  const [dateIso, setDateIso] = useState(selectedIso);

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
    };
    if (!draftId.current) {
      draftId.current = next.id;
      onAddRef.current(next);
      return;
    }
    onUpdateRef.current(next);
  }, [adding, name, message, phone, dateIso]);

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
    });
  }, [editingId, adding, name, message, phone, dateIso]);

  const visible = birthdays
    .filter((event) => {
      const date = fromIso(event.iso);
      return date.getMonth() === month && year >= date.getFullYear();
    })
    .sort((a, b) => fromIso(a.iso).getDate() - fromIso(b.iso).getDate());

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
            setDateIso(selectedIso);
          }}
        >
          <CalendarGlyph className="size-5" flash={glyphFlash} />
        </Button>
      </div>
      <A11yHint>Datas de aniversário, repetidas todo ano.</A11yHint>
      {adding ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
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
          <MessageField value={message} onChange={setMessage} />
          <div className="flex items-center gap-2">
            <DatePick value={dateIso} weekStart={weekStart} onChange={setDateIso} />
            <input
              value={phone}
              onChange={(event) => onPhone(event.target.value)}
              placeholder="WhatsApp"
              inputMode="tel"
              aria-label="Número do WhatsApp"
              className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-2 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
            />
          </div>
        </div>
      ) : null}
      {visible.length === 0 && !adding ? (
        <p className="mt-3 border-t border-line pt-3 text-pretty text-sm text-muted">
          Nenhum aniversário neste mês.
        </p>
      ) : (
        <ul className="mt-1">
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
                      <div className="flex flex-col gap-2 pb-3">
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
                        <MessageField value={message} onChange={setMessage} />
                        <div className="flex items-center gap-2">
                          <DatePick value={dateIso} weekStart={weekStart} onChange={setDateIso} />
                          <input
                            value={phone}
                            onChange={(change) => onPhone(change.target.value)}
                            placeholder="WhatsApp"
                            inputMode="tel"
                            aria-label="Número do WhatsApp"
                            className="h-11 min-w-0 flex-1 rounded-xl bg-bg px-2 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
                          />
                        </div>
                      </div>
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
                          setMessage(event.note ?? "");
                          setPhone(event.contact ?? "");
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
