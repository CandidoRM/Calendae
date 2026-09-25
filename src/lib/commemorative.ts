import { civilDate, easterDate, toIso, type CalEvent } from "@/lib/calendar";
import { worldCupDates } from "@/lib/world-cup";

function nthWeekday(year: number, month: number, weekday: number, nth: number): string {
  const first = civilDate(year, month, 1);
  const shift = (weekday - first.getDay() + 7) % 7;
  return toIso(civilDate(year, month, 1 + shift + (nth - 1) * 7));
}

export function commemorativeDates(year: number): CalEvent[] {
  const rows: { iso: string; title: string }[] = [
    { iso: `${year}-01-06`, title: "Dia de Reis" },
    { iso: `${year}-03-08`, title: "Dia Internacional da Mulher" },
    { iso: `${year}-04-01`, title: "Dia da Mentira" },
    { iso: toIso(easterDate(year)), title: "Páscoa" },
    { iso: `${year}-04-19`, title: "Dia dos Povos Indígenas" },
    { iso: `${year}-04-22`, title: "Descobrimento do Brasil" },
    { iso: nthWeekday(year, 4, 0, 2), title: "Dia das Mães" },
    { iso: `${year}-05-13`, title: "Abolição da Escravatura" },
    { iso: `${year}-06-12`, title: "Dia dos Namorados" },
    { iso: `${year}-06-13`, title: "Santo Antônio" },
    { iso: `${year}-06-24`, title: "São João" },
    { iso: `${year}-06-28`, title: "Orgulho LGBTQIA+" },
    { iso: `${year}-06-29`, title: "São Pedro" },
    { iso: nthWeekday(year, 7, 0, 2), title: "Dia dos Pais" },
    { iso: `${year}-08-11`, title: "Dia do Estudante" },
    { iso: `${year}-08-22`, title: "Dia do Folclore" },
    { iso: `${year}-09-21`, title: "Dia da Árvore" },
    { iso: `${year}-10-12`, title: "Dia das Crianças" },
    { iso: `${year}-10-15`, title: "Dia do Professor" },
    { iso: `${year}-10-31`, title: "Halloween" },
  ];
  return [
    ...rows.map((row) => ({
      id: `com-${row.iso}-${row.title}`,
      iso: row.iso,
      title: row.title,
      time: "",
      source: "holiday" as const,
      holidayKind: "commemorative" as const,
    })),
    ...worldCupDates(year),
  ];
}
