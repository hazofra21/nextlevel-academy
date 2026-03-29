"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/95 backdrop-blur-md border-b border-[#222]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="font-display text-2xl font-bold tracking-widest text-white">
            NEXT<span className="text-gradient">LEVEL</span>
          </span>
          <span className="hidden sm:block text-[10px] text-[#888] font-medium tracking-[0.3em] uppercase border-l border-[#333] pl-3">
            Academy
          </span>
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#programas" className="text-sm text-[#aaa] hover:text-white transition-colors tracking-wider uppercase font-medium">
            Programas
          </Link>
          <Link href="#tecnificaciones" className="text-sm text-[#aaa] hover:text-white transition-colors tracking-wider uppercase font-medium">
            Tecnificaciones
          </Link>
          <Link href="#tienda" className="text-sm text-[#aaa] hover:text-white transition-colors tracking-wider uppercase font-medium">
            Tienda
          </Link>
          <Link href="#sobre-nosotros" className="text-sm text-[#aaa] hover:text-white transition-colors tracking-wider uppercase font-medium">
            Nosotros
          </Link>
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="btn-outline px-5 py-2.5 rounded text-sm">
            Entrar
          </Link>
          <Link href="/login" className="btn-primary px-5 py-2.5 rounded text-sm">
            Empieza Ahora
          </Link>
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-t border-[#222] px-6 py-6 flex flex-col gap-5">
          <Link href="#programas" onClick={() => setMenuOpen(false)} className="text-sm text-[#aaa] hover:text-white uppercase tracking-wider font-medium">Programas</Link>
          <Link href="#tecnificaciones" onClick={() => setMenuOpen(false)} className="text-sm text-[#aaa] hover:text-white uppercase tracking-wider font-medium">Tecnificaciones</Link>
          <Link href="#tienda" onClick={() => setMenuOpen(false)} className="text-sm text-[#aaa] hover:text-white uppercase tracking-wider font-medium">Tienda</Link>
          <Link href="#sobre-nosotros" onClick={() => setMenuOpen(false)} className="text-sm text-[#aaa] hover:text-white uppercase tracking-wider font-medium">Nosotros</Link>
          <div className="flex flex-col gap-3 pt-2 border-t border-[#222]">
            <Link href="/login" className="btn-outline px-5 py-3 rounded text-sm text-center">Entrar</Link>
            <Link href="/login" className="btn-primary px-5 py-3 rounded text-sm text-center">Empieza Ahora</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
