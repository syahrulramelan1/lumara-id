"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Heart, Star, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { ProductImageZoom } from "@/components/product/ProductImageZoom";
import { ColorSwatch } from "@/components/product/ColorSwatch";
import type { ProductWithReviews } from "@/types";
import {
  type ColorVariant,
  parseColors,
  isColorAvailable,
} from "@/types/colorVariant";

// Fallback gambar saat product.images kosong atau image gagal load.
// File-nya ada di MobileApp/public/. Mau ganti? Upload file lain ke public/
// dan update path-nya di sini.
const PLACEHOLDER_IMAGE = "/placeholder.svg";

interface ProductDetailProps {
  product: ProductWithReviews;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const { dbUser } = useAuthStore();
  const { language } = useUIStore();
  const t = getT(language);

  const parseJsonArr = (val: unknown): string[] =>
    Array.isArray(val) ? (val as string[]) : (() => { try { return JSON.parse(val as string); } catch { return []; } })();
  const images: string[] = parseJsonArr(product.images);
  const sizes: string[] = parseJsonArr(product.sizes);

  // Colors → ColorVariant[] (support legacy string[] dan format object baru)
  const colors: ColorVariant[] = useMemo(() => parseColors(product.colors), [product.colors]);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");

  // Default selected color: varian pertama yang available (stock > 0 atau undefined).
  // Kalau semua habis, fallback ke yang pertama (untuk display, tapi disabled saat add to cart).
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(() => {
    const firstAvail = colors.find(isColorAvailable);
    return firstAvail ?? colors[0] ?? null;
  });

  const [qty, setQty] = useState(1);

  // ── Display images: kalau warna terpilih punya image khusus, taruh di slot
  // pertama agar saat user pilih warna, gambar utama langsung berubah ke gambar
  // varian itu. Sisanya tetap dari product.images. Fallback ke placeholder. ──
  const displayImages = useMemo(() => {
    const base = images.length > 0 ? images : [PLACEHOLDER_IMAGE];
    if (selectedColor?.image) {
      const variantImg = selectedColor.image;
      return [variantImg, ...base.filter((img) => img !== variantImg)];
    }
    return base;
  }, [selectedColor, images]);

  // Saat warna ganti & varian punya image, reset ke gambar pertama (= variant image).
  useEffect(() => {
    if (selectedColor?.image) setActiveImage(0);
  }, [selectedColor]);

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error(t.product.select_size_color);
      return;
    }
    if (!isColorAvailable(selectedColor)) {
      toast.error("Warna ini sedang habis stok");
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: displayImages[0] ?? "",
      size: selectedSize,
      color: selectedColor.name,
      quantity: qty,
    });
    toast.success(t.product.added_to_cart);
  };

  return (
    <div>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={16} /> {t.common.back}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images — pakai displayImages (variant image diprioritaskan) */}
        <div className="space-y-3">
          <ProductImageZoom
            images={displayImages}
            activeIndex={activeImage}
            productName={product.name}
            discount={discount}
            onIndexChange={setActiveImage}
          />
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {displayImages.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-20 rounded-[10px] overflow-hidden shrink-0 border-2 transition-colors bg-muted ${
                    i === activeImage ? "border-primary" : "border-transparent"
                  }`}
                  aria-label={`Lihat foto ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-contain transition-opacity"
                    sizes="64px"
                    onError={(e) => {
                      // Kalau image gagal load, pakai placeholder
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.endsWith(PLACEHOLDER_IMAGE)) target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
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
              <span className="text-sm text-muted-foreground">({product.reviewCount} {t.product.reviews})</span>
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
              <p className="text-sm font-semibold mb-2">{t.product.size}: <span className="font-normal text-muted-foreground">{selectedSize}</span></p>
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
              <p className="text-sm font-semibold mb-2">
                {t.product.color}:{" "}
                <span className="font-normal text-muted-foreground">
                  {selectedColor?.name ?? "—"}
                </span>
              </p>
              {/* Radio group — keyboard-friendly, screen-reader friendly */}
              <div
                role="radiogroup"
                aria-label="Pilih warna produk"
                className="flex flex-wrap gap-3 items-center"
              >
                {colors.map((color) => (
                  <ColorSwatch
                    key={color.name}
                    color={color}
                    active={selectedColor?.name === color.name}
                    onSelect={setSelectedColor}
                  />
                ))}
              </div>
              {/* Stock indicator: kalau varian punya stock tracking, tampilkan
                  jumlah di bawah swatch. Kalau habis, tampilkan teks merah. */}
              {selectedColor?.stock !== undefined && (
                <p className={`text-xs mt-2 ${selectedColor.stock === 0 ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                  {selectedColor.stock === 0
                    ? "Stok habis untuk warna ini"
                    : `Stok: ${selectedColor.stock}`}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">{t.product.qty}:</p>
            <div className="flex items-center border border-border rounded-[10px] overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 hover:bg-muted transition-colors font-bold"
                aria-label="Kurangi jumlah"
              >−</button>
              <span className="px-4 py-2 font-medium text-sm border-x border-border min-w-[48px] text-center">{qty}</span>
              <button
                // Cap qty: kalau varian punya stock tracking, pakai itu; kalau enggak, pakai product.stock.
                onClick={() => {
                  const cap = selectedColor?.stock ?? product.stock;
                  setQty(Math.min(cap, qty + 1));
                }}
                className="px-3 py-2 hover:bg-muted transition-colors font-bold"
                aria-label="Tambah jumlah"
              >+</button>
            </div>
            <span className="text-xs text-muted-foreground">{t.product.stock}: {product.stock}</span>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={handleAddToCart}
              disabled={selectedColor !== null && !isColorAvailable(selectedColor)}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              {t.product.add_to_cart}
            </motion.button>
            <motion.button
              onClick={() => {
                if (!dbUser) { router.push(`/login?redirect=/products/${product.slug}`); return; }
                toggle(product.id);
              }}
              whileTap={{ scale: 0.8 }}
              animate={wishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-3.5 rounded-[12px] border-2 transition-colors ${
                wishlisted ? "border-red-500 bg-red-50 text-red-500 dark:bg-red-950" : "border-border hover:border-primary"
              }`}
              title={!dbUser ? "Masuk untuk menyimpan ke wishlist" : undefined}
            >
              <Heart size={20} className={wishlisted ? "fill-red-500" : ""} />
            </motion.button>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold mb-2">{t.product.description}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">{t.product.reviews_section} ({product.reviewCount})</h2>
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
