"use client";
import Link from "next/link";
import { ProductGrid } from "@/components/shared/ProductGrid";
import type { ProductWithCategory } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

interface FeaturedSectionProps {
  products: ProductWithCategory[];
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  const language = useUIStore((s) => s.language);
  const t = getT(language);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-transparent to-primary/5 rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t.sections.featured_title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{t.sections.featured_subtitle}</p>
        </div>
        <Link href="/products?featured=true" className="text-sm font-medium text-primary hover:underline">
          {t.sections.view_all}
        </Link>
      </div>
      <ProductGrid products={products} cols={4} priority={4} />
    </section>
  );
}
