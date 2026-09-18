'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { projectCategories } from "@/data/projects";
import { fetchProjects } from "@/utils/projectApi";
import { fadeUp, staggerContainer } from "@/utils/motionVariants";

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const carouselRef = useRef(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setError("Projects API is not responding. Try `npm run server` and reload.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    return activeCategory === "All" ? projects : projects.filter((project) => project.category === activeCategory);
  }, [activeCategory, projects]);

  const syncCarousel = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const { scrollLeft, clientWidth, scrollWidth } = carousel;
    setCanScrollPrev(scrollLeft > 4);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 4);

    const cards = carousel.querySelectorAll("[data-project-card]");
    if (!cards.length) return;

    const center = scrollLeft + clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - cardCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    setActiveIndex(nearest);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollTo({ left: 0, behavior: "instant" });
    setActiveIndex(0);
    syncCarousel();

    const onScroll = () => syncCarousel();
    carousel.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      carousel.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [filteredProjects, syncCarousel]);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelector("[data-project-card]");
    const step = card ? card.offsetWidth + 16 : carousel.clientWidth * 0.9;
    carousel.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const scrollToIndex = (index) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const card = carousel.querySelectorAll("[data-project-card]")[index];
    if (!card) return;

    carousel.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  const renderProjectCard = (project, index) => (
    <motion.article
      key={project.id}
      data-project-card
      whileHover={{ y: -4 }}
      className="group flex-1 min-w-[300px] max-w-[440px] shrink-0 snap-start overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm transition-all duration-300 hover:border-[#ff5f1a]/30 hover:shadow-xl hover:shadow-[#ff5f1a]/5 flex flex-col justify-between"
    >
      <div className="relative h-56 w-full overflow-hidden bg-black/5">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="space-y-3.5 p-6 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-black/40">
            <span>{String(index + 1).padStart(2, "0")} · {project.year}</span>
            <span className="text-[#ff5f1a] font-semibold">{project.category}</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-[#1a1a1a]">
            {project.title}
          </h3>

          <p className="text-xs text-black/60 leading-relaxed line-clamp-3 font-normal">
            {project.description}
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-black/8 bg-black/3 px-2.5 py-1 font-mono text-[10px] text-black/50">
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-black/5 flex items-center justify-between">
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
                className="font-mono text-[10px] text-black/40 hover:text-black font-semibold uppercase tracking-wider"
              >
                Live Demo ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );

  const showControls = filteredProjects.length > 1;

  return (
    <div id="projects" className="section-shell py-24 sm:py-32">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="space-y-10"
      >
        <motion.p variants={fadeUp} className="section-label">
          03 — Projects
        </motion.p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.h2 variants={fadeUp} className="section-title max-w-3xl">
            Selected work with premium execution and product clarity.
          </motion.h2>
          <motion.div variants={fadeUp} className="flex w-fit flex-wrap gap-1.5 rounded-full border border-black/8 bg-white p-1.5 shadow-sm">
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="relative rounded-full px-4 py-1.5 text-xs font-semibold text-black/50 transition hover:text-[#1a1a1a]"
              >
                {activeCategory === category && (
                  <motion.span
                    layoutId="projectFilter"
                    className="absolute inset-0 rounded-full border border-black/5 bg-black/5"
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="w-[min(88vw,420px)] shrink-0 overflow-hidden rounded-3xl border border-black/8 bg-white p-6 space-y-4">
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
          <div className="rounded-3xl border border-black/8 bg-white p-6 text-black/60">
            <p>{error}</p>
            <button
              onClick={loadProjects}
              className="mt-4 rounded-full border border-[#ff5f1a]/30 bg-[#ff5f1a] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-3xl border border-black/8 bg-white p-6 text-black/60">
            <p>No projects found in data source.</p>
            <button
              onClick={loadProjects}
              className="mt-4 rounded-full border border-[#ff5f1a]/30 bg-[#ff5f1a] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
            >
              Reload
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
            className="space-y-6"
          >
            <div
              ref={carouselRef}
              className="projects-carousel flex gap-4 overflow-x-auto scroll-smooth py-2"
              aria-label="Project showcase"
            >
              {filteredProjects.map((project, index) => renderProjectCard(project, index))}
            </div>

            {showControls && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-black/40">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(filteredProjects.length).padStart(2, "0")}
                </p>

                <div className="flex flex-1 items-center gap-1.5 sm:max-w-md sm:px-6">
                  {filteredProjects.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      aria-label={`Go to project ${index + 1}`}
                      onClick={() => scrollToIndex(index)}
                      className={`h-1 flex-1 rounded-full transition duration-300 ${
                        index === activeIndex ? "bg-[#ff5f1a]" : "bg-black/10 hover:bg-black/20"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous project"
                    onClick={() => scrollCarousel(-1)}
                    disabled={!canScrollPrev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black/60 shadow-sm transition hover:border-[#ff5f1a]/40 hover:text-black disabled:pointer-events-none disabled:opacity-30"
                  >
                    <FiChevronLeft className="text-lg" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next project"
                    onClick={() => scrollCarousel(1)}
                    disabled={!canScrollNext}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black/60 shadow-sm transition hover:border-[#ff5f1a]/40 hover:text-black disabled:pointer-events-none disabled:opacity-30"
                  >
                    <FiChevronRight className="text-lg" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
