"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductGrid } from "@/components/shared/ProductGrid";
import type { ProductWithCategory } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { FadeInView } from "@/components/motion/FadeInView";

interface NewArrivalsSectionProps {
  products: ProductWithCategory[];
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const language = useUIStore((s) => s.language);
  const t = getT(language);

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-12 overflow-hidden">
      {/* Background blob dekoratif */}
      <motion.div
        animate={{ x: [-8, 8, -8], scale: [1, 1.06, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 -right-10 w-60 h-60 bg-secondary/7 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <FadeInView className="flex items-center justify-between mb-6">
        <div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2"
          >
            ✨ {t.sections.new_badge}
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground">{t.sections.new_title}</h2>
        </div>
        <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <Link href="/products?new=true" className="text-sm font-medium text-primary hover:underline">
            {t.sections.view_all}
          </Link>
        </motion.div>
      </FadeInView>

      <ProductGrid products={products} cols={4} />
    </section>
  );
}
