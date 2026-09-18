'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import avtr from '@/assets/avtr.png';
import {
  SiReact,
  SiNextdotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
} from 'react-icons/si';
import { HiOutlineGlobeAlt, HiOutlineCode } from 'react-icons/hi';

const TECH_MAP = {
  react: { name: "ReactJS", icon: SiReact, color: "#00B4D8", bg: "rgba(0, 180, 216, 0.1)", border: "rgba(0, 180, 216, 0.25)" },
  next: { name: "NextJS", icon: SiNextdotjs, color: "#1a1a1a", bg: "rgba(0, 0, 0, 0.06)", border: "rgba(0, 0, 0, 0.15)" },
  express: { name: "Express.js", icon: SiExpress, color: "#1a1a1a", bg: "rgba(0, 0, 0, 0.06)", border: "rgba(0, 0, 0, 0.15)" },
  postgres: { name: "PostgreSQL", icon: SiPostgresql, color: "#336791", bg: "rgba(51, 103, 145, 0.1)", border: "rgba(51, 103, 145, 0.25)" },
  mongo: { name: "MongoDB", icon: SiMongodb, color: "#13AA52", bg: "rgba(19, 170, 82, 0.1)", border: "rgba(19, 170, 82, 0.25)" },
  tailwind: { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4", bg: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.25)" },
  typescript: { name: "TypeScript", icon: SiTypescript, color: "#3178C6", bg: "rgba(49, 120, 198, 0.1)", border: "rgba(49, 120, 198, 0.25)" },
  javascript: { name: "JavaScript", icon: SiJavascript, color: "#B89600", bg: "rgba(247, 223, 30, 0.15)", border: "rgba(214, 186, 0, 0.3)" },
  html: { name: "HTML", icon: SiHtml5, color: "#E34F26", bg: "rgba(227, 79, 38, 0.1)", border: "rgba(227, 79, 38, 0.25)" },
  css: { name: "CSS", icon: SiCss, color: "#1572B6", bg: "rgba(21, 114, 182, 0.1)", border: "rgba(21, 114, 182, 0.25)" },
  restapi: { name: "REST APIs", icon: HiOutlineGlobeAlt, color: "#ff5f1a", bg: "rgba(255, 95, 26, 0.1)", border: "rgba(255, 95, 26, 0.25)" },
};

function TechBadge({ name, techKey }) {
  const item = TECH_MAP[techKey] || { name: name || techKey, icon: HiOutlineCode, color: "#ff5f1a", bg: "rgba(255, 95, 26, 0.1)", border: "rgba(255, 95, 26, 0.2)" };
  const Icon = item.icon;

  return (
    <span
      style={{ backgroundColor: item.bg, borderColor: item.border }}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border font-mono text-[11.5px] font-bold align-middle mx-0.5 shadow-sm transition-transform hover:scale-105 duration-200"
    >
      <Icon style={{ color: item.color }} className="h-3.5 w-3.5 shrink-0" />
      <span className="text-[#1a1a1a]">{item.name}</span>
    </span>
  );
}

const JOURNEY_START = new Date("2026-01-01T00:00:00+06:00").getTime();

function useJourneyMonths() {
  const [months, setMonths] = useState(8);

  useEffect(() => {
    const now = new Date();
    const start = new Date("2026-01-01T00:00:00+06:00");
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    setMonths(Math.max(1, diffMonths));
  }, []);

  return months;
}

function useJourneySeconds() {
  const [mounted, setMounted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    setMounted(true);
    setSeconds(Math.floor((Date.now() - JOURNEY_START) / 1000));
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - JOURNEY_START) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return mounted ? seconds : null;
}

function formatSeconds(s) {
  return s.toLocaleString("en-US");
}

function AnimatedDigit({ char }) {
  const isDigit = /\d/.test(char);

  if (!isDigit) {
    return <span className="inline-block text-[#ff5f1a]/60">{char}</span>;
  }

  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{ height: "1.15em", width: "0.62em", verticalAlign: "bottom" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "100%", opacity: 0, filter: "blur(3px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(3px)" }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

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
  const months = useJourneyMonths();
  const seconds = useJourneySeconds();

  return (
    <section id="story" className="relative z-10 pt-8 pb-16 sm:pt-14 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-10">

          {/* Main Title Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            {/* Title Line 1 */}
            <h1 className="text-[clamp(2.5rem,6.5vw,5rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#1a1a1a] flex flex-wrap items-center gap-x-3 gap-y-2">
              <span>Hey, I'm</span>
              
              {/* Avatar Pill Badge */}
              <span className="inline-flex items-center justify-center p-1 bg-white rounded-2xl border border-black/10 shadow-md shadow-black/5 rotate-[-2deg] transition-transform hover:rotate-0 duration-300">
                <span className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-xl overflow-hidden block">
                  <Image
                    src={avtr}
                    alt="Zabed Mahmud"
                    fill
                    className="object-cover"
                    priority
                  />
                </span>
              </span>

              <span className="text-[#1a1a1a]">Zabed</span>
            </h1>

            {/* Title Line 2 */}
            <h2 className="text-[clamp(2.2rem,6vw,4.6rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-[#1a1a1a] flex flex-wrap items-center gap-x-3 gap-y-2">
              <span>And I Design</span>
              
              {/* Code Icon Pill */}
              <span className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#1a1a1a] text-white shadow-lg shadow-black/10 transition-transform hover:scale-105 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#ff5f1a]">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </span>

              <span>Web Solutions &</span>

              {/* Digital Products Icon Pill */}
              <span className="inline-flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-[#1a1a1a] text-white shadow-lg shadow-black/10 transition-transform hover:scale-105 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-emerald-400">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <line x1="9" y1="1" x2="9" y2="4"></line>
                  <line x1="15" y1="1" x2="15" y2="4"></line>
                  <line x1="9" y1="20" x2="9" y2="23"></line>
                  <line x1="15" y1="20" x2="15" y2="23"></line>
                  <line x1="20" y1="9" x2="23" y2="9"></line>
                  <line x1="20" y1="15" x2="23" y2="15"></line>
                  <line x1="1" y1="9" x2="4" y2="9"></line>
                  <line x1="1" y1="15" x2="4" y2="15"></line>
                </svg>
              </span>

              <span>Digital Products</span>
            </h2>
          </motion.div>

          {/* Intro Paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 text-[1.05rem] leading-[1.85] text-black/65 font-normal pt-2"
          >
            <p>
              I'm a Web Developer, Designer, and Tech Enthusiast from Chittagong, Bangladesh 🇧🇩. I've been coding and building web applications for about <span className="font-bold text-lg text-[#1a1a1a]">{months}</span> months — or <span className="italic">exactly</span>{" "}
              <span className="font-mono font-extrabold text-lg sm:text-xl text-[#ff5f1a] tracking-tight px-0.5">
                {seconds !== null ? (
                  formatSeconds(seconds).split("").map((char, i) => (
                    <AnimatedDigit key={i} char={char} />
                  ))
                ) : (
                  <span>328,749,895</span>
                )}
              </span>{" "}
              Seconds!
            </p>

            <p className="leading-[2.2]">
              I use <TechBadge techKey="react" />, <TechBadge techKey="next" />, <TechBadge techKey="express" />, <TechBadge techKey="postgres" />, <TechBadge techKey="mongo" />, <TechBadge techKey="tailwind" />, and <TechBadge techKey="typescript" /> most of the time. My focus is on building clean, high-performance web products, scalable APIs, and intuitive user interfaces.
            </p>

            <p>
              I have developed modern software applications for clients and personal projects, crafting digital experiences that perform seamlessly. I love what I do ❤️.
            </p>
          </motion.div>

          {/* Section Heading: Little more about me.. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pt-10 border-t border-black/8"
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black/35 font-sans">
              Little more <span className="text-[#1a1a1a]">about me..</span>
            </h3>
          </motion.div>

          {/* Story Narrative Paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6 text-[1.05rem] leading-[1.85] text-black/65 font-normal"
          >
            <p>
              It started in <span className="font-semibold text-[#1a1a1a]">March 2024</span> — I discovered a full web development playlist online. Watching raw code turn into live interactive elements in the browser felt like unlocking a whole new creative world.
            </p>

            <p className="relative">
              Then came{" "}
              <HoverImage
                src="https://i.ibb.co.com/rf7qNgB2/credit-prothom-alo.webp"
                alt="July Uprising"
                label="July 2024"
              />
              . Bangladesh saw a student uprising, internet blackouts occurred, and momentum paused. Weeks went by, but the passion never truly left.
            </p>

            <p>
              By <span className="font-semibold text-[#1a1a1a]">September 2024</span>, I re-ignited my learning. And on <span className="font-semibold text-[#1a1a1a]">December 24, 2025</span>, I enrolled in Programming Hero's web development course.
            </p>

            <p>
              <span className="font-semibold text-[#1a1a1a]">January 1, 2026.</span> I went all-in. HTML, CSS, Tailwind CSS, JavaScript, React, Next.js, Express.js, MongoDB, PostgreSQL, and REST APIs. Each piece built upon the last into a full stack workflow.
            </p>

            <p>
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
            </p>

            <blockquote className="mt-8 border-l-2 border-[#ff5f1a]/50 pl-5 text-base italic leading-7 text-black/50">
              "The best time to start was yesterday. The second best time is{" "}
              <span className="font-semibold not-italic text-[#1a1a1a]">right now.</span>"
            </blockquote>
          </motion.div>

        </div>
      </div>
    </section>
  );
}