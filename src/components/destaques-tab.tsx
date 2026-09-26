import { useState } from "react";
import { A11yHint } from "@/components/a11y-hint";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { Button } from "@/components/ui/button";
import { fromIso, weekdayName, type CalEvent } from "@/lib/calendar";
import { electionRaceLabel } from "@/lib/elections";
import { cn, withTip } from "@/lib/utils";

function KindMark({ on }: { on: boolean }) {
  return <span aria-hidden="true" className={cn("cal-kind", on && "is-on")} />;
}

function rowTitle(event: CalEvent): string {
  if (event.holidayKind === "election") return electionRaceLabel(fromIso(event.iso).getFullYear());
  if (event.holidayKind === "enem") return "ENEM";
  return event.title;
}

function rowTag(event: CalEvent): string | null {
  if (event.holidayKind === "election" || event.holidayKind === "enem") return `(${event.title})`;
  if (event.holidayKind === "season") return "(estação)";
  if (event.holidayKind === "lunar") {
    if (!event.title.startsWith("Eclipse")) return "(lunar)";
    return event.place?.startsWith("Parcial") ? "(parcial)" : "(total)";
  }
  return null;
}

function rowDetail(event: CalEvent, place: string, zone: string): string {
  if (event.holidayKind === "election") {
    return [place, zone ? `Zona ${zone}` : ""].filter(Boolean).join(" · ") || "Eleitoral";
  }
  if (event.holidayKind === "enem") return event.confirmed ? "Confirmado" : "Previsto";
  return event.place || "Estação";
}

type DestaquesTabProps = {
  year: number;
  month: number;
  today: string;
  openId: string | null;
  events: CalEvent[];
  elections: boolean;
  electionSecondRound: boolean;
  enem: boolean;
  seasons: boolean;
  lunar: boolean;
  electionPlace: string;
  electionZone: string;
  onToggleElections: (on: boolean) => void;
  onToggleSecondRound: (on: boolean) => void;
  onToggleEnem: (on: boolean) => void;
  onToggleSeasons: (on: boolean) => void;
  onToggleLunar: (on: boolean) => void;
  onElectionPlace: (value: string) => void;
  onElectionZone: (value: string) => void;
  onOpen: (event: CalEvent) => void;
};

