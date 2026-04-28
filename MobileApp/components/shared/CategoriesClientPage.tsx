"use client";
import Link from "next/link";
import Image from "next/image";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import type { CategoryWithCount } from "@/types";

export function CategoriesClientPage({ categories }: { categories: CategoryWithCount[] }) {
  const { language } = useUIStore();
  const t = getT(language);

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{t.pages.categories.title}</h1>
      <p className="text-muted-foreground text-sm mb-8">{t.pages.categories.subtitle}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
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
                {cat._count.products} {t.sections.products_count}
              </p>
              {cat.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cat.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
