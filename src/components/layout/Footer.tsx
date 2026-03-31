import Link from "next/link";
import Logo from "./Logo";
import { getAcademySettings } from "@/lib/settings";

export default async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getAcademySettings().catch(() => null);
  const social = settings?.redes_sociales ?? {};

  const programLinks = [
    { label: "Tecnificaciones", href: "/tecnificaciones" },
    { label: "Campamentos", href: "/campamentos" },
    { label: "Cursos Online", href: "/cursos-online" },
    { label: "Clases Personales", href: "/clases-personales" },
  ];

  const academyLinks = [
    { label: "Sobre Nosotros", href: "/nosotros" },
    { label: "Entrenadores", href: "/entrenadores" },
    { label: "Tienda", href: "/tienda" },
    { label: "Blog", href: "/blog" },
  ];

  const contactLinks = [
    {
      label: "Instagram",
      href: social.instagram || "https://www.instagram.com/nextlevelsportnet",
      external: true,
    },
    {
      label: "Telegram",
      href: social.telegram || "/contacto#telegram",
      external: Boolean(social.telegram),
    },
    {
      label: "YouTube",
      href: social.youtube || "/contacto#youtube",
      external: Boolean(social.youtube),
    },
    {
      label: "Email",
      href: settings?.email_contacto
        ? `mailto:${settings.email_contacto}`
        : "/contacto#email",
      external: Boolean(settings?.email_contacto),
    },
  ];

  return (
    <footer className="bg-[#050505] border-t border-[#111]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo */}
          <div className="md:col-span-1">
            <Logo variant="vertical" height={64} className="mb-2" />
            <p className="text-[#444] text-sm leading-relaxed">
              {settings?.nombre_academia || "NextLevel Academy"} · Academia online
              de hockey hielo y línea de alto rendimiento.
            </p>
          </div>

          {/* Programas */}
          <div>
            <p className="text-[#888] text-xs tracking-[0.25em] uppercase font-medium mb-4">Programas</p>
            <ul className="flex flex-col gap-3">
              {programLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#444] text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academia */}
          <div>
            <p className="text-[#888] text-xs tracking-[0.25em] uppercase font-medium mb-4">Academia</p>
            <ul className="flex flex-col gap-3">
              {academyLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#444] text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p className="text-[#888] text-xs tracking-[0.25em] uppercase font-medium mb-4">Contacto</p>
            <ul className="flex flex-col gap-3">
              {contactLinks.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#444] text-sm hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-[#444] text-sm hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#111] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#333] text-xs tracking-wider">
            © {year} {settings?.nombre_academia || "NextLevel"} y H.Azofra · Todos
            los derechos reservados
          </p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="text-[#333] text-xs hover:text-white transition-colors tracking-wider uppercase">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-[#333] text-xs hover:text-white transition-colors tracking-wider uppercase">
              Términos
            </Link>
            <Link href="/cookies" className="text-[#333] text-xs hover:text-white transition-colors tracking-wider uppercase">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
