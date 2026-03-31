import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAcademySettings } from "@/lib/settings";
import { submitContactLeadAction } from "./actions";

interface ContactoPageProps {
  searchParams?: Promise<{
    sent?: string;
    error?: string;
    limited?: string;
    schema?: string;
  }>;
}

export default async function ContactoPage({
  searchParams,
}: ContactoPageProps) {
  const params = (await searchParams) ?? {};
  const startedAt = Date.now();
  const settings = await getAcademySettings().catch(() => null);
  const social = settings?.redes_sociales ?? {};
  const channels = [
    {
      id: "instagram",
      name: "Instagram",
      href: social.instagram || "https://www.instagram.com/nextlevelsportnet",
      label: social.instagram || "@nextlevelsportnet",
    },
    {
      id: "telegram",
      name: "Telegram",
      href: social.telegram || "",
      label: social.telegram || "Pendiente de configurar",
    },
    {
      id: "youtube",
      name: "YouTube",
      href: social.youtube || "",
      label: social.youtube || "Pendiente de configurar",
    },
    {
      id: "email",
      name: "Email",
      href: settings?.email_contacto ? `mailto:${settings.email_contacto}` : "",
      label: settings?.email_contacto || "Pendiente de configurar",
    },
    {
      id: "telefono",
      name: "Teléfono",
      href: settings?.telefono ? `tel:${settings.telefono}` : "",
      label: settings?.telefono || "Pendiente de configurar",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] pt-28">
        <section className="bg-[#050505]/78 pb-24 backdrop-blur-[2px]">
          <div className="mx-auto max-w-6xl px-6">
            {params.sent ? (
              <div className="mb-6 rounded-2xl border border-[#00C8FF]/18 bg-[#00C8FF]/8 px-5 py-4 text-sm text-[#c7f4ff]">
                Mensaje enviado correctamente. Te responderemos por el canal que
                has dejado.
              </div>
            ) : null}

            {params.limited ? (
              <div className="mb-6 rounded-2xl border border-[#ffb347]/18 bg-[#ffb347]/8 px-5 py-4 text-sm text-[#ffd8a1]">
                Has enviado demasiadas solicitudes seguidas. Espera un poco y vuelve
                a intentarlo.
              </div>
            ) : null}

            {params.schema ? (
              <div className="mb-6 rounded-2xl border border-[#ffb347]/18 bg-[#ffb347]/8 px-5 py-4 text-sm text-[#ffd8a1]">
                El formulario está maquetado pero la tabla de leads aún no está creada
                en Supabase.
              </div>
            ) : null}

            {params.error ? (
              <div className="mb-6 rounded-2xl border border-[#ff4d4f]/18 bg-[#ff4d4f]/8 px-5 py-4 text-sm text-[#ffb8b9]">
                No se ha podido enviar el mensaje. Revisa los campos e inténtalo de
                nuevo.
              </div>
            ) : null}

            <div className="mb-14">
              <div className="accent-line mb-4" />
              <span className="mb-3 block text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                Contacto
              </span>
              <h1 className="font-display text-5xl font-bold md:text-6xl">Canales Oficiales</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#7c7c7c]">
                Este bloque centraliza los canales públicos y de soporte de la
                academia. Lo que se configure desde el panel de ajustes aparecerá aquí
                automáticamente.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {channels.map((channel) => (
                channel.href ? (
                  <a
                    key={channel.id}
                    id={channel.id}
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d]/92 p-7 transition-colors hover:border-[#00C8FF]/40"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                      {channel.name}
                    </p>
                    <p className="mt-3 font-display text-3xl font-bold break-all">
                      {channel.label}
                    </p>
                  </a>
                ) : (
                  <div
                    key={channel.id}
                    id={channel.id}
                    className="rounded-2xl border border-dashed border-[#2b2b2b] bg-[#0d0d0d]/92 p-7"
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                      {channel.name}
                    </p>
                    <p className="mt-3 font-display text-3xl font-bold text-[#5f5f5f]">
                      {channel.label}
                    </p>
                  </div>
                )
              ))}
            </div>

            <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
              <section className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
                <div className="accent-line mb-4" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                  Formulario
                </span>
                <h2 className="mt-4 font-display text-4xl font-bold">
                  Pedir información
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#7c7c7c]">
                  Usa este formulario para cursos, campamentos, clases personales o
                  colaboraciones. El mensaje entra directo a la bandeja interna del
                  panel.
                </p>

                <form action={submitContactLeadAction} className="mt-8 grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="started_at" value={String(startedAt)} />
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                  />
                  <input
                    name="nombre"
                    required
                    placeholder="Nombre y apellidos"
                    className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
                  />
                  <input
                    name="telefono"
                    placeholder="Teléfono"
                    className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
                  />
                  <input
                    name="asunto"
                    placeholder="Asunto"
                    className="w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
                  />
                  <textarea
                    name="mensaje"
                    required
                    rows={7}
                    placeholder="Cuéntanos qué necesitas"
                    className="md:col-span-2 w-full rounded-xl border border-[#242424] bg-[#080808] px-4 py-3 text-sm text-white outline-none"
                  />
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="btn-primary rounded px-8 py-4 text-sm">
                      Enviar mensaje
                    </button>
                  </div>
                </form>
              </section>

              <aside className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7">
                <div className="accent-line mb-4" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#00C8FF]">
                  Respuesta
                </span>
                <h3 className="mt-4 font-display text-3xl font-bold">
                  Qué llega al panel
                </h3>
                <div className="mt-6 space-y-4">
                  {[
                    "Nombre, email y teléfono del lead",
                    "Asunto y mensaje completo",
                    "Origen del contacto para segmentar campañas",
                    "Estado comercial: nuevo, contactado, cerrado o spam",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-[#1d1d1d] bg-white/4 p-4 text-sm text-[#cfcfcf]">
                      {item}
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
