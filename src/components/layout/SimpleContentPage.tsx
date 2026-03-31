import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

interface SimpleContentPageProps {
  eyebrow: string;
  title: string;
  description: string;
  status?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  highlights?: string[];
  cards?: Array<{
    title: string;
    description: string;
  }>;
  roadmapTitle?: string;
  roadmapItems?: string[];
}

export default function SimpleContentPage({
  eyebrow,
  title,
  description,
  status = "Vista previa",
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  highlights = [],
  cards = [],
  roadmapTitle = "Qué vendrá en esta sección",
  roadmapItems = [],
}: SimpleContentPageProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] pt-28">
        <section className="bg-[#050505]/72 pb-24 backdrop-blur-[2px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_420px]">
              <div className="rounded-[2rem] border border-[#1a1a1a] bg-[#0d0d0d]/90 p-8 md:p-12">
                <div className="accent-line mb-4" />
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="block text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                    {eyebrow}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#a4a4a4]">
                    {status}
                  </span>
                </div>

                <h1 className="font-display text-5xl font-bold leading-none md:text-7xl">{title}</h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#868686]">
                  {description}
                </p>

                {highlights.length > 0 ? (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-[#00C8FF]/20 bg-[#00C8FF]/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#c8f3ff]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                ) : null}

                {(primaryCtaLabel && primaryCtaHref) || (secondaryCtaLabel && secondaryCtaHref) ? (
                  <div className="mt-10 flex flex-wrap gap-4">
                    {primaryCtaLabel && primaryCtaHref ? (
                      <Link href={primaryCtaHref} className="btn-primary rounded px-6 py-3 text-sm">
                        {primaryCtaLabel}
                      </Link>
                    ) : null}
                    {secondaryCtaLabel && secondaryCtaHref ? (
                      <Link href={secondaryCtaHref} className="btn-outline rounded px-6 py-3 text-sm">
                        {secondaryCtaLabel}
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <aside className="rounded-[2rem] border border-[#1a1a1a] bg-[linear-gradient(180deg,rgba(0,200,255,0.12)_0%,rgba(9,9,9,0.95)_28%,rgba(9,9,9,0.96)_100%)] p-8">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                  Roadmap visual
                </p>
                <h2 className="mt-4 font-display text-3xl font-bold">{roadmapTitle}</h2>
                <div className="mt-8 space-y-4">
                  {roadmapItems.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-start gap-4 rounded-2xl border border-white/6 bg-white/4 p-4"
                    >
                      <span className="font-display text-3xl leading-none text-[#00C8FF]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="pt-1 text-sm leading-relaxed text-[#d4d4d4]">{item}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </div>

            {cards.length > 0 ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-[1.6rem] border border-[#1a1a1a] bg-[#0f0f0f]/88 p-7 shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                      Bloque
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-bold">{card.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-[#787878]">{card.description}</p>
                  </article>
                ))}
              </div>
            ) : null}

            <div className="mt-8 rounded-[1.8rem] border border-[#1a1a1a] bg-[#0d0d0d]/88 p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                    Estado de esta página
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#8a8a8a]">
                    La estructura visual ya está creada para que el sitio no tenga páginas vacías. El contenido editorial, catálogo, fechas, fichas y automatizaciones lo ajustamos después.
                  </p>
                </div>
                <Link href="/contacto" className="btn-outline shrink-0 rounded px-5 py-3 text-sm">
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
