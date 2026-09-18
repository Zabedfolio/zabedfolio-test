'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { fetchProjects } from "@/utils/projectApi";
import { fadeUp, staggerContainer } from "@/utils/motionVariants";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setError("Projects API is not responding. Reload to retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const renderProjectCard = (project, index) => (
    <motion.article
      key={project.id || index}
      variants={fadeUp}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#ff5f1a]/30 hover:shadow-2xl hover:shadow-[#ff5f1a]/10"
    >
      <div>
        <div className="relative h-56 w-full overflow-hidden bg-black/5">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-black/40">
            <span>{String(index + 1).padStart(2, "0")} · {project.year || "2025"}</span>
            <span className="text-[#ff5f1a] font-semibold">{project.category}</span>
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
            href={`/projects/${project.id}`}
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
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="space-y-10"
      >
        <motion.h2 variants={fadeUp} className="section-title max-w-3xl">
          Selected work with premium execution and product clarity.
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-3xl border border-black/8 bg-white p-6 space-y-4">
                <div className="h-48 animate-pulse rounded-2xl bg-black/5" />
                <div className="space-y-2">
                  <div className="h-3 w-28 animate-pulse rounded bg-black/10" />
                  <div className="h-6 w-2/3 animate-pulse rounded bg-black/10" />
                  <div className="h-12 animate-pulse rounded bg-black/5" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-black/8 bg-white p-8 text-black/60 text-center">
            <p>{error}</p>
            <button
              onClick={loadProjects}
              className="mt-4 rounded-full border border-[#ff5f1a]/30 bg-[#ff5f1a] px-5 py-2 text-xs uppercase tracking-[0.2em] text-white font-bold"
            >
              Retry
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-3xl border border-black/8 bg-white p-8 text-black/60 text-center">
            <p>No projects found.</p>
            <button
              onClick={loadProjects}
              className="mt-4 rounded-full border border-[#ff5f1a]/30 bg-[#ff5f1a] px-5 py-2 text-xs uppercase tracking-[0.2em] text-white font-bold"
            >
              Reload
            </button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, index) => renderProjectCard(project, index))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
