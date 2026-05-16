"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import type { CategoryWithCount } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { FadeInView } from "@/components/motion/FadeInView";

function CategoryCard({ cat, delay, productsLabel }: { cat: CategoryWithCount; delay: number; productsLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.88 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.88 }}
      transition={{ type: "spring", stiffness: 80, damping: 14, delay }}
    >
      <Link href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.08, y: -3 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="relative w-full aspect-[3/4] rounded-[14px] overflow-hidden bg-primary/5 border border-card-border group-hover:border-primary/40 transition-colors duration-200"
        >
          {cat.image ? (
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-400"
              sizes="(max-width: 640px) 30vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🧕</div>
          )}
        </motion.div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
          <p className="text-xs text-muted-foreground">
            {cat._count.products} {productsLabel}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

interface CategorySectionProps {
  categories: CategoryWithCount[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  const language = useUIStore((s) => s.language);
  const t = getT(language);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <FadeInView className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t.sections.categories_title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t.sections.categories_subtitle}</p>
        </div>
        <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
          {t.sections.view_all}
        </Link>
      </FadeInView>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {categories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            delay={i * 0.07}
            productsLabel={t.sections.products_count}
          />
        ))}
      </div>
    </section>
  );
}
