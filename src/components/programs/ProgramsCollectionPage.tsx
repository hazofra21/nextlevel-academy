import Link from "next/link";
import type { AcademyEvent } from "@/content/events";
import CheckoutButton from "@/components/payments/CheckoutButton";

interface ProgramsCollectionPageProps {
  eyebrow: string;
  title: string;
  description: string;
  upcomingTitle: string;
  archiveTitle: string;
  upcoming: AcademyEvent[];
  past: AcademyEvent[];
  stripeEnabled: boolean;
}

function getEventTypeLabel(event: AcademyEvent) {
  if (event.programType === "campamento") return "Campamento";
  if (event.programType === "clinica") return "Clínica";
  if (event.programType === "tecnificacion") return "Tecnificación";
  return event.kind === "camp" ? "Campamento" : "Curso";
}

function getDetailRoute(event: AcademyEvent) {
  return event.programType === "tecnificacion" ? "/tecnificaciones" : "/campamentos";
}

export default function ProgramsCollectionPage({
  eyebrow,
  title,
  description,
  upcomingTitle,
  archiveTitle,
  upcoming,
  past,
  stripeEnabled,
}: ProgramsCollectionPageProps) {
  const nextEvent = upcoming[0] ?? null;
  const otherUpcoming = upcoming.slice(1);

  return (
    <main className="min-h-screen bg-[#050505] pt-28">
      <section className="bg-[#050505]/74 pb-24 backdrop-blur-[2px]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <div className="accent-line mb-4" />
            <span className="mb-3 block text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
              {eyebrow}
            </span>
            <h1 className="font-display text-5xl font-bold md:text-7xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#8a8a8a]">
              {description}
            </p>
          </div>

          {nextEvent ? (
            <section className="overflow-hidden rounded-[2rem] border border-[#1a1a1a] bg-[#0d0d0d]/92 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
              <div className="grid gap-0 lg:grid-cols-[380px_minmax(0,1fr)]">
                <div className="relative min-h-[540px] border-b border-[#1a1a1a] lg:border-b-0 lg:border-r">
                  <img src={nextEvent.poster} alt={nextEvent.title} className="h-full w-full object-cover object-center" />
                </div>

                <div className="p-8 md:p-10">
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#00C8FF]/25 bg-[#00C8FF]/8 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.32em] text-[#bfefff]">
                      Próximo evento
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-[#b5b5b5]">
                      {getEventTypeLabel(nextEvent)}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-[#b5b5b5]">
                      {nextEvent.capacityLabel}
                    </span>
                  </div>

                  <h2 className="font-display text-4xl font-bold leading-none md:text-6xl">
                    {nextEvent.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#8b8b8b]">
                    {nextEvent.subtitle}. {nextEvent.summary}
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: "Fecha", value: nextEvent.dateLabel },
                      { label: "Horario", value: nextEvent.timeLabel },
                      { label: "Ubicación", value: nextEvent.location },
                      { label: "Precio", value: nextEvent.priceLabel },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
                          {item.label}
                        </p>
                        <p className="mt-2 font-display text-2xl font-bold leading-tight">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="rounded-2xl border border-[#1a1a1a] bg-white/4 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#00C8FF]">
                        Información
                      </p>
                      <div className="mt-5 space-y-3">
                        {nextEvent.infoPoints.map((point) => (
                          <div key={point} className="flex gap-3 text-sm leading-relaxed text-[#cccccc]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00C8FF]" />
                            <p>{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#1a1a1a] bg-[#0b0b0b] p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#00C8FF]">
                        Contacto
                      </p>
                      <div className="mt-5 space-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Edad</p>
                          <p className="mt-1 text-sm text-white">{nextEvent.audience}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Teléfono</p>
                          {nextEvent.contactPhone ? (
                            <a href={`tel:${nextEvent.contactPhone.replace(/\s+/g, "")}`} className="mt-1 block text-sm text-white hover:text-[#00C8FF]">
                              {nextEvent.contactPhone}
                            </a>
                          ) : (
                            <p className="mt-1 text-sm text-[#7a7a7a]">Bajo consulta</p>
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.28em] text-[#666]">Email</p>
                          {nextEvent.contactEmail ? (
                            <a href={`mailto:${nextEvent.contactEmail}`} className="mt-1 block text-sm text-white hover:text-[#00C8FF]">
                              {nextEvent.contactEmail}
                            </a>
                          ) : (
                            <p className="mt-1 text-sm text-[#7a7a7a]">Pendiente</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {nextEvent.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#d7d7d7]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4">
                    {stripeEnabled && nextEvent.checkoutEnabled ? (
                      <CheckoutButton
                        resourceType="program"
                        resourceId={nextEvent.id}
                        enabled
                        label="Reservar plaza"
                      />
                    ) : null}
                    {nextEvent.registrationUrl && nextEvent.registrationUrl !== "#" ? (
                      <a
                        href={nextEvent.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline rounded px-6 py-3 text-sm"
                      >
                        Inscripción manual
                      </a>
                    ) : null}
                    <a
                      href={nextEvent.contactEmail ? `mailto:${nextEvent.contactEmail}` : "/contacto"}
                      className="btn-outline rounded px-6 py-3 text-sm"
                    >
                      Pedir información
                    </a>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="rounded-[1.8rem] border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-8">
              <p className="font-display text-3xl font-bold">Sin eventos publicados</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#7e7e7e]">
                En cuanto publiques eventos desde el admin, esta familia aparecerá aquí de forma automática.
              </p>
            </div>
          )}

          {otherUpcoming.length > 0 ? (
            <section className="mt-12">
              <div className="mb-6">
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                  Próximamente
                </span>
                <h3 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                  {upcomingTitle}
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {otherUpcoming.map((event) => (
                  <article
                    key={event.slug}
                    className="overflow-hidden rounded-[1.7rem] border border-[#1a1a1a] bg-[#0f0f0f]/88"
                  >
                    <div className="relative aspect-[4/5] border-b border-[#1a1a1a]">
                      <img src={event.poster} alt={event.title} className="h-full w-full object-cover object-center" />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-[#00C8FF]/25 bg-[#00C8FF]/8 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#c7f4ff]">
                          {getEventTypeLabel(event)}
                        </span>
                        <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#b6b6b6]">
                          {event.priceLabel}
                        </span>
                      </div>

                      <h4 className="mt-4 font-display text-3xl font-bold leading-none">
                        {event.shortTitle}
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-[#8a8a8a]">
                        {event.subtitle}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-[#d2d2d2]">
                        <p><span className="text-[#00C8FF]">Fecha:</span> {event.dateLabel}</p>
                        <p><span className="text-[#00C8FF]">Lugar:</span> {event.location}</p>
                        <p><span className="text-[#00C8FF]">Edad:</span> {event.audience}</p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {event.highlights.slice(0, 3).map((highlight) => (
                          <span
                            key={highlight}
                            className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#d7d7d7]"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {stripeEnabled && event.checkoutEnabled ? (
                          <CheckoutButton
                            resourceType="program"
                            resourceId={event.id}
                            enabled
                            label="Reservar"
                          />
                        ) : null}
                        <Link href={getDetailRoute(event)} className="btn-outline rounded px-5 py-3 text-sm">
                          Ver detalle
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-12">
            <div className="mb-6">
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                Archivo
              </span>
              <h3 className="mt-3 font-display text-3xl font-bold md:text-4xl">
                {archiveTitle}
              </h3>
            </div>

            {past.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {past.map((event) => (
                  <article
                    key={event.slug}
                    className="overflow-hidden rounded-[1.7rem] border border-[#1a1a1a] bg-[#0f0f0f]/82 opacity-85"
                  >
                    <div className="relative aspect-[4/5] border-b border-[#1a1a1a]">
                      <img src={event.poster} alt={event.title} className="h-full w-full object-cover object-center grayscale" />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#b6b6b6]">
                          Realizado
                        </span>
                        <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#b6b6b6]">
                          {getEventTypeLabel(event)}
                        </span>
                      </div>

                      <h4 className="mt-4 font-display text-3xl font-bold leading-none">
                        {event.shortTitle}
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-[#8a8a8a]">
                        {event.summary}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.8rem] border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-8">
                <p className="font-display text-3xl font-bold">Histórico en preparación</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#7e7e7e]">
                  Aquí se archivarán los eventos realizados para reforzar trayectoria, prueba visual y bagaje de la academia.
                </p>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