export function DestaquesTab({
  year,
  month,
  today,
  openId,
  events,
  elections,
  electionSecondRound,
  enem,
  seasons,
  lunar,
  electionPlace,
  electionZone,
  onToggleElections,
  onToggleSecondRound,
  onToggleEnem,
  onToggleSeasons,
  onToggleLunar,
  onElectionPlace,
  onElectionZone,
  onOpen,
}: DestaquesTabProps) {
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [adding, setAdding] = useState(false);
  const rows = events
    .filter((event) => {
      const date = fromIso(event.iso);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .sort((a, b) => a.iso.localeCompare(b.iso) || a.title.localeCompare(b.title));

  return (
    <section className="cal-tab" data-cal-tab="destaques">
      <div className="cal-tab-head">
        <h2 className="cal-tab-title">Destaques</h2>
        <Button
          variant="ghost"
          size="icon"
          {...withTip("Opções")}
          aria-label="Opções de destaques"
          onClick={() => {
            pingGlyph();
            setAdding((open) => !open);
          }}
        >
          <CalendarGlyph className="size-5" flash={glyphFlash} />
        </Button>
      </div>
      <A11yHint>Eleição, ENEM, estações e Lua. Não são feriado.</A11yHint>
      {adding ? (
        <div className="cal-holiday-opts mt-3 flex flex-col border-t border-line pt-3">
          <button
            type="button"
            className="flex h-7 w-full items-center gap-3 text-left text-sm"
            aria-pressed={elections}
            onClick={() => onToggleElections(!elections)}
          >
            <KindMark on={elections} />
            Eleições
          </button>
          <A11yHint>Turnos da eleição. Local e zona aparecem na lista.</A11yHint>
          <div className="flex gap-2 pl-7">
            <input
              value={electionPlace}
              disabled={!elections}
              onChange={(event) => {
                const next = event.target.value.replace(/[^\p{L}\s-]/gu, "");
                onElectionPlace(next.replace(/\s+/g, " "));
              }}
              placeholder="Local"
              inputMode="text"
              autoCapitalize="words"
              autoCorrect="off"
              className={cn(
                "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
                !elections && "cursor-not-allowed opacity-45",
              )}
            />
            <input
              value={electionZone}
              disabled={!elections}
              onChange={(event) => onElectionZone(event.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="Zona"
              inputMode="numeric"
              maxLength={4}
              aria-label="Zona eleitoral"
              className={cn(
                "h-11 w-[4.5rem] shrink-0 rounded-xl bg-bg px-0 text-center text-sm tabular-nums text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
                !elections && "cursor-not-allowed opacity-45",
              )}
            />
          </div>
          <button
            type="button"
            className={cn(
              "flex h-7 w-full items-center gap-3 pl-7 text-left text-sm",
              !elections && "cursor-not-allowed opacity-45",
            )}
            aria-pressed={elections ? electionSecondRound : false}
            disabled={!elections}
            onClick={() => {
              if (!elections) return;
              onToggleSecondRound(!electionSecondRound);
            }}
          >
            <KindMark on={elections ? electionSecondRound : false} />
            2º turno
          </button>
          <A11yHint>Marca o segundo turno, se houver.</A11yHint>
          <button
            type="button"
            className="flex h-7 w-full items-center gap-3 text-left text-sm"
            aria-pressed={enem}
            onClick={() => onToggleEnem(!enem)}
          >
            <KindMark on={enem} />
            ENEM
          </button>
          <A11yHint>Os dois dias de prova.</A11yHint>
          <button
            type="button"
            className="flex h-7 w-full items-center gap-3 text-left text-sm"
            aria-pressed={seasons}
            onClick={() => onToggleSeasons(!seasons)}
          >
            <KindMark on={seasons} />
            Estações
          </button>
          <A11yHint>Início de cada estação, solstício ou equinócio.</A11yHint>
          <button
            type="button"
            className="flex h-7 w-full items-center gap-3 text-left text-sm"
            aria-pressed={lunar}
            onClick={() => onToggleLunar(!lunar)}
          >
            <KindMark on={lunar} />
            Lunar
          </button>
          <A11yHint>Fases da Lua e eclipses visíveis no Brasil.</A11yHint>
        </div>
      ) : null}
      {rows.length === 0 ? (
        <p className={cn("text-pretty text-sm text-muted", adding ? "mt-2" : "mt-3 border-t border-line pt-3")}>
          Nada neste mês.
        </p>
      ) : (
        <ul className="mt-1">
          {rows.map((event) => {
            const past = event.iso < today;
            const open = openId === event.id;
            const tag = rowTag(event);
            const detail = rowDetail(event, electionPlace, electionZone);
            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => onOpen(event)}
                  className={cn(
                    "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
                    past && "opacity-55",
                  )}
                >
                  <span className={cn("cal-agenda-tone cal-dmy text-[0.8rem]", open ? "text-today" : "text-muted")}>
                    <span>{String(fromIso(event.iso).getDate()).padStart(2, "0")}</span>
                    <span>/</span>
                    <span>{String(fromIso(event.iso).getMonth() + 1).padStart(2, "0")}</span>
                  </span>
                  <span className={cn("cal-agenda-tone min-w-0 text-pretty text-sm", open ? "font-bold" : "font-medium")}>
                    {rowTitle(event)}
                  </span>
                  <span className={cn("cal-agenda-tone text-right text-xs", open ? "font-bold text-fg" : "font-normal text-muted")}>
                    {tag}
                  </span>
                  <span className={cn("cal-agenda-tone text-xs capitalize", open ? "font-bold text-fg" : "font-normal text-muted")}>
                    {weekdayName(event.iso).slice(0, 3)}
                  </span>
                </button>
                <div className={cn("cal-event-details", open && "is-open")}>
                  <div>
                    {detail ? (
                      <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
                        <span />
                        <span className="col-span-2 whitespace-nowrap">{detail}</span>
                      </p>
                    ) : (
                      <span />
                    )}
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
