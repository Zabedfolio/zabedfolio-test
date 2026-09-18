"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCollection,
  HiOutlineCog,
  HiOutlineCube,
  HiOutlineDatabase,
  HiOutlineChevronRight,
} from "react-icons/hi";

export default function AdminOverview() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    learnedSkills: 0,
    education: 0,
    experience: 0,
    processSteps: 0,
    notes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [proj, skl, edu, exp, prc, nts] = await Promise.all([
          fetch("/api/admin/projects").then((r) => r.json()),
          fetch("/api/admin/skills").then((r) => r.json()),
          fetch("/api/admin/education").then((r) => r.json()),
          fetch("/api/admin/experience").then((r) => r.json()),
          fetch("/api/admin/process").then((r) => r.json()),
          fetch("/api/admin/notes").then((r) => r.json()),
        ]);

        setStats({
          projects: Array.isArray(proj) ? proj.length : 0,
          skills: Array.isArray(skl) ? skl.length : 0,
          education: Array.isArray(edu) ? edu.length : 0,
          experience: Array.isArray(exp) ? exp.length : 0,
          processSteps: Array.isArray(prc) ? prc.length : 0,
          notes: Array.isArray(nts) ? nts.length : 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Projects Showcase",
      count: stats.projects,
      desc: "Work case studies, details & tech tags",
      icon: HiOutlineBriefcase,
      color: "bg-orange-500/5",
      borderColor: "border-orange-500/20",
      href: "/admin/projects",
    },
    {
      title: "Skills Directory",
      count: stats.skills,
      desc: "Icons, categories and color schemes",
      icon: HiOutlineCog,
      color: "bg-blue-500/5",
      borderColor: "border-blue-500/20",
      href: "/admin/skills",
    },
    {
      title: "Timeline: Education",
      count: stats.education,
      desc: "Institutions, certificates & duration",
      icon: HiOutlineAcademicCap,
      color: "bg-emerald-500/5",
      borderColor: "border-emerald-500/20",
      href: "/admin/education",
    },
    {
      title: "Timeline: Experience",
      count: stats.experience,
      desc: "Freelance & formal employment roles",
      icon: HiOutlineCube,
      color: "bg-purple-500/5",
      borderColor: "border-purple-500/20",
      href: "/admin/experience",
    },
    {
      title: "Process Workflow",
      count: stats.processSteps,
      desc: "Steps from discovery to final launch",
      icon: HiOutlineCube,
      color: "bg-amber-500/5",
      borderColor: "border-amber-500/20",
      href: "/admin/process",
    },
    {
      title: "Notes & Ideas",
      count: stats.notes,
      desc: "Thought stream, translations & pictures",
      icon: HiOutlineCollection,
      color: "bg-indigo-500/5",
      borderColor: "border-indigo-500/20",
      href: "/admin/notes",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">Dashboard Overview</h1>
        <p className="mt-1 text-sm font-medium text-black/50">Quickly manage your dynamic portfolio contents</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-white border border-black/8 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  href={card.href}
                  className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-white border border-black/8 ${card.color} hover:border-[#ff5f1a]/40 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#1a1a1a] group-hover:text-[#ff5f1a] transition">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs text-black/50 font-normal">{card.desc}</p>
                    </div>
                    <span className="p-3 rounded-2xl bg-black/4 border border-black/5 text-black/60 group-hover:text-[#ff5f1a] group-hover:bg-[#ff5f1a]/10 transition duration-300">
                      <Icon className="text-xl" />
                    </span>
                  </div>

                  <div className="mt-8 flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">
                      {card.count}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-black/40 group-hover:text-[#ff5f1a] transition duration-300 font-mono font-semibold uppercase tracking-wider">
                      Manage <HiOutlineChevronRight />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                <HiOutlineDatabase className="text-2xl" />
              </span>
              <div>
                <h4 className="font-bold text-[#1a1a1a]">Database Integrity</h4>
                <p className="text-xs text-black/50 mt-0.5 font-normal">Connected to MongoDB Atlas Cluster0</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Active
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-black/4 text-black/60 border border-black/8">
                SSL Secured
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
