import SimpleContentPage from "@/components/layout/SimpleContentPage";

export default function BlogPage() {
  return (
    <SimpleContentPage
      eyebrow="Academia"
      title="Blog"
      description="Página editorial diseñada para que el proyecto no dependa solo de landing y venta. Será la capa de contenido, análisis y autoridad de NextLevel."
      status="Editorial"
      primaryCtaLabel="Ir al inicio"
      primaryCtaHref="/"
      secondaryCtaLabel="Ver contacto"
      secondaryCtaHref="/contacto"
      highlights={["Análisis", "Método", "Noticias", "Rendimiento"]}
      roadmapTitle="Qué publicaremos aquí"
      roadmapItems={[
        "Artículos sobre técnica, metodología, campamentos y desarrollo del jugador.",
        "Contenido de autoridad para reforzar SEO, marca y confianza.",
        "Entradas destacadas, categorías y bloques visuales listos para crecer.",
      ]}
      cards={[
        {
          title: "Contenido De Valor",
          description: "Diseñado para publicar artículos que posicionen a NextLevel como referencia seria en hockey.",
        },
        {
          title: "Actualidad Y Método",
          description: "Espacio para novedades, filosofía de entrenamiento y análisis de rendimiento.",
        },
        {
          title: "Crecimiento De Marca",
          description: "Página preparada para apoyar visibilidad, posicionamiento orgánico y captación.",
        },
      ]}
    />
  );
}
