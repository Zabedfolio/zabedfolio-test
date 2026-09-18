"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import avtr from "@/assets/avtr.png";
import {
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineCube,
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineExternalLink,
  HiOutlineCog,
  HiOutlineDocumentText,
  HiOutlineLibrary,
} from "react-icons/hi";

const sidebarItems = [
  { href: "/admin", label: "Overview", icon: HiOutlineChartBar },
  { href: "/admin/projects", label: "Projects", icon: HiOutlineBriefcase },
  { href: "/admin/skills", label: "Skills", icon: HiOutlineCog },
  { href: "/admin/case-studies", label: "Case Studies", icon: HiOutlineLibrary },
  { href: "/admin/education", label: "Education", icon: HiOutlineAcademicCap },
  { href: "/admin/experience", label: "Experience", icon: HiOutlineCube },
  { href: "/admin/process", label: "Process Steps", icon: HiOutlineCube },
  { href: "/admin/notes", label: "Notes", icon: HiOutlineCollection },
  { href: "/admin/resume", label: "Resume", icon: HiOutlineDocumentText },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("admin_sidebar_collapsed", String(nextState));
  };

  const handleSignOut = async () => {
    localStorage.removeItem("admin_logged_in");
    await signOut({
      callbackURL: "/admin/login",
    });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#eeeeee] text-[#1a1a1a] flex selection:bg-[#ff5f1a]/20">
      {/* Sidebar for Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-black/8 h-screen sticky top-0 flex-shrink-0 transition-all duration-300 z-30 shadow-sm ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-black/8">
          <Link href="/admin" className="flex items-center gap-3 group overflow-hidden">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-black/10 bg-white p-0.5 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff5f1a]/50 flex-shrink-0">
              <Image
                src={avtr}
                alt="Zabed Mahmud"
                fill
                className="object-cover rounded-[10px]"
                priority
              />
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <div className="text-xs font-bold tracking-tight text-[#1a1a1a]">Zabed Mahmud</div>
                <div className="text-[10px] font-mono tracking-wider text-[#ff5f1a] font-semibold uppercase">Admin Panel</div>
              </div>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-xl border border-black/10 bg-black/3 text-black/60 hover:text-[#1a1a1a] hover:bg-black/5 transition"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <span className="text-xs font-bold font-mono text-[#ff5f1a] px-0.5">»</span>
            ) : (
              <span className="text-xs font-bold font-mono text-black/40 px-0.5">«</span>
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-2xl text-xs font-semibold transition duration-200 ${
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                } ${
                  isActive
                    ? "bg-[#1a1a1a] text-white shadow-md shadow-black/10"
                    : "text-black/60 hover:text-[#1a1a1a] hover:bg-black/4 border border-transparent"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <Icon className="text-lg flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-black/8 space-y-2">
          <Link
            href="/"
            target="_blank"
            className={`flex items-center w-full text-black/60 hover:text-[#1a1a1a] rounded-2xl hover:bg-black/4 transition ${
              isCollapsed ? "justify-center p-3" : "justify-between px-4 py-3 text-xs font-semibold"
            }`}
            title={isCollapsed ? "View Portfolio" : ""}
          >
            <span className="flex items-center gap-2">
              <HiOutlineExternalLink className="text-base" /> 
              {!isCollapsed && <span>View Site</span>}
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className={`flex items-center w-full text-red-600 hover:bg-red-500/10 rounded-2xl border border-transparent transition duration-200 ${
              isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3 text-xs font-semibold"
            }`}
            title={isCollapsed ? "Sign Out" : ""}
          >
            <HiOutlineLogout className="text-base flex-shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-16 flex items-center justify-between px-6 bg-white/90 border-b border-black/8 backdrop-blur-xl sticky top-0 z-40">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 overflow-hidden rounded-xl border border-black/10 bg-white p-0.5 shadow-sm">
              <Image
                src={avtr}
                alt="Zabed Mahmud"
                fill
                className="object-cover rounded-[8px]"
                priority
              />
            </div>
            <span className="text-xs font-bold tracking-tight text-[#1a1a1a]">
              Zabed <span className="text-[#ff5f1a]">Admin</span>
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-black/70 hover:text-[#1a1a1a] hover:bg-black/5 rounded-xl transition"
          >
            {mobileOpen ? <HiOutlineX className="text-xl" /> : <HiOutlineMenu className="text-xl" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-white/98 backdrop-blur-2xl flex flex-col pt-20 px-6 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#1a1a1a] text-white shadow-md"
                        : "text-black/60 hover:text-[#1a1a1a] hover:bg-black/4"
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="py-6 border-t border-black/8 space-y-3">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 px-5 py-4 text-sm font-semibold text-black/60 hover:text-[#1a1a1a]"
              >
                <HiOutlineExternalLink className="text-xl" /> View Site
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-4 w-full px-5 py-4 text-sm font-semibold text-red-600 bg-red-500/8 rounded-2xl"
              >
                <HiOutlineLogout className="text-xl" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content Container */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
