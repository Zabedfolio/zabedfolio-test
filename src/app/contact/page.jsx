import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";

export const metadata = {
  title: "Contact — Zabed Mahmud",
  description: "Get in touch with Zabed Mahmud for freelance projects, full-stack engineering roles, or creative collaborations.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#ff5f1a]/20">
      <Navbar />
      <main className="relative z-10 pt-6 md:pl-16">
        <Contact />
      </main>
    </div>
  );
}
