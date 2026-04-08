import { decodeHtml } from "@/lib/utils";
import type { WPEvent } from "@/types/wordpress";

export type AgendaEvent = {
  id: number;
  title: string;
  slug: string;
  startDate: string;
  endDate?: string | null;
  venue?: string | null;
  city?: string | null;
  address?: string | null;
  time?: string | null;
  klasse?: string | null;
  result?: string | null;
  isNextRace?: boolean;
  series?: string | null;
  roundLabel?: string | null;
  summary?: string | null;
  content?: string | null;
  source: "wordpress" | "local";
};

const localAgendaEvents: AgendaEvent[] = [
  {
    id: 10001,
    title: "Chrono NK 4T",
    slug: "nk4t-ronde-1-2026",
    startDate: "2026-03-14",
    endDate: "2026-03-15",
    venue: "Circuit de Landsard",
    klasse: "Parolin Rocky 200cc",
    series: "Chrono NK 4T 2026",
    roundLabel: "Ronde 1",
    summary: "Openingsweekend van Chrono NK 4T 2026 in de klasse Parolin Rocky 200cc.",
    content:
      "<p>Raceweekend van Chrono NK 4T. Levy rijdt hier in de klasse Parolin Rocky 200cc op Circuit de Landsard.</p>",
    source: "local",
  },
  {
    id: 10002,
    title: "NXTGP Dutch Open",
    slug: "dutch-open-ronde-1-2026",
    startDate: "2026-03-28",
    endDate: "2026-03-29",
    venue: "Kartcircuit Pottendijk Linksom",
    klasse: "Parolin Rocky 200cc",
    series: "NXTGP Dutch Open 2026",
    roundLabel: "DO 1",
    summary: "Eerste ronde van NXTGP Dutch Open 2026 in de klasse Parolin Rocky 200cc.",
    content:
      "<p>Openingsweekend van NXTGP Dutch Open 2026 op Kartcircuit Pottendijk Linksom in de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10003,
    title: "Chrono NK 4T",
    slug: "nk4t-ronde-2-2026",
    startDate: "2026-04-04",
    endDate: "2026-04-05",
    venue: "Circuit Park Berghem",
    klasse: "Parolin Rocky 200cc",
    series: "Chrono NK 4T 2026",
    roundLabel: "Ronde 2",
    summary: "Tweede raceweekend van Chrono NK 4T in Parolin Rocky 200cc.",
    content:
      "<p>Chrono NK 4T Ronde 2 wordt verreden op Circuit Park Berghem in de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10004,
    title: "NXTGP Dutch Open",
    slug: "dutch-open-ronde-2-2026",
    startDate: "2026-04-11",
    endDate: "2026-04-12",
    venue: "Erftlandring Kerpen",
    city: "Kerpen, Duitsland",
    klasse: "Parolin Rocky 200cc",
    series: "NXTGP Dutch Open 2026",
    roundLabel: "DO 2",
    summary: "Tweede weekend van NXTGP Dutch Open in de klasse Parolin Rocky 200cc.",
    content:
      "<p>NXTGP Dutch Open reist voor ronde 2 af naar Erftlandring Kerpen in Duitsland. Klasse: Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10005,
    title: "Chrono NK 4T",
    slug: "nk4t-ronde-3-2026",
    startDate: "2026-05-09",
    endDate: "2026-05-10",
    venue: "Kartbaan Strijen",
    klasse: "Parolin Rocky 200cc",
    series: "Chrono NK 4T 2026",
    roundLabel: "Ronde 3",
    summary: "Derde Chrono NK 4T-weekend in Parolin Rocky 200cc.",
    content:
      "<p>Chrono NK 4T Ronde 3 staat gepland op Kartbaan Strijen voor de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10006,
    title: "NXTGP Dutch Open",
    slug: "dutch-open-ronde-3-2026",
    startDate: "2026-06-06",
    endDate: "2026-06-07",
    venue: "TT Circuit Assen Special",
    klasse: "Parolin Rocky 200cc",
    series: "NXTGP Dutch Open 2026",
    roundLabel: "DO 3",
    summary: "Derde NXTGP Dutch Open-weekend in Parolin Rocky 200cc.",
    content:
      "<p>Ronde 3 van NXTGP Dutch Open wordt verreden op het TT Circuit Assen Special in de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10007,
    title: "NXTGP Dutch Open",
    slug: "dutch-open-ronde-4-2026",
    startDate: "2026-06-20",
    endDate: "2026-06-21",
    venue: "SHW Strijen",
    klasse: "Parolin Rocky 200cc",
    series: "NXTGP Dutch Open 2026",
    roundLabel: "DO 4",
    summary: "Vierde NXTGP Dutch Open-weekend in Parolin Rocky 200cc.",
    content:
      "<p>Ronde 4 van NXTGP Dutch Open staat op de kalender in Strijen voor de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10008,
    title: "Chrono NK 4T",
    slug: "nk4t-ronde-4-2026",
    startDate: "2026-06-27",
    endDate: "2026-06-28",
    venue: "Circuit Erftlandring Kerpen",
    city: "Kerpen, Duitsland",
    klasse: "Parolin Rocky 200cc",
    series: "Chrono NK 4T 2026",
    roundLabel: "Ronde 4",
    summary: "Vierde Chrono NK 4T-weekend in Parolin Rocky 200cc.",
    content:
      "<p>Deze Chrono NK 4T-ronde wordt verreden op Circuit Erftlandring Kerpen in Duitsland voor de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10009,
    title: "NXTGP Dutch Open",
    slug: "dutch-open-ronde-5-2026",
    startDate: "2026-09-19",
    endDate: "2026-09-20",
    venue: "Erftlandring Kerpen",
    city: "Kerpen, Duitsland",
    klasse: "Parolin Rocky 200cc",
    series: "NXTGP Dutch Open 2026",
    roundLabel: "DO 5",
    summary: "Vijfde NXTGP Dutch Open-weekend in Parolin Rocky 200cc.",
    content:
      "<p>Na de zomerstop gaat NXTGP Dutch Open verder met ronde 5 in Kerpen voor de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10010,
    title: "Chrono NK 4T",
    slug: "nk4t-ronde-5-2026",
    startDate: "2026-10-10",
    endDate: "2026-10-11",
    venue: "Circuit Spa Francorchamps",
    city: "Spa-Francorchamps, België",
    klasse: "Parolin Rocky 200cc",
    series: "Chrono NK 4T 2026",
    roundLabel: "Ronde 5",
    summary: "Voorlaatste Chrono NK 4T-weekend in Parolin Rocky 200cc.",
    content:
      "<p>Chrono NK 4T Ronde 5 staat gepland op Circuit Spa Francorchamps voor de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10011,
    title: "NXTGP Dutch Open",
    slug: "dutch-open-ronde-6-2026",
    startDate: "2026-10-17",
    endDate: "2026-10-18",
    venue: "Kartcircuit Pottendijk Rechtsom",
    klasse: "Parolin Rocky 200cc",
    series: "NXTGP Dutch Open 2026",
    roundLabel: "DO 6",
    summary: "Zesde NXTGP Dutch Open-weekend in Parolin Rocky 200cc.",
    content:
      "<p>Ronde 6 van NXTGP Dutch Open vindt plaats op Kartcircuit Pottendijk Rechtsom in de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10012,
    title: "NXTGP Dutch Open",
    slug: "dutch-open-ronde-7-2026",
    startDate: "2026-10-31",
    endDate: "2026-11-01",
    venue: "TT Circuit Assen",
    klasse: "Parolin Rocky 200cc",
    series: "NXTGP Dutch Open 2026",
    roundLabel: "DO 7",
    summary: "Finaleweekend van NXTGP Dutch Open 2026 in Parolin Rocky 200cc.",
    content:
      "<p>NXTGP Dutch Open 2026 wordt afgesloten met ronde 7 op TT Circuit Assen voor de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
  {
    id: 10013,
    title: "Chrono NK 4T",
    slug: "nk4t-ronde-6-2026",
    startDate: "2026-11-14",
    endDate: "2026-11-15",
    venue: "Circuit de Landsard",
    klasse: "Parolin Rocky 200cc",
    series: "Chrono NK 4T 2026",
    roundLabel: "Ronde 6",
    summary: "Seizoensafsluiter van Chrono NK 4T 2026 in Parolin Rocky 200cc.",
    content:
      "<p>De finale van Chrono NK 4T 2026 wordt verreden op Circuit de Landsard in de klasse Parolin Rocky 200cc.</p>",
    source: "local",
  },
];

export const parseWordPressEvent = (event: WPEvent): AgendaEvent => {
  const meta = event.meta ?? {};
  const startDate = meta.datum || event.date || event.modified;

  return {
    id: event.id,
    title: decodeHtml(event.title.rendered),
    slug: event.slug,
    startDate,
    endDate: meta.einddatum || null,
    venue: meta.locatie ? decodeHtml(meta.locatie) : null,
    city: meta.stad ? decodeHtml(meta.stad) : null,
    address: meta.adres ? decodeHtml(meta.adres) : null,
    time: meta.tijd || null,
    klasse: meta.klasse ? decodeHtml(meta.klasse) : null,
    series: meta.serie ? decodeHtml(meta.serie) : null,
    roundLabel: meta.ronde_label ? decodeHtml(meta.ronde_label) : null,
    result: meta.resultaat ? decodeHtml(meta.resultaat) : null,
    isNextRace: Boolean(meta.volgende_race),
    summary: event.excerpt?.rendered ? decodeHtml(event.excerpt.rendered) : null,
    content: event.content?.rendered || null,
    source: "wordpress",
  };
};

export const mergeAgendaEvents = (wpEvents: WPEvent[] = []) => {
  const merged = new Map<string, AgendaEvent>();

  for (const event of localAgendaEvents) {
    merged.set(event.slug, event);
  }

  for (const event of wpEvents.map(parseWordPressEvent)) {
    merged.set(event.slug, event);
  }

  return Array.from(merged.values()).sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
};

export const findAgendaEventBySlug = (slug: string, wpEvent?: WPEvent | null) => {
  if (wpEvent) return parseWordPressEvent(wpEvent);
  return localAgendaEvents.find((event) => event.slug === slug) ?? null;
};

export const formatAgendaDate = (dateStr?: string | null) => {
  if (!dateStr) return "Onbekende datum";
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getDaysUntilAgendaEvent = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(dateStr);
  eventDate.setHours(0, 0, 0, 0);
  const diffTime = eventDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getAgendaEventYear = (event: Pick<AgendaEvent, "startDate">) =>
  new Date(event.startDate).getFullYear();
