import Link from "next/link";
import Logo from "@/components/layout/Logo";
import type { AppRole } from "@/auth/user";

interface UserShellProps {
  children: React.ReactNode;
  profileName: string;
  email: string;
  role: AppRole;
}

const navItems = [
  { label: "Resumen", href: "/dashboard" },
  { label: "Mi perfil", href: "/dashboard#perfil" },
  { label: "Mis cursos", href: "/dashboard#cursos" },
  { label: "Pagos", href: "/dashboard#pagos" },
];

export default function UserShell({
  children,
  profileName,
  email,
  role,
}: UserShellProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="grid min-h-screen lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border-r border-[#141414] bg-[#080808] p-6">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center">
              <Logo variant="horizontal" height={30} />
            </Link>
            <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[#00C8FF]">
              Panel usuario
            </p>
          </div>

          <div className="mb-8 rounded-[1.5rem] border border-[#191919] bg-[#0c0c0c] p-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#5d5d5d]">
              Sesión activa
            </p>
            <p className="mt-3 font-display text-2xl leading-none">
              {profileName}
            </p>
            <p className="mt-2 text-sm text-[#7d7d7d]">{email}</p>
            <div className="mt-4 inline-flex rounded-full border border-[#00C8FF]/20 bg-[#00C8FF]/6 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#00C8FF]">
              {role === "admin" ? "Admin" : "Jugador"}
            </div>
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

          <form action="/auth/logout" method="post" className="mt-10">
            <button
              type="submit"
              className="w-full rounded-xl border border-[#2a2a2a] px-4 py-3 text-left text-sm uppercase tracking-[0.22em] text-[#8a8a8a] transition-colors hover:border-white/20 hover:text-white"
            >
              Cerrar sesión
            </button>
          </form>
        </aside>

        <main className="bg-[radial-gradient(circle_at_top,rgba(0,200,255,0.08),transparent_28%),#050505] p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
