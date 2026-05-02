"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { SiShopee } from "react-icons/si";
import { TokopediaIcon } from "@/components/icons/BrandIcons";
import { SOCIAL_CHANNELS, withUtm } from "@/lib/social";

/**
 * Splash linktree — 6 tombol equal:
 *   - WA (livechat), Instagram, TikTok, Shopee, Tokopedia, Web
 * Visual ukuran semua sama (full-width pill button), tidak ada hierarchy
 * "skip ke web". Tombol Web jadi pilihan ke-6 setara dengan 5 channel lain.
 *
 * Dipakai di:
 *   - `/`        → root path, halaman pertama yang dilihat visitor
 *   - `/links`   → URL khusus untuk pasang di bio IG/TikTok (linktree alias)
 *
 * Link Shopee + Tokopedia auto-append `?utm_source=lumara_splash` supaya
 * bisa dilacak di Shopee Insight / Tokpedia Statistik.
 */
export function SplashLinkTree() {
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
      case "tokopedia": return <TokopediaIcon size={size} />;
      default:          return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 dark:from-primary/10 dark:via-background dark:to-secondary/10 flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md">
        {/* Header / branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold mb-4 shadow-violet">
            L
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Lumara.id
          </h1>
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
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl bg-card border border-card-border hover:border-primary/40 hover:shadow-violet-sm transition-all group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: c.brandHex }}
              >
                {iconFor(c.id)}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm text-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground truncate">{c.handle}</p>
              </div>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </motion.a>
          ))}

          {/* Tombol ke-6: Web — equal weight, NOT a "skip" button.
              Visual & ukuran sama dengan 5 channel di atas. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + channels.length * 0.05 }}
          >
            <Link
              href="/home"
              className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl bg-card border border-card-border hover:border-primary/40 hover:shadow-violet-sm transition-all group"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br from-primary to-secondary">
                <span className="text-lg font-bold">L</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-sm text-foreground">Lihat Koleksi Web</p>
                <p className="text-xs text-muted-foreground truncate">lumara-id.onrender.com</p>
              </div>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          </motion.div>
        </div>

        {/* Footer kecil */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          © {new Date().getFullYear()} Lumara.id
        </motion.p>
      </div>
    </div>
  );
}
