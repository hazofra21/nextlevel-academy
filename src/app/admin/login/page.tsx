import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

interface AdminLoginPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect("/admin");
  }

  const params = (await searchParams) ?? {};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-[#1a1a1a] bg-[#0c0c0c]/96 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.5)]">
        <div className="accent-line mb-4" />
        <span className="text-xs uppercase tracking-[0.3em] text-[#00C8FF]">
          Acceso interno
        </span>
        <h1 className="mt-4 font-display text-5xl font-bold">Admin</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#8a8a8a]">
          El panel interno usa acceso real con Google y rol admin en Supabase. La vía temporal ya no forma parte del flujo normal.
        </p>

        {params.error === "disabled" ? (
          <div className="mt-6 rounded-2xl border border-[#00C8FF]/20 bg-[#00C8FF]/8 px-4 py-3 text-sm text-[#bfefff]">
            Entra con tu cuenta Google administradora para continuar.
          </div>
        ) : null}

        {params.error && params.error !== "disabled" ? (
          <div className="mt-6 rounded-2xl border border-[#ff4d4f]/20 bg-[#ff4d4f]/8 px-4 py-3 text-sm text-[#ffb5b6]">
            No se ha podido iniciar sesión en el panel. Vuelve a entrar con Google.
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          <a href="/login?next=%2Fadmin" className="btn-primary block w-full rounded px-6 py-3 text-center text-sm">
            Entrar con Google
          </a>

          <div className="rounded-2xl border border-[#1a1a1a] bg-[#080808] p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
              Modelo de acceso
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#9a9a9a]">
              Solo las cuentas con rol <code>admin</code> o <code>superadmin</code> en Supabase pueden entrar al panel. El login temporal queda retirado de la superficie pública.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
