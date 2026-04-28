import { ProductCard } from "@/components/product/ProductCard";
import type { ProductWithCategory } from "@/types";

interface ProductGridProps {
  products: ProductWithCategory[];
  cols?: 2 | 3 | 4;
  priority?: number;
}

export function ProductGrid({ products, cols = 2, priority = 0 }: ProductGridProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  }[cols];

  if (!products.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-4xl mb-3">🧕</p>
        <p className="font-medium">Produk tidak ditemukan</p>
        <p className="text-sm mt-1">Coba kata kunci atau filter yang berbeda</p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-3 sm:gap-4`}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < priority} />
      ))}
    </div>
  );
}
