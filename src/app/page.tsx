import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import ValorSection from "@/components/sections/ValorSection";
import DiferencialSection from "@/components/sections/DiferencialSection";
import ProgramasSection from "@/components/sections/ProgramasSection";
import TestimoniosSection from "@/components/sections/TestimoniosSection";
import CTAFinal from "@/components/sections/CTAFinal";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ValorSection />
        <DiferencialSection />
        <ProgramasSection />
        <TestimoniosSection />
        <CTAFinal />
      </main>
      <Footer />
    </>
  );
}
