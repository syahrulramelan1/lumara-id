import Link from "next/link";
import { ProductGrid } from "@/components/shared/ProductGrid";
import type { ProductWithCategory } from "@/types";

interface NewArrivalsSectionProps {
  products: ProductWithCategory[];
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-2">
            ✨ Baru Masuk
          </div>
          <h2 className="text-2xl font-bold text-foreground">Koleksi Terbaru</h2>
        </div>
        <Link href="/products?new=true" className="text-sm font-medium text-primary hover:underline">
          Lihat semua
        </Link>
      </div>
      <ProductGrid products={products} cols={4} />
    </section>
  );
}
