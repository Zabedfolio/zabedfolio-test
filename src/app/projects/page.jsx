import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Projects — Zabed Mahmud",
  description: "Explore web development projects, case studies, and digital solutions created by Zabed Mahmud.",
};

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#ff5f1a]/20">
      <Navbar />
      <main className="relative z-10 pt-6">
        <Projects />
        <CaseStudiesSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
