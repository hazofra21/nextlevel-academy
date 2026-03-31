import Image from "next/image";
import Link from "next/link";
import type { AcademyEvent } from "@/content/events";

interface UpcomingEventBannerProps {
  event: AcademyEvent | null;
}

export default function UpcomingEventBanner({
  event,
}: UpcomingEventBannerProps) {
  const nextEvent = event;

  if (!nextEvent) return null;

  return (
    <section className="bg-[#050505]/68 py-8 backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[2rem] border border-[#1a1a1a] bg-[linear-gradient(130deg,rgba(0,200,255,0.14)_0%,rgba(8,8,8,0.95)_22%,rgba(8,8,8,0.95)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
          <div className="grid gap-0 lg:grid-cols-[340px_minmax(0,1fr)]">
            <div className="relative min-h-[420px] border-b border-[#1a1a1a] lg:min-h-full lg:border-b-0 lg:border-r">
              <Image
                src={nextEvent.poster}
                alt={nextEvent.title}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>

            <div className="p-8 md:p-10">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#00C8FF]/25 bg-[#00C8FF]/8 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.32em] text-[#bfefff]">
                  Próximo Campamento
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-[#b5b5b5]">
                  {nextEvent.capacityLabel}
                </span>
              </div>

              <h2 className="font-display text-4xl font-bold leading-none md:text-6xl">
                {nextEvent.shortTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#8d8d8d]">
                {nextEvent.summary}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Fecha", value: nextEvent.dateLabel },
                  { label: "Horario", value: nextEvent.timeLabel },
                  { label: "Ubicación", value: nextEvent.location },
                  { label: "Precio", value: nextEvent.priceLabel },
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
                <a
                  href={nextEvent.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary rounded px-6 py-3 text-sm"
                >
                  Inscribirse
                </a>
                <Link href="/campamentos" className="btn-outline rounded px-6 py-3 text-sm">
                  Ver Ficha Completa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
