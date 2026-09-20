import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ConnectorType, GoogleCalendarTools } from "@/lib/app-data";
import { fallbackHolidays, facultativeName, parseGoogleEvents, type CalEvent } from "@/lib/calendar";
import { KNOWN_SECOND_ROUND_FEDERAL } from "@/lib/elections";
import { tsePresidentSecondRound } from "@/lib/elections-tse";
import type { InssYearTable } from "@/lib/inss";

export type GoogleMonthResult = {
  ok: boolean;
  events: CalEvent[];
  errorMessage?: string;
  loginRequired?: boolean;
  loginUrl?: string;
  pending?: boolean;
};

export type HolidayFetch = {
  events: CalEvent[];
  live: boolean;
};

export const getHolidays = createServerFn({ method: "GET" })
  .validator(z.object({ year: z.number().int().min(2000).max(2100) }))
  .handler(async ({ data }): Promise<HolidayFetch> => {
    try {
      const res = await fetch(`https://brasilapi.com.br/api/feriados/v1/${data.year}`, {
        signal: AbortSignal.timeout(2500),
      });
      if (!res.ok) return { events: fallbackHolidays(data.year), live: false };
      const json: unknown = await res.json();
      if (!Array.isArray(json)) {
        return { events: fallbackHolidays(data.year), live: false };
      }
      const events: CalEvent[] = [];
      for (const row of json) {
        const item = row as { date?: string; name?: string; type?: string };
        if (!item.date || !item.name) continue;
        if (item.type && item.type !== "national") continue;
        events.push({
          id: `holiday-${item.date}-${item.name}`,
          iso: item.date,
          title: item.name,
          time: "",
          source: "holiday",
          holidayKind: facultativeName(item.name) ? "facultative" : "national",
        });
      }
      if (!events.length) return { events: fallbackHolidays(data.year), live: false };
      const seen = new Set(events.map((event) => event.iso));
      for (const row of fallbackHolidays(data.year)) {
        if (row.holidayKind === "facultative" && !seen.has(row.iso)) events.push(row);
      }
      return { events, live: true };
    } catch {
      return { events: fallbackHolidays(data.year), live: false };
    }
  });

export const confirmElectionSecondRound = createServerFn({ method: "GET" })
  .validator(z.object({ year: z.number().int().min(2000).max(2100) }))
  .handler(async ({ data }): Promise<{ confirmed: boolean; source?: "tse" | "wiki" | "known" }> => {
    if (data.year % 4 !== 2) return { confirmed: false };
    if (KNOWN_SECOND_ROUND_FEDERAL.has(data.year)) return { confirmed: true, source: "known" };

    try {
      const official = await tsePresidentSecondRound(data.year);
      if (official === true) return { confirmed: true, source: "tse" };
      if (official === false) return { confirmed: false };
    } catch {
      /* cycle not published yet */
    }

    function readsConfirmed(extract: string): boolean {
      const text = extract.toLowerCase();
      if (!text.includes("segundo turno") && !text.includes("second round") && !text.includes("runoff")) {
        return false;
      }
      if (/caso necess|caso nenhum|se ningu[eé]m|if necessary|should no candidate/.test(text)) {
        return false;
      }
      return /disput|confirmado|foi para o segundo|ir[aá] para o segundo|haver[aá] segundo|runoff|second round (will|was|is being|took)/.test(
        text,
      );
    }

    async function wikiExtract(lang: "pt" | "en", title: string): Promise<string> {
      const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${title}`, {
        signal: AbortSignal.timeout(2500),
      });
      if (!res.ok) return "";
      const json: unknown = await res.json();
      return typeof json === "object" && json && "extract" in json && typeof json.extract === "string"
        ? json.extract
        : "";
    }

    try {
      const [pt, en] = await Promise.all([
        wikiExtract("pt", `Elei%C3%A7%C3%B5es_gerais_no_Brasil_em_${data.year}`),
        wikiExtract("en", `${data.year}_Brazilian_general_election`),
      ]);
      if (readsConfirmed(pt) || readsConfirmed(en)) return { confirmed: true, source: "wiki" };
      return { confirmed: false };
    } catch {
      return { confirmed: false };
    }
  });

export const getGoogleMonth = createServerFn({ method: "POST" })
  .validator(
    z.object({
      timeMin: z.string(),
      timeMax: z.string(),
    }),
  )
  .handler(async ({ data }): Promise<GoogleMonthResult> => {
    const { callTool } = await import("@/lib/app-data/client.server");
    const result = await callTool(
      GoogleCalendarTools.search,
      {
        query: "",
        timeMin: data.timeMin,
        timeMax: data.timeMax,
      },
      { connectorType: ConnectorType.GoogleCalendar },
    );
    return {
      ok: result.ok,
      events: result.ok ? parseGoogleEvents(result.data) : [],
      errorMessage: result.errorMessage,
      loginRequired: result.loginRequired,
      loginUrl: result.loginUrl,
      pending: result.pending,
    };
  });

export type CityHit = {
  ibge: number;
  name: string;
  uf: string;
};

type MunRow = {
  data?: string;
  nome?: string;
  tipo?: string;
  uf?: string;
  codigo_ibge?: number | string;
};

const NOMINATIM_UA = "Calendae/1.0 (calendar; feriados municipais)";
let munYearCache: { year: number; rows: MunRow[] } | null = null;
let cityIndex: CityHit[] | null = null;

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function brDateToIso(raw: string, year: number): string | null {
  const match = raw.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm] = match;
  return `${year}-${mm}-${dd}`;
}

function ufFromAddress(address: Record<string, string> | undefined): string {
  const iso = address?.["ISO3166-2-lvl4"] ?? "";
  if (iso.startsWith("BR-")) return iso.slice(3);
  return "";
}

function cityFromNominatim(hit: {
  name?: string;
  extratags?: Record<string, string>;
  address?: Record<string, string>;
}): CityHit | null {
  const ibge = Number(hit.extratags?.["IBGE:GEOCODIGO"]);
  const name = hit.address?.city || hit.address?.town || hit.address?.municipality || hit.name;
  const uf = ufFromAddress(hit.address);
  if (!ibge || !name || !uf) return null;
  return { ibge, name, uf };
}

async function loadMunicipalRows(year: number): Promise<MunRow[]> {
  if (munYearCache && (munYearCache.year === year || munYearCache.rows.length)) {
    if (munYearCache.year === year) return munYearCache.rows;
  }
  const urls = [
    `https://cdn.jsdelivr.net/gh/joaopbini/feriados-brasil@master/dados/feriados/municipal/json/${year}.json`,
    "https://cdn.jsdelivr.net/gh/joaopbini/feriados-brasil@master/dados/feriados/municipal/json/2026.json",
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const json: unknown = await res.json();
      if (!Array.isArray(json)) continue;
      munYearCache = { year, rows: json as MunRow[] };
      return munYearCache.rows;
    } catch {
      continue;
    }
  }
  return munYearCache?.rows ?? [];
}

