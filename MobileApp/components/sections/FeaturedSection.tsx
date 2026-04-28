import Link from "next/link";
import { ProductGrid } from "@/components/shared/ProductGrid";
import type { ProductWithCategory } from "@/types";

interface FeaturedSectionProps {
  products: ProductWithCategory[];
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-transparent to-primary/5 rounded-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pilihan Terbaik</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Produk unggulan dengan rating tertinggi</p>
        </div>
        <Link href="/products?featured=true" className="text-sm font-medium text-primary hover:underline">
          Lihat semua
        </Link>
      </div>
      <ProductGrid products={products} cols={4} priority={4} />
    </section>
  );
}
