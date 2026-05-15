"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
  priority?: boolean;
  index?: number;
}

export function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const { toggle, isWishlisted } = useWishlistStore();
  const images: string[] = Array.isArray(product.images)
    ? (product.images as string[])
    : (() => { try { return JSON.parse(product.images as string); } catch { return []; } })();
  const coverImage = images[0] ?? null;
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const delay = Math.min(index * 0.07, 0.42);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 80, damping: 14, delay }}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 400, damping: 22 } }}
      className="group relative bg-card rounded-card overflow-hidden border border-card-border shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-zinc-50 via-muted to-violet-50/40 dark:from-zinc-900 dark:via-zinc-800/60 dark:to-violet-950/20 ring-1 ring-inset ring-black/[0.07] dark:ring-white/[0.05]">
          {coverImage ? (
            <>
              <Image
                src={coverImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                priority={priority}
              />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.18)]" />
            </>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-2">
              <div
                className="absolute inset-0 opacity-[0.12] dark:opacity-[0.07]"
                style={{
                  backgroundImage: "radial-gradient(circle, #7C3AED 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />
              <div className="relative z-10 w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center ring-1 ring-violet-200/60 dark:ring-violet-700/30">
                <ImageOff size={20} className="text-violet-400 dark:text-violet-500" />
              </div>
              <span className="relative z-10 text-[10px] text-violet-400/70 dark:text-violet-600 font-medium tracking-wide">Belum ada foto</span>
            </div>
          )}

          {discount && (
            <motion.span
              initial={{ scale: 0, rotate: -15 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -15 }}
              transition={{ type: "spring", stiffness: 350, damping: 14, delay: delay + 0.15 }}
              className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full"
            >
              -{discount}%
            </motion.span>
          )}
          {product.isNew && !discount && (
            <motion.span
              initial={{ scale: 0, rotate: -15 }}
              animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -15 }}
              transition={{ type: "spring", stiffness: 350, damping: 14, delay: delay + 0.15 }}
              className="absolute top-2 left-2 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full"
            >
              New
            </motion.span>
          )}
        </div>
      </Link>

      <motion.button
        onClick={() => toggle(product.id)}
        whileTap={{ scale: 0.75 }}
        animate={wishlisted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute top-2 right-2 p-2 bg-white/85 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
      >
        <Heart
          size={16}
          className={wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}
        />
      </motion.button>

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
