import LegalPage from "@/components/layout/LegalPage";
import { getAcademySettings } from "@/lib/settings";

function splitConfiguredText(value: string | null) {
  if (!value) return [];

  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default async function CookiesPage() {
  const settings = await getAcademySettings().catch(() => null);
  const configuredContent = splitConfiguredText(settings?.politica_cookies ?? null);

  return (
    <LegalPage
      eyebrow="Legal"
      title="Política De Cookies"
      description="Resumen del uso de cookies y tecnologías similares en la web de NextLevel."
      sections={
        configuredContent.length > 0
          ? [{ title: "Texto vigente", content: configuredContent }]
          : [
              {
                title: "Qué son las cookies",
                content: [
                  "Las cookies son pequeños archivos que se almacenan en el dispositivo del usuario para facilitar el funcionamiento de la web, recordar preferencias y analizar el uso del servicio.",
                ],
              },
              {
                title: "Tipos que pueden utilizarse",
                content: [
                  "La web puede utilizar cookies técnicas necesarias para el funcionamiento básico, cookies de preferencia y herramientas analíticas destinadas a medir el rendimiento y mejorar la experiencia.",
                  "Cuando proceda, el usuario podrá configurar o rechazar determinadas cookies desde su navegador o desde los mecanismos de gestión que se incorporen al sitio.",
                ],
              },
              {
                title: "Cómo desactivarlas",
                content: [
                  "El usuario puede eliminar o bloquear cookies desde la configuración de su navegador. Esto puede afectar al funcionamiento correcto de algunas partes de la plataforma.",
                ],
              },
              {
                title: "Actualizaciones",
                content: [
                  "Esta política podrá actualizarse para reflejar cambios técnicos, legales o funcionales en la web.",
                ],
              },
            ]
      }
    />
  );
}
