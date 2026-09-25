import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarGlyph, useGlyphFlash } from "@/components/calendar-glyph";
import { A11yHint } from "@/components/a11y-hint";
import {
  commemorativeAka,
  facultativeAka,
  facultativeName,
  fromIso,
  isNational,
  nationalAka,
  officialHolidayTitle,
  uniqueEvents,
  weekdayName,
  type CalEvent,
} from "@/lib/calendar";
import { cn, withTip } from "@/lib/utils";
import { electionRaceLabel } from "@/lib/elections";

type CityHit = { ibge: number; name: string; uf: string };

function KindMark({ on }: { on: boolean }) {
  return <span aria-hidden="true" className={cn("cal-kind", on && "is-on")} />;
}

function holidayKindLabel(event: CalEvent): string | null {
  if (event.holidayKind === "municipal") return "(municipal)";
  if (event.holidayKind === "commemorative") return "(comemorativo)";
  if (event.holidayKind === "facultative" || facultativeName(event.title)) return "(facultativo)";
  if (event.holidayKind === "election") return `(${event.title})`;
  if (event.holidayKind === "enem") return `(${event.title})`;
  if (event.holidayKind === "season") return "(estação)";
  return null;
}

function holidayTypeName(event: CalEvent): string {
  if (event.holidayKind === "municipal") return event.place || "Municipal";
  if (event.holidayKind === "commemorative") {
    return commemorativeAka(event.title) ?? nationalAka(event.title) ?? "Comemorativo";
  }
  if (event.holidayKind === "facultative" || facultativeName(event.title)) {
    return facultativeAka(event.title) ?? "Ponto facultativo";
  }
  if (event.holidayKind === "election") return "Eleitoral";
  if (event.holidayKind === "enem") return event.confirmed ? "Confirmado" : "Previsto";
  if (event.holidayKind === "season") return event.place || "Estação";
  return nationalAka(event.title) ?? "Histórico";
}

function holidayTitle(event: CalEvent): string {
  if (event.holidayKind === "election") {
    return electionRaceLabel(fromIso(event.iso).getFullYear());
  }
  if (event.holidayKind === "enem") return "ENEM";
  if (event.holidayKind === "season") return event.title;
  return officialHolidayTitle(event);
}

type HolidaysTabProps = {
  year: number;
  month: number;
  today: string;
  openId: string | null;
  catalog: CalEvent[];
  extras: CalEvent[];
  pool: CalEvent[];
  municipal: boolean;
  commemorative: boolean;
  facultative: boolean;
  national: boolean;
  cityName: string;
  cityUf: string;
  cityIbge: number | null;
  onToggleMunicipal: (on: boolean) => void;
  onToggleCommemorative: (on: boolean) => void;
  onToggleFacultative: (on: boolean) => void;
  onToggleNational: (on: boolean) => void;
  onSearchCity: (query: string, uf?: string) => Promise<CityHit[]>;
  onPickCity: (city: CityHit) => void;
  onLocate: () => Promise<CityHit | null>;
  onOpen: (event: CalEvent) => void;
};

