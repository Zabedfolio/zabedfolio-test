'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineClock } from "react-icons/hi";
import { fetchProjects } from "@/utils/projectApi";

const DEFAULT_UPCOMING_PROJECTS = [
  {
    id: "upcoming-ai-copilot",
    title: "AI Developer Workspace & Copilot",
    category: "Full Stack AI",
    year: "2026",
    status: "upcoming",
    description: "An integrated developer workspace powered by local AI models, real-time code analysis, and automated workflow orchestrations.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23222226'/%3E%3Cpath d='M0 0l800 500M800 0L0 500' stroke='%232b2b30' stroke-width='1.5'/%3E%3Ccircle cx='400' cy='250' r='60' fill='%231a1a1c' stroke='%2338383e' stroke-width='2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23ff5f1a' letter-spacing='4'%3EUPCOMING PROJECT%3C/text%3E%3C/svg%3E",
    tags: ["Next.js 16", "Python", "WebSockets", "MongoDB"]
  },
  {
    id: "upcoming-cloud-monitor",
    title: "Serverless Metrics & Analytics Engine",
    category: "Cloud Infrastructure",
    year: "2026",
    status: "upcoming",
    description: "High-throughput cloud performance monitor delivering sub-second telemetry visualization and automated threshold alert dispatches.",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23222226'/%3E%3Cpath d='M0 0l800 500M800 0L0 500' stroke='%232b2b30' stroke-width='1.5'/%3E%3Ccircle cx='400' cy='250' r='60' fill='%231a1a1c' stroke='%2338383e' stroke-width='2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23ff5f1a' letter-spacing='4'%3EUPCOMING PROJECT%3C/text%3E%3C/svg%3E",
    tags: ["React", "PostgreSQL", "Go", "Docker"]
  }
];

export default function UpcomingProjects() {
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUpcoming = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      if (Array.isArray(data)) {
        const filtered = data.filter((p) => p.status === "upcoming");
        if (filtered.length > 0) {
          setUpcomingProjects(filtered);
        } else {
          setUpcomingProjects(DEFAULT_UPCOMING_PROJECTS);
        }
      } else {
        setUpcomingProjects(DEFAULT_UPCOMING_PROJECTS);
      }
    } catch {
      setUpcomingProjects(DEFAULT_UPCOMING_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUpcoming();
  }, [loadUpcoming]);

  return (
    <section id="upcoming" className="section-shell py-16 sm:py-24 border-t border-black/8">
      <div className="space-y-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              In Pipeline & Architecture Phase
            </span>
          </div>

          <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] flex flex-wrap items-center gap-x-3 gap-y-2">
            <span>Upcoming Projects</span>
            <span className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#1a1a1a] text-white shadow-lg shadow-black/10 transition-transform hover:scale-110 duration-300 shrink-0">
              <HiOutlineClock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
            </span>
            <span>on the horizon.</span>
          </h2>
          <p className="text-base text-black/60 max-w-2xl">
            A sneak peek into upcoming digital products, open-source initiatives, and client solutions currently being designed and engineered.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-black/5 animate-pulse border border-black/8" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingProjects.map((project, index) => (
              <motion.article
                key={project.id || project._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl"
              >
                <div>
                  {/* Common Gray Placeholder Image Container */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#222226]">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center space-y-2">
                        <span className="font-mono text-xs uppercase tracking-[0.3em] font-extrabold text-[#ff5f1a]">
                          UPCOMING PROJECT
                        </span>
                        <span className="text-white font-bold text-lg">{project.title}</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-black/60 backdrop-blur-md px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      <HiOutlineClock className="h-3.5 w-3.5 text-amber-400" />
                      <span>Upcoming</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-black/40">
                      <span>Release Target · {project.year || "2026"}</span>
                      <span className="text-amber-600 font-semibold">{project.category || "Upcoming"}</span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-[#1a1a1a] group-hover:text-amber-600 transition-colors duration-200">
                      {project.title}
                    </h3>

                    <p className="text-xs text-black/60 leading-relaxed font-normal line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>

                {(project.tags || []).length > 0 && (
                  <div className="px-6 pb-6 pt-2 border-t border-black/5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/8 bg-black/3 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
