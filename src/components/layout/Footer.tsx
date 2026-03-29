import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#111]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo */}
          <div className="md:col-span-1">
            <div className="font-display text-2xl font-bold tracking-widest mb-4">
              NEXT<span className="text-gradient">LEVEL</span>
              <div className="text-[10px] text-[#555] font-sans normal-case tracking-[0.3em] mt-0.5">ACADEMY</div>
            </div>
            <p className="text-[#444] text-sm leading-relaxed">
              Academia online de hockey hielo y línea de alto rendimiento.
            </p>
          </div>

          {/* Programas */}
          <div>
            <p className="text-[#888] text-xs tracking-[0.25em] uppercase font-medium mb-4">Programas</p>
            <ul className="flex flex-col gap-3">
              {["Tecnificaciones", "Campamentos", "Cursos Online", "Clases Personales"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[#444] text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academia */}
          <div>
            <p className="text-[#888] text-xs tracking-[0.25em] uppercase font-medium mb-4">Academia</p>
            <ul className="flex flex-col gap-3">
              {["Sobre Nosotros", "Entrenadores", "Tienda", "Blog"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[#444] text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-[#888] text-xs tracking-[0.25em] uppercase font-medium mb-4">Contacto</p>
            <ul className="flex flex-col gap-3">
              {["Instagram", "Telegram", "YouTube", "Email"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[#444] text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#111] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#333] text-xs tracking-wider">
            © 2025 NextLevel Academy · Todos los derechos reservados
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-[#333] text-xs hover:text-white transition-colors tracking-wider uppercase">
              Privacidad
            </Link>
            <Link href="#" className="text-[#333] text-xs hover:text-white transition-colors tracking-wider uppercase">
              Términos
            </Link>
            <Link href="#" className="text-[#333] text-xs hover:text-white transition-colors tracking-wider uppercase">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
