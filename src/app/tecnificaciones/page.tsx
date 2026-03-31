import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProgramsCollectionPage from "@/components/programs/ProgramsCollectionPage";
import { getTecnificacionPageEvents } from "@/lib/programs";
import { getPaymentProviderStatus } from "@/payments/providers";

export default async function TecnificacionesPage() {
  const { upcoming, past } = await getTecnificacionPageEvents();
  const stripeEnabled = getPaymentProviderStatus("stripe").enabled;

  return (
    <>
      <Navbar />
      <ProgramsCollectionPage
        eyebrow="Tecnificaciones"
        title="Próximas y realizadas"
        description="Programas técnicos de NextLevel para jugadores y porteros. Misma estructura operativa que campamentos, pero enfocada en desarrollo, vídeo análisis y evolución por posición."
        upcomingTitle="Más tecnificaciones en calendario"
        archiveTitle="Tecnificaciones realizadas"
        upcoming={upcoming}
        past={past}
        stripeEnabled={stripeEnabled}
      />
      <Footer />
    </>
  );
}
