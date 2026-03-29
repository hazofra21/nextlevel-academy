const diferenciales = [
  {
    numero: "01",
    titulo: "100% Online y Presencial",
    descripcion: "Accede a todos los contenidos desde cualquier lugar del mundo. Videos en HD, ejercicios descargables y seguimiento en vivo.",
  },
  {
    numero: "02",
    titulo: "Análisis de Rendimiento",
    descripcion: "Sube tus vídeos y recibe análisis técnico personalizado de nuestros coaches. Datos reales, mejoras concretas.",
  },
  {
    numero: "03",
    titulo: "Evolución Medible",
    descripcion: "Dashboard de progreso con métricas de cada jugador. Visualiza tu evolución semana a semana con datos objetivos.",
  },
  {
    numero: "04",
    titulo: "Comunidad Élite",
    descripcion: "Entrena junto a jugadores de toda Europa. Grupos privados, retos semanales y competiciones internas.",
  },
];

export default function DiferencialSection() {
  return (
    <section className="py-24 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Izquierda */}
          <div>
            <div className="accent-line mb-4" />
            <span className="text-[#00C8FF] text-xs tracking-[0.3em] uppercase font-medium mb-3 block">
              Por qué NextLevel
            </span>
            <h2 className="font-display text-5xl md:text-6xl font-bold mb-6">
              LA ACADEMIA QUE LAS TRADICIONALES NO PUEDEN SER
            </h2>
            <p className="text-[#666] text-base leading-relaxed mb-10">
              Las academias tradicionales te limitan al lugar y el horario. Nosotros rompemos esas barreras.
              Metodología de élite, accesible desde cualquier pista del mundo.
            </p>

            {/* Diferencial items */}
            <div className="flex flex-col gap-8">
              {diferenciales.map((d) => (
                <div key={d.numero} className="flex gap-5">
                  <span className="font-display text-4xl font-bold text-[#1a1a1a] shrink-0 w-12">
                    {d.numero}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold mb-1">{d.titulo}</h3>
                    <p className="text-[#666] text-sm leading-relaxed">{d.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Derecha — mockup plataforma */}
          <div className="relative">
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              {/* Barra de la app */}
              <div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-5 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#222]" />
                  <div className="w-3 h-3 rounded-full bg-[#222]" />
                  <div className="w-3 h-3 rounded-full bg-[#222]" />
                </div>
                <span className="text-[#444] text-xs mx-auto">NextLevel — Dashboard</span>
              </div>

              {/* Contenido mockup */}
              <div className="p-6">
                {/* Header usuario */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#555] text-xs uppercase tracking-wider mb-1">Bienvenido de vuelta</p>
                    <p className="font-display text-lg font-bold">CARLOS MARTÍNEZ</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#555] text-xs uppercase tracking-wider mb-1">Nivel</p>
                    <p className="text-gradient font-display font-bold">AVANZADO</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { valor: "87%", label: "Progreso" },
                    { valor: "24", label: "Sesiones" },
                    { valor: "4.8", label: "Valoración" },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#0a0a0a] rounded-lg p-3 text-center border border-[#1a1a1a]">
                      <p className="font-display text-2xl font-bold text-gradient">{s.valor}</p>
                      <p className="text-[#444] text-xs mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Barra de progreso */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#555] mb-2">
                    <span>Tecnificación — Semana 8</span>
                    <span>87%</span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full w-[87%] bg-gradient-to-r from-[#00C8FF] to-[#0080FF] rounded-full" />
                  </div>
                </div>

                {/* Próxima sesión */}
                <div className="bg-[#00C8FF]/5 border border-[#00C8FF]/10 rounded-lg p-4">
                  <p className="text-[#00C8FF] text-xs uppercase tracking-wider mb-1">Próxima sesión</p>
                  <p className="font-medium text-sm">Stick handling avanzado — Drills de velocidad</p>
                  <p className="text-[#555] text-xs mt-1">Hoy · 45 min</p>
                </div>
              </div>
            </div>

            {/* Decoración */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-[#00C8FF]/5 blur-3xl" />
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-[#0080FF]/5 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
