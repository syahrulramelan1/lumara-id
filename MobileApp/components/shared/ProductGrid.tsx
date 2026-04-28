"use client";
import { ProductCard } from "@/components/product/ProductCard";
import { SkeletonGrid } from "@/components/motion/SkeletonCard";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import type { ProductWithCategory } from "@/types";

interface ProductGridProps {
  products: ProductWithCategory[];
  cols?: 2 | 3 | 4;
  priority?: number;
  isLoading?: boolean;
  skeletonCount?: number;
}

export function ProductGrid({
  products,
  cols = 2,
  priority = 0,
  isLoading = false,
  skeletonCount = 6,
}: ProductGridProps) {
  const { language } = useUIStore();
  const t = getT(language);

  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  }[cols];

  if (isLoading) {
    return <SkeletonGrid cols={cols} count={skeletonCount} />;
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-4xl mb-3">🧕</p>
        <p className="font-medium">{t.product.not_found}</p>
        <p className="text-sm mt-1">{t.product.not_found_sub}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-3 sm:gap-4`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < priority} index={i} />
      ))}
    </div>
  );
}
