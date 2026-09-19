'use client';

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineShieldCheck,
  HiOutlineMenuAlt4,
  HiOutlineX,
} from "react-icons/hi";

const navItems = [
  { href: "/", label: "Home", icon: HiOutlineHome },
  { href: "/projects", label: "Projects", icon: HiOutlineFolder },
  { href: "/admin", label: "Admin", icon: HiOutlineShieldCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isAdminLocal, setIsAdminLocal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAdminLocal(localStorage.getItem("admin_logged_in") === "true");
    }
  }, [session]);

  return (
    <>
      {/* Desktop Vertical Sidebar Navigation Dock */}
      <aside className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-3 rounded-3xl border border-black/10 bg-white/80 p-2.5 shadow-xl shadow-black/5 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <div key={item.href} className="relative group">
              <Link
                href={item.href}
                className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-[#1a1a1a] text-white shadow-md shadow-black/10"
                    : "text-black/60 hover:bg-black/5 hover:text-[#1a1a1a]"
                }`}
              >
                <Icon className="text-xl" />
                {isActive && (
                  <motion.span
                    layoutId="sidebarActivePill"
                    className="absolute -right-1 h-2 w-2 rounded-full bg-[#ff5f1a]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>

              {/* Hover Tooltip */}
              <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 rounded-xl bg-[#1a1a1a] px-3 py-1.5 font-mono text-[11px] font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1 whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </aside>

      {/* Mobile Menu Trigger & Modal */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/90 text-[#1a1a1a] shadow-lg backdrop-blur-md">
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
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="fixed inset-x-4 top-4 z-[60] rounded-3xl border border-black/10 bg-white p-6 shadow-2xl"
                  >
                    <div className="flex items-center justify-between pb-4 border-b border-black/5">
                      <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#1a1a1a]">
                        Navigation
                      </div>
                      <Dialog.Close asChild>
                        <button className="rounded-full border border-black/10 bg-black/5 p-2 text-[#1a1a1a]">
                          <HiOutlineX className="text-lg" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="flex flex-col py-4 gap-2">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-base font-bold transition-all ${
                              isActive
                                ? "bg-[#1a1a1a] text-white"
                                : "text-black/70 hover:bg-black/5 hover:text-[#1a1a1a]"
                            }`}
                          >
                            <Icon className="text-xl" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </div>

      {/* Top Right Fixed 'Wanna talk?' CTA Button */}
      <div className="fixed top-5 right-5 sm:right-8 z-50">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-[#ff5f1a] hover:bg-[#e04d0d] px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-xl shadow-[#ff5f1a]/30 transition-all duration-300 hover:scale-105 active:scale-95 tracking-wide"
        >
          Wanna talk?
        </Link>
      </div>
    </>
  );
}
