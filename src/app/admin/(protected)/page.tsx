import AdminShell from "@/components/admin/AdminShell";
import { getProgramsForAdmin } from "@/lib/programs";
import { getProfilesForAdmin } from "@/lib/profiles";

const modules = [
  {
    title: "Eventos",
    description:
      "Campamentos, tecnificaciones y clínicas con fechas, carteles, popup y visibilidad pública.",
    href: "/admin/eventos",
  },
  {
    title: "Cobros",
    description:
      "Pedidos, pagos, facturación visible y preparación para Stripe seguro.",
    href: "/admin/cobros",
  },
  {
    title: "Ajustes",
    description:
      "Datos de contacto, redes, políticas y configuración editable de la academia.",
    href: "/admin/ajustes",
  },
  {
    title: "Alumnos",
    description:
      "Perfiles registrados, control de rol y estado de acceso desde el panel.",
    href: "/admin/alumnos",
  },
  {
    title: "Contactos",
    description:
      "Leads, formularios entrantes y seguimiento comercial desde el mismo panel.",
    href: "/admin/contactos",
  },
  {
    title: "Seguridad",
    description:
      "Auditoría, rate limits, errores sensibles y salud de pasarelas en un solo módulo.",
    href: "/admin/seguridad",
  },
];

export default async function AdminDashboardPage() {
  const programs = await getProgramsForAdmin();
  const profiles = await getProfilesForAdmin();
  const now = new Date();
  const upcomingCount = programs.filter((program) => new Date(program.fecha_fin) >= now).length;
  const pastCount = programs.filter((program) => new Date(program.fecha_fin) < now).length;
  const adminCount = profiles.filter(
    (profile) => profile.rol === "admin" || profile.rol === "superadmin"
  ).length;

  return (
    <AdminShell
      title="Panel Principal"
      description="Base inicial del área de administración. Desde aquí iremos conectando módulos reales a Supabase para dejar de tocar el código cuando haya cambios operativos."
    >
      <section className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Campañas activas", value: upcomingCount },
          { label: "Archivo histórico", value: pastCount },
          { label: "Entradas en sistema", value: programs.length },
          { label: "Perfiles registrados", value: profiles.length },
          { label: "Admins con acceso", value: adminCount },
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

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        {modules.map((module) => (
          <a
            key={module.title}
            href={module.href}
            className="rounded-[1.8rem] border border-[#191919] bg-[#0d0d0d]/92 p-7"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#00C8FF]">
              Módulo
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold">
              {module.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#818181]">
              {module.description}
            </p>
          </a>
        ))}
      </section>
    </AdminShell>
  );
}
