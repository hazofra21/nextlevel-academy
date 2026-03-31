import SimpleContentPage from "@/components/layout/SimpleContentPage";

export default function ProgramasPage() {
  return (
    <SimpleContentPage
      eyebrow="Programas"
      title="Programas"
      description="Campamentos y tecnificaciones forman parte de la misma línea de desarrollo de NextLevel. Esta página unifica toda la oferta para que el header principal tenga una entrada clara y el usuario entienda el mapa completo de la academia."
      status="Oferta activa"
      primaryCtaLabel="Ver campamentos"
      primaryCtaHref="/campamentos"
      secondaryCtaLabel="Ver tecnificaciones"
      secondaryCtaHref="/tecnificaciones"
      highlights={[
        "Campamentos",
        "Tecnificaciones",
        "Cursos Online",
        "Clases Personales",
      ]}
      roadmapTitle="Cómo se organiza la oferta"
      roadmapItems={[
        "Campamentos presenciales con calendario, archivo y captación de leads.",
        "Tecnificaciones como línea principal de trabajo técnico por edad, nivel y posición.",
        "Cursos online y sesiones premium como capa digital y de seguimiento individual.",
      ]}
      cards={[
        {
          title: "Campamentos",
          description:
            "Bloque para summer camps, eventos intensivos, convivencia y experiencia de rendimiento completa.",
        },
        {
          title: "Tecnificaciones",
          description:
            "Programas técnicos continuos para jugadores y porteros, con foco en evolución medible y metodología.",
        },
        {
          title: "Cursos Online",
          description:
            "Campus digital con formación estructurada, módulos, acceso restringido y progresión del alumno.",
        },
        {
          title: "Clases Personales",
          description:
            "Servicio premium 1 a 1 para corrección técnica, videoanálisis y acompañamiento individual.",
        },
      ]}
    />
  );
}
