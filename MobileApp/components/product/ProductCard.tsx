"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlistStore();
  const images: string[] = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
  const coverImage = images[0] ?? "/placeholder.png";
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-card rounded-[14px] overflow-hidden border border-card-border shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={coverImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
          {discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.isNew && !discount && (
            <span className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggle(product.id)}
        className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
      >
        <Heart
          size={16}
          className={wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}
        />
      </button>

      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-0.5">{product.category.name}</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="font-bold text-sm text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-muted-foreground">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
      </div>
    </motion.div>
  );
}