async function loadCityIndex(): Promise<CityHit[]> {
  if (cityIndex?.length) return cityIndex;
  const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios", {
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) return cityIndex ?? [];
  const json: unknown = await res.json();
  if (!Array.isArray(json)) return cityIndex ?? [];
  const out: CityHit[] = [];
  for (const row of json) {
    const item = row as {
      id?: number;
      nome?: string;
      microrregiao?: { mesorregiao?: { UF?: { sigla?: string } } };
    };
    const ibge = Number(item.id);
    const name = item.nome ?? "";
    const uf = item.microrregiao?.mesorregiao?.UF?.sigla ?? "";
    if (!ibge || !name || !uf) continue;
    out.push({ ibge, name, uf });
  }
  cityIndex = out;
  return out;
}

export const searchMunicipio = createServerFn({ method: "GET" })
  .validator(z.object({ query: z.string().min(2).max(80), uf: z.string().max(2).optional() }))
  .handler(async ({ data }): Promise<CityHit[]> => {
    const q = fold(data.query);
    const uf = data.uf?.trim().toUpperCase() ?? "";
    if (q.length < 2) return [];
    try {
      const cities = await loadCityIndex();
      const scored = cities
        .filter((city) => !uf || city.uf === uf)
        .map((city) => {
          const name = fold(city.name);
          const score = name === q ? 0 : name.startsWith(q) ? 1 : name.includes(q) ? 2 : 9;
          return { city, score };
        })
        .filter((row) => row.score < 9)
        .sort((a, b) => a.score - b.score || a.city.name.localeCompare(b.city.name, "pt-BR"));
      return scored.slice(0, 8).map((row) => row.city);
    } catch {
      return [];
    }
  });

