"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AcademyEvent } from "@/content/events";

interface UpcomingEventPopupProps {
  event: AcademyEvent | null;
}

export default function UpcomingEventPopup({
  event,
}: UpcomingEventPopupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!event) return;

    const storageKey = `nextlevel-hide-event-${event.slug}`;
    const shouldHide = window.localStorage.getItem(storageKey);

    if (!shouldHide) {
      setOpen(true);
    }
  }, [event]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!event || !open) return null;

  const handleClose = () => setOpen(false);

  const handleDontShowAgain = () => {
    window.localStorage.setItem(`nextlevel-hide-event-${event.slug}`, "1");
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#1f1f1f] bg-[#080808] shadow-[0_30px_120px_rgba(0,0,0,0.6)]">
        <button
          type="button"
          aria-label="Cerrar popup"
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition-colors hover:border-[#00C8FF]/40 hover:text-[#00C8FF]"
        >
          ×
        </button>

        <div className="grid max-h-[92vh] overflow-auto lg:grid-cols-[380px_minmax(0,1fr)]">
          <div className="relative min-h-[420px] border-b border-[#1a1a1a] lg:min-h-full lg:border-b-0 lg:border-r">
            <Image
              src={event.poster}
              alt={event.title}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className="p-7 md:p-10">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#00C8FF]/25 bg-[#00C8FF]/8 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.32em] text-[#bfefff]">
                Próximo Campamento
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-[#b5b5b5]">
                {event.capacityLabel}
              </span>
            </div>

            <h2 className="font-display text-4xl font-bold leading-none md:text-6xl">
              {event.shortTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#8d8d8d]">
              {event.summary}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary rounded px-6 py-3 text-sm"
              >
                Inscribirse
              </a>
              <Link href="/campamentos" className="btn-outline rounded px-6 py-3 text-sm">
                Ver Más Info
              </Link>
            </div>

            <div className="mt-8 border-t border-[#1a1a1a] pt-6 text-sm text-[#7e7e7e]">
              <p>
                Dudas o información:{" "}
                <a href={`tel:${event.contactPhone.replace(/\s+/g, "")}`} className="text-white hover:text-[#00C8FF]">
                  {event.contactPhone}
                </a>
                {" · "}
                <a href={`mailto:${event.contactEmail}`} className="text-white hover:text-[#00C8FF]">
                  {event.contactEmail}
                </a>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleDontShowAgain}
                className="text-xs uppercase tracking-[0.24em] text-[#7f7f7f] transition-colors hover:text-white"
              >
                No mostrar más
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="text-xs uppercase tracking-[0.24em] text-[#00C8FF] transition-colors hover:text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
