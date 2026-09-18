'use client';

import Image from 'next/image';
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaArrowUp,
} from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

export default function Footer() {
  const socials = [
    {
      name: 'GitHub',
      href: 'https://github.com/Zabedfolio',
      icon: FaGithub,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/zabedfolio/',
      icon: FaLinkedinIn,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/zaabed_maahmud/',
      icon: FaInstagram,
    },
    {
      name: 'LeetCode',
      href: 'https://leetcode.com/u/zabedfolio/',
      icon: SiLeetcode,
    },
  ];

  return (
    <footer className="relative bg-[#eeeeee] border-t border-black/8 pt-16 pb-12">
      <div className="section-shell">
        <div className="rounded-3xl border border-black/8 bg-white p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left: Brand info */}
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Zabed Mahmud
            </h3>
            <p className="text-sm text-black/60 max-w-md font-normal leading-relaxed">
              Full Stack Web Developer & Designer crafting high-performance, modern digital products.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/8 bg-[#f9f9f9] px-3.5 py-1.5 text-xs font-medium text-black/60 transition hover:border-[#ff5f1a]/40 hover:bg-[#ff5f1a] hover:text-white"
                  >
                    <Icon className="text-xs" />
                    <span>{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="mailto:zabedfolio@gmail.com"
              className="rounded-full bg-[#ff5f1a] px-6 py-3 text-xs font-semibold text-white shadow-md shadow-[#ff5f1a]/20 transition hover:opacity-90"
            >
              Get In Touch
            </a>
            <a
              href="/resume"
              className="rounded-full border border-black/10 bg-white px-6 py-3 text-xs font-semibold text-black/80 shadow-sm transition hover:border-[#ff5f1a]/50 hover:text-[#ff5f1a]"
            >
              View Resume
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/5 text-xs font-mono text-black/40">
          <p>© {new Date().getFullYear()} Zabed Mahmud. All rights reserved.</p>
          
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            className="inline-flex items-center gap-1.5 text-black/50 hover:text-[#ff5f1a] transition-colors"
          >
            <FaArrowUp />
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}