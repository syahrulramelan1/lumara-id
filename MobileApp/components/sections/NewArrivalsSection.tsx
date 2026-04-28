"use client";
import Link from "next/link";
import { ProductGrid } from "@/components/shared/ProductGrid";
import type { ProductWithCategory } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

interface NewArrivalsSectionProps {
  products: ProductWithCategory[];
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  const language = useUIStore((s) => s.language);
  const t = getT(language);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
            ✨ {t.sections.new_badge}
          </div>
          <h2 className="text-2xl font-bold text-foreground">{t.sections.new_title}</h2>
        </div>
        <Link href="/products?new=true" className="text-sm font-medium text-primary hover:underline">
          {t.sections.view_all}
        </Link>
      </div>
      <ProductGrid products={products} cols={4} />
    </section>
  );
}
