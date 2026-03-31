import SimpleContentPage from "@/components/layout/SimpleContentPage";

export default function TiendaPage() {
  return (
    <SimpleContentPage
      eyebrow="Academia"
      title="Tienda"
      description="Página pensada para la futura capa comercial de NextLevel. El objetivo es que no parezca un placeholder, sino el embrión visual de una tienda cuidada."
      status="Commerce preview"
      primaryCtaLabel="Volver al inicio"
      primaryCtaHref="/"
      secondaryCtaLabel="Contacto"
      secondaryCtaHref="/contacto"
      highlights={["Merch", "Digital", "Recursos", "Training"]}
      roadmapTitle="Qué podrá verse aquí"
      roadmapItems={[
        "Productos físicos y digitales bajo una estética coherente con la marca.",
        "Destacados, colecciones y recursos para jugadores y porteros.",
        "Integración futura con compras, acceso a productos y automatizaciones.",
      ]}
      cards={[
        {
          title: "Merchandising",
          description: "Espacio para ropa, accesorios y material de identidad visual de la academia.",
        },
        {
          title: "Productos Digitales",
          description: "Zona para guías, recursos descargables y material formativo complementario.",
        },
        {
          title: "Experiencia De Compra",
          description: "Estructura visual lista para destacar producto, precio, CTA y valor percibido.",
        },
      ]}
    />
  );
}