export function HolidaysTab({
  year,
  month,
  today,
  openId,
  catalog,
  extras,
  pool,
  municipal,
  commemorative,
  facultative,
  national,
  cityName,
  cityUf,
  cityIbge,
  onToggleMunicipal,
  onToggleCommemorative,
  onToggleFacultative,
  onToggleNational,
  onSearchCity,
  onPickCity,
  onLocate,
  onOpen,
}: HolidaysTabProps) {
  const [glyphFlash, pingGlyph] = useGlyphFlash();
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState(cityName);
  const [uf, setUf] = useState(cityUf);
  const [draftMunicipal, setDraftMunicipal] = useState(municipal);
  const [draftCommemorative, setDraftCommemorative] = useState(commemorative);
  const [draftFacultative, setDraftFacultative] = useState(facultative);
  const [draftNational, setDraftNational] = useState(national);
  const [pendingCity, setPendingCity] = useState<CityHit | null>(
    cityIbge ? { ibge: cityIbge, name: cityName, uf: cityUf } : null,
  );
  const [suggestions, setSuggestions] = useState<CityHit[]>([]);
  const debounce = useRef<number | null>(null);

  useEffect(() => {
    if (!adding) return;
    setQuery(cityName);
    setUf(cityUf);
    setDraftMunicipal(municipal);
    setDraftCommemorative(commemorative);
    setDraftFacultative(facultative);
    setDraftNational(national);
    setPendingCity(cityIbge ? { ibge: cityIbge, name: cityName, uf: cityUf } : null);
    setSuggestions([]);
  }, [adding, cityName, cityUf, cityIbge, municipal, commemorative, facultative, national]);

  function fold(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function applyHits(value: string, hits: CityHit[]) {
    const exact = hits.filter((city) => fold(city.name) === fold(value));
    if (exact.length === 1) {
      setSuggestions([]);
      setPendingCity(exact[0]);
      setQuery(exact[0].name);
      setUf(exact[0].uf);
      onPickCity(exact[0]);
      return;
    }
    if (hits.length === 1) {
      setSuggestions([]);
      setPendingCity(hits[0]);
      setQuery(hits[0].name);
      setUf(hits[0].uf);
      onPickCity(hits[0]);
      return;
    }
    setSuggestions(exact.length > 1 ? exact : hits);
  }

  function searchSoon(name: string, state: string) {
    if (debounce.current) window.clearTimeout(debounce.current);
    const city = name.trim();
    if (city.length < 2) {
      setSuggestions([]);
      return;
    }
    debounce.current = window.setTimeout(() => {
      void onSearchCity(city, state || undefined).then((hits) => applyHits(city, hits));
    }, 280);
  }

  function onCityInput(value: string) {
    const letters = value.replace(/[^\p{L}\s-]/gu, "");
    const split = letters.match(/^(.*)-(\p{L}{2})$/u);
    if (split) {
      const city = split[1].replace(/\s+/g, " ").trim();
      const state = split[2].toUpperCase();
      setQuery(city);
      setUf(state);
      searchSoon(city, state);
      return;
    }
    const city = letters.replace(/\s+/g, " ");
    setQuery(city);
    searchSoon(city, uf);
  }

  function onUfInput(value: string) {
    const next = value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
    setUf(next);
    searchSoon(query, next);
  }

  const source: CalEvent[] = uniqueEvents([...catalog, ...extras]);
  const events = source
    .filter((event) => {
      const date = fromIso(event.iso);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .sort((a, b) => a.iso.localeCompare(b.iso) || a.title.localeCompare(b.title));

  const available = uniqueEvents(pool).filter((event) => {
    const date = fromIso(event.iso);
    return date.getFullYear() === year && date.getMonth() === month;
  });
  const empty =
    events.length === 0
      ? !national && available.some(isNational)
        ? "Feriados desativados"
        : "Mês sem feriados oficiais"
      : null;

  return (
    <section className="cal-tab">
      <div className="cal-tab-head">
        <h2 className="cal-tab-title">Feriados</h2>
        <Button
          variant="ghost"
          size="icon"
          {...withTip("Opções")}
          aria-label="Opções de feriados"
          onClick={() => {
            pingGlyph();
            setAdding((v) => !v);
          }}
        >
          <CalendarGlyph className="size-5" flash={glyphFlash} />
        </Button>
      </div>
      <A11yHint>Datas em que não há expediente, mais comemorações do mês.</A11yHint>
      {adding ? (
        <div className="cal-holiday-opts mt-3 flex flex-col border-t border-line pt-3">
          <button
            type="button"
            className="flex h-7 w-full items-center gap-3 text-left text-sm"
            aria-pressed={draftNational}
            onClick={() => {
              const next = !draftNational;
              setDraftNational(next);
              onToggleNational(next);
            }}
          >
            <KindMark on={draftNational} />
            Nacionais
          </button>
          <A11yHint>Feriados de todo o país, com folga no expediente.</A11yHint>
          <button
            type="button"
            className="flex h-7 w-full items-center gap-3 text-left text-sm"
            aria-pressed={draftFacultative}
            onClick={() => {
              const next = !draftFacultative;
              setDraftFacultative(next);
              onToggleFacultative(next);
            }}
          >
            <KindMark on={draftFacultative} />
            Facultativos
          </button>
          <A11yHint>Pontos facultativos, como Carnaval e Corpus Christi.</A11yHint>
          <button
            type="button"
            className="flex h-7 w-full items-center gap-3 text-left text-sm"
            aria-pressed={draftCommemorative}
            onClick={() => {
              const next = !draftCommemorative;
              setDraftCommemorative(next);
              onToggleCommemorative(next);
            }}
          >
            <KindMark on={draftCommemorative} />
            Comemorativos
          </button>
          <A11yHint>Datas lembradas, sem folga no trabalho.</A11yHint>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-7 min-w-0 flex-1 items-center gap-3 text-left text-sm"
                aria-pressed={draftMunicipal}
                onClick={() => {
                  const next = !draftMunicipal;
                  setDraftMunicipal(next);
                  onToggleMunicipal(next);
                }}
              >
                <KindMark on={draftMunicipal} />
                Municipais
              </button>
              <button
                type="button"
                aria-label="Usar minha localização"
                {...withTip("Localização", "flex size-8 shrink-0 items-center justify-center text-muted")}
                onClick={() => {
                  void onLocate().then((city) => {
                    if (!city) return;
                    setDraftMunicipal(true);
                    onToggleMunicipal(true);
                    setQuery(city.name);
                    setUf(city.uf);
                    setPendingCity(city);
                    setSuggestions([]);
                    onPickCity(city);
                  });
                }}
              >
                <MapPin className="size-4" />
              </button>
            </div>
            <A11yHint>Feriados só da sua cidade, como padroeiro.</A11yHint>
            <div className="flex flex-col gap-2 pl-7">
              <div className="flex gap-2">
                <input
                  value={query}
                  disabled={!draftMunicipal}
                  onChange={(event) => onCityInput(event.target.value)}
                  placeholder="Cidade"
                  inputMode="text"
                  autoCapitalize="words"
                  autoCorrect="off"
                  className={cn(
                    "h-11 min-w-0 flex-1 rounded-xl bg-bg px-3 text-sm text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
                    !draftMunicipal && "cursor-not-allowed opacity-45",
                  )}
                  onKeyDown={(event) => {
                    if (!draftMunicipal || event.key !== "Enter") return;
                    event.preventDefault();
                    const city = suggestions[0] ?? pendingCity;
                    if (!city) return;
                    setSuggestions([]);
                    setQuery(city.name);
                    setUf(city.uf);
                    setPendingCity(city);
                    onPickCity(city);
                  }}
                />
                <input
                  value={uf}
                  disabled={!draftMunicipal}
                  onChange={(event) => onUfInput(event.target.value)}
                  placeholder="UF"
                  maxLength={2}
                  aria-label="Estado"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  className={cn(
                    "h-11 w-14 shrink-0 rounded-xl bg-bg px-0 text-center text-sm uppercase tracking-wide text-fg shadow-[0_0_0_1px_var(--c-line)] outline-none placeholder:text-muted",
                    !draftMunicipal && "cursor-not-allowed opacity-45",
                  )}
                />
              </div>
              {draftMunicipal && suggestions.length ? (
                <ul className="overflow-hidden rounded-xl shadow-[0_0_0_1px_var(--c-line)]">
                  {suggestions.map((city) => (
                    <li key={city.ibge}>
                      <button
                        type="button"
                        className="flex h-11 w-full items-center px-3 text-left text-sm"
                        onClick={() => {
                          setSuggestions([]);
                          setQuery(city.name);
                          setUf(city.uf);
                          setPendingCity(city);
                          onPickCity(city);
                        }}
                      >
                        {city.name}, {city.uf}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
      {empty ? (
        <p
          className={cn(
            "text-pretty text-sm text-muted",
            adding ? "mt-2" : "mt-3 border-t border-line pt-3",
          )}
        >
          {empty}
        </p>
      ) : (
        <ul className="mt-1">
          {events.map((event) => {
            const past = event.iso < today;
            const open = openId === event.id;
            const kindLabel = holidayKindLabel(event);
            return (
              <li key={event.id}>
                <button
                  type="button"
                  onClick={() => {
                    pingGlyph();
                    onOpen(event);
                  }}
                  className={cn(
                    "grid w-full grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 border-t border-line py-3 text-left",
                    past && "opacity-55",
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
                  <span
                    className={cn(
                      "cal-agenda-tone min-w-0 text-sm",
                      kindLabel ? "text-pretty" : "col-span-2 whitespace-nowrap",
                      open ? "font-bold" : "font-medium",
                    )}
                  >
                    {holidayTitle(event)}
                  </span>
                  {kindLabel ? (
                    <span
                      className={cn(
                        "cal-agenda-tone text-right text-xs",
                        open ? "font-bold text-fg" : "font-normal text-muted",
                      )}
                    >
                      {kindLabel}
                    </span>
                  ) : null}
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
                    {holidayTypeName(event) ? (
                      <p className="grid grid-cols-[2.85rem_minmax(0,1fr)_7.25rem_1.65rem] items-baseline gap-x-2.5 pb-3 text-xs text-muted">
                        <span />
                        <span className="col-span-2 whitespace-nowrap">{holidayTypeName(event)}</span>
                      </p>
                    ) : null}
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
