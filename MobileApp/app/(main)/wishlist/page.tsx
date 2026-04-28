"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useEffect, useState } from "react";
import type { ProductWithCategory } from "@/types";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { ProductGridSkeleton } from "@/components/shared/LoadingSpinner";

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productIds.length) { setLoading(false); return; }

    const fetchWishlistProducts = async () => {
      try {
        const fetches = productIds.map((id) =>
          fetch(`/api/products/${id}`).then((r) => r.json()).then((d) => d.data)
        );
        const results = await Promise.all(fetches);
        setProducts(results.filter(Boolean));
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [productIds]);

  if (!productIds.length) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <Heart size={64} className="mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Wishlist Kosong</h1>
        <p className="text-muted-foreground mb-6">Simpan produk favoritmu di sini</p>
        <Link href="/products" className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-[12px]">
          Lihat Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Wishlist ({productIds.length})</h1>
      {loading ? <ProductGridSkeleton count={4} /> : <ProductGrid products={products} cols={4} />}
    </div>
  );
}
