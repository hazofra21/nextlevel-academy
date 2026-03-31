export type EventStatus = "upcoming" | "past";

export interface AcademyEvent {
  id: string;
  sourceType: "program" | "fallback";
  programType: "campamento" | "tecnificacion" | "clinica";
  slug: string;
  status: EventStatus;
  kind: "camp" | "course";
  title: string;
  shortTitle: string;
  subtitle: string;
  summary: string;
  poster: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  audience: string;
  priceLabel: string;
  capacityLabel: string;
  registrationUrl: string;
  contactPhone: string;
  contactEmail: string;
  highlights: string[];
  infoPoints: string[];
  popupEnabled: boolean;
  bannerEnabled: boolean;
  checkoutEnabled: boolean;
}

export const fallbackEvents: AcademyEvent[] = [
  {
    id: "fallback-tecnificacion-adultos-abril-2026",
    sourceType: "fallback",
    programType: "tecnificacion",
    slug: "tecnificacion-adultos-abril-2026",
    status: "upcoming",
    kind: "camp",
    title: "Tecnificación De Hockey Hielo Para Adultos",
    shortTitle: "Tecnificación Adultos",
    subtitle: "Primera tecnificación Next Level para jugadores adultos",
    summary:
      "Entrenamiento enfocado en mejorar la técnica individual con trabajo específico en hielo y vídeo análisis para analizar y corregir la ejecución de cada jugador.",
    poster: "/events/tecnificacion-adultos-abril-2026.webp",
    dateLabel: "2 y 3 de abril",
    timeLabel: "14:30 · 19:00",
    location: "La Nevera · Majadahonda",
    audience: "Mayores de 18 años",
    priceLabel: "70€",
    capacityLabel: "Plazas limitadas",
    registrationUrl: "https://forms.gle/4ziwp8LyQc9S8ggX7",
    contactPhone: "+34 643 27 79 57",
    contactEmail: "info@nextlevel.net",
    highlights: [
      "Vídeo análisis técnico individual",
      "3 horas de hielo",
      "2 entrenadores",
      "Técnica individual",
    ],
    infoPoints: [
      "Trabajo específico en hielo orientado a técnica individual.",
      "Vídeo análisis para corregir y ajustar la ejecución de cada jugador.",
      "Charla de táctica general, conceptos básicos y posicionamiento.",
      "Evento presencial en pista de hielo La Nevera, en Majadahonda.",
    ],
    popupEnabled: true,
    bannerEnabled: true,
    checkoutEnabled: false,
  },
];
