"use client";
import Link from "next/link";
import Image from "next/image";
import type { CategoryWithCount } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

interface CategorySectionProps {
  categories: CategoryWithCount[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  const language = useUIStore((s) => s.language);
  const t = getT(language);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t.sections.categories_title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t.sections.categories_subtitle}</p>
        </div>
        <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
          {t.sections.view_all}
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group flex flex-col items-center gap-2"
          >
            <div className="relative w-full aspect-square rounded-[14px] overflow-hidden bg-primary/5 border border-card-border group-hover:border-primary/30 transition-colors">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 30vw, 20vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">🧕</div>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
              <p className="text-xs text-muted-foreground">
                {cat._count.products} {t.sections.products_count}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
