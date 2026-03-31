const testimonios = [
  {
    nombre: "Alejandro R.",
    edad: "16 años · Jugador",
    texto: "En 3 meses de tecnificación mejoré mi velocidad de patinaje y el tiro más que en 2 años en mi club. Los análisis de vídeo son increíbles.",
    rating: 5,
  },
  {
    nombre: "María S.",
    edad: "14 años · Portera",
    texto: "El programa de porteras es exactamente lo que necesitaba. Mi entrenadora no tenía experiencia específica en portería y aquí tengo coaches especializados.",
    rating: 5,
  },
  {
    nombre: "Daniel M.",
    edad: "19 años · Jugador",
    texto: "Combino el programa físico con mis entrenamientos del club y la diferencia es brutal. Más explosivo, menos lesiones.",
    rating: 5,
  },
  {
    nombre: "Pablo G.",
    edad: "13 años · Jugador",
    texto: "Mi hijo lleva 2 temporadas con NextLevel y ha pasado de equipo regional a ser captado por un club de División de Honor. Los números hablan solos.",
    rating: 5,
  },
];

const logros = [
  { valor: "93%", label: "de alumnos mejoran su nivel en 90 días" },
  { valor: "47+", label: "captaciones por clubes profesionales" },
  { valor: "4.9/5", label: "valoración media de los programas" },
  { valor: "6", label: "países con alumnos activos" },
];

export default function TestimoniosSection() {
  return (
    <section className="py-24 bg-[#080808]/62 backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="accent-line mb-4" />
          <span className="text-[#00C8FF] text-xs tracking-[0.3em] uppercase font-medium mb-3">
            Resultados reales
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold">
            LO QUE DICEN NUESTROS JUGADORES
          </h2>
        </div>

        {/* Logros */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {logros.map((l) => (
            <div key={l.label} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6 text-center">
              <p className="font-display text-4xl font-bold text-gradient mb-2">{l.valor}</p>
              <p className="text-[#555] text-xs leading-relaxed">{l.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonios.map((t) => (
            <div
              key={t.nombre}
              className="card-hover bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-6 flex flex-col gap-4"
            >
              {/* Estrellas */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#00C8FF">
                    <path d="M7 1l1.8 3.6L13 5.35l-3 2.9.7 4.1L7 10.35 3.3 12.35l.7-4.1-3-2.9 4.2-.75L7 1z" />
                  </svg>
                ))}
              </div>

              <p className="text-[#888] text-sm leading-relaxed flex-1">&ldquo;{t.texto}&rdquo;</p>

              <div className="border-t border-[#1a1a1a] pt-4">
                <p className="font-medium text-sm text-white">{t.nombre}</p>
                <p className="text-[#555] text-xs mt-0.5">{t.edad}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
