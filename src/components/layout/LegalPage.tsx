import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: Array<{
    title: string;
    content: string[];
  }>;
}

export default function LegalPage({
  eyebrow,
  title,
  description,
  sections,
}: LegalPageProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] pt-28">
        <section className="bg-[#050505]/78 pb-24 backdrop-blur-[2px]">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-14">
              <div className="accent-line mb-4" />
              <span className="mb-3 block text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                {eyebrow}
              </span>
              <h1 className="font-display text-5xl font-bold md:text-6xl">{title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#7a7a7a]">
                {description}
              </p>
            </div>

            <div className="space-y-8">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d]/92 p-7"
                >
                  <h2 className="font-display text-2xl font-bold">{section.title}</h2>
                  <div className="mt-4 space-y-4">
                    {section.content.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-relaxed text-[#8c8c8c]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
