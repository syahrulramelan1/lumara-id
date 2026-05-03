"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowUpRight, Sun, Moon, Sparkles } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { SiShopee } from "react-icons/si";
import { SOCIAL_CHANNELS, withUtm } from "@/lib/social";

export function SplashLinkTree() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const channels = SOCIAL_CHANNELS.map((c) => ({
    ...c,
    url: c.id === "whatsapp" ? c.url : withUtm(c.url),
  }));

  const iconFor = (id: string, size = 22) => {
    switch (id) {
      case "whatsapp":  return <FaWhatsapp  size={size} />;
      case "instagram": return <FaInstagram size={size} />;
      case "tiktok":    return <FaTiktok    size={size} />;
      case "shopee":    return <SiShopee    size={size} />;
      default:          return null;
    }
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0F0A1E]">

      {/* ── Blobs: fixed layer, overflow-hidden agar tidak meluber ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          className="absolute -top-40 -left-32 w-[500px] h-[500px] rounded-full blur-3xl
                     bg-violet-200/40 dark:bg-primary/20"
          animate={{ x: [0, 60, 0], y: [0, 50, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 -right-32 w-[420px] h-[420px] rounded-full blur-3xl
                     bg-pink-200/40 dark:bg-pink-600/15"
          animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/3 w-[480px] h-[480px] rounded-full blur-3xl
                     bg-amber-100/50 dark:bg-amber-500/10"
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-3xl
                     bg-sky-100/40 dark:bg-sky-600/10"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ── Theme toggle — fixed agar tetap terlihat saat scroll ── */}
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        suppressHydrationWarning
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        aria-label={isDark ? "Mode terang" : "Mode gelap"}
        style={{ touchAction: "manipulation" }}
        className="fixed top-5 right-5 sm:top-7 sm:right-7 z-30 p-3 rounded-full
                   bg-white/70 dark:bg-white/5 backdrop-blur-xl
                   border border-violet-100/80 dark:border-white/10
                   shadow-[0_4px_20px_-8px_rgba(124,58,237,0.15)]
                   hover:shadow-[0_8px_30px_-8px_rgba(124,58,237,0.25)] transition-shadow"
      >
        {!mounted ? (
          <div className="w-[18px] h-[18px]" />
        ) : isDark ? (
          <Sun size={18} className="text-amber-400" />
        ) : (
          <Moon size={18} className="text-violet-600" />
        )}
      </motion.button>

      {/* ── Konten: scrollable, centered ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-20">
        <div className="w-full max-w-md">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center mb-10"
          >
            {/* Sparkles tagline pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                         bg-violet-50 dark:bg-violet-950/40
                         border border-violet-100 dark:border-violet-900/50
                         text-xs text-violet-700 dark:text-violet-300 font-medium mb-6"
            >
              <Sparkles size={12} />
              Modest Fashion Premium
            </motion.div>

            {/* Logo wordmark — pakai <img> biasa, lebih reliabel untuk static files */}
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 6px 20px rgba(124,58,237,0.18))",
                  "drop-shadow(0 12px 36px rgba(124,58,237,0.44))",
                  "drop-shadow(0 6px 20px rgba(124,58,237,0.18))",
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex justify-center mb-4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isDark ? "/logo-white.jpeg" : "/logo-dark.jpeg"}
                alt="Lumara.id"
                className="h-14 w-auto object-contain"
                style={{ maxWidth: 220 }}
              />
            </motion.div>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Pilih channel paling nyaman buat kamu
            </p>
          </motion.div>

          {/* Channel buttons */}
          <div className="space-y-2.5">
            {channels.map((c, i) => (
              <motion.a
                key={c.id}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -2 }}
                // pan-y: izinkan scroll vertikal, jangan block touch event
                style={{ touchAction: "pan-y" }}
                className="relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl
                           bg-white dark:bg-zinc-900/60
                           border border-zinc-100 dark:border-zinc-800
                           shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]
                           hover:shadow-[0_8px_30px_-8px_rgba(124,58,237,0.25)]
                           hover:border-violet-200 dark:hover:border-violet-700/50
                           transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out bg-gradient-to-r from-transparent via-violet-100/40 dark:via-white/5 to-transparent pointer-events-none" />

                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundColor: c.brandHex }}
                >
                  {iconFor(c.id)}
                </div>
                <div className="relative flex-1 min-w-0 text-left">
                  <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-100">{c.label}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{c.handle}</p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="relative text-zinc-300 dark:text-zinc-600 group-hover:text-violet-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </motion.a>
            ))}

            {/* Tombol ke-5: Web */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + channels.length * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -2 }}
              style={{ touchAction: "pan-y" }}
            >
              <Link
                href="/home"
                className="relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl
                           bg-white dark:bg-zinc-900/60
                           border border-zinc-100 dark:border-zinc-800
                           shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]
                           hover:shadow-[0_8px_30px_-8px_rgba(124,58,237,0.25)]
                           hover:border-violet-200 dark:hover:border-violet-700/50
                           transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out bg-gradient-to-r from-transparent via-violet-100/40 dark:via-white/5 to-transparent pointer-events-none" />

                <div className="relative w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/mawar-icon.jpeg"
                    alt="Lumara.id"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative flex-1 min-w-0 text-left">
                  <p className="font-semibold text-[15px] text-zinc-900 dark:text-zinc-100">Lihat Koleksi Web</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">lumara-id.onrender.com</p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="relative text-zinc-300 dark:text-zinc-600 group-hover:text-violet-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </Link>
            </motion.div>
          </div>

          {/* Footer kecil */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-10"
          >
            © {new Date().getFullYear()} Lumara.id — Modest Fashion Indonesia
          </motion.p>
        </div>
      </div>
    </div>
  );
}
