"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowRight, Sun, Moon } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { SiShopee } from "react-icons/si";
import { SOCIAL_CHANNELS, withUtm } from "@/lib/social";

/**
 * Splash linktree — 5 tombol equal:
 *   - WA (livechat), Instagram, TikTok, Shopee, Web
 * Visual ukuran semua sama (full-width pill button), tidak ada hierarchy
 * "skip ke web". Tombol Web jadi pilihan ke-5 setara dengan 4 channel lain.
 *
 * Animasi:
 *   - Floating gradient blobs di background (slow infinite movement)
 *   - Logo glow pulse (scale + shadow loop)
 *   - Animated gradient text untuk brand name
 *   - Stagger entrance untuk semua channel cards
 *   - Theme toggle (sync dengan seluruh website via next-themes)
 *
 * Dipakai di:
 *   - `/`        → root path, halaman pertama yang dilihat visitor
 *   - `/links`   → URL khusus untuk pasang di bio IG/TikTok (linktree alias)
 *
 * Link Shopee/IG/TikTok auto-append `?utm_source=lumara_splash` supaya
 * bisa dilacak di Shopee Seller Insight & GA4.
 */
export function SplashLinkTree() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Cegah hydration mismatch — theme baru tau setelah mount.
  useEffect(() => setMounted(true), []);

  const channels = SOCIAL_CHANNELS.map((c) => ({
    ...c,
    // Append UTM cuma ke URL marketplace & sosmed (yang bukan wa.me)
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10 flex items-center justify-center px-4 py-10 sm:py-16">

      {/* ── Animated background blobs ─────────────────────────────────
          3 lingkaran blur besar yang bergerak slow infinite — bikin
          background "hidup" tanpa mengganggu readability. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-primary/30 dark:bg-primary/20 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 w-[460px] h-[460px] rounded-full bg-secondary/30 dark:bg-secondary/20 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -60, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-pink-400/20 dark:bg-pink-600/15 blur-3xl"
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Theme toggle — kanan-atas, fixed pada viewport splash ──── */}
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        suppressHydrationWarning
        aria-label={isDark ? "Switch ke light mode" : "Switch ke dark mode"}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-2.5 rounded-full bg-card/80 backdrop-blur-md border border-card-border hover:border-primary/40 hover:scale-110 active:scale-95 transition-all shadow-card"
      >
        {!mounted ? (
          // Placeholder saat SSR — match dimensi tombol
          <div className="w-[18px] h-[18px]" />
        ) : isDark ? (
          <Sun size={18} className="text-yellow-400" />
        ) : (
          <Moon size={18} className="text-primary" />
        )}
      </button>

      {/* ── Konten utama ─────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md">

        {/* Header / branding dengan logo glow pulse */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            // Glow pulse: logo subtle scale + shadow yang mengembang
            animate={{
              boxShadow: [
                "0 10px 30px -10px rgba(124, 58, 237, 0.5)",
                "0 20px 50px -10px rgba(124, 58, 237, 0.8)",
                "0 10px 30px -10px rgba(124, 58, 237, 0.5)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold mb-4"
          >
            L
          </motion.div>

          {/* Brand name — gradient yang "shifting" pelan */}
          <motion.h1
            className="text-3xl font-bold bg-clip-text text-transparent bg-[length:200%_auto] bg-gradient-to-r from-primary via-secondary to-primary mb-2"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            Lumara.id
          </motion.h1>

          <p className="text-sm text-muted-foreground">Modest Fashion Premium Indonesia</p>
          <p className="text-xs text-muted-foreground mt-1">Pilih cara paling nyaman buat kamu 🙌</p>
        </motion.div>

        {/* Channel buttons — semua equal weight, full-width */}
        <div className="space-y-3">
          {channels.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07, ease: "easeOut" }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl bg-card/90 backdrop-blur-sm border border-card-border hover:border-primary/50 hover:shadow-violet-sm transition-colors group overflow-hidden"
            >
              {/* Shimmer effect — gradient line yang lewat saat hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none" />

              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3"
                style={{ backgroundColor: c.brandHex }}
              >
                {iconFor(c.id)}
              </div>
              <div className="relative flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm text-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground truncate">{c.handle}</p>
              </div>
              <ArrowRight size={16} className="relative text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </motion.a>
          ))}

          {/* Tombol ke-5: Web — equal weight, NOT a "skip" button. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + channels.length * 0.07, ease: "easeOut" }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ y: -3, scale: 1.01 }}
          >
            <Link
              href="/home"
              className="relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl bg-card/90 backdrop-blur-sm border border-card-border hover:border-primary/50 hover:shadow-violet-sm transition-colors group overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none" />

              <div className="relative w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br from-primary to-secondary transition-transform group-hover:scale-110 group-hover:rotate-3">
                <span className="text-lg font-bold">L</span>
              </div>
              <div className="relative flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm text-foreground">Lihat Koleksi Web</p>
                <p className="text-xs text-muted-foreground truncate">lumara-id.onrender.com</p>
              </div>
              <ArrowRight size={16} className="relative text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          </motion.div>
        </div>

        {/* Footer kecil */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          © {new Date().getFullYear()} Lumara.id
        </motion.p>
      </div>
    </div>
  );
}
