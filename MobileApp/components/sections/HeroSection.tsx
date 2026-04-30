"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { EASE_OUT_EXPO } from "@/components/motion/variants";

const STAGGER_DELAY = 0.1;

export function HeroSection() {
  const language = useUIStore((s) => s.language);
  const t = getT(language);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F9F9FF] via-[#EDE9FE] to-[#F0E6FF] dark:from-[#0F0A1E] dark:via-[#1a0f2e] dark:to-[#0F0A1E] min-h-[480px] flex items-center">
      {/* Floating blobs */}
      <motion.div
        animate={{ y: [-12, 12, -12], scale: [1, 1.06, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [10, -10, 10], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [-8, 8, -8], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-1/2 right-1/4 w-32 h-32 bg-primary/8 rounded-full blur-2xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 text-primary shadow-sm backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <Sparkles size={13} className="opacity-80" />
            {t.hero.badge}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT_EXPO, delay: STAGGER_DELAY }}
            className="text-4xl md:text-6xl font-extrabold leading-tight text-foreground mb-4"
          >
            {t.hero.title_1}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t.hero.title_2}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: STAGGER_DELAY * 2 }}
            className="text-lg text-muted-foreground mb-8 max-w-lg"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: STAGGER_DELAY * 3 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors hover:gap-3 w-full sm:w-auto"
              >
                {t.hero.shop_now}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-primary text-primary font-semibold rounded-[12px] hover:bg-primary/5 transition-colors w-full sm:w-auto"
              >
                {t.hero.view_collection}
              </Link>
            </motion.div>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT_EXPO, delay: STAGGER_DELAY * 4 }}
          >
            <SearchBar className="max-w-md" placeholder={t.hero.search_placeholder} />
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: STAGGER_DELAY * 5 }}
            className="flex items-center gap-4 mt-6 text-sm text-muted-foreground flex-wrap"
          >
            <span className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full text-xs font-medium">🚚 {t.hero.badge_shipping}</span>
            <span className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full text-xs font-medium">💎 {t.hero.badge_premium}</span>
            <span className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full text-xs font-medium">🔄 {t.hero.badge_return}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
