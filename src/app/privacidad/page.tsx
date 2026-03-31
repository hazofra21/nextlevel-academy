import LegalPage from "@/components/layout/LegalPage";
import { getAcademySettings } from "@/lib/settings";

function splitConfiguredText(value: string | null) {
  if (!value) return [];

  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function PrivacidadPage() {
  const settings = await getAcademySettings().catch(() => null);
  const configuredContent = splitConfiguredText(settings?.politica_privacidad ?? null);

  return (
    <LegalPage
      eyebrow="Legal"
      title="Política De Privacidad"
      description="Información básica sobre cómo NextLevel y H.Azofra tratan los datos personales recogidos a través de esta web."
      sections={
        configuredContent.length > 0
          ? [{ title: "Texto vigente", content: configuredContent }]
          : [
              {
                title: "Responsable del tratamiento",
                content: [
                  "El responsable de esta web es NextLevel junto a H.Azofra como titular técnico y gestor del proyecto digital.",
                  "Para cualquier cuestión relacionada con privacidad, acceso, rectificación o supresión de datos, el usuario podrá ponerse en contacto a través de los canales publicados en la sección de contacto.",
                ],
              },
              {
                title: "Datos que recopilamos",
                content: [
                  "Podemos recopilar datos identificativos y de contacto cuando el usuario complete formularios, solicite información, se registre o interactúe con servicios de la plataforma.",
                  "También pueden recogerse datos técnicos básicos de navegación para seguridad, rendimiento y análisis del servicio.",
                ],
              },
              {
                title: "Finalidad del uso",
                content: [
                  "Los datos se utilizan para gestionar solicitudes, acceso a servicios, comunicaciones relacionadas con la actividad de la academia y mejora de la experiencia digital.",
                  "No se utilizarán para finalidades incompatibles con la relación mantenida con el usuario.",
                ],
              },
              {
                title: "Conservación y derechos",
                content: [
                  "Los datos se conservarán durante el tiempo necesario para la prestación del servicio o mientras exista una obligación legal aplicable.",
                  "El usuario podrá ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad mediante solicitud por los canales de contacto disponibles.",
                ],
              },
            ]
      }
    />
  );
}
