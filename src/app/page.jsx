import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#ff5f1a]/20">
      <Navbar />
      <main className="relative z-10">
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}