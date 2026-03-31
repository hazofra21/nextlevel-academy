import SimpleContentPage from "@/components/layout/SimpleContentPage";

export default function CursosOnlinePage() {
  return (
    <SimpleContentPage
      eyebrow="Programas"
      title="Cursos Online"
      description="Landing preparada para el campus digital de NextLevel. Aquí se colocará la oferta de cursos, rutas de aprendizaje y acceso al entorno formativo."
      status="Campus digital"
      primaryCtaLabel="Ver inicio"
      primaryCtaHref="/"
      secondaryCtaLabel="Login"
      secondaryCtaHref="/login"
      highlights={["Lecciones", "Módulos", "Dashboard", "Progreso"]}
      roadmapTitle="Qué llevará el campus"
      roadmapItems={[
        "Cursos ordenados por temática, nivel y objetivo de rendimiento.",
        "Tarjetas de acceso con duración, instructor y nivel recomendado.",
        "Conexión futura con progreso, métricas y seguimiento del alumno.",
      ]}
      cards={[
        {
          title: "Biblioteca De Cursos",
          description: "Espacio visual para mostrar cursos destacados, novedades y rutas recomendadas.",
        },
        {
          title: "Aprendizaje Guiado",
          description: "Bloque para ordenar contenidos por módulos, sesiones y objetivos concretos.",
        },
        {
          title: "Experiencia De Usuario",
          description: "Reservado para login, progreso, acceso inmediato y contenido premium del campus.",
        },
      ]}
    />
  );
}
