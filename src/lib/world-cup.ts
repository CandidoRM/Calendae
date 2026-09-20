import type { CalEvent } from "@/lib/calendar";

type CupYear = {
  open: string;
  final: string;
  brazil: { iso: string; title: string }[];
};

const CUPS: Record<number, CupYear> = {
  2002: {
    open: "2002-05-31",
    final: "2002-06-30",
    brazil: [
      { iso: "2002-06-03", title: "Brasil x Turquia" },
      { iso: "2002-06-08", title: "Brasil x China" },
      { iso: "2002-06-13", title: "Brasil x Costa Rica" },
      { iso: "2002-06-17", title: "Brasil x Bélgica" },
      { iso: "2002-06-21", title: "Brasil x Inglaterra" },
      { iso: "2002-06-26", title: "Brasil x Turquia" },
      { iso: "2002-06-30", title: "Brasil x Alemanha" },
    ],
  },
  2006: {
    open: "2006-06-09",
    final: "2006-07-09",
    brazil: [
      { iso: "2006-06-13", title: "Brasil x Croácia" },
      { iso: "2006-06-18", title: "Brasil x Austrália" },
      { iso: "2006-06-22", title: "Brasil x Japão" },
      { iso: "2006-06-27", title: "Brasil x Gana" },
      { iso: "2006-07-01", title: "Brasil x França" },
    ],
  },
  2010: {
    open: "2010-06-11",
    final: "2010-07-11",
    brazil: [
      { iso: "2010-06-15", title: "Brasil x Coreia do Norte" },
      { iso: "2010-06-20", title: "Brasil x Costa do Marfim" },
      { iso: "2010-06-25", title: "Brasil x Portugal" },
      { iso: "2010-06-28", title: "Brasil x Holanda" },
    ],
  },
  2014: {
    open: "2014-06-12",
    final: "2014-07-13",
    brazil: [
      { iso: "2014-06-12", title: "Brasil x Croácia" },
      { iso: "2014-06-17", title: "Brasil x México" },
      { iso: "2014-06-23", title: "Brasil x Camarões" },
      { iso: "2014-06-28", title: "Brasil x Chile" },
      { iso: "2014-07-04", title: "Brasil x Colômbia" },
      { iso: "2014-07-08", title: "Brasil x Alemanha" },
      { iso: "2014-07-12", title: "Brasil x Holanda" },
    ],
  },
  2018: {
    open: "2018-06-14",
    final: "2018-07-15",
    brazil: [
      { iso: "2018-06-17", title: "Brasil x Suíça" },
      { iso: "2018-06-22", title: "Brasil x Costa Rica" },
      { iso: "2018-06-27", title: "Brasil x Sérvia" },
      { iso: "2018-07-02", title: "Brasil x México" },
      { iso: "2018-07-06", title: "Brasil x Bélgica" },
    ],
  },
  2022: {
    open: "2022-11-20",
    final: "2022-12-18",
    brazil: [
      { iso: "2022-11-24", title: "Brasil x Sérvia" },
      { iso: "2022-11-28", title: "Brasil x Suíça" },
      { iso: "2022-12-02", title: "Brasil x Camarões" },
      { iso: "2022-12-05", title: "Brasil x Coreia do Sul" },
      { iso: "2022-12-09", title: "Brasil x Croácia" },
    ],
  },
  2026: {
    open: "2026-06-11",
    final: "2026-07-19",
    brazil: [
      { iso: "2026-06-13", title: "Brasil x Marrocos" },
      { iso: "2026-06-19", title: "Brasil x Haiti" },
      { iso: "2026-06-24", title: "Brasil x Escócia" },
      { iso: "2026-06-29", title: "Brasil x Japão" },
      { iso: "2026-07-05", title: "Brasil x Noruega" },
    ],
  },
  2030: {
    open: "2030-06-08",
    final: "2030-07-21",
    brazil: [],
  },
};

function row(iso: string, title: string): CalEvent {
  return {
    id: `com-copa-${iso}-${title}`,
    iso,
    title,
    time: "",
    source: "holiday",
    holidayKind: "commemorative",
  };
}

export function worldCupDates(year: number): CalEvent[] {
  const cup = CUPS[year];
  if (!cup) return [];
  const out = [row(cup.open, "Copa do Mundo"), row(cup.final, "Final da Copa")];
  for (const match of cup.brazil) out.push(row(match.iso, match.title));
  return out;
}
