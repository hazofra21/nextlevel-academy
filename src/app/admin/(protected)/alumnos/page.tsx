import AdminShell from "@/components/admin/AdminShell";
import { getProfilesForAdmin } from "@/lib/profiles";
import {
  updateProfileRoleAction,
  updateProfileStatusAction,
} from "./actions";

interface AdminAlumnosPageProps {
  searchParams?: Promise<{
    role?: string;
    status?: string;
    q?: string;
    saved?: string;
    error?: string;
  }>;
}

function getRoleBadge(role: string) {
  if (role === "admin" || role === "superadmin") {
    return {
      label: "Admin",
      className:
        "border-[#00C8FF]/25 bg-[#00C8FF]/8 text-[#c7f4ff]",
    };
  }

  return {
    label: "Alumno",
    className: "border-white/10 bg-white/5 text-[#d3d3d3]",
  };
}

export default async function AdminAlumnosPage({
  searchParams,
}: AdminAlumnosPageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? "";
  const role = params.role?.trim() ?? "";
  const status = params.status?.trim() ?? "";

  const profiles = await getProfilesForAdmin({
    role,
    status,
    query,
  });

  const metrics = {
    total: profiles.length,
    admins: profiles.filter(
      (profile) => profile.rol === "admin" || profile.rol === "superadmin"
    ).length,
    active: profiles.filter((profile) => profile.activo).length,
  };

  const returnTo = `/admin/alumnos?${new URLSearchParams(
    Object.entries({
      role,
      status,
      q: query,
    }).filter(([, value]) => value)
  ).toString()}`.replace(/\?$/, "");

  return (
    <AdminShell
      title="Alumnos"
      description="Listado real de usuarios registrados en la plataforma. Desde aquí puedes revisar perfiles, filtrar por estado y ajustar rol o activación sin tocar la base de datos a mano."
    >
      {params.saved ? (
        <div className="mb-6 rounded-2xl border border-[#00C8FF]/18 bg-[#00C8FF]/8 px-5 py-4 text-sm text-[#c7f4ff]">
          Perfil actualizado correctamente.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-6 rounded-2xl border border-[#ff4d4f]/18 bg-[#ff4d4f]/8 px-5 py-4 text-sm text-[#ffb8b9]">
          {params.error === "last-admin"
            ? "No puedes desactivar o degradar al último administrador activo."
            : "No se ha podido aplicar ese cambio."}
        </div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Perfiles visibles", value: metrics.total },
          { label: "Admins en este filtro", value: metrics.admins },
          { label: "Activos en este filtro", value: metrics.active },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.6rem] border border-[#191919] bg-[#0b0b0b]/92 p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
              {item.label}
            </p>
            <p className="mt-3 font-display text-5xl font-bold">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
        <form method="get" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_180px_140px]">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre o email"
            className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
          />

          <select
            name="role"
            defaultValue={role}
            className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="">Todos los roles</option>
            <option value="alumno">Solo alumnos</option>
            <option value="admin">Solo admins</option>
          </select>

          <select
            name="status"
            defaultValue={status}
            className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>

          <button type="submit" className="btn-primary rounded px-6 py-3 text-sm">
            Filtrar
          </button>
        </form>
      </section>

      <section className="mt-8 space-y-4">
        {profiles.map((profile) => {
          const badge = getRoleBadge(profile.rol);

          return (
            <article
              key={profile.id}
              className="rounded-[1.8rem] border border-[#191919] bg-[#0b0b0b]/92 p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${
                        profile.activo
                          ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-300"
                          : "border-[#ff4d4f]/20 bg-[#ff4d4f]/8 text-[#ffb8b9]"
                      }`}
                    >
                      {profile.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-3xl font-bold leading-none">
                    {profile.nombre} {profile.apellidos}
                  </h2>
                  <p className="mt-3 text-sm text-[#8a8a8a]">{profile.email}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:min-w-[420px]">
                  <form action={updateProfileRoleAction} className="rounded-2xl border border-[#1f1f1f] bg-white/4 p-4">
                    <input type="hidden" name="profileId" value={profile.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                      Rol
                    </p>
                    <div className="mt-3 flex gap-3">
                      <select
                        name="role"
                        defaultValue={
                          profile.rol === "admin" || profile.rol === "superadmin"
                            ? "admin"
                            : "alumno"
                        }
                        className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="alumno">Alumno</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button type="submit" className="btn-outline rounded px-4 py-3 text-sm">
                        Guardar
                      </button>
                    </div>
                  </form>

                  <form action={updateProfileStatusAction} className="rounded-2xl border border-[#1f1f1f] bg-white/4 p-4">
                    <input type="hidden" name="profileId" value={profile.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                      Estado
                    </p>
                    <div className="mt-3 flex gap-3">
                      <select
                        name="active"
                        defaultValue={profile.activo ? "true" : "false"}
                        className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                      <button type="submit" className="btn-outline rounded px-4 py-3 text-sm">
                        Guardar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </article>
          );
        })}

        {profiles.length === 0 ? (
          <div className="rounded-[1.8rem] border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-8">
            <p className="font-display text-3xl font-bold">Sin resultados</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#7e7e7e]">
              No hay perfiles que coincidan con ese filtro todavía.
            </p>
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
