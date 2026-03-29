import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const logos = [
  {
    nombre: "Horizontal — Color",
    descripcion: "Uso principal. Navbar, cabeceras, fondos oscuros.",
    archivo: "/logos/logo-horizontal-color.svg",
    fondo: "bg-[#050505]",
    tag: "PRINCIPAL",
  },
  {
    nombre: "Horizontal — Blanco",
    descripcion: "Fondos oscuros sin gradiente. Impresión en negro.",
    archivo: "/logos/logo-horizontal-blanco.svg",
    fondo: "bg-[#111]",
    tag: null,
  },
  {
    nombre: "Horizontal — Negro",
    descripcion: "Fondos blancos o claros. Documentos, merchandising.",
    archivo: "/logos/logo-horizontal-negro.svg",
    fondo: "bg-white",
    tag: null,
  },
  {
    nombre: "Vertical — Color",
    descripcion: "Redes sociales, portadas, uso secundario en web.",
    archivo: "/logos/logo-vertical-color.svg",
    fondo: "bg-[#050505]",
    tag: null,
  },
  {
    nombre: "Vertical — Blanco",
    descripcion: "Fondos oscuros sin gradiente. Stories, banners.",
    archivo: "/logos/logo-vertical-blanco.svg",
    fondo: "bg-[#111]",
    tag: null,
  },
  {
    nombre: "Vertical — Negro",
    descripcion: "Fondos blancos o claros. Impresión, merchandising.",
    archivo: "/logos/logo-vertical-negro.svg",
    fondo: "bg-white",
    tag: null,
  },
  {
    nombre: "Icono — Color",
    descripcion: "Favicon, avatar, app icon, notificaciones.",
    archivo: "/logos/logo-icono-color.svg",
    fondo: "bg-[#050505]",
    tag: null,
  },
];

const colores = [
  { nombre: "Accent Blue", hex: "#00C8FF", uso: "Color principal, CTA, links" },
  { nombre: "Accent Dark", hex: "#0080FF", uso: "Gradiente secundario" },
  { nombre: "Negro Base", hex: "#050505", uso: "Fondo principal" },
  { nombre: "Superficie", hex: "#0f0f0f", uso: "Cards, paneles" },
  { nombre: "Blanco", hex: "#ffffff", uso: "Texto principal" },
  { nombre: "Gris Muted", hex: "#888888", uso: "Texto secundario" },
];

export default function BrandPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24 min-h-screen bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="mb-16">
            <div className="accent-line mb-4" />
            <span className="text-[#00C8FF] text-xs tracking-[0.3em] uppercase font-medium block mb-3">
              Identidad visual
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              BRAND ASSETS
            </h1>
            <p className="text-[#555] text-base max-w-xl">
              Recursos gráficos oficiales de NextLevel Academy. Usa siempre los archivos originales sin modificar proporciones ni colores.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/5 rounded-full px-4 py-1.5">
              <span className="text-yellow-400 text-xs tracking-wider">Próximamente solo accesible para administradores</span>
            </div>
          </div>

          {/* Logos */}
          <section className="mb-20">
            <h2 className="font-display text-2xl font-bold mb-8 text-[#888] tracking-wider">LOGOTIPOS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {logos.map((logo) => (
                <div key={logo.nombre} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden">
                  {/* Preview */}
                  <div className={`${logo.fondo} h-36 flex items-center justify-center p-8 border-b border-[#1a1a1a]`}>
                    <img
                      src={logo.archivo}
                      alt={logo.nombre}
                      className="max-h-20 max-w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm text-white">{logo.nombre}</p>
                      {logo.tag && (
                        <span className="text-[10px] font-bold tracking-wider bg-[#00C8FF] text-black px-2 py-0.5 rounded shrink-0">
                          {logo.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[#555] text-xs mb-4">{logo.descripcion}</p>
                    <a
                      href={logo.archivo}
                      download
                      className="btn-primary w-full py-2.5 rounded text-xs text-center block"
                    >
                      Descargar SVG
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Colores */}
          <section className="mb-20">
            <h2 className="font-display text-2xl font-bold mb-8 text-[#888] tracking-wider">PALETA DE COLORES</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {colores.map((color) => (
                <div key={color.hex} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden">
                  <div
                    className="h-20"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="p-4">
                    <p className="font-medium text-xs text-white mb-1">{color.nombre}</p>
                    <p className="font-mono text-[#00C8FF] text-xs mb-1">{color.hex}</p>
                    <p className="text-[#444] text-[11px]">{color.uso}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tipografía */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-8 text-[#888] tracking-wider">TIPOGRAFÍA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-8">
                <p className="text-[#555] text-xs tracking-wider uppercase mb-4">Display / Títulos</p>
                <p className="font-display text-5xl font-bold mb-4">OSWALD</p>
                <p className="font-display text-xl text-[#555]">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
                <p className="font-display text-base text-[#333] mt-2">0123456789</p>
                <p className="text-[#444] text-xs mt-4">Bold 700 · Uppercase · Letter-spacing 0.02em</p>
              </div>
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-8">
                <p className="text-[#555] text-xs tracking-wider uppercase mb-4">Cuerpo / UI</p>
                <p className="text-4xl font-bold mb-4">Inter</p>
                <p className="text-xl text-[#555]">ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz</p>
                <p className="text-base text-[#333] mt-2">0123456789</p>
                <p className="text-[#444] text-xs mt-4">Regular 400 / Medium 500 / Bold 700</p>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
