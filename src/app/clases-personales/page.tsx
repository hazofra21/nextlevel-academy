import SimpleContentPage from "@/components/layout/SimpleContentPage";

export default function ClasesPersonalesPage() {
  return (
    <SimpleContentPage
      eyebrow="Programas"
      title="Clases Personales"
      description="Página diseñada para sesiones 1 a 1 de técnica, corrección, rendimiento y acompañamiento individual. Visualmente ya queda lista para vender este servicio premium."
      status="Servicio premium"
      primaryCtaLabel="Ir a contacto"
      primaryCtaHref="/contacto"
      secondaryCtaLabel="Ver inicio"
      secondaryCtaHref="/"
      highlights={["1 a 1", "Vídeo análisis", "Plan personalizado", "Seguimiento"]}
      roadmapTitle="Qué tendrá esta página"
      roadmapItems={[
        "Presentación clara del servicio individual y su posicionamiento premium.",
        "Bloques de objetivos, metodología y modalidades de trabajo.",
        "CTA directo para solicitud, reserva o evaluación inicial.",
      ]}
      cards={[
        {
          title: "Sesiones Personalizadas",
          description: "Diseñadas para necesidades concretas de cada jugador o portero, con enfoque más preciso y directo.",
        },
        {
          title: "Corrección Técnica",
          description: "Espacio para destacar revisión de errores, ajustes concretos y hoja de trabajo individual.",
        },
        {
          title: "Seguimiento Premium",
          description: "Zona prevista para reflejar continuidad, feedback y resultados medibles de cada alumno.",
        },
      ]}
    />
  );
}
