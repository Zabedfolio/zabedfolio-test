'use client';

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { HiOutlineMenuAlt4, HiOutlineX, HiOutlineShieldCheck } from "react-icons/hi";
import avtr from "@/assets/avtr.png";

const navItems = [
  { href: "/#story", label: "Story" },
  { href: "/#skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/#contact", label: "Contact" }
];

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("/#story");
  const { scrollY } = useScroll();
  const [isAdminLocal, setIsAdminLocal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdminLocal(localStorage.getItem("admin_logged_in") === "true");
    }
  }, [session]);

  const navBg = useTransform(scrollY, [0, 100], ["rgba(238,238,238,0.7)", "rgba(238,238,238,0.92)"]);
  const navBorder = useTransform(scrollY, [0, 100], ["rgba(0,0,0,0.04)", "rgba(0,0,0,0.08)"]);
  const navBlur = useTransform(scrollY, [0, 100], [8, 16]);

  return (
    <motion.header
      style={{
        backgroundColor: navBg,
        borderBottomColor: navBorder,
        backdropFilter: useTransform(navBlur, (v) => `blur(${v}px) saturate(180%)`)
      }}
      className="sticky top-0 z-50 border-b border-black/5 transition-colors"
    >
      <div className="section-shell">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          
          {/* Logo / Brand */}
          <Link href="/" className="relative z-10 flex items-center gap-3 group">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-black/10 bg-white p-0.5 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff5f1a]/50">
              <Image
                src={avtr}
                alt="Zabed Mahmud"
                fill
                className="object-cover rounded-[10px]"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#1a1a1a] tracking-tight transition-colors duration-300 group-hover:text-[#ff5f1a]">
                Zabed Mahmud
              </span>
              <span className="text-[10px] font-mono text-black/40 uppercase tracking-wider -mt-0.5">
                Full Stack Developer
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden rounded-full border border-black/8 bg-white/80 p-1.5 shadow-sm backdrop-blur-md md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActive(item.href)}
                className="relative px-4 py-1.5 text-xs font-semibold text-black/60 transition hover:text-[#1a1a1a]"
              >
                {active === item.href && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 rounded-full bg-black/5 border border-black/5"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          {(session?.user || isAdminLocal) && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/admin"
                title="Go to Admin Dashboard"
                className="rounded-full border border-black/10 bg-white p-2.5 text-[#ff5f1a] hover:bg-[#ff5f1a]/10 transition shadow-sm"
              >
                <HiOutlineShieldCheck className="text-lg" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {(session?.user || isAdminLocal) && (
              <Link
                href="/admin"
                title="Go to Admin Dashboard"
                className="rounded-full border border-black/10 bg-white p-2.5 text-[#ff5f1a] transition shadow-sm"
              >
                <HiOutlineShieldCheck className="text-lg" />
              </Link>
            )}
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button className="rounded-full border border-black/10 bg-white p-2.5 text-[#1a1a1a] shadow-sm">
                  <HiOutlineMenuAlt4 className="text-xl" />
                </button>
              </Dialog.Trigger>

              <AnimatePresence>
                {open && (
                  <Dialog.Portal forceMount>
                    <Dialog.Overlay asChild>
                      <motion.div
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    </Dialog.Overlay>

                    <Dialog.Content asChild>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-x-4 top-4 z-[60] rounded-3xl border border-black/10 bg-white p-6 shadow-2xl"
                      >
                        <div className="flex items-center justify-between pb-4 border-b border-black/5">
                          <div className="text-sm font-bold uppercase tracking-wider text-[#1a1a1a]">
                            Zabed Mahmud
                          </div>
                          <Dialog.Close asChild>
                            <button className="rounded-full border border-black/10 bg-black/5 p-2 text-[#1a1a1a]">
                              <HiOutlineX className="text-lg" />
                            </button>
                          </Dialog.Close>
                        </div>

                        <div className="flex flex-col py-6 gap-4">
                          {navItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setActive(item.href);
                                setOpen(false);
                              }}
                              className="text-xl font-bold tracking-tight text-[#1a1a1a] hover:text-[#ff5f1a] transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
          </div>

        </div>
      </div>
    </motion.header>
  );
}
