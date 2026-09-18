'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import avtr from '@/assets/avtr.png';
import Link from 'next/link';

// ─── Journey start: Jan 1 2026 00:00:00 UTC+6 (Bangladesh) ───────────────────
const JOURNEY_START = new Date("2026-01-01T00:00:00+06:00").getTime();

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
    return (
      <span className="inline-block text-[#ff5f1a]/60">{char}</span>
    );
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

export default function Hero() {
  const seconds = useJourneySeconds();

  return (
    <section className="relative z-10 pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="section-shell max-w-4xl mx-auto">
        <div className="space-y-10">

          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium tracking-wide text-black/60 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Full Stack Web Developer 🇧🇩
            </span>
          </motion.div>

          {/* Main Title with Inline Graphic Badges */}
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

              {/* Hardware / Design Icon Pill */}
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

          {/* Work & Role Pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            {/* Full Time Pill */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2 shadow-sm text-xs font-semibold text-[#1a1a1a]">
              <span>Full Time</span>
              <span className="font-mono text-black/40 bg-black/5 px-1.5 py-0.5 rounded text-[11px] font-bold">&gt;_</span>
            </div>

            {/* Part Time Group Pills */}
            <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 py-2 shadow-sm text-xs font-semibold text-[#1a1a1a]">
              <span className="text-black/50">Part-Time</span>
              <div className="flex flex-wrap items-center gap-1.5 border-l border-black/10 pl-2">
                <span title="Graphics Design" className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-700 font-medium border border-amber-500/20">
                  🎨 Graphics Design
                </span>
                <span title="Social Media Management" className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 px-2 py-0.5 text-[11px] text-blue-700 font-medium border border-blue-500/20">
                  📱 Social Media Management
                </span>
                <span title="Gaming & Tech" className="inline-flex items-center gap-1 rounded-lg bg-purple-500/10 px-2 py-0.5 text-[11px] text-purple-700 font-medium border border-purple-500/20">
                  🎮 Tech & Gaming
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bio Text Paragraphs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4 text-[1.05rem] leading-[1.8] text-black/65 max-w-3xl font-normal pt-2"
          >
            <p>
              I'm a Web Developer, Designer, and Tech Enthusiast from Chittagong, Bangladesh 🇧🇩. I've been coding and building web applications for about 8 months — or <span className="italic">exactly</span>{" "}
              <span className="font-mono font-extrabold text-[#ff5f1a] tracking-tight px-1 py-0.5 rounded bg-[#ff5f1a]/8 border border-[#ff5f1a]/20">
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

            <p>
              I use ReactJS, NextJS, Express, PostgreSQL, MongoDB, Tailwind CSS, and TypeScript most of the time. My focus is on building clean, high-performance web products, scalable APIs, and intuitive user interfaces.
            </p>

            <p>
              I have developed modern software applications for clients and personal projects, crafting digital experiences that perform seamlessly. I love what I do ❤️.
            </p>
          </motion.div>

          {/* Section Transition Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-10 border-t border-black/8"
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black/35 font-sans">
              Little more <span className="text-[#1a1a1a]">about me..</span>
            </h3>
          </motion.div>

        </div>
      </div>
    </section>
  );
}