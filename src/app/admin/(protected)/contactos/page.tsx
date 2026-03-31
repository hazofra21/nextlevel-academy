import AdminShell from "@/components/admin/AdminShell";
import { getLeadsForAdmin } from "@/lib/leads";
import { updateLeadStatusAction } from "./actions";

interface AdminContactosPageProps {
  searchParams?: Promise<{
    status?: string;
    q?: string;
    saved?: string;
    error?: string;
  }>;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "contactado":
      return "border-[#00C8FF]/20 bg-[#00C8FF]/8 text-[#c7f4ff]";
    case "cerrado":
      return "border-emerald-500/20 bg-emerald-500/8 text-emerald-300";
    case "spam":
      return "border-[#ff4d4f]/20 bg-[#ff4d4f]/8 text-[#ffb8b9]";
    default:
      return "border-white/10 bg-white/5 text-[#d3d3d3]";
  }
}

export default async function AdminContactosPage({
  searchParams,
}: AdminContactosPageProps) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const leadsResult = await getLeadsForAdmin({
    status,
    query,
  });
  const leads = leadsResult.leads;

  const metrics = {
    total: leads.length,
    new: leads.filter((lead) => lead.estado === "nuevo").length,
    contacted: leads.filter((lead) => lead.estado === "contactado").length,
    closed: leads.filter((lead) => lead.estado === "cerrado").length,
  };

  const returnTo = `/admin/contactos?${new URLSearchParams(
    Object.entries({
      status,
      q: query,
    }).filter(([, value]) => value)
  ).toString()}`.replace(/\?$/, "");

  return (
    <AdminShell
      title="Contactos"
      description="Bandeja de leads y mensajes entrantes. Este módulo ya está preparado para centralizar peticiones de información, campañas y futuros formularios comerciales."
    >
      {params.saved ? (
        <div className="mb-6 rounded-2xl border border-[#00C8FF]/18 bg-[#00C8FF]/8 px-5 py-4 text-sm text-[#c7f4ff]">
          Lead actualizado correctamente.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-6 rounded-2xl border border-[#ff4d4f]/18 bg-[#ff4d4f]/8 px-5 py-4 text-sm text-[#ffb8b9]">
          No se ha podido aplicar ese cambio.
        </div>
      ) : null}

      {!leadsResult.available ? (
        <section className="rounded-[1.8rem] border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-8">
          <p className="font-display text-3xl font-bold">Módulo listo, tabla pendiente</p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#7e7e7e]">
            El panel ya está preparado, pero falta ejecutar la migración
            [0002_leads.sql] para que el formulario público empiece a guardar
            contactos en Supabase.
          </p>
        </section>
      ) : (
        <>
          <section className="grid gap-5 md:grid-cols-4">
            {[
              { label: "Leads visibles", value: metrics.total },
              { label: "Nuevos", value: metrics.new },
              { label: "Contactados", value: metrics.contacted },
              { label: "Cerrados", value: metrics.closed },
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
            <form method="get" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_140px]">
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Buscar por nombre, email o asunto"
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />

              <select
                name="status"
                defaultValue={status}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              >
                <option value="">Todos los estados</option>
                <option value="nuevo">Nuevos</option>
                <option value="contactado">Contactados</option>
                <option value="cerrado">Cerrados</option>
                <option value="spam">Spam</option>
              </select>

              <button type="submit" className="btn-primary rounded px-6 py-3 text-sm">
                Filtrar
              </button>
            </form>
          </section>

          <section className="mt-8 space-y-4">
            {leads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-[1.8rem] border border-[#191919] bg-[#0b0b0b]/92 p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 xl:max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${getStatusBadge(
                          lead.estado
                        )}`}
                      >
                        {lead.estado}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#d3d3d3]">
                        {lead.origen}
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-3xl font-bold leading-none">
                      {lead.nombre}
                    </h2>
                    <p className="mt-3 text-sm text-[#8a8a8a]">
                      {lead.email}
                      {lead.telefono ? ` · ${lead.telefono}` : ""}
                    </p>
                    {lead.asunto ? (
                      <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-[#00C8FF]">
                        {lead.asunto}
                      </p>
                    ) : null}
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#cfcfcf]">
                      {lead.mensaje}
                    </p>
                  </div>

                  <form
                    action={updateLeadStatusAction}
                    className="rounded-2xl border border-[#1f1f1f] bg-white/4 p-4 xl:min-w-[320px]"
                  >
                    <input type="hidden" name="leadId" value={lead.id} />
                    <input type="hidden" name="returnTo" value={returnTo} />
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                      Estado
                    </p>
                    <div className="mt-3 flex gap-3">
                      <select
                        name="estado"
                        defaultValue={lead.estado}
                        className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
                      >
                        <option value="nuevo">Nuevo</option>
                        <option value="contactado">Contactado</option>
                        <option value="cerrado">Cerrado</option>
                        <option value="spam">Spam</option>
                      </select>
                      <button type="submit" className="btn-outline rounded px-4 py-3 text-sm">
                        Guardar
                      </button>
                    </div>
                  </form>
                </div>
              </article>
            ))}

            {leads.length === 0 ? (
              <div className="rounded-[1.8rem] border border-dashed border-[#2a2a2a] bg-[#0c0c0c]/86 p-8">
                <p className="font-display text-3xl font-bold">Bandeja vacía</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#7e7e7e]">
                  Todavía no hay contactos que coincidan con ese filtro.
                </p>
              </div>
            ) : null}
          </section>
        </>
      )}
    </AdminShell>
  );
}
