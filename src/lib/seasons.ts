import { type CalEvent } from "@/lib/calendar";

const DEG = Math.PI / 180;

/** Termos periódicos de Meeus, suficientes para acertar o dia civil. */
const TERMS: [number, number, number][] = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];

function meanJde(year: number, which: 0 | 1 | 2 | 3): number {
  const y = (year - 2000) / 1000;
  if (which === 0) {
    return 2451623.80984 + 365242.37404 * y + 0.05169 * y * y - 0.00411 * y ** 3 - 0.00057 * y ** 4;
  }
  if (which === 1) {
    return 2451716.56767 + 365241.62603 * y + 0.00325 * y * y + 0.00888 * y ** 3 - 0.0003 * y ** 4;
  }
  if (which === 2) {
    return 2451810.21715 + 365242.01767 * y - 0.11575 * y * y + 0.00337 * y ** 3 + 0.00078 * y ** 4;
  }
  return 2451900.05952 + 365242.74049 * y - 0.06223 * y * y - 0.00823 * y ** 3 + 0.00032 * y ** 4;
}

const seasonCache = new Map<string, Date>();

function seasonInstant(year: number, which: 0 | 1 | 2 | 3): Date {
  const key = `${year}:${which}`;
  const hit = seasonCache.get(key);
  if (hit) return hit;
  const jde0 = meanJde(year, which);
  const t = (jde0 - 2451545) / 36525;
  let s = 0;
  for (const [a, b, c] of TERMS) s += a * Math.cos((b + c * t) * DEG);
  const w = (35999.373 * t - 2.47) * DEG;
  const dl = 1 + 0.0334 * Math.cos(w) + 0.0007 * Math.cos(2 * w);
  const jde = jde0 + (0.00001 * s) / dl;
  const date = new Date((jde - 2440587.5) * 86400000);
  seasonCache.set(key, date);
  return date;
}

/** Equinócio de setembro: outono no norte, primavera no sul. */
export function septemberEquinox(year: number): Date {
  return seasonInstant(year, 2);
}

function brasiliaIso(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

const SEASONS: { which: 0 | 1 | 2 | 3; title: string; detail: string }[] = [
  { which: 0, title: "Outono", detail: "Equinócio" },
  { which: 1, title: "Inverno", detail: "Solstício" },
  { which: 2, title: "Primavera", detail: "Equinócio" },
  { which: 3, title: "Verão", detail: "Solstício" },
];

const seasonYearCache = new Map<number, CalEvent[]>();

/** Estações do hemisfério sul, no dia civil de Brasília. */
export function seasonDates(year: number): CalEvent[] {
  const hit = seasonYearCache.get(year);
  if (hit) return hit;
  const rows = SEASONS.map((season) => {
    const iso = brasiliaIso(seasonInstant(year, season.which));
    return {
      id: `season-${year}-${season.title}`,
      iso,
      title: season.title,
      place: season.detail,
      source: "holiday" as const,
      holidayKind: "season" as const,
      confirmed: true,
    };
  });
  seasonYearCache.set(year, rows);
  return rows;
}
