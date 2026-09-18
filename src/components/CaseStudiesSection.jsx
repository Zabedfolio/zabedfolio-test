'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCaseStudies = async () => {
      try {
        const response = await fetch("/api/case-studies", { cache: "no-store" });
        const data = await response.json();
        setCaseStudies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load case studies", error);
      } finally {
        setLoading(false);
      }
    };

    loadCaseStudies();
  }, []);

  return (
    <section id="case-studies" className="section-shell py-16 sm:py-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="section-label">Case Studies</p>
          <h2 className="section-title mt-2">Research-led product stories that go beyond code.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-black/60 font-normal">
            Deep-dives into architecture, user experience, and technical execution across my featured projects.
          </p>
        </div>
        <Link href="/case-study" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-semibold text-black/80 shadow-sm transition hover:border-[#ff5f1a] hover:text-[#ff5f1a]">
          View all case studies <span aria-hidden>→</span>
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-3xl border border-black/8 bg-white p-6" />
          ))}
        </div>
      ) : caseStudies.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-black/8 bg-white p-8 text-black/60">
          No case studies published yet.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {caseStudies.map((study, index) => {
            const detailPath = `/case-study/${study.slug || study.id || study._id}`;
            return (
              <motion.article
                key={study._id || study.id || study.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition-all duration-300 hover:border-[#ff5f1a]/30 hover:shadow-xl hover:shadow-[#ff5f1a]/5 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-black/5">
                    {study.image ? (
                      <img
                        src={study.image}
                        alt={study.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute left-4 top-4 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-black/70 shadow-sm backdrop-blur">
                      {study.category || "Case Study"}
                    </div>
                  </div>

                  <div className="space-y-3 p-6">
                    <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider text-black/40">
                      <span>{study.year || "2026"}</span>
                    </div>

                    <h3 className="text-xl font-bold tracking-tight text-[#1a1a1a] group-hover:text-[#ff5f1a] transition-colors">
                      {study.title}
                    </h3>

                    <p className="text-xs text-black/60 leading-relaxed line-clamp-3 font-normal">
                      {study.subtitle || study.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(study.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-black/8 bg-black/3 px-2.5 py-1 font-mono text-[10px] text-black/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-black/5 flex items-center justify-between">
                    <Link href={detailPath} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff5f1a] hover:underline underline-offset-4">
                      Read case study <span aria-hidden>→</span>
                    </Link>
                    {study.liveUrl ? (
                      <a href={study.liveUrl} target="_blank" rel="noreferrer" className="font-mono text-[10px] text-black/40 hover:text-black font-semibold uppercase tracking-wider">
                        Live ↗
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
