import { saveProgramAction } from "../publicidad/actions";
import AdminShell from "@/components/admin/AdminShell";
import { getProgramsForAdmin } from "@/lib/programs";

interface AdminEventosPageProps {
  searchParams?: Promise<{
    edit?: string;
    saved?: string;
    error?: string;
  }>;
}

function isPastEvent(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return value < today;
}

function getEventGroupLabel(programId: string, selectedProgramId?: string) {
  return programId === selectedProgramId
    ? "border-[#00C8FF]/30 bg-[#00C8FF]/10"
    : "border-[#1d1d1d] bg-white/4 hover:border-[#00C8FF]/25";
}

export default async function AdminEventosPage({
  searchParams,
}: AdminEventosPageProps) {
  const programs = await getProgramsForAdmin();
  const params = (await searchParams) ?? {};
  const selectedProgram =
    programs.find((program) => program.id === params.edit) ?? programs[0] ?? null;
  const upcomingPrograms = programs.filter(
    (program) => program.publicado && !isPastEvent(program.fecha_fin || program.fecha_inicio)
  );
  const archivedPrograms = programs.filter((program) =>
    isPastEvent(program.fecha_fin || program.fecha_inicio)
  );
  const draftPrograms = programs.filter((program) => !program.publicado);
  const featuredPrograms = programs.filter((program) => program.destacado);

  return (
    <AdminShell
      title="Eventos"
      description="Módulo operativo para gestionar campamentos, tecnificaciones y clínicas desde el panel. Aquí editas carteles, fechas, visibilidad, contacto y presencia en la web pública sin tocar código."
    >
      <section className="mb-8 grid gap-5 md:grid-cols-4">
        {[
          { label: "Total", value: String(programs.length) },
          { label: "Próximos", value: String(upcomingPrograms.length) },
          { label: "Realizados", value: String(archivedPrograms.length) },
          { label: "Destacados", value: String(featuredPrograms.length) },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[1.6rem] border border-[#191919] bg-[#0b0b0b]/92 p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
              {item.label}
            </p>
            <p className="mt-3 font-display text-4xl font-bold">{item.value}</p>
          </article>
        ))}
      </section>

      {params.saved ? (
        <div className="mb-6 rounded-2xl border border-[#00C8FF]/18 bg-[#00C8FF]/8 px-5 py-4 text-sm text-[#c7f4ff]">
          Cambios guardados correctamente.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-6 rounded-2xl border border-[#ff4d4f]/18 bg-[#ff4d4f]/8 px-5 py-4 text-sm text-[#ffb8b9]">
          No se ha podido guardar. Revisa los campos e inténtalo de nuevo.
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="space-y-4">
          <article className="rounded-[1.8rem] border border-[#191919] bg-[#0b0b0b]/92 p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
              Eventos
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              Calendario operativo
            </h2>
            <div className="mt-6 space-y-6">
              {[
                {
                  title: "Próximos",
                  items: upcomingPrograms,
                  empty: "No hay eventos próximos publicados.",
                },
                {
                  title: "Borradores",
                  items: draftPrograms,
                  empty: "No hay borradores pendientes.",
                },
                {
                  title: "Realizados",
                  items: archivedPrograms,
                  empty: "Todavía no hay histórico archivado.",
                },
              ].map((group) => (
                <div key={group.title}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                      {group.title}
                    </p>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#a8a8a8]">
                      {group.items.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {group.items.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-[#252525] bg-[#080808] px-4 py-4 text-sm text-[#6f6f6f]">
                        {group.empty}
                      </div>
                    ) : null}

                    {group.items.map((program) => (
                      <a
                        key={program.id}
                        href={`/admin/eventos?edit=${program.id}`}
                        className={`block rounded-2xl border p-4 transition-colors ${getEventGroupLabel(
                          program.id,
                          selectedProgram?.id
                        )}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-[#00C8FF]">
                              {program.tipo}
                            </p>
                            <p className="mt-2 font-display text-2xl font-bold">
                              {program.titulo}
                            </p>
                          </div>
                          {program.destacado ? (
                            <span className="rounded-full border border-[#00C8FF]/20 bg-[#00C8FF]/8 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#c7f4ff]">
                              Destacado
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 text-xs text-[#8a8a8a]">{program.slug}</p>
                        <p className="mt-2 text-xs text-[#6f6f6f]">
                          {program.fecha_inicio}
                          {program.fecha_fin ? ` · ${program.fecha_fin}` : ""}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <form action={saveProgramAction} className="space-y-6">
          <article className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
                  Editor
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold">
                  {selectedProgram ? "Editar evento" : "Nuevo campamento o tecnificación"}
                </h2>
              </div>
              <a href="/admin/eventos" className="btn-outline rounded px-5 py-3 text-sm">
                Nuevo
              </a>
            </div>
          </article>

          <input type="hidden" name="id" defaultValue={selectedProgram?.id ?? ""} />

          <section className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Tipo
              </span>
              <select
                name="tipo"
                defaultValue={selectedProgram?.tipo ?? "campamento"}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              >
                <option value="campamento">Campamento</option>
                <option value="tecnificacion">Tecnificación</option>
                <option value="clinica">Clínica</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Slug
              </span>
              <input
                name="slug"
                required
                defaultValue={selectedProgram?.slug ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Título
              </span>
              <input
                name="titulo"
                required
                defaultValue={selectedProgram?.titulo ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Subtítulo corto
              </span>
              <input
                name="descripcion_corta"
                defaultValue={selectedProgram?.descripcion_corta ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Descripción principal
              </span>
              <textarea
                name="descripcion"
                required
                rows={4}
                defaultValue={selectedProgram?.descripcion ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Imagen actual o URL
              </span>
              <input
                name="imagen_portada"
                defaultValue={selectedProgram?.imagen_portada ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Subir cartel nuevo
              </span>
              <input
                name="poster_file"
                type="file"
                accept="image/*"
                className="w-full rounded-xl border border-dashed border-[#2b2b2b] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Fecha inicio
              </span>
              <input
                name="fecha_inicio"
                type="date"
                required
                defaultValue={selectedProgram?.fecha_inicio ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Fecha fin
              </span>
              <input
                name="fecha_fin"
                type="date"
                defaultValue={selectedProgram?.fecha_fin ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Hora inicio
              </span>
              <input
                name="hora_inicio"
                type="time"
                defaultValue={selectedProgram?.hora_inicio?.slice(0, 5) ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Hora fin
              </span>
              <input
                name="hora_fin"
                type="time"
                defaultValue={selectedProgram?.hora_fin?.slice(0, 5) ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Lugar
              </span>
              <input
                name="ubicacion"
                required
                defaultValue={selectedProgram?.ubicacion ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Ciudad
              </span>
              <input
                name="ciudad"
                defaultValue={selectedProgram?.ciudad ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Precio
              </span>
              <input
                name="precio"
                type="number"
                step="0.01"
                defaultValue={selectedProgram?.precio?.toString() ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Plazas
              </span>
              <input
                name="plazas_totales"
                type="number"
                defaultValue={selectedProgram?.plazas_totales?.toString() ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Edad mínima
              </span>
              <input
                name="edad_minima"
                type="number"
                defaultValue={selectedProgram?.edad_minima?.toString() ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Edad máxima
              </span>
              <input
                name="edad_maxima"
                type="number"
                defaultValue={selectedProgram?.edad_maxima?.toString() ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Highlights
              </span>
              <textarea
                name="incluye"
                rows={4}
                defaultValue={(selectedProgram?.incluye ?? []).join("\n")}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Info detallada
              </span>
              <textarea
                name="requisitos"
                rows={5}
                defaultValue={(selectedProgram?.requisitos ?? []).join("\n")}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                URL inscripción
              </span>
              <input
                name="registration_url"
                defaultValue={selectedProgram?.horario_detalle?.registrationUrl ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Teléfono
              </span>
              <input
                name="contact_phone"
                defaultValue={selectedProgram?.horario_detalle?.contactPhone ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Email
              </span>
              <input
                name="contact_email"
                defaultValue={selectedProgram?.horario_detalle?.contactEmail ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>
          </section>

          <article className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
              Visibilidad
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                {
                  name: "publicado",
                  label: "Publicado en web",
                  defaultChecked: selectedProgram?.publicado ?? true,
                },
                {
                  name: "destacado",
                  label: "Evento principal",
                  defaultChecked: selectedProgram?.destacado ?? true,
                },
                {
                  name: "popup_enabled",
                  label: "Mostrar popup",
                  defaultChecked:
                    selectedProgram?.horario_detalle?.popupEnabled ?? true,
                },
                {
                  name: "banner_enabled",
                  label: "Mostrar banner/carrusel",
                  defaultChecked:
                    selectedProgram?.horario_detalle?.bannerEnabled ?? true,
                },
              ].map((item) => (
                <label
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-[#1f1f1f] bg-white/4 px-5 py-4"
                >
                  <span className="text-sm text-white">{item.label}</span>
                  <input
                    type="checkbox"
                    name={item.name}
                    defaultChecked={item.defaultChecked}
                    className="h-4 w-4 accent-[#00C8FF]"
                  />
                </label>
              ))}
            </div>
          </article>

          <div className="flex flex-wrap gap-4">
            <button type="submit" className="btn-primary rounded px-6 py-3 text-sm">
              Guardar evento
            </button>
            <a href="/campamentos" className="btn-outline rounded px-6 py-3 text-sm">
              Ver pública
            </a>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
