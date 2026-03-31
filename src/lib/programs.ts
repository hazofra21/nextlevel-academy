import "server-only";

import { fallbackEvents, type AcademyEvent } from "@/content/events";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface ProgramRecord {
  id: string;
  tipo: string;
  slug: string;
  titulo: string;
  descripcion: string;
  descripcion_corta: string | null;
  imagen_portada: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  ubicacion: string;
  ciudad: string | null;
  plazas_totales: number | null;
  precio: number | string | null;
  incluye: string[] | null;
  requisitos: string[] | null;
  publicado: boolean | null;
  destacado: boolean | null;
  edad_minima: number | null;
  edad_maxima: number | null;
  horario_detalle: {
    registrationUrl?: string;
    contactPhone?: string;
    contactEmail?: string;
    popupEnabled?: boolean;
    bannerEnabled?: boolean;
  } | null;
}

function formatPrice(value: number | string | null) {
  if (value === null || value === undefined || value === "") return "Consultar";

  const numericValue =
    typeof value === "string" ? Number.parseFloat(value) : value;

  if (Number.isNaN(numericValue)) return "Consultar";
  if (numericValue <= 0) return "Consultar";
  if (numericValue % 1 === 0) return `${numericValue}€`;

  return `${numericValue.toFixed(2)}€`;
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Fecha por definir";
  }

  const formatter = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
  });

  if (startDate === endDate) {
    return formatter.format(start);
  }

  return `${formatter.format(start)} · ${formatter.format(end)}`;
}

function formatTimeRange(startTime: string | null, endTime: string | null) {
  if (startTime && endTime) return `${startTime.slice(0, 5)} · ${endTime.slice(0, 5)}`;
  if (startTime) return startTime.slice(0, 5);
  return "Horario por definir";
}

function formatAudience(program: ProgramRecord) {
  if (program.edad_minima && program.edad_maxima) {
    return `${program.edad_minima}-${program.edad_maxima} años`;
  }

  if (program.edad_minima) {
    return `Desde ${program.edad_minima} años`;
  }

  if (program.edad_maxima) {
    return `Hasta ${program.edad_maxima} años`;
  }

  return "Todos los perfiles";
}

function getNumericPrice(value: number | string | null) {
  if (value === null || value === undefined || value === "") return 0;

  const numericValue =
    typeof value === "string" ? Number.parseFloat(value) : value;

  return Number.isNaN(numericValue) ? 0 : numericValue;
}

function mapProgramToEvent(program: ProgramRecord): AcademyEvent {
  const now = new Date();
  const endDate = new Date(program.fecha_fin);
  const isPast = !Number.isNaN(endDate.getTime()) && endDate < now;
  const numericPrice = getNumericPrice(program.precio);

  return {
    id: program.id,
    sourceType: "program",
    programType:
      program.tipo === "campamento" || program.tipo === "clinica"
        ? program.tipo
        : "tecnificacion",
    slug: program.slug,
    status: isPast ? "past" : "upcoming",
    kind: program.tipo === "campamento" ? "camp" : "course",
    title: program.titulo,
    shortTitle: program.titulo,
    subtitle: program.descripcion_corta ?? "Evento NextLevel",
    summary: program.descripcion,
    poster: program.imagen_portada || "/events/tecnificacion-adultos-abril-2026.webp",
    dateLabel: formatDateRange(program.fecha_inicio, program.fecha_fin),
    timeLabel: formatTimeRange(program.hora_inicio, program.hora_fin),
    location: [program.ubicacion, program.ciudad].filter(Boolean).join(" · "),
    audience: formatAudience(program),
    priceLabel: formatPrice(program.precio),
    capacityLabel:
      program.plazas_totales && program.plazas_totales > 0
        ? `${program.plazas_totales} plazas`
        : "Plazas limitadas",
    registrationUrl:
      program.horario_detalle?.registrationUrl ?? "#",
    contactPhone: program.horario_detalle?.contactPhone ?? "",
    contactEmail: program.horario_detalle?.contactEmail ?? "",
    highlights: program.incluye ?? [],
    infoPoints: program.requisitos ?? [],
    popupEnabled:
      program.horario_detalle?.popupEnabled ?? Boolean(program.destacado),
    bannerEnabled:
      program.horario_detalle?.bannerEnabled ?? Boolean(program.destacado),
    checkoutEnabled: Boolean(program.publicado) && numericPrice > 0,
  };
}

export async function getProgramsForAdmin() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("programas")
    .select(
      "id,tipo,slug,titulo,descripcion,descripcion_corta,imagen_portada,fecha_inicio,fecha_fin,hora_inicio,hora_fin,ubicacion,ciudad,plazas_totales,precio,incluye,requisitos,publicado,destacado,edad_minima,edad_maxima,horario_detalle"
    )
    .order("fecha_inicio", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProgramRecord[];
}

export async function getPublicEvents() {
  try {
    const programs = await getProgramsForAdmin();
    const publicPrograms = programs.filter((program) => program.publicado);

    if (publicPrograms.length === 0) {
      return fallbackEvents;
    }

    return publicPrograms.map(mapProgramToEvent);
  } catch {
    return fallbackEvents;
  }
}

export async function getFeaturedPopupEvent() {
  const events = await getPublicEvents();

  return events.find((event) => event.popupEnabled && event.status === "upcoming") ?? null;
}

export async function getFeaturedBannerEvent() {
  const events = await getPublicEvents();

  return events.find((event) => event.bannerEnabled && event.status === "upcoming") ?? null;
}

export async function getUpcomingEvents() {
  const events = await getPublicEvents();

  return events.filter((event) => event.status === "upcoming");
}

export async function getCampPageEvents() {
  return getProgramPageEvents(["campamento", "clinica"]);
}

export async function getTecnificacionPageEvents() {
  return getProgramPageEvents(["tecnificacion"]);
}

async function getProgramPageEvents(
  programTypes: Array<ProgramRecord["tipo"]>
) {
  const events = await getPublicEvents();

  return {
    upcoming: events.filter(
      (event) =>
        event.status === "upcoming" &&
        programTypes.includes(event.programType)
    ),
    past: events.filter(
      (event) =>
        event.status === "past" &&
        programTypes.includes(event.programType)
    ),
  };
}
