'use client';

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { fetchProjectById } from "@/utils/projectApi";

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
      if (!data) {
        setError("Project not found in API response.");
        return;
      }
      setProject(data);
    } catch {
      setError("Project details API is not responding. Try `npm run server` and retry.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  return (
    <div className="section-shell py-12 sm:py-20">
      <Link href="/projects" className="mb-8 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-semibold text-black/80 shadow-sm transition hover:border-[#ff5f1a] hover:text-[#ff5f1a]">
        ← Back to projects
      </Link>

      {loading ? (
        <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm">
          <div className="h-72 animate-pulse bg-black/5" />
          <div className="space-y-8 p-6 sm:p-10">
            <div className="h-3 w-32 animate-pulse rounded bg-black/10" />
            <div className="h-12 w-2/3 animate-pulse rounded bg-black/10" />
            <div className="h-20 animate-pulse rounded bg-black/5" />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-black/8 bg-white p-8 text-black/60 shadow-sm text-center">
          <p>{error}</p>
          <button
            onClick={loadProject}
            className="mt-4 rounded-full border border-[#ff5f1a]/30 bg-[#ff5f1a] px-5 py-2 text-xs uppercase tracking-[0.2em] text-white font-bold"
          >
            Retry
          </button>
        </div>
      ) : project ? (
        <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm">
          {project.image ? (
            <div className="relative h-80 sm:h-96 w-full bg-black/5">
              <Image src={project.image} alt={project.title ?? "Project image"} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
            </div>
          ) : null}

          <div className="space-y-8 p-6 sm:p-10">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff5f1a]">
                Project Detail · {project.year || "2026"}
              </span>
              <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-[#1a1a1a]">{project.title}</h1>
              <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-black/60 font-normal">{project.description}</p>
            </div>

            {(project?.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(project?.tags ?? []).map((tag) => (
                  <span key={tag} className="rounded-full border border-black/8 bg-black/3 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-black/50">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {(project.challenge || project.improvements) && (
              <div className="grid gap-6 lg:grid-cols-2">
                {project.challenge && (
                  <div className="rounded-2xl border border-black/8 bg-black/2 p-6 space-y-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#ff5f1a]">Challenge</p>
                    <p className="text-sm leading-relaxed text-black/70">{project.challenge}</p>
                  </div>
                )}
                {project.improvements && (
                  <div className="rounded-2xl border border-black/8 bg-black/2 p-6 space-y-2">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-600">Key Solutions & Execution</p>
                    <p className="text-sm leading-relaxed text-black/70">{project.improvements}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4 border-t border-black/5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#ff5f1a] hover:bg-[#e04d0d] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition"
                >
                  Live Site ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/10 hover:bg-black/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#1a1a1a] transition"
                >
                  GitHub Repository ↗
                </a>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
