"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import type { CategoryWithCount } from "@/types";
import { FadeInView } from "@/components/motion/FadeInView";
import { EASE_OUT_EXPO } from "@/components/motion/variants";

function CategoryCard({ cat, delay, productsLabel }: { cat: CategoryWithCount; delay: number; productsLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.95 }}
      transition={{ duration: 0.45, ease: EASE_OUT_EXPO, delay }}
    >
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
      >
        <Link
          href={`/categories/${cat.slug}`}
          className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors block"
        >
          <div className="relative aspect-square bg-muted">
            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, 20vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">🧕</div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{cat.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {cat._count.products} {productsLabel}
            </p>
            {cat.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
            )}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function CategoriesClientPage({ categories }: { categories: CategoryWithCount[] }) {
  const { language } = useUIStore();
  const t = getT(language);

  return (
    <>
      <FadeInView>
        <h1 className="text-2xl font-bold mb-2">{t.pages.categories.title}</h1>
        <p className="text-muted-foreground text-sm mb-8">{t.pages.categories.subtitle}</p>
      </FadeInView>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            delay={Math.min(i * 0.06, 0.35)}
            productsLabel={t.sections.products_count}
          />
        ))}
      </div>
    </>
  );
}
