'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

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

// Live Journey Start: Jan 1 2026 UTC+6
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
    return <span className="inline-block text-[#ff5f1a]/50">{char}</span>;
  }

  return (
    <span
      className="relative inline-block overflow-hidden"
      style={{ height: "1.15em", width: "0.62em", verticalAlign: "bottom" }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={char}
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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

// GitHub Contributions Card
function GithubContributions() {
  const [contributions, setContributions] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2026);

  useEffect(() => {
    fetch('/api/github-stats')
      .then((res) => res.json())
      .then((data) => setContributions(data.contributions))
      .catch((err) => console.error('GitHub stats error:', err));
  }, []);

  const displayContributions = selectedYear === 2025 ? 42 : (contributions || 764);

  return (
    <div className="flex-1 min-h-[360px] group relative overflow-hidden rounded-3xl border border-black/8 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-[#ff5f1a]/30 hover:shadow-xl hover:shadow-[#ff5f1a]/5">
      {/* Visual Top Half */}
      <div className="relative h-[210px] w-full bg-[#fcfcfc] border-b border-black/5 flex items-center justify-center p-4 overflow-hidden select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        {/* Dynamic Wave SVG */}
        <svg className="absolute bottom-0 left-0 right-0 h-16 w-full select-none pointer-events-none z-0 opacity-40 group-hover:opacity-50 transition-opacity duration-300" viewBox="0 0 400 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="glow-2025" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5f1a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff5f1a" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="glow-2026" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d={selectedYear === 2025 
              ? "M 0 50 Q 50 46 100 48 T 200 44 T 300 46 T 400 42 L 400 60 L 0 60 Z"
              : "M 0 50 Q 50 38 100 28 T 200 18 T 300 8 T 400 2 L 400 60 L 0 60 Z"
            }
            fill={selectedYear === 2025 ? "url(#glow-2025)" : "url(#glow-2026)"}
            stroke={selectedYear === 2025 ? "#ff5f1a" : "#10b981"}
            strokeWidth="1.5"
            className="transition-all duration-700 ease-in-out"
          />
        </svg>

        {/* Floating Glass Box */}
        <div className="relative z-10 w-full max-w-[210px] rounded-2xl border border-white/60 bg-white/75 p-4 shadow-lg shadow-black/5 backdrop-blur-md flex flex-col gap-3 transition-all duration-300">
          <div className="flex justify-between items-center w-full">
            <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Metrics</span>
            <span className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all duration-300 ${
              selectedYear === 2026 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
            }`}>
              {selectedYear === 2026 ? '+1719% Growth' : 'Baseline'}
            </span>
          </div>

          <div className="text-center">
            <span className="font-mono text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
              {displayContributions}
              <span className={selectedYear === 2026 ? "text-[#10b981] ml-0.5" : "text-[#ff5f1a] ml-0.5"}>+</span>
            </span>
          </div>

          {/* Toggle Switch */}
          <div 
            onClick={() => setSelectedYear(selectedYear === 2025 ? 2026 : 2025)}
            className="relative flex items-center bg-black/5 p-0.5 rounded-full w-full h-6 cursor-pointer select-none transition-colors border border-black/5 hover:bg-black/8"
          >
            <div 
              className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-out" 
              style={{ transform: selectedYear === 2026 ? 'translateX(100%)' : 'translateX(0%)' }} 
            />
            <span className={`w-1/2 text-center text-[9px] font-mono z-10 transition-colors ${selectedYear === 2025 ? 'text-black font-semibold' : 'text-black/35'}`}>
              2025
            </span>
            <span className={`w-1/2 text-center text-[9px] font-mono z-10 transition-colors ${selectedYear === 2026 ? 'text-black font-semibold' : 'text-black/35'}`}>
              2026
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Half */}
      <div className="p-6 flex flex-col justify-between flex-grow text-left gap-3">
        <div>
          <h3 className="text-base font-bold text-[#1a1a1a] mb-1 uppercase tracking-wider text-[12px] font-mono">
            GitHub Contributions
          </h3>
          <p className="text-[11.5px] text-black/50 leading-relaxed font-normal">
            Monitoring active repository contribution frequency, codebase commits, and open-source contributions.
          </p>
        </div>
        <span className="font-mono text-[9px] text-[#ff5f1a]/70 uppercase tracking-widest font-bold">
          Year {selectedYear} active
        </span>
      </div>
    </div>
  );
}

// LeetCode Stats Card
function LeetcodeStats() {
  const [stats, setStats] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    fetch('/api/leetcode-stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (data.status === 'success') {
          setStats(data);
        }
      })
      .catch((err) => console.error('LeetCode API error:', err));
  }, []);

  const totalSolved = stats?.totalSolved || 0;
  
  const getMilestone = (solved) => {
    if (solved < 100) return 100;
    if (solved < 250) return 250;
    if (solved < 500) return 500;
    return 1000;
  };
  const target = getMilestone(totalSolved);
  const progressPercent = Math.min((totalSolved / target) * 100, 100);

  return (
    <div className="flex-1 min-h-[360px] group relative overflow-hidden rounded-3xl border border-black/8 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-[#ff5f1a]/30 hover:shadow-xl hover:shadow-[#ff5f1a]/5">
      {/* Visual Top Half */}
      <div className="relative h-[210px] w-full bg-[#fcfcfc] border-b border-black/5 flex items-center justify-center p-4 overflow-hidden select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-[210px] rounded-2xl border border-white/60 bg-white/75 p-4 shadow-lg shadow-black/5 backdrop-blur-md flex flex-col gap-3 transition-all duration-300">
          <div className="flex justify-between items-center w-full">
            <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Solved</span>
            {stats && (
              <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                {stats.acceptanceRate}% Accept
              </span>
            )}
          </div>

          <div className="text-center">
            <span className="font-mono text-3xl font-extrabold tracking-tight text-[#1a1a1a]">
              {stats ? (
                <>
                  {totalSolved}
                  <span className="text-[#ff5f1a] font-normal text-[15px] ml-0.5">/ {target}</span>
                </>
              ) : (
                '--'
              )}
            </span>
          </div>

          {stats && (
            <div className="space-y-1">
              <div className="relative h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff8a00] to-[#ff4d00] rounded-full shadow-md transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[7.5px] font-mono text-black/35 px-0.5">
                <span>Target</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
            </div>
          )}

          {stats && (
            <div className="space-y-2">
              <div 
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center justify-between text-[8px] font-mono text-black/45 hover:text-black cursor-pointer border-t border-black/5 pt-2 select-none"
              >
                <span>Breakdown</span>
                <div className={`relative w-6 h-3.5 rounded-full transition-colors duration-300 ${showBreakdown ? 'bg-[#ff5f1a]' : 'bg-black/10'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full bg-white transition-transform duration-300 ${showBreakdown ? 'translate-x-2.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {showBreakdown && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-emerald-600 font-bold">Easy</span>
                    <span className="text-black/50">{stats.easySolved}/{stats.totalEasy}</span>
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-amber-500 font-bold">Med</span>
                    <span className="text-black/50">{stats.mediumSolved}/{stats.totalMedium}</span>
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono">
                    <span className="text-red-500 font-bold">Hard</span>
                    <span className="text-black/50">{stats.hardSolved}/{stats.totalHard}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Half */}
      <div className="p-6 flex flex-col justify-between flex-grow text-left gap-3">
        <div>
          <h3 className="text-base font-bold text-[#1a1a1a] mb-1 uppercase tracking-wider text-[12px] font-mono">
            LeetCode Solutions
          </h3>
          <p className="text-[11.5px] text-black/50 leading-relaxed font-normal">
            Solving data structures & algorithm challenges to refine runtime execution and memory optimization.
          </p>
        </div>
        <span className="font-mono text-[9px] text-[#ff5f1a]/70 uppercase tracking-widest font-bold">
          Milestone Progress
        </span>
      </div>
    </div>
  );
}

export default function About() {
  const seconds = useJourneySeconds();
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
    <section id="story" className="py-12 sm:py-20">
      <div className="section-shell">
        <div className="space-y-16">

          {/* ── 1. Live Stats Cards Row ── */}
          <div id="stats" className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-xs uppercase tracking-[0.24em] text-[#ff5f1a]"
            >
              Real-time Metrics
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
              className="grid gap-6 md:grid-cols-3 w-full"
            >
              {/* Journey Counter Card */}
              <div className="flex-1 min-h-[360px] group relative overflow-hidden rounded-3xl border border-black/8 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 hover:border-[#ff5f1a]/30 hover:shadow-xl hover:shadow-[#ff5f1a]/5">
                <div className="relative h-[210px] w-full bg-[#fcfcfc] border-b border-black/5 flex items-center justify-center p-4 overflow-hidden select-none">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                  
                  <div className="relative z-10 w-full max-w-[210px] rounded-2xl border border-white/60 bg-white/75 p-4 shadow-lg shadow-black/5 backdrop-blur-md flex flex-col gap-3.5 transition-all duration-300">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[9px] font-mono text-black/40 font-bold uppercase tracking-wider">Timeline</span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>

                    <div className="text-center py-1">
                      <span className="font-mono text-[1.4rem] font-bold tracking-tight text-[#ff5f1a] tabular-nums flex items-center justify-center">
                        {seconds !== null ? (
                          formatSeconds(seconds).split("").map((char, i) => (
                            <AnimatedDigit key={i} char={char} />
                          ))
                        ) : (
                          <span>328,749,895</span>
                        )}
                      </span>
                    </div>

                    <div className="border-t border-black/5 pt-2 text-center">
                      <span className="text-[8px] font-mono text-black/35">
                        ticking since Jan 1, 2026
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow text-left gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#1a1a1a] mb-1 uppercase tracking-wider text-[12px] font-mono">
                      Development Journey
                    </h3>
                    <p className="text-[11.5px] text-black/50 leading-relaxed font-normal">
                      Counting every active second of software development practice, component architecture, and design execution.
                    </p>
                  </div>
                  <span className="font-mono text-[9px] text-[#ff5f1a]/70 uppercase tracking-widest font-bold">
                    Live Counter Active
                  </span>
                </div>
              </div>

              {/* GitHub Contributions Card */}
              <GithubContributions />

              {/* LeetCode Stats Card */}
              <LeetcodeStats />
            </motion.div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />

          {/* ── 2. Journey Narrative + Stack ── */}
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
                The Journey
              </motion.p>
              
              <div className="space-y-6 text-[1.05rem] leading-[1.85] text-black/60">
                <motion.p variants={fade(0.05)}>
                  It started in <span className="font-semibold text-[#1a1a1a]">March 2024</span> — I discovered a full web development playlist online. Watching code turn into live interactive elements in the browser felt like unlocking a whole new world.
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
                  <span className="font-semibold text-[#1a1a1a]">January 1, 2026.</span> I went all-in. HTML, CSS, Tailwind, JavaScript, React, Next.js, Express.js, MongoDB, and REST APIs. Each piece built upon the last.
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
                  {" "}was a knowledge-base platform. I'm constantly learning, building real-world projects, and sharpening my skill set every day.
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
                Skills & Technologies
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