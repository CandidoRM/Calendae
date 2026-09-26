import { type CalEvent } from "@/lib/calendar";

const DEG = Math.PI / 180;

const PHASES = ["Lua nova", "Quarto crescente", "Lua cheia", "Quarto minguante"] as const;

function rad(deg: number): number {
  return ((deg % 360) + 360) % 360 * DEG;
}

/** Instante da fase (Meeus, cap. 49), preciso o bastante para o dia civil. */
function phaseInstant(k: number, phase: 0 | 1 | 2 | 3): Date {
  const kk = k + phase / 4;
  const T = kk / 1236.85;
  const jde =
    2451550.09766 +
    29.530588861 * kk +
    0.00015437 * T * T -
    0.00000015 * T ** 3 +
    0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;
  const M = rad(2.5534 + 29.1053567 * kk);
  const Mp = rad(201.5643 + 385.81693528 * kk);
  const F = rad(160.7108 + 390.67050274 * kk);
  const Om = rad(124.7746 - 1.5637558 * kk);
  const s = Math.sin;
  const c = Math.cos;
  let corr: number;
  if (phase === 0 || phase === 2) {
    corr =
      (phase === 0 ? -0.4072 : -0.40614) * s(Mp) +
      0.17241 * E * s(M) +
      0.01608 * s(2 * Mp) +
      0.01039 * s(2 * F) +
      0.00739 * E * s(Mp - M) -
      0.00514 * E * s(Mp + M) +
      0.00208 * E * E * s(2 * M) -
      0.00111 * s(Mp - 2 * F) -
      0.00057 * s(Mp + 2 * F) +
      0.00056 * E * s(2 * Mp + M) -
      0.00042 * s(3 * Mp) +
      0.00042 * E * s(M + 2 * F) +
      0.00038 * E * s(M - 2 * F) -
      0.00024 * E * s(2 * Mp - M) -
      0.00017 * s(Om) -
      0.00007 * s(Mp + 2 * M);
  } else {
    corr =
      -0.62801 * s(Mp) +
      0.17172 * E * s(M) -
      0.01183 * E * s(Mp + M) +
      0.00862 * s(2 * Mp) +
      0.00804 * s(2 * F) +
      0.00454 * E * s(Mp - M) +
      0.00204 * E * E * s(2 * M) -
      0.0018 * s(Mp - 2 * F) -
      0.0007 * s(Mp + 2 * F) -
      0.0004 * s(3 * Mp) -
      0.00034 * E * s(2 * Mp - M) +
      0.00032 * E * s(M + 2 * F) +
      0.00032 * E * s(M - 2 * F) -
      0.00028 * E * E * s(Mp + 2 * M) +
      0.00027 * E * s(2 * Mp + M) -
      0.00017 * s(Om);
    const w = 0.00306 - 0.00038 * E * c(M) + 0.00026 * c(Mp) - 0.00002 * c(Mp - M) + 0.00002 * c(Mp + M) + 0.00002 * c(2 * F);
    corr += phase === 1 ? w : -w;
  }
  return new Date((jde + corr - 2440587.5) * 86400000);
}

/** Instante da fase (Meeus, cap. 49), preciso o bastante para o dia civil. */
export function lunarPhaseInstant(k: number, phase: 0 | 1 | 2 | 3): Date {
  return phaseInstant(k, phase);
}

function brasiliaIso(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Eclipses cuja fase citada é visível em território brasileiro.
 * Penumbral fica de fora. Anular fica de fora.
 * Fontes: NASA, Observatório Nacional, Time and Date.
 * O de 3 de março de 2026 é total em outras regiões; no Brasil só a fase parcial.
 */
const ECLIPSES: { iso: string; title: string; kind: "total" | "parcial" }[] = [
  { iso: "1991-07-11", title: "Eclipse solar", kind: "total" },
  { iso: "1994-11-03", title: "Eclipse solar", kind: "total" },
  { iso: "2000-01-21", title: "Eclipse lunar", kind: "total" },
  { iso: "2003-05-16", title: "Eclipse lunar", kind: "total" },
  { iso: "2003-11-09", title: "Eclipse lunar", kind: "total" },
  { iso: "2007-03-03", title: "Eclipse lunar", kind: "total" },
  { iso: "2007-08-28", title: "Eclipse lunar", kind: "total" },
  { iso: "2008-02-21", title: "Eclipse lunar", kind: "total" },
  { iso: "2008-08-16", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2010-12-21", title: "Eclipse lunar", kind: "total" },
  { iso: "2012-06-04", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2014-04-15", title: "Eclipse lunar", kind: "total" },
  { iso: "2015-09-28", title: "Eclipse lunar", kind: "total" },
  { iso: "2019-01-21", title: "Eclipse lunar", kind: "total" },
  { iso: "2019-07-16", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2021-11-19", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2022-05-16", title: "Eclipse lunar", kind: "total" },
  { iso: "2023-10-28", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2024-09-17", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2025-03-14", title: "Eclipse lunar", kind: "total" },
  { iso: "2026-03-03", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2026-08-28", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2028-01-12", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2028-07-06", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2029-06-26", title: "Eclipse lunar", kind: "total" },
  { iso: "2029-12-20", title: "Eclipse lunar", kind: "total" },
  { iso: "2034-09-28", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2035-08-19", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2037-07-27", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2041-05-16", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2041-11-08", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2045-08-12", title: "Eclipse solar", kind: "total" },
  { iso: "2046-07-18", title: "Eclipse lunar", kind: "parcial" },
  { iso: "2046-08-02", title: "Eclipse solar", kind: "total" },
  { iso: "2048-06-26", title: "Eclipse lunar", kind: "parcial" },
];

function phaseEvents(year: number): CalEvent[] {
  const k0 = Math.floor((year - 2000) * 12.3685);
  const out: CalEvent[] = [];
  const seen = new Set<string>();
  for (let k = k0 - 2; k <= k0 + 15; k += 1) {
    for (const phase of [0, 1, 2, 3] as const) {
      const iso = brasiliaIso(phaseInstant(k, phase));
      if (!iso.startsWith(`${year}-`)) continue;
      const key = `${iso}-${phase}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        id: `lunar-${iso}-${phase}`,
        iso,
        title: PHASES[phase],
        place: "Fase da Lua",
        source: "holiday",
        holidayKind: "lunar",
        confirmed: true,
      });
    }
  }
  return out;
}

function eclipseEvents(year: number): CalEvent[] {
  return ECLIPSES.filter((item) => item.iso.startsWith(`${year}-`)).map((item) => ({
    id: `eclipse-${item.iso}`,
    iso: item.iso,
    title: item.title,
    place: item.kind === "total" ? "Total · visível no Brasil" : "Parcial · visível no Brasil",
    source: "holiday" as const,
    holidayKind: "lunar" as const,
    confirmed: true,
  }));
}

const lunarYearCache = new Map<number, CalEvent[]>();

export function lunarDates(year: number): CalEvent[] {
  const hit = lunarYearCache.get(year);
  if (hit) return hit;
  const rows = [...phaseEvents(year), ...eclipseEvents(year)];
  lunarYearCache.set(year, rows);
  return rows;
}
