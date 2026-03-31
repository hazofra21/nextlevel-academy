import Link from "next/link";

export default function CTAFinal() {
  return (
    <section className="py-32 bg-[#050505]/66 backdrop-blur-[2px] relative overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#001525] to-[#050505]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00C8FF]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="accent-line mx-auto mb-6" />
        <span className="text-[#00C8FF] text-xs tracking-[0.3em] uppercase font-medium block mb-6">
          Empieza hoy
        </span>
        <h2 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none">
          TU PRÓXIMO NIVEL
          <br />
          <span className="text-gradient">TE ESPERA</span>
        </h2>
        <p className="text-[#666] text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Únete a cientos de jugadores que ya entrenan con metodología de élite.
          Comienza gratis, sin compromisos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-primary px-10 py-4 rounded text-base">
            Empieza Gratis Ahora
          </Link>
          <Link href="/tecnificaciones" className="btn-outline px-10 py-4 rounded text-base">
            Ver todos los programas
          </Link>
        </div>

        <p className="text-[#333] text-xs mt-8 tracking-wider">
          Sin tarjeta de crédito · Cancela cuando quieras · Acceso inmediato
        </p>
      </div>
    </section>
  );
}
