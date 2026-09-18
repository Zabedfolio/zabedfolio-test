'use client';

import { motion } from "framer-motion";
import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fadeUp, staggerContainer } from "@/utils/motionVariants";
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

    toast.success("Message sent successfully!", {
      className: "toast-theme",
      bodyClassName: "text-sm",
    });

    setForm(initialState);
  } catch (error) {
    console.error("EmailJS Error:", error);
    toast.error("Failed to send message. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div id="contact" className="section-shell py-16 sm:py-24">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <motion.p variants={fadeUp} className="section-label">
            Get In Touch
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            Let&apos;s Build Something Memorable.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-base leading-7 text-black/60 font-normal">
            If you need a web application, portfolio, or a tailored software solution, I&apos;m ready to collaborate and bring your ideas to life.
          </motion.p>

          <motion.div variants={fadeUp} className="space-y-3">
            {contactCards.map(({ label, value, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-4 shadow-sm transition hover:border-[#ff5f1a]/30 hover:shadow-md cursor-pointer">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff5f1a]/10 text-[#ff5f1a]">
                    <Icon className="text-lg" />
                  </div>

                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-black/40 font-bold">
                      {label}
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-[#1a1a1a]">{value}</div>
                  </div>
                </div>
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="rounded-3xl border border-black/8 bg-white p-6 sm:p-8 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 sm:col-span-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/40">Name</span>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-black/10 bg-[#f9f9f9] px-4 py-3 text-sm text-[#1a1a1a] transition focus:bg-white focus:border-[#ff5f1a] focus:outline-none"
                />
              </label>
              <label className="space-y-1.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/40">Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full rounded-xl border border-black/10 bg-[#f9f9f9] px-4 py-3 text-sm text-[#1a1a1a] transition focus:bg-white focus:border-[#ff5f1a] focus:outline-none"
                />
              </label>
              <label className="space-y-1.5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/40">Phone</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+880 1979 333880"
                  className="w-full rounded-xl border border-black/10 bg-[#f9f9f9] px-4 py-3 text-sm text-[#1a1a1a] transition focus:bg-white focus:border-[#ff5f1a] focus:outline-none"
                />
              </label>
              <label className="space-y-1.5 sm:col-span-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-black/40">Message</span>
                <textarea
                  required
                  rows={5}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project or goal..."
                  className="w-full rounded-xl border border-black/10 bg-[#f9f9f9] px-4 py-3 text-sm text-[#1a1a1a] transition focus:bg-white focus:border-[#ff5f1a] focus:outline-none"
                />
              </label>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="mt-6 w-full sm:w-auto rounded-full bg-[#ff5f1a] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#ff5f1a]/20 disabled:cursor-not-allowed disabled:opacity-70 transition hover:opacity-90"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <ToastContainer position="bottom-right" theme="dark" toastClassName="toast-theme" />
    </div>
  );
}
