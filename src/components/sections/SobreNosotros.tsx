import Image from "next/image"

const logros = [
  { valor: "Copa de Europa", label: "Hockey Línea · Selección Absoluta" },
  { valor: "1ª División", label: "Hockey Hielo · España" },
  { valor: "Internacional", label: "Selección Nacional" },
]

export default function SobreNosotros() {
  return (
    <section className="py-24 bg-[#080808]/62 backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16">
          <div className="accent-line mb-4" />
          <span className="text-[#00C8FF] text-xs tracking-[0.3em] uppercase font-medium block mb-3">
            Quiénes somos
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            EL EQUIPO DETRÁS<br />
            <span className="text-gradient">DE NEXT LEVEL</span>
          </h2>
        </div>

        {/* Director */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Foto */}
          <div className="relative">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden max-w-sm mx-auto lg:mx-0">
              <Image
                src="/people/pablo-mata-raise-inline.jpg"
                alt="Pablo Mata — Fundador NextLevel Academy"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
            </div>
            {/* Badge flotante */}
            <div className="absolute bottom-6 left-1/2 lg:left-8 -translate-x-1/2 lg:translate-x-0 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl px-5 py-3 text-center">
              <p className="font-display text-lg font-bold text-white">PABLO MATA</p>
              <p className="text-[#00C8FF] text-xs tracking-widest uppercase">Fundador & Head Coach</p>
            </div>
          </div>

          {/* Contenido */}
          <div className="flex flex-col gap-8">

            {/* Bio */}
            <div>
              <p className="text-white text-lg leading-relaxed mb-4">
                Soy el entrenador principal y fundador de la Academia de Hockey Next Level.
                Este proyecto nació de mi pasión por el hockey y de la experiencia acumulada
                a lo largo de los años, que me llevó a entender que el verdadero crecimiento
                de un jugador va más allá de lo técnico.
              </p>
              <p className="text-[#666] text-base leading-relaxed mb-4">
                Desde pequeño el hockey me enamoró — un deporte que me ha dado experiencias
                únicas, títulos en primera categoría y el orgullo de representar a mi país.
                En hockey línea, uno de los logros más importantes de mi carrera fue levantar
                la <span className="text-white font-medium">Copa de Europa con la Selección Absoluta</span>.
              </p>
              <p className="text-[#666] text-base leading-relaxed">
                Así nació Next Level: con la idea de crear un espacio donde cada jugador
                pueda desarrollar su máximo potencial trabajando no solo el rendimiento
                deportivo, sino también los valores, la confianza y la mentalidad necesaria
                para crecer dentro y fuera de la pista.
              </p>
            </div>

            {/* Logros */}
            <div className="grid grid-cols-3 gap-4">
              {logros.map((l) => (
                <div key={l.valor} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-4 text-center">
                  <p className="font-display text-sm font-bold text-gradient leading-tight mb-1">{l.valor}</p>
                  <p className="text-[#444] text-[11px] leading-tight">{l.label}</p>
                </div>
              ))}
            </div>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/nextlevelsportnet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#555] hover:text-[#00C8FF] transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @nextlevelsportnet
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
