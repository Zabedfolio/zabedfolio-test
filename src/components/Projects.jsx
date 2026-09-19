'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineFolder, HiOutlineSparkles } from "react-icons/hi";
import { fetchProjects } from "@/utils/projectApi";
import { fallbackProjects } from "@/data/fallbackProjects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      if (Array.isArray(data) && data.length > 0) {
        const liveProjects = data.filter((p) => p.status !== "upcoming");
        setProjects(liveProjects.length > 0 ? liveProjects : fallbackProjects);
      } else {
        setProjects(fallbackProjects);
      }
    } catch {
      setProjects(fallbackProjects);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const renderProjectCard = (project, index) => (
    <motion.article
      key={project.id || project._id || index}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#ff5f1a]/30 hover:shadow-2xl hover:shadow-[#ff5f1a]/10"
    >
      <div>
        <div className="relative h-56 w-full overflow-hidden bg-black/5">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title || "Project"}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#1a1a1a] to-black/80 flex items-center justify-center p-6 text-white font-bold text-lg">
              {project.title}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-black/40">
            <span>{String(index + 1).padStart(2, "0")} · {project.year || "2026"}</span>
            <div className="flex items-center gap-2">
              {project.status === "running" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] text-emerald-700 font-bold tracking-normal normal-case">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Running
                </span>
              )}
              <span className="text-[#ff5f1a] font-semibold">{project.category || "Full Stack"}</span>
            </div>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-[#1a1a1a] group-hover:text-[#ff5f1a] transition-colors duration-200">
            {project.title}
          </h3>

          <p className="text-xs text-black/60 leading-relaxed font-normal line-clamp-3">
            {project.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        <div className="pt-4 border-t border-black/5 flex items-center justify-between">
          <Link
            href={`/projects/${project.id || project._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff5f1a] hover:underline underline-offset-4"
          >
            View Case Study <span aria-hidden>→</span>
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-black/40 hover:text-black font-semibold uppercase tracking-wider transition-colors"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );

  return (
    <div id="projects" className="section-shell py-16 sm:py-24">
      <div className="space-y-10">
        <h2 className="text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1a1a1a] max-w-4xl flex flex-wrap items-center gap-x-3 gap-y-2">
          <span>Selected work</span>
          <span className="inline-flex items-center justify-center h-10 w-10 sm:h-13 sm:w-13 rounded-2xl bg-[#1a1a1a] text-white shadow-lg shadow-black/10 transition-transform hover:scale-110 duration-300 shrink-0">
            <HiOutlineFolder className="h-5 w-5 sm:h-6 sm:w-6 text-[#ff5f1a]" />
          </span>
          <span>with premium execution</span>
          <span className="inline-flex items-center justify-center h-10 w-10 sm:h-13 sm:w-13 rounded-2xl bg-[#1a1a1a] text-white shadow-lg shadow-black/10 transition-transform hover:scale-110 duration-300 shrink-0">
            <HiOutlineSparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
          </span>
          <span>and product clarity.</span>
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-3xl border border-black/8 bg-white p-6 space-y-4 shadow-sm animate-pulse">
                <div className="h-48 rounded-2xl bg-black/5" />
                <div className="space-y-2">
                  <div className="h-3 w-28 rounded bg-black/10" />
                  <div className="h-6 w-2/3 rounded bg-black/10" />
                  <div className="h-12 rounded bg-black/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => renderProjectCard(project, index))}
          </div>
        )}
      </div>
    </div>
  );
}
