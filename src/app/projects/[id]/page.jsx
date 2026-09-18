import Navbar from "@/components/Navbar";
import ProjectDetails from "@/components/ProjectDetails";

export default async function ProjectPage({ params }) {
  const { id } = await params;
  return (
    <div className="relative min-h-screen bg-[#eeeeee] text-[#1a1a1a] selection:bg-[#ff5f1a]/20">
      <Navbar />
      <main className="relative z-10 pt-6 md:pl-16">
        <ProjectDetails projectId={id} />
      </main>
    </div>
  );
}