import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ParallaxCanvas from "@/components/background/ParallaxCanvas";
import ScrollBlurProvider from "@/components/scroll/ScrollBlurProvider";
import ScrollBlurSection from "@/components/scroll/ScrollBlurSection";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#ff5f1a]/20">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <CaseStudiesSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}