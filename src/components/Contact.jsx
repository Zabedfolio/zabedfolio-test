'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import emailjs from "emailjs-com";

const contactCards = [
  {
    label: "Email",
    value: "zabedfolio@gmail.com",
    icon: FaEnvelope,
    href: "mailto:zabedfolio@gmail.com"
  },
  {
    label: "Phone",
    value: "+880 1979 333880",
    icon: FaPhoneAlt,
    href: "tel:+8801979333880"
  },
  {
    label: "WhatsApp",
    value: "+880 1979 333880",
    icon: FaWhatsapp,
    href: "https://wa.me/8801979333880"
  }
];

const initialState = {
  name: "",
  email: "",
  phone: "",
  message: ""
};

export default function Contact() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const templateParams = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    };

    try {
      await emailjs.send(
        "service_t1jbkqn",
        "template_xhala38",
        templateParams,
        "aPfInZVkZDN3gQXkT"
      );

      toast.success("Message sent successfully!");
      setForm(initialState);
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact" className="section-shell py-12 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-5 items-start">
        {/* Left Column: Heading & Info Cards */}
        <div className="space-y-8 lg:col-span-2">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for Freelance & Full-time Roles
            </span>

            <h1 className="text-[clamp(2.2rem,4.5vw,3.8rem)] font-extrabold leading-[1.08] tracking-tight text-[#1a1a1a] flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span>Let's build</span>
              <span className="inline-flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-[#1a1a1a] text-white shadow-lg shadow-black/10 transition-transform hover:scale-110 duration-300 shrink-0">
                <HiOutlineChatAlt2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#ff5f1a]" />
              </span>
              <span>something remarkable together.</span>
            </h1>

            <p className="text-base leading-relaxed text-black/60 font-normal">
              Whether you need a web application, portfolio, or custom digital product, I'm excited to collaborate and turn your vision into reality.
            </p>
          </div>

          <div className="space-y-3">
            {contactCards.map(({ label, value, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-4 shadow-sm transition hover:border-[#ff5f1a]/30 hover:shadow-md cursor-pointer group">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff5f1a]/10 text-[#ff5f1a] transition-transform group-hover:scale-110">
                    <Icon className="text-lg" />
                  </div>

                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-black/40 font-bold">
                      {label}
                    </div>
                    <div className="mt-0.5 text-sm font-semibold text-[#1a1a1a] group-hover:text-[#ff5f1a] transition-colors">
                      {value}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-black/8 bg-white p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-[#1a1a1a]">
              Send Me A Message
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/60">Your Name</span>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3.5 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </label>

              <label className="space-y-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/60">Email Address</span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3.5 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </label>

              <label className="space-y-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/60">Phone Number</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+880 1979 333880"
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3.5 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/60">Project Details / Message</span>
                <textarea
                  required
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, timeline, and requirements..."
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3.5 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-full bg-[#ff5f1a] hover:bg-[#e04d0d] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#ff5f1a]/20 disabled:cursor-not-allowed disabled:opacity-70 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>

      <ToastContainer position="bottom-right" theme="light" toastClassName="toast-theme" />
    </div>
  );
}
