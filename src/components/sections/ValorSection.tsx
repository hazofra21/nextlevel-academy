const valores = [
  {
    icono: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L4 10v12l12 6 12-6V10L16 4z" stroke="#00C8FF" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 10l12 6 12-6M16 16v10" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    titulo: "Entrenamiento Técnico",
    descripcion: "Programas de tecnificación diseñados por entrenadores con experiencia en ligas profesionales. Patinaje, stick handling, tiro y juego posicional.",
    etiqueta: "TÉCNICA",
  },
  {
    icono: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4z" stroke="#00C8FF" strokeWidth="1.5" />
        <path d="M16 10v6l4 4" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    titulo: "Preparación Física",
    descripcion: "Planes de acondicionamiento específicos para hockey. Velocidad, potencia, agilidad y resistencia. Adaptado a cada edad y nivel.",
    etiqueta: "FÍSICO",
  },
  {
    icono: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4l3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9l3-9z" stroke="#00C8FF" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    titulo: "Mentalidad Competitiva",
    descripcion: "Psicología deportiva aplicada al hockey. Gestión de la presión, concentración, liderazgo y desarrollo de la mentalidad ganadora.",
    etiqueta: "MENTAL",
  },
  {
    icono: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="24" height="18" rx="2" stroke="#00C8FF" strokeWidth="1.5" />
        <path d="M4 14h24M10 6v4M22 6v4" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 20h4M18 20h4" stroke="#00C8FF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    titulo: "Programas por Posición",
    descripcion: "Entrenamientos específicos para jugadores de campo y porteros. Cada posición tiene sus propias demandas técnicas y físicas.",
    etiqueta: "POSICIÓN",
  },
];

export default function ValorSection() {
  return (
    <section className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="accent-line mb-4" />
          <span className="text-[#00C8FF] text-xs tracking-[0.3em] uppercase font-medium mb-3">
            Qué ofrecemos
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold max-w-2xl">
            FORMACIÓN COMPLETA PARA JUGADORES DE ÉLITE
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valores.map((v) => (
            <div
              key={v.titulo}
              className="card-hover bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="w-14 h-14 rounded-lg bg-[#00C8FF]/5 border border-[#00C8FF]/10 flex items-center justify-center">
                {v.icono}
              </div>
              <div>
                <span className="text-[#00C8FF] text-[10px] tracking-[0.25em] uppercase font-medium">
                  {v.etiqueta}
                </span>
                <h3 className="font-display text-xl font-bold mt-1 mb-2">{v.titulo}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{v.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
