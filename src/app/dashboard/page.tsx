import { requireUserContext } from "@/auth/user";
import { getFeaturedBannerEvent } from "@/lib/programs";

export default async function DashboardPage() {
  const { profile, role } = await requireUserContext();
  const nextEvent = await getFeaturedBannerEvent();

  return (
    <>
      <header className="mb-8 rounded-[1.8rem] border border-[#191919] bg-[#0a0a0a]/92 p-8">
        <div className="accent-line mb-4" />
        <span className="text-xs uppercase tracking-[0.3em] text-[#00C8FF]">
          Acceso privado
        </span>
        <h1 className="mt-4 font-display text-5xl font-bold md:text-6xl">
          TU DASHBOARD
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#8a8a8a]">
          Tu sesión ya está protegida con cookies seguras y control server-side.
          Desde aquí iremos activando cursos, pagos, progreso y módulos internos
          sin exponer datos sensibles al cliente.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.6rem] border border-[#191919] bg-[#0b0b0b]/92 p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#5d5d5d]">
            Perfil
          </p>
          <p className="mt-4 font-display text-3xl">
            {profile.nombre}
          </p>
          <p className="mt-2 text-sm text-[#7d7d7d]">{profile.email}</p>
        </article>

        <article className="rounded-[1.6rem] border border-[#191919] bg-[#0b0b0b]/92 p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#5d5d5d]">
            Rol efectivo
          </p>
          <p className="mt-4 font-display text-3xl text-[#00C8FF]">
            {role === "admin" ? "ADMIN" : "USER"}
          </p>
          <p className="mt-2 text-sm text-[#7d7d7d]">
            Basado en tu perfil persistido en Supabase.
          </p>
          {role === "admin" ? (
            <a
              href="/admin"
              className="mt-4 inline-flex rounded-full border border-[#00C8FF]/20 bg-[#00C8FF]/8 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#00C8FF]"
            >
              Abrir admin
            </a>
          ) : null}
        </article>

        <article className="rounded-[1.6rem] border border-[#191919] bg-[#0b0b0b]/92 p-6">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#5d5d5d]">
            Seguridad
          </p>
          <p className="mt-4 font-display text-3xl text-[#00C8FF]">
            ACTIVA
          </p>
          <p className="mt-2 text-sm text-[#7d7d7d]">
            Sesión en servidor, validación backend y acceso restringido.
          </p>
        </article>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_380px]">
        <article
          id="perfil"
          className="rounded-[1.8rem] border border-[#191919] bg-[#0b0b0b]/92 p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#5d5d5d]">
                Estado de cuenta
              </p>
              <h2 className="mt-3 font-display text-4xl">
                PERFIL SINCRONIZADO
              </h2>
            </div>
            <span className="rounded-full border border-[#00C8FF]/20 bg-[#00C8FF]/6 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#00C8FF]">
              Base segura
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.3rem] border border-[#171717] bg-[#080808] p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#5d5d5d]">
                Nombre
              </p>
              <p className="mt-3 text-lg text-white">
                {profile.nombre} {profile.apellidos}
              </p>
            </div>

            <div className="rounded-[1.3rem] border border-[#171717] bg-[#080808] p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#5d5d5d]">
                Email
              </p>
              <p className="mt-3 text-lg text-white">{profile.email}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.3rem] border border-[#171717] bg-[#080808] p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#5d5d5d]">
              Siguiente fase
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#8a8a8a]">
              Sobre esta base ya podemos conectar compras, acceso a cursos,
              ownership checks y módulos privados sin rehacer la autenticación.
            </p>
          </div>
        </article>

        <aside className="rounded-[1.8rem] border border-[#191919] bg-[#0b0b0b]/92 p-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#5d5d5d]">
            Próximo destacado
          </p>
          <h2 className="mt-3 font-display text-3xl">
            {nextEvent?.shortTitle ?? "SIN EVENTOS"}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#8a8a8a]">
            {nextEvent?.summary ??
              "Cuando publiques el siguiente campamento o curso destacado, aparecerá aquí como referencia rápida para el usuario."}
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-[1.2rem] border border-[#171717] bg-[#080808] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#5d5d5d]">
                Fecha
              </p>
              <p className="mt-2 text-sm text-white">
                {nextEvent?.dateLabel ?? "Por definir"}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-[#171717] bg-[#080808] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#5d5d5d]">
                Ubicación
              </p>
              <p className="mt-2 text-sm text-white">
                {nextEvent?.location ?? "Pendiente"}
              </p>
            </div>
            <div className="rounded-[1.2rem] border border-[#171717] bg-[#080808] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#5d5d5d]">
                Precio
              </p>
              <p className="mt-2 text-sm text-white">
                {nextEvent?.priceLabel ?? "Consultar"}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
