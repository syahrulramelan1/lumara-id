"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { CategoryWithCount } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { FadeInView } from "@/components/motion/FadeInView";
import { EASE_OUT_EXPO } from "@/components/motion/variants";

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
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO, delay: i * 0.06 }}
          >
            <Link href={`/categories/${cat.slug}`} className="group flex flex-col items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-primary/5 border border-card-border group-hover:border-primary/40 transition-colors duration-200"
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-400"
                    sizes="(max-width: 640px) 30vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🧕</div>
                )}
              </motion.div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
                <p className="text-xs text-muted-foreground">
                  {cat._count.products} {t.sections.products_count}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
