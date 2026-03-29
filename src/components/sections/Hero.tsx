import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fondo con gradiente dramático — reemplazar por video cuando esté disponible */}
      <div className="absolute inset-0 bg-[#050505]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#001a2e] via-[#050505] to-[#050505]" />
        {/* Efecto de luz accent */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00C8FF]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#0080FF]/5 blur-[100px] pointer-events-none" />
      </div>

      {/* Grid decorativo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#00C8FF 1px, transparent 1px), linear-gradient(90deg, #00C8FF 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-[#00C8FF]/30 bg-[#00C8FF]/5 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C8FF] animate-pulse" />
          <span className="text-[#00C8FF] text-xs font-medium tracking-[0.2em] uppercase">
            Academia Online de Alto Rendimiento
          </span>
        </div>

        {/* Título principal */}
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none mb-6 max-w-5xl">
          ENTRENA COMO
          <br />
          <span className="text-gradient">UN PROFESIONAL</span>
          <br />
          DESDE CUALQUIER LUGAR
        </h1>

        {/* Subtítulo */}
        <p className="text-[#888] text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          Tecnificaciones, campamentos y cursos online de hockey hielo y línea.
          Metodología de élite, seguimiento personalizado, resultados reales.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/login" className="btn-primary px-8 py-4 rounded text-base">
            Empieza Ahora — Es Gratis
          </Link>
          <Link href="#programas" className="btn-outline px-8 py-4 rounded text-base">
            Ver Programas
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 border-t border-[#1a1a1a] pt-12">
          {[
            { valor: "+500", label: "Jugadores formados" },
            { valor: "12+", label: "Entrenadores expertos" },
            { valor: "100%", label: "Online y presencial" },
            { valor: "3", label: "Países activos" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="font-display text-4xl font-bold text-gradient">
                {stat.valor}
              </span>
              <span className="text-[#555] text-sm tracking-wider uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Flecha scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[#333] text-xs tracking-widest uppercase">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#333]">
          <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
