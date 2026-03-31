import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import UpcomingEventsCarousel from "@/components/sections/UpcomingEventsCarousel";
import UpcomingEventPopup from "@/components/sections/UpcomingEventPopup";
import ValorSection from "@/components/sections/ValorSection";
import DiferencialSection from "@/components/sections/DiferencialSection";
import SobreNosotros from "@/components/sections/SobreNosotros";
import ProgramasSection from "@/components/sections/ProgramasSection";
import TestimoniosSection from "@/components/sections/TestimoniosSection";
import CTAFinal from "@/components/sections/CTAFinal";
import { getFeaturedPopupEvent, getUpcomingEvents } from "@/lib/programs";
import { getPaymentProviderStatus } from "@/payments/providers";

export default async function HomePage() {
  const popupEvent = await getFeaturedPopupEvent();
  const upcomingEvents = await getUpcomingEvents();
  const stripeEnabled = getPaymentProviderStatus("stripe").enabled;

  return (
    <>
      <Navbar />
      <UpcomingEventPopup event={popupEvent} />
      <main>
        <Hero />
        <UpcomingEventsCarousel events={upcomingEvents} stripeEnabled={stripeEnabled} />
        <ValorSection />
        <DiferencialSection />
        <SobreNosotros />
        <ProgramasSection />
        <TestimoniosSection />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
