import Link from "next/link";
import Logo from "@/components/layout/Logo";

interface AdminShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Eventos", href: "/admin/eventos" },
  { label: "Alumnos", href: "/admin/alumnos" },
  { label: "Contactos", href: "/admin/contactos" },
  { label: "Cobros", href: "/admin/cobros" },
  { label: "Seguridad", href: "/admin/seguridad" },
  { label: "Ajustes", href: "/admin/ajustes" },
];

export default function AdminShell({
  title,
  description,
  children,
}: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-[#141414] bg-[#080808] p-6">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center">
              <Logo variant="horizontal" height={30} />
            </Link>
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[#00C8FF]">
              Admin
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl border border-transparent bg-white/3 px-4 py-3 text-sm text-[#b7b7b7] transition-colors hover:border-[#00C8FF]/20 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <form action="/admin/api/logout" method="post" className="mt-10">
            <button
              type="submit"
              className="w-full rounded-xl border border-[#2a2a2a] px-4 py-3 text-left text-sm uppercase tracking-[0.22em] text-[#8a8a8a] transition-colors hover:border-white/20 hover:text-white"
            >
              Cerrar sesión
            </button>
          </form>
        </aside>

        <main className="bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.08),transparent_28%),#050505] p-6 md:p-10">
          <header className="mb-8 rounded-[1.8rem] border border-[#191919] bg-[#0a0a0a]/92 p-8">
            <div className="accent-line mb-4" />
            <span className="text-xs uppercase tracking-[0.3em] text-[#00C8FF]">
              Gestión interna
            </span>
            <h1 className="mt-4 font-display text-5xl font-bold md:text-6xl">
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#8a8a8a]">
              {description}
            </p>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}
