"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import avtr from "@/assets/avtr.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await signIn.email({
        email,
        password,
        callbackURL: "/admin",
      });

      if (response?.error) {
        setError(response.error.message || "Invalid email or password");
      } else {
        localStorage.setItem("admin_logged_in", "true");
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#eeeeee] px-4 selection:bg-[#ff5f1a]/20">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ff5f1a]/10 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-3xl border border-black/8 bg-white p-8 shadow-2xl shadow-black/5">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-black/10 bg-white p-0.5 shadow-sm transition-transform group-hover:scale-105">
              <Image
                src={avtr}
                alt="Zabed Mahmud"
                fill
                className="object-cover rounded-[10px]"
                priority
              />
            </div>
            <div className="text-left">
              <span className="text-sm font-bold text-[#1a1a1a] tracking-tight block">
                Zabed Mahmud
              </span>
              <span className="text-[10px] font-mono text-black/40 uppercase tracking-wider block">
                Admin Control
              </span>
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">Admin Portal</h2>
          <p className="mt-1 text-xs text-black/50 font-medium">Sign in to manage your portfolio content</p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/8 p-3.5 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-black/50 mb-1.5 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="zabedfolio@gmail.com"
              className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition duration-200 focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-black/50 mb-1.5 font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition duration-200 focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center rounded-2xl bg-[#1a1a1a] py-3.5 text-sm font-bold text-white transition duration-200 hover:bg-[#ff5f1a] shadow-md shadow-black/5 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
