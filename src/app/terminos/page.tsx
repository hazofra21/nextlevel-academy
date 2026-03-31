import LegalPage from "@/components/layout/LegalPage";
import { getAcademySettings } from "@/lib/settings";

function splitConfiguredText(value: string | null) {
  if (!value) return [];

  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function TerminosPage() {
  const settings = await getAcademySettings().catch(() => null);
  const configuredContent = splitConfiguredText(
    settings?.terminos_condiciones ?? null
  );

  return (
    <LegalPage
      eyebrow="Legal"
      title="Términos De Uso"
      description="Condiciones generales de acceso y uso de la web de NextLevel y sus contenidos."
      sections={
        configuredContent.length > 0
          ? [{ title: "Texto vigente", content: configuredContent }]
          : [
              {
                title: "Uso del sitio",
                content: [
                  "El acceso a esta web implica la aceptación de unas normas básicas de uso responsable, respeto a la plataforma y utilización lícita de sus contenidos y servicios.",
                  "El usuario se compromete a no emplear la web para actividades contrarias a la ley, al orden público o a los derechos de terceros.",
                ],
              },
              {
                title: "Propiedad intelectual",
                content: [
                  "La identidad visual, textos, diseños, recursos gráficos, estructura y contenidos de la web pertenecen a NextLevel y H.Azofra o se usan con autorización.",
                  "No está permitida su reproducción total o parcial sin autorización expresa.",
                ],
              },
              {
                title: "Servicios y disponibilidad",
                content: [
                  "La plataforma podrá actualizar, modificar o retirar contenidos, funcionalidades o servicios cuando resulte necesario para la evolución del proyecto.",
                  "No se garantiza disponibilidad permanente e ininterrumpida del sitio, aunque se trabajará para mantenerlo operativo con el mayor nivel posible de continuidad.",
                ],
              },
              {
                title: "Responsabilidad",
                content: [
                  "NextLevel y H.Azofra no serán responsables por daños derivados de un uso indebido del sitio por parte del usuario o por incidencias ajenas a su control razonable.",
                  "El usuario es responsable de la veracidad de los datos que facilite y del uso que haga de su acceso a la plataforma.",
                ],
              },
            ]
      }
    />
  );
}
