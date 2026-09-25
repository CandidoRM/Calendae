import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { HeaderMenu } from "@/components/header-menu";
import { FormSlot } from "@/components/form-slot";
import { A11yHint } from "@/components/a11y-hint";
import { MONTHS, fromIso, newEventId, type CalEvent } from "@/lib/calendar";
import { thirteenthMonths } from "@/lib/almanac";
import {
  benefitPayTitle,
  benefitThirteenthTitle,
  formatNb,
  formatPayDay,
  especieCode,
  especieInfo,
  inssCompetenceLabel,
  inssCompetencePay,
  inssPayIso,
  inssThirteenth,
  isBpcEspecie,
  parseEspecieField,
  parseNb,
  parseNbField,
  sanitizeInssField,
  type InssBracket,
} from "@/lib/inss";
import { cn, withTip } from "@/lib/utils";

const BRACKETS: { value: InssBracket; label: string }[] = [
  { value: "minimo", label: "até um salário mínimo" },
  { value: "acima", label: "acima de um salário mínimo" },
];

function FaixaPick({
  value,
  onChange,
}: {
  value: InssBracket;
  onChange: (value: InssBracket) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cal-kind-pick is-long flex items-center gap-2">
      <HeaderMenu
        label="Faixa do INSS"
        value={value}
        options={BRACKETS}
        open={open}
        wide
        fixed
        soft
        buttonClassName="cal-kind-btn"
        optionClassName="cal-kind-option"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onPick={(next) => {
          onChange(next);
          setOpen(false);
        }}
      />
    </div>
  );
}

type BenefitsTabProps = {
  year: number;
  month: number;
  today: string;
  openId: string | null;
  benefits: CalEvent[];
  onAdd: (event: CalEvent) => void;
  onRemove: (id: string) => void;
  onUpdate: (event: CalEvent) => void;
  onOpen: (event: CalEvent, iso: string) => void;
  framed?: boolean;
  adding?: boolean;
  formSlot?: string | null;
};

