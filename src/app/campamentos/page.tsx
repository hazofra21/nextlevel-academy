import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ProgramsCollectionPage from "@/components/programs/ProgramsCollectionPage";
import { getCampPageEvents } from "@/lib/programs";
import { getPaymentProviderStatus } from "@/payments/providers";

export default async function CampamentosPage() {
  const { upcoming, past } = await getCampPageEvents();
  const stripeEnabled = getPaymentProviderStatus("stripe").enabled;

  return (
    <>
      <Navbar />
      <ProgramsCollectionPage
        eyebrow="Campamentos"
        title="Próximos y realizados"
        description="Campamentos de NextLevel con ficha completa, acceso a información, archivo de bagaje y reserva conectada al checkout cuando el evento esté preparado para pago."
        upcomingTitle="Más campamentos en calendario"
        archiveTitle="Campamentos realizados"
        upcoming={upcoming}
        past={past}
        stripeEnabled={stripeEnabled}
      />
      <Footer />
    </>
  );
}
