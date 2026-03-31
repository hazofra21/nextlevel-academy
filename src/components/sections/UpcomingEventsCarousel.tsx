"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AcademyEvent } from "@/content/events";
import CheckoutButton from "@/components/payments/CheckoutButton";

interface UpcomingEventsCarouselProps {
  events: AcademyEvent[];
  stripeEnabled: boolean;
}

export default function UpcomingEventsCarousel({
  events,
  stripeEnabled,
}: UpcomingEventsCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % events.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [events.length]);

  if (events.length === 0) return null;

  const event = events[current];

  const goPrev = () =>
    setCurrent((prev) => (prev - 1 + events.length) % events.length);

  const goNext = () => setCurrent((prev) => (prev + 1) % events.length);

  return (
    <section className="bg-[#050505]/58 py-12 backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <div className="accent-line mb-4" />
          <span className="mb-3 block text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
            Próximamente
          </span>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-4xl font-bold md:text-6xl">
                CAMPAMENTOS Y TECNIFICACIONES
              </h2>
            </div>

            {events.length > 1 ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Evento anterior"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[#00C8FF]/35 hover:text-[#00C8FF]"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Siguiente evento"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-[#00C8FF]/35 hover:text-[#00C8FF]"
                >
                  →
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[#1a1a1a] bg-[linear-gradient(130deg,rgba(0,200,255,0.14)_0%,rgba(8,8,8,0.95)_22%,rgba(8,8,8,0.95)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
          <div className="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="relative min-h-[420px] border-b border-[#1a1a1a] lg:min-h-full lg:border-b-0 lg:border-r">
              <Image
                key={event.poster}
                src={event.poster}
                alt={event.title}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div className="p-8 md:p-10">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#00C8FF]/25 bg-[#00C8FF]/8 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.32em] text-[#bfefff]">
                  {event.kind === "camp" ? "Campamento" : "Curso"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-[#b5b5b5]">
                  {current + 1}/{events.length}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-[#b5b5b5]">
                  {event.capacityLabel}
                </span>
              </div>

              <h3 className="font-display text-4xl font-bold leading-none md:text-6xl">
                {event.shortTitle}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#8d8d8d]">
                {event.subtitle}. {event.summary}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Fecha", value: event.dateLabel },
                  { label: "Horario", value: event.timeLabel },
                  { label: "Ubicación", value: event.location },
                  { label: "Precio", value: event.priceLabel },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/8 bg-white/5 p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
                      {item.label}
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold leading-tight">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {event.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#d7d7d7]"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                {stripeEnabled && event.checkoutEnabled ? (
                  <CheckoutButton
                    resourceType="program"
                    resourceId={event.id}
                    enabled
                    label="Reservar plaza"
                  />
                ) : event.registrationUrl && event.registrationUrl !== "#" ? (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary rounded px-6 py-3 text-sm"
                  >
                    Inscripción
                  </a>
                ) : null}
                <Link
                  href={event.programType === "tecnificacion" ? "/tecnificaciones" : "/campamentos"}
                  className="btn-outline rounded px-6 py-3 text-sm"
                >
                  Ver Ficha Completa
                </Link>
              </div>

              {events.length > 1 ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {events.map((item, index) => (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => setCurrent(index)}
                      className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.24em] transition-colors ${
                        index === current
                          ? "border-[#00C8FF]/30 bg-[#00C8FF]/10 text-[#c7f4ff]"
                          : "border-white/8 bg-white/5 text-[#8b8b8b] hover:text-white"
                      }`}
                    >
                      {item.shortTitle}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