export function BenefitsTab({
  year,
  month,
  today,
  openId,
  benefits,
  onAdd,
  onRemove,
  onUpdate,
  onOpen,
  framed = true,
  adding: addingProp,
  formSlot = null,
}: BenefitsTabProps) {
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [addingSelf, setAddingSelf] = useState(false);
  const adding = addingProp ?? addingSelf;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nb, setNb] = useState("");
  const [especie, setEspecie] = useState("");
  const [name, setName] = useState("");
  const [bracket, setBracket] = useState<InssBracket>("minimo");
  const draftIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (adding) return;
    if (editingId) return;
    if (draftIdRef.current && !nb.trim() && !especie.trim()) {
      onRemove(draftIdRef.current);
    }
    setNb("");
    setEspecie("");
    setName("");
    setBracket("minimo");
    draftIdRef.current = null;
  }, [adding, editingId]);

  const parsed = parseNb(nb);
  const previewIso = parsed ? inssCompetencePay(year, month, parsed.digit, bracket) : null;

  const visible = benefits
    .flatMap((event) => {
      const parsedNb = parseNb(event.nb ?? "");
      if (!parsedNb) return [];
      const digit = parsedNb.digit;
      const eventBracket = event.bracket ?? "minimo";
      const iso = inssPayIso(year, month, digit, eventBracket);
      const rows: { event: CalEvent; iso: string; digit: number; tag: string | null }[] = [];
      if (iso) rows.push({ event, iso, digit, tag: null });
      if (!isBpcEspecie(event.especie ?? "")) {
        for (const extra of inssThirteenth(year, digit, eventBracket, thirteenthMonths(year))) {
          const date = fromIso(extra.iso);
          if (date.getFullYear() === year && date.getMonth() === month) {
            rows.push({ event, iso: extra.iso, digit, tag: extra.label });
          }
        }
      }
      return rows;
    })
    .sort((a, b) => a.iso.localeCompare(b.iso) || (a.tag ?? "").localeCompare(b.tag ?? ""));

  function resetForm() {
    setNb("");
    setEspecie("");
    setName("");
    setBracket("minimo");
    setEditingId(null);
    draftIdRef.current = null;
  }

  function persist(next: {
    nb?: string;
    especie?: string;
    name?: string;
    bracket?: InssBracket;
  }) {
    const nbVal = next.nb ?? nb;
    const espVal = next.especie ?? especie;
    const nameVal = next.name ?? name;
    const bracketVal = next.bracket ?? bracket;
    const parsedNb = parseNb(nbVal);
    const digits = parsedNb?.digits.replace(/\D/g, "") ?? "";
    const ready = Boolean(parsedNb && (digits.length >= 10 || nbVal.includes("-")));
    const target = editingId ?? draftIdRef.current;
    if (!ready) {
      if (!editingId && draftIdRef.current) {
        onRemove(draftIdRef.current);
        draftIdRef.current = null;
      }
      return;
    }
    const pay = inssCompetencePay(year, month, parsedNb!.digit, bracketVal);
    if (!pay) return;
    const bpcNow = isBpcEspecie(espVal);
    const info = especieInfo(espVal);
    const title =
      nameVal.trim() ||
      info?.name ||
      (especieCode(espVal) ? `Espécie ${especieCode(espVal)}` : "Benefício");
    const patch = {
      title,
      iso: pay,
      nb: parsedNb.digits,
      especie: espVal.trim() || undefined,
      bracket: bracketVal,
      thirteenth: !bpcNow,
      kind: "mensal" as const,
      source: "benefit" as const,
    };
    if (target) {
      const current = benefits.find((event) => event.id === target);
      if (current) onUpdate({ ...current, ...patch });
      return;
    }
    const id = newEventId();
    draftIdRef.current = id;
    onAdd({ id, ...patch });
  }

  function payHint() {
    if (!parsed || !previewIso) return null;
    const date = fromIso(previewIso);
    return `Final ${parsed.digit}: depósito em ${date.getDate()} de ${MONTHS[date.getMonth()]}.`;
  }

  const hint = payHint();

  const formFields = (
    <>
      <div className="flex gap-2">
        <input
          value={especie}
          onChange={(event) => {
            const parsedField = parseEspecieField(event.target.value);
            setEspecie(parsedField.especie);
            if (parsedField.nb) setNb(parsedField.nb);
            persist({
              especie: parsedField.especie,
              nb: parsedField.nb || undefined,
            });
          }}
          placeholder="B21"
          aria-label="Espécie"
          maxLength={22}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          className="cal-num-field h-11 w-[4.5rem] shrink-0 rounded-xl bg-bg px-2 text-center text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
          autoFocus={adding && !editingId}
        />
        <input
          value={nb}
          onChange={(event) => {
            const parsedField = parseNbField(event.target.value);
            if (parsedField.especie != null) setEspecie(parsedField.especie);
            setNb(parsedField.nb);
            persist({
              nb: parsedField.nb,
              especie: parsedField.especie ?? undefined,
            });
          }}
          placeholder="NB"
          aria-label="Número do benefício"
          inputMode="text"
          autoCorrect="off"
          spellCheck={false}
          className="cal-num-field h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
        />
      </div>
      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          persist({ name: event.target.value });
        }}
        placeholder="Nome (opcional)"
        className="h-11 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted"
      />
      <FaixaPick
        value={bracket}
        onChange={(value) => {
          setBracket(value);
          persist({ bracket: value });
        }}
      />
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </>
  );

  const body = (
    <>
      {framed || adding ? (
      <div className="cal-tab-head">
        <h2 className={framed ? "cal-tab-title" : "translate-y-3 text-sm font-medium text-fg"}>INSS</h2>
        {framed ? (
          <Button
            variant="ghost"
            size="icon"
            {...withTip("Novo")}
            aria-label="Novo recebimento"
            onClick={() => {
              pingGlyph();
              resetForm();
              setAddingSelf((v) => !v);
            }}
          >
            <CalendarGlyph className="size-5" flash={glyphFlash} />
          </Button>
        ) : null}
      </div>
      ) : null}
      {framed ? <A11yHint>Dia em que o benefício do INSS cai na conta.</A11yHint> : null}
      <FormSlot id={formSlot}>
      {adding ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">{formFields}</div>
      ) : null}
      </FormSlot>
      {visible.length === 0 ? null : (
        <ul className="cal-ruled mt-1">
          {visible.map(({ event, iso, digit, tag }) => {
            const open = openId === event.id;
            const past = iso < today;
            const editing = editingId === event.id;
            const competence = inssCompetenceLabel(iso, digit, event.bracket ?? "minimo");
            return (
              <li key={`${event.id}:${iso}:${tag ?? "pay"}`}>
                <button
                  type="button"
                  onClick={() => {
                    pingGlyph();
                    setEditingId(null);
                    onOpen(event, iso);
                  }}
                  className={cn(
                    "flex w-full items-baseline gap-3 border-t border-line py-3 text-left",
                    past && "opacity-55",
                  )}
                >
                  <span
                    className={cn(
                      "cal-agenda-tone min-w-8 shrink-0 tabular-nums text-sm",
                      open ? "text-today" : "text-muted",
                    )}
                  >
                    {formatPayDay(iso)}
                  </span>
                  <span
                    className={cn(
                      "cal-agenda-tone min-w-0 flex-1 truncate text-sm",
                      open ? "font-bold" : "font-medium",
                    )}
                  >
                    {tag ? benefitThirteenthTitle(event) : benefitPayTitle(event)}
                  </span>
                  <span
                    className={cn(
                      "cal-agenda-tone flex shrink-0 items-baseline gap-2.5 text-xs",
                      open ? "font-bold text-fg" : "text-muted",
                    )}
                  >
                    <span>({tag ?? "mensal"})</span>
                  </span>
                </button>
                <div className={cn("cal-event-details", open && "is-open")}>
                  <div>
                    {editing ? (
                      <div className="flex flex-col gap-2 pb-3">{formFields}</div>
                    ) : (
                      <div className="min-w-0 pb-3 pl-11 text-xs text-muted">
                        <p>
                          {event.especie ? `Espécie ${event.especie} · ` : ""}
                          NB {formatNb(event.nb ?? "")}
                        </p>
                        <p>
                          {event.bracket === "acima" ? "(maior salário)" : "(único salário)"}
                          {competence ? ` competência ${competence}` : ""}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-end pb-3">
                      <button
                        type="button"
                        aria-label={`Editar ${event.title}`}
                        {...withTip("Editar", "flex size-8 items-center justify-center text-muted")}
                        onClick={() => {
                          if (addingProp === undefined) setAddingSelf(false);
                          draftIdRef.current = null;
                          setEditingId((id) => (id === event.id ? null : event.id));
                          setNb(sanitizeInssField(event.nb ?? ""));
                          setEspecie(sanitizeInssField(event.especie ?? ""));
                          setName(
                            event.title === benefitPayTitle({ title: "", especie: event.especie }) ||
                              event.title.startsWith("INSS final") ||
                              /\bfinal\s+\d\b/i.test(event.title) ||
                              event.title === especieInfo(event.especie)?.name
                              ? ""
                              : event.title,
                          );
                          setBracket(event.bracket ?? "minimo");
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
