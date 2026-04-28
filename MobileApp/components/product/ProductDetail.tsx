"use client";
import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Heart, Star, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { ProductWithReviews } from "@/types";

interface ProductDetailProps {
  product: ProductWithReviews;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();

  const parseJsonArr = (val: unknown): string[] =>
    Array.isArray(val) ? (val as string[]) : (() => { try { return JSON.parse(val as string); } catch { return []; } })();
  const images: string[] = parseJsonArr(product.images);
  const sizes: string[] = parseJsonArr(product.sizes);
  const colors: string[] = parseJsonArr(product.colors);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [qty, setQty] = useState(1);

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Pilih ukuran dan warna terlebih dahulu");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] ?? "",
      size: selectedSize,
      color: selectedColor,
      quantity: qty,
    });
    toast.success("Ditambahkan ke keranjang!");
  };

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> Kembali
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
            {images[activeImage] && (
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            {discount && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-20 rounded-[10px] overflow-hidden shrink-0 border-2 transition-colors ${
                    i === activeImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-sm text-primary font-medium mb-1">{product.category.name}</p>
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"} />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} ulasan)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {sizes.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Ukuran: <span className="font-normal text-muted-foreground">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-[10px] text-sm font-medium border-2 transition-colors ${
                      selectedSize === size ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2">Warna: <span className="font-normal text-muted-foreground">{selectedColor}</span></p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-[999px] text-xs font-medium border-2 transition-colors ${
                      selectedColor === color ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">Jumlah:</p>
            <div className="flex items-center border border-border rounded-[10px] overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 hover:bg-muted transition-colors font-bold"
              >−</button>
              <span className="px-4 py-2 font-medium text-sm border-x border-border min-w-[48px] text-center">{qty}</span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="px-3 py-2 hover:bg-muted transition-colors font-bold"
              >+</button>
            </div>
            <span className="text-xs text-muted-foreground">Stok: {product.stock}</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors active:scale-95"
            >
              <ShoppingBag size={18} />
              Tambah ke Keranjang
            </button>
            <button
              onClick={() => toggle(product.id)}
              className={`p-3.5 rounded-[12px] border-2 transition-colors ${
                wishlisted ? "border-red-500 bg-red-50 text-red-500 dark:bg-red-950" : "border-border hover:border-primary"
              }`}
            >
              <Heart size={20} className={wishlisted ? "fill-red-500" : ""} />
            </button>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold mb-2">Deskripsi</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Ulasan ({product.reviewCount})</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="bg-card border border-card-border rounded-[14px] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                    {review.user.name?.charAt(0) ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.user.name}</p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={10} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
