import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SobreNosotros from "@/components/sections/SobreNosotros";

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#050505]">
        <SobreNosotros />
      </main>
      <Footer />
    </>
  );
}
