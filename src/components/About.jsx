'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import avtr from "@/assets/avtr.png";

// Motion variants
const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// Hover image popup component
function HoverImage({ src, alt, label }) {
  const [visible, setVisible] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      <span className="cursor-default font-semibold text-[#1a1a1a] underline decoration-dashed decoration-[#ff5f1a]/60 underline-offset-4">
        {label}
      </span>

      {visible && (
        <span
          className="pointer-events-none fixed z-50"
          style={{ left: mouse.x + 20, top: mouse.y - 100 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="block overflow-hidden rounded-2xl border border-black/10 shadow-2xl shadow-black/20 bg-white"
            style={{ width: 260, height: 170 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-1.5 block text-center font-mono text-[10px] tracking-widest text-black/40"
          >
            {alt}
          </motion.span>
        </span>
      )}
    </span>
  );
}

export default function About() {
  const [skills, setSkills] = useState([
    { name: "ReactJS & Next.js", category: "Frontend Core" },
    { name: "Node.js & Express", category: "Backend Runtime" },
    { name: "PostgreSQL & MongoDB", category: "Databases" },
    { name: "Tailwind CSS & Framer Motion", category: "UI & Animation" },
    { name: "TypeScript & JavaScript", category: "Languages" },
    { name: "Git, GitHub & Vercel", category: "DevOps & Tools" },
  ]);

  useEffect(() => {
    fetch("/api/public/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setSkills(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section id="story" className="py-16 sm:py-24">
      <div className="section-shell">
        <div className="space-y-16">

          {/* Top Header Card / Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-12 border-b border-black/8"
          >
            <div className="flex items-center gap-5">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border border-black/10 shadow-md bg-white shrink-0">
                <Image
                  src={avtr}
                  alt="Zabed Mahmud"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-1 font-mono text-[11px] font-medium tracking-wide text-black/60 shadow-sm mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Full Stack Web Developer 🇧🇩
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1a1a1a]">
                  Zabed Mahmud
                </h1>
                <p className="text-sm font-medium text-black/50">
                  Building web solutions, scalable applications & modern user interfaces.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Journey Narrative + Stack Story ── */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.08 }}
            variants={stagger}
            className="grid gap-16 lg:grid-cols-2 lg:items-start"
          >
            {/* Left Column: Story */}
            <div>
              <motion.p variants={fade()} className="mb-8 font-mono text-xs uppercase tracking-[0.24em] text-black/35">
                The Story
              </motion.p>
              
              <div className="space-y-6 text-[1.05rem] leading-[1.85] text-black/60 font-normal">
                <motion.p variants={fade(0.05)}>
                  It started in <span className="font-semibold text-[#1a1a1a]">March 2024</span> — I discovered a full web development playlist online. Watching raw code turn into live interactive elements in the browser felt like unlocking a whole new creative world.
                </motion.p>

                <motion.p variants={fade(0.1)} className="relative">
                  Then came{" "}
                  <HoverImage
                    src="https://i.ibb.co.com/rf7qNgB2/credit-prothom-alo.webp"
                    alt="July Uprising"
                    label="July 2024"
                  />
                  . Bangladesh saw a student uprising, internet blackouts occurred, and momentum paused. Weeks went by, but the passion never truly left.
                </motion.p>

                <motion.p variants={fade(0.15)}>
                  By <span className="font-semibold text-[#1a1a1a]">September 2024</span>, I re-ignited my learning. And on <span className="font-semibold text-[#1a1a1a]">December 24, 2025</span>, I enrolled in Programming Hero's web development course.
                </motion.p>

                <motion.p variants={fade(0.2)}>
                  <span className="font-semibold text-[#1a1a1a]">January 1, 2026.</span> I went all-in. HTML, CSS, Tailwind CSS, JavaScript, React, Next.js, Express.js, MongoDB, PostgreSQL, and REST APIs. Each piece built upon the last into a full stack workflow.
                </motion.p>

                <motion.p variants={fade(0.25)}>
                  My{" "}
                  <a
                    href="https://zabedfolio.github.io/Knowledge_A01/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link relative inline-flex items-baseline gap-1 font-semibold text-[#1a1a1a] underline decoration-[#ff5f1a]/50 underline-offset-4 transition-all hover:decoration-[#ff5f1a]"
                  >
                    first project
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" fill="currentColor" className="mb-0.5 h-2.5 w-2.5 opacity-40 transition-opacity group-hover/link:opacity-100">
                      <path d="M3.5 1.5a.5.5 0 0 0 0 1H8.29L1.65 9.15a.5.5 0 1 0 .7.7L9 3.21V8a.5.5 0 0 0 1 0V2a.5.5 0 0 0-.5-.5H3.5Z" />
                    </svg>
                  </a>
                  {" "}was a knowledge-base platform. I'm constantly learning, building real-world applications, and sharpening my skill set every day.
                </motion.p>
              </div>

              <motion.blockquote
                variants={fade(0.3)}
                className="mt-10 border-l-2 border-[#ff5f1a]/50 pl-5 text-base italic leading-7 text-black/45"
              >
                "The best time to start was yesterday. The second best time is{" "}
                <span className="font-semibold not-italic text-[#1a1a1a]">right now.</span>"
              </motion.blockquote>
            </div>

            {/* Right Column: Stack & Skills */}
            <div id="skills" className="lg:sticky lg:top-24">
              <motion.p variants={fade()} className="mb-8 font-mono text-xs uppercase tracking-[0.24em] text-black/35">
                Tech Stack & Toolkit
              </motion.p>

              <div className="space-y-3">
                {skills.map((item, i) => (
                  <motion.div
                    key={item.name}
                    variants={fade(i * 0.04)}
                    className="group flex items-center justify-between rounded-2xl border border-black/8 bg-white px-5 py-3.5 shadow-sm transition-all duration-300 hover:border-[#ff5f1a]/30 hover:shadow-md hover:shadow-[#ff5f1a]/5"
                  >
                    <span className="font-semibold text-sm text-black/75 transition-colors group-hover:text-[#1a1a1a]">
                      {item.name}
                    </span>
                    <span className="font-mono text-[11px] text-black/40 transition-colors group-hover:text-black/60 bg-black/4 px-2.5 py-1 rounded-md">
                      {item.category}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}