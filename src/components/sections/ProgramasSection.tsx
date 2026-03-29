import Link from "next/link";

const programas = [
  {
    tipo: "JUGADORES",
    titulo: "Tecnificación Integral",
    descripcion: "Programa completo para jugadores de campo. Patinaje, técnica de palo, tiro, juego en zona y lectura del juego.",
    detalles: ["12 semanas de duración", "2-3 sesiones por semana", "Vídeoanalísis incluido", "Todos los niveles"],
    precio: "Desde 89€/mes",
    badge: "MÁS POPULAR",
    badgeColor: "bg-[#00C8FF] text-black",
    href: "/tecnificaciones",
  },
  {
    tipo: "PORTEROS",
    titulo: "Goalkeeper Elite",
    descripcion: "Entrenamiento especializado exclusivo para porteros. Técnica de posicionamiento, reflejos, salidas y juego con el stick.",
    detalles: ["8 semanas de duración", "3 sesiones por semana", "Coach específico porteros", "Nivel intermedio-avanzado"],
    precio: "Desde 99€/mes",
    badge: "ESPECIALIZADO",
    badgeColor: "bg-[#0080FF] text-white",
    href: "/tecnificaciones",
  },
  {
    tipo: "FÍSICO",
    titulo: "Hockey Performance",
    descripcion: "Preparación física específica para hockey. Velocidad explosiva, potencia en el patin, agilidad y prevención de lesiones.",
    detalles: ["Plan personalizado", "Seguimiento semanal", "Compatible con cualquier programa", "Online y presencial"],
    precio: "Desde 49€/mes",
    badge: "COMPLEMENTARIO",
    badgeColor: "bg-white/10 text-white",
    href: "/tecnificaciones",
  },
];

export default function ProgramasSection() {
  return (
    <section id="programas" className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="accent-line mb-4" />
          <span className="text-[#00C8FF] text-xs tracking-[0.3em] uppercase font-medium mb-3">
            Programas
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-bold max-w-3xl">
            ELIGE TU CAMINO HACIA LA ÉLITE
          </h2>
          <p className="text-[#555] mt-4 max-w-xl text-base">
            Programas diseñados para cada perfil. Tanto si eres jugador, portero o quieres mejorar tu físico, tenemos el programa para ti.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programas.map((p) => (
            <div
              key={p.tipo}
              className="card-hover bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Header card */}
              <div className="p-6 border-b border-[#1a1a1a]">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[#00C8FF] text-[10px] tracking-[0.3em] uppercase font-medium">
                    {p.tipo}
                  </span>
                  <span className={`text-[10px] tracking-[0.2em] uppercase font-bold px-2.5 py-1 rounded ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{p.titulo}</h3>
                <p className="text-[#555] text-sm leading-relaxed">{p.descripcion}</p>
              </div>

              {/* Detalles */}
              <div className="p-6 flex-1">
                <ul className="flex flex-col gap-3 mb-6">
                  {p.detalles.map((d) => (
                    <li key={d} className="flex items-center gap-3 text-sm text-[#888]">
                      <span className="w-1 h-1 rounded-full bg-[#00C8FF] shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-[#1a1a1a]">
                <p className="text-white font-display font-bold text-lg mb-4">{p.precio}</p>
                <Link
                  href={p.href}
                  className="btn-primary w-full py-3 rounded text-sm text-center block"
                >
                  Ver Programa
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA campamentos */}
        <div className="mt-10 bg-gradient-to-r from-[#00C8FF]/10 to-[#0080FF]/10 border border-[#00C8FF]/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[#00C8FF] text-xs tracking-[0.3em] uppercase font-medium block mb-2">También disponible</span>
            <h3 className="font-display text-3xl font-bold">CAMPAMENTOS DE VERANO</h3>
            <p className="text-[#666] text-sm mt-2">Inmersión total en hockey hielo y línea. Plazas limitadas.</p>
          </div>
          <Link href="/campamentos" className="btn-outline px-8 py-3.5 rounded text-sm shrink-0">
            Ver Campamentos
          </Link>
        </div>
      </div>
    </section>
  );
}