export const locateMunicipio = createServerFn({ method: "GET" })
  .validator(z.object({ lat: z.number(), lon: z.number() }))
  .handler(async ({ data }): Promise<CityHit | null> => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${data.lat}&lon=${data.lon}&zoom=10&addressdetails=1&extratags=1`;
      const res = await fetch(url, {
        headers: { "User-Agent": NOMINATIM_UA, Accept: "application/json" },
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return null;
      const json: unknown = await res.json();
      return cityFromNominatim(json as Parameters<typeof cityFromNominatim>[0]);
    } catch {
      return null;
    }
  });

export const getMunicipalHolidays = createServerFn({ method: "GET" })
  .validator(
    z.object({
      year: z.number().int().min(2000).max(2100),
      ibge: z.number().int(),
      city: z.string().min(1).max(80),
      uf: z.string().max(2).optional(),
    }),
  )
  .handler(async ({ data }): Promise<CalEvent[]> => {
    const rows = await loadMunicipalRows(data.year);
    const nationals = new Set(fallbackHolidays(data.year).map((event) => event.iso));
    const out: CalEvent[] = [];
    for (const row of rows) {
      if (Number(row.codigo_ibge) !== data.ibge) continue;
      if (row.tipo && row.tipo !== "MUNICIPAL") continue;
      if (!row.data || !row.nome) continue;
      const iso = brDateToIso(row.data, data.year);
      if (!iso || nationals.has(iso)) continue;
      out.push({
        id: `mun-${data.ibge}-${iso}-${row.nome}`,
        iso,
        title: row.nome,
        time: "",
        place: data.uf ? `${data.city}-${data.uf}` : data.city,
        source: "holiday",
        holidayKind: "municipal",
      });
    }
    return out;
  });

const MONTH_INDEX: Record<string, number> = {
  jan: 0, fev: 1, mar: 2, abr: 3, mai: 4, jun: 5,
  jul: 6, ago: 7, set: 8, out: 9, nov: 10, dez: 11,
};

function stripCell(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tableRows(table: string): string[][] {
  const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) =>
    [...row[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((cell) => stripCell(cell[1])),
  );
  return rows.filter((row) => row.length >= 2);
}

function parsePayCell(raw: string, year: number, competence: number): string | null {
  const hit = raw.toLowerCase().match(/(\d{1,2})\s*\/\s*([a-zç]{3})/);
  if (!hit) return null;
  const month = MONTH_INDEX[hit[2]];
  if (month == null) return null;
  const day = Number(hit[1]);
  const payYear = month < competence ? year + 1 : year;
  const iso = `${payYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const date = new Date(payYear, month, day);
  if (date.getFullYear() !== payYear || date.getMonth() !== month || date.getDate() !== day) return null;
  return iso;
}

function emptyBoard(): Record<number, string[]> {
  const board: Record<number, string[]> = {};
  for (let digit = 0; digit <= 9; digit += 1) board[digit] = Array.from({ length: 12 }, () => "");
  return board;
}

function fillBoard(rows: string[][], year: number, grouped: boolean): Record<number, string[]> | null {
  const board = emptyBoard();
  let filled = 0;
  for (const row of rows) {
    const digits = (row[0].match(/\d/g) ?? []).map(Number).filter((digit) => digit >= 0 && digit <= 9);
    if (!digits.length) continue;
    if (grouped && digits.length < 2) continue;
    if (!grouped && digits.length !== 1) continue;
    for (let month = 0; month < 12; month += 1) {
      const iso = parsePayCell(row[month + 1] ?? "", year, month);
      if (!iso) continue;
      for (const digit of digits) {
        board[digit][month] = iso;
        filled += 1;
      }
    }
  }
  if (filled < 40) return null;
  return board;
}

function parseInssHtml(html: string, year: number): InssYearTable | null {
  const tables = [...html.matchAll(/<table\b[\s\S]*?<\/table>/gi)].map((hit) => hit[0]);
  let minimo: Record<number, string[]> | null = null;
  let acima: Record<number, string[]> | null = null;
  for (const table of tables) {
    const rows = tableRows(table);
    if (!minimo) {
      const board = fillBoard(rows, year, false);
      if (board) {
        minimo = board;
        continue;
      }
    }
    if (!acima) {
      const board = fillBoard(rows, year, true);
      if (board) acima = board;
    }
  }
  if (!minimo || !acima) return null;
  return { minimo, acima };
}

export type InssFetch = { table: InssYearTable | null; live: boolean };

export const getInssCalendar = createServerFn({ method: "GET" })
  .validator(z.object({ year: z.number().int().min(2000).max(2100) }))
  .handler(async ({ data }): Promise<InssFetch> => {
    const year = data.year;
    const urls = [
      `https://agenciabrasil.ebc.com.br/economia/noticia/${year}-01/confira-calendario-de-pagamentos-do-inss-para-${year}`,
      `https://agenciabrasil.ebc.com.br/economia/noticia/${year - 1}-12/confira-calendario-de-pagamentos-do-inss-para-${year}`,
      `https://agenciabrasil.ebc.com.br/economia/noticia/${year}-12/confira-calendario-de-pagamentos-do-inss-para-${year}`,
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
        if (!res.ok) continue;
        const table = parseInssHtml(await res.text(), year);
        if (table) return { table, live: true };
      } catch {
        /* try next */
      }
    }
    return { table: null, live: false };
  });

