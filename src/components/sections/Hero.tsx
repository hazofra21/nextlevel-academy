"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

const BG_IMAGES = [
  "/backgrounds/bg-04.png",
  "/backgrounds/bg-02.png",
  "/backgrounds/bg-06.png",
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BG_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Fondos rotativos — fijos al scroll */}
      {BG_IMAGES.map((src, i) => (
        <div
          key={src}
          className="fixed inset-0 -z-20 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover object-center brightness-[1.22] contrast-[1.06] saturate-[1.08]"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gradientes suaves de apoyo, sin apagar la foto */}
      <div className="fixed inset-0 -z-10" style={{
        background: [
          "radial-gradient(circle at center, rgba(5,5,5,0.03) 0%, rgba(5,5,5,0.14) 75%, rgba(5,5,5,0.22) 100%)",
          "linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0.015) 22%, rgba(5,5,5,0.015) 68%, rgba(5,5,5,0.16) 100%)"
        ].join(", ")
      }} />

      {/* Luces accent */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00C8FF]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#0080FF]/5 blur-[100px] pointer-events-none" />

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
        <div className="w-full max-w-5xl rounded-[2rem] border border-white/8 bg-[#050505]/18 px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-[2px] sm:px-10 sm:py-10">
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

        {/* Indicadores de imagen */}
        <div className="flex gap-2 mt-8">
          {BG_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: i === current ? "#00C8FF" : "#333" }}
            />
          ))}
        </div>
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
  )
}
