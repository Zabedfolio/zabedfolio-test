'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { fetchProjectById } from "@/utils/projectApi";
import { fallbackProjects } from "@/data/fallbackProjects";

export default function ProjectDetails({ projectId }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProject = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setProject(null);
      const data = await fetchProjectById(projectId);
      if (data && !data.error) {
        setProject(data);
      } else {
        const foundFallback = fallbackProjects.find(
          (p) => p.id === projectId || p._id === projectId
        );
        if (foundFallback) {
          setProject(foundFallback);
        } else {
          setError("Project details not found.");
        }
      }
    } catch {
      const foundFallback = fallbackProjects.find(
        (p) => p.id === projectId || p._id === projectId
      );
      if (foundFallback) {
        setProject(foundFallback);
      } else {
        setError("Unable to load project details.");
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  return (
    <div className="section-shell py-12 sm:py-20">
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-semibold text-black/80 shadow-sm transition hover:border-[#ff5f1a] hover:text-[#ff5f1a] active:scale-95"
      >
        ← Back to projects
      </Link>

      {loading ? (
        <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm">
          <div className="h-80 sm:h-96 animate-pulse bg-black/5" />
          <div className="space-y-8 p-6 sm:p-10">
            <div className="h-4 w-36 animate-pulse rounded bg-black/10" />
            <div className="h-12 w-2/3 animate-pulse rounded bg-black/10" />
            <div className="h-24 animate-pulse rounded bg-black/5" />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-black/8 bg-white p-10 text-black/60 shadow-sm text-center space-y-4">
          <p className="text-base font-semibold">{error}</p>
          <button
            onClick={loadProject}
            className="rounded-full bg-[#ff5f1a] hover:bg-[#e04d0d] px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-white font-bold transition shadow-sm"
          >
            Retry
          </button>
        </div>
      ) : project ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm"
        >
          {project.image ? (
            <div className="relative h-80 sm:h-[420px] w-full bg-black/5 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title ?? "Project preview"}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent opacity-90" />
            </div>
          ) : null}

          <div className="space-y-10 p-6 sm:p-10 sm:-mt-16 relative z-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#ff5f1a] px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                  {project.category || "Case Study"}
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-black/40">
                  {project.year || "2026"}
                </span>
              </div>

              <h1 className="text-[clamp(2.2rem,5vw,4.2rem)] font-extrabold leading-[1.05] tracking-tight text-[#1a1a1a]">
                {project.title}
              </h1>

              <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-black/65 font-normal">
                {project.description}
              </p>
            </div>

            {(project?.tags ?? []).length > 0 && (
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black/40">
                  Technologies & Architecture
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(project.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/8 bg-black/3 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-black/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(project.challenge || project.improvements) && (
              <div className="grid gap-6 lg:grid-cols-2">
                {project.challenge && (
                  <div className="rounded-2xl border border-black/8 bg-black/2 p-6 space-y-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff5f1a]">
                      Challenge & Objective
                    </h3>
                    <p className="text-sm leading-relaxed text-black/70 font-normal">
                      {project.challenge}
                    </p>
                  </div>
                )}
                {project.improvements && (
                  <div className="rounded-2xl border border-black/8 bg-black/2 p-6 space-y-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Key Solutions & Results
                    </h3>
                    <p className="text-sm leading-relaxed text-black/70 font-normal">
                      {project.improvements}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-black/8">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#ff5f1a] hover:bg-[#e04d0d] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#ff5f1a]/20 transition-all hover:scale-105 active:scale-95"
                >
                  Visit Live Site ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/10 hover:bg-black/5 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[#1a1a1a] transition-all hover:scale-105 active:scale-95"
                >
                  Source Repository ↗
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
