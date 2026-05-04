"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowUpRight, Sun, Moon, Sparkles, ChevronUp } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { SiShopee } from "react-icons/si";
import { SOCIAL_CHANNELS, withUtm } from "@/lib/social";

export function SplashLinkTree() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  useEffect(() => setMounted(true), []);

  // Prefetch /home agar transisi instan saat curtain naik
  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

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

  // ── Cinematic transition ke /home — transparent blur, langsung masuk ──
  const triggerExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => router.push("/home"), 450);
  };

  // Threshold swipe: offset 80px ATAU velocity > 400px/s ke atas
  const handleSwipeEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -80 || info.velocity.y < -400) {
      triggerExit();
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0F0A1E]">

      {/* ── Blobs: 3 saja, blur-2xl (40px) bukan 3xl (96px), promote ke layer GPU ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          style={{ willChange: "transform" }}
          className="absolute -top-32 -left-24 w-[380px] h-[380px] rounded-full blur-2xl
                     bg-violet-200/40 dark:bg-primary/20"
          animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ willChange: "transform" }}
          className="absolute top-1/4 -right-24 w-[340px] h-[340px] rounded-full blur-2xl
                     bg-pink-200/40 dark:bg-pink-600/15"
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          style={{ willChange: "transform" }}
          className="absolute -bottom-24 left-1/4 w-[360px] h-[360px] rounded-full blur-2xl
                     bg-amber-100/50 dark:bg-amber-500/10"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
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
                   bg-white/90 dark:bg-zinc-900/90
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

      {/* ── Konten: scrollable, centered. Exit anim: slide-up + fade ── */}
      <motion.div
        animate={isExiting ? { y: -60, opacity: 0, filter: "blur(2px)" } : {}}
        transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-20 ${
          isExiting ? "pointer-events-none" : ""
        }`}
      >
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

            {/* Logo wordmark — frame statis (no infinite filter), shadow violet halus */}
            <div className="flex justify-center mb-4">
              {/* solid bg + ring inset (no backdrop-blur — terlalu mahal di mobile) */}
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/85 ring-1 ring-inset ring-black/[0.07] dark:ring-white/[0.07] shadow-[0_8px_24px_-8px_rgba(124,58,237,0.28)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={isDark ? "/api/logo/white" : "/api/logo/dark"}
                  alt="Lumara.id"
                  width={200}
                  height={48}
                  loading="eager"
                  decoding="async"
                  className="h-12 w-auto block"
                  style={{ maxWidth: 200 }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector(".logo-fallback")) {
                      const fallback = document.createElement("span");
                      fallback.className = "logo-fallback text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600";
                      fallback.textContent = "Lumara.id";
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
            </div>

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
                           bg-gradient-to-br from-white via-white to-violet-50/40
                           dark:from-zinc-900/60 dark:via-zinc-900/60 dark:to-violet-950/20
                           ring-1 ring-inset ring-black/[0.05] dark:ring-white/[0.05]
                           shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]
                           hover:shadow-[0_8px_30px_-8px_rgba(124,58,237,0.25)]
                           hover:ring-violet-200 dark:hover:ring-violet-700/50
                           transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out bg-gradient-to-r from-transparent via-violet-100/40 dark:via-white/5 to-transparent pointer-events-none" />

                <div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 transition-transform duration-300 group-hover:scale-105 ring-1 ring-inset ring-white/20"
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
              <button
                onClick={triggerExit}
                type="button"
                className="relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-left
                           bg-gradient-to-br from-white via-white to-violet-50/40
                           dark:from-zinc-900/60 dark:via-zinc-900/60 dark:to-violet-950/20
                           ring-1 ring-inset ring-black/[0.05] dark:ring-white/[0.05]
                           shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)]
                           hover:shadow-[0_8px_30px_-8px_rgba(124,58,237,0.25)]
                           hover:ring-violet-200 dark:hover:ring-violet-700/50
                           transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-in-out bg-gradient-to-r from-transparent via-violet-100/40 dark:via-white/5 to-transparent pointer-events-none" />

                {/* Mawar icon — sama untuk light & dark theme */}
                <div className="relative w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105 ring-1 ring-inset ring-black/[0.07] bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/api/logo/icon"
                    alt="Lumara.id"
                    width={44}
                    height={44}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
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
              </button>
            </motion.div>
          </div>

          {/* ── Swipe-up handle: drag ke atas → cinematic transition ke /home ── */}
          <motion.div
            drag="y"
            dragConstraints={{ top: -120, bottom: 0 }}
            dragElastic={{ top: 0.4, bottom: 0 }}
            onDragEnd={handleSwipeEnd}
            onClick={triggerExit}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + (channels.length + 1) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{ touchAction: "none" }}
            className="mt-8 mx-auto cursor-pointer flex flex-col items-center gap-2 select-none"
            aria-label="Geser ke atas untuk masuk toko"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_8px_24px_-6px_rgba(124,58,237,0.5)] ring-1 ring-inset ring-white/20"
            >
              <ChevronUp size={20} className="text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium tracking-wide">
              Geser ke atas untuk belanja
            </span>
          </motion.div>

          {/* Footer kecil */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-8"
          >
            © {new Date().getFullYear()} Lumara.id — Modest Fashion Indonesia
          </motion.p>
        </div>
      </motion.div>

      {/* ── Transition overlay: transparent backdrop-blur, no color ── */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-[200] backdrop-blur-md bg-white/25 dark:bg-zinc-950/40 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
