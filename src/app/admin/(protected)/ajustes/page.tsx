import AdminShell from "@/components/admin/AdminShell";
import { getAcademySettings } from "@/lib/settings";
import { saveAcademySettingsAction } from "./actions";

interface AdminAjustesPageProps {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
  }>;
}

export default async function AdminAjustesPage({
  searchParams,
}: AdminAjustesPageProps) {
  const params = (await searchParams) ?? {};
  const settings = await getAcademySettings();
  const social = settings.redes_sociales ?? {};

  return (
    <AdminShell
      title="Ajustes"
      description="Centro de control de la identidad de la academia. Aquí quedan el nombre oficial, los datos de contacto y los textos legales que alimentan footer, páginas legales y futuras integraciones."
    >
      {params.saved ? (
        <div className="mb-6 rounded-2xl border border-[#00C8FF]/18 bg-[#00C8FF]/8 px-5 py-4 text-sm text-[#c7f4ff]">
          Ajustes guardados correctamente.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-6 rounded-2xl border border-[#ff4d4f]/18 bg-[#ff4d4f]/8 px-5 py-4 text-sm text-[#ffb8b9]">
          No se ha podido guardar la configuración.
        </div>
      ) : null}

      <form action={saveAcademySettingsAction} className="space-y-6">
        <section className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
              Nombre academia
            </span>
            <input
              name="nombre_academia"
              required
              defaultValue={settings.nombre_academia}
              className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
              Email contacto
            </span>
            <input
              name="email_contacto"
              type="email"
              defaultValue={settings.email_contacto ?? ""}
              className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
              Teléfono
            </span>
            <input
              name="telefono"
              defaultValue={settings.telefono ?? ""}
              className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
              Email notificaciones
            </span>
            <input
              name="email_notificaciones"
              type="email"
              defaultValue={settings.email_notificaciones ?? ""}
              className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
              Dirección
            </span>
            <input
              name="direccion"
              defaultValue={settings.direccion ?? ""}
              className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
            />
          </label>
        </section>

        <section className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
            Canales públicos
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold">Redes y contacto</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Instagram
              </span>
              <input
                name="instagram"
                defaultValue={social.instagram ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                Telegram
              </span>
              <input
                name="telegram"
                defaultValue={social.telegram ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
                YouTube
              </span>
              <input
                name="youtube"
                defaultValue={social.youtube ?? ""}
                className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
              />
            </label>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <label className="block rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
            <span className="block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
              Política de privacidad
            </span>
            <textarea
              name="politica_privacidad"
              rows={10}
              defaultValue={settings.politica_privacidad ?? ""}
              className="mt-4 w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
            />
          </label>

          <label className="block rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
            <span className="block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
              Términos y condiciones
            </span>
            <textarea
              name="terminos_condiciones"
              rows={10}
              defaultValue={settings.terminos_condiciones ?? ""}
              className="mt-4 w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
            />
          </label>

          <label className="block rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
            <span className="block text-[10px] uppercase tracking-[0.28em] text-[#7d7d7d]">
              Política de cookies
            </span>
            <textarea
              name="politica_cookies"
              rows={10}
              defaultValue={settings.politica_cookies ?? ""}
              className="mt-4 w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
            />
          </label>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary rounded px-8 py-4 text-sm">
            Guardar ajustes
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
