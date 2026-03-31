import SimpleContentPage from "@/components/layout/SimpleContentPage";

export default function EntrenadoresPage() {
  return (
    <SimpleContentPage
      eyebrow="Academia"
      title="Entrenadores"
      description="Página de staff preparada para presentar al equipo técnico de NextLevel con una imagen sólida, profesional y orientada a confianza."
      status="Equipo técnico"
      primaryCtaLabel="Ver nosotros"
      primaryCtaHref="/nosotros"
      secondaryCtaLabel="Volver al inicio"
      secondaryCtaHref="/"
      highlights={["Head Coach", "Especialistas", "Experiencia", "Metodología"]}
      roadmapTitle="Qué mostraremos del staff"
      roadmapItems={[
        "Ficha visual de cada entrenador con foto, rol y especialidad.",
        "Trayectoria deportiva y técnica para generar credibilidad real.",
        "Diferenciación entre técnica, porteros, rendimiento y seguimiento.",
      ]}
      cards={[
        {
          title: "Head Coach",
          description: "Bloque principal para Pablo Mata y la visión deportiva que sostiene el proyecto.",
        },
        {
          title: "Especialidades",
          description: "Zona para separar entrenadores por área: técnica, físico, porteros y análisis.",
        },
        {
          title: "Confianza Y Credibilidad",
          description: "Diseñado para reforzar autoridad profesional y percepción de academia seria.",
        },
      ]}
    />
  );
}
