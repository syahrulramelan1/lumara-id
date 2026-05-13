"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductGrid } from "@/components/shared/ProductGrid";
import type { ProductWithCategory } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { FadeInView } from "@/components/motion/FadeInView";

interface FeaturedSectionProps {
  products: ProductWithCategory[];
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  const language = useUIStore((s) => s.language);
  const t = getT(language);

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-12 overflow-hidden">
      {/* Blob dekoratif */}
      <motion.div
        animate={{ y: [-10, 10, -10], scale: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-16 -right-16 w-72 h-72 bg-primary/6 rounded-full blur-3xl pointer-events-none -z-10"
      />
      <motion.div
        animate={{ y: [8, -8, 8], scale: [1.03, 1, 1.03] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 -left-20 w-56 h-56 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <FadeInView className="flex items-center justify-between mb-6" y={50}>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t.sections.featured_title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t.sections.featured_subtitle}</p>
        </div>
        <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <Link href="/products?featured=true" className="text-sm font-medium text-primary hover:underline">
            {t.sections.view_all} →
          </Link>
        </motion.div>
      </FadeInView>

      <ProductGrid products={products} cols={4} priority={4} />
    </section>
  );
}
