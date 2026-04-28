"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export function Navbar() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.count());
  const wishCount = useWishlistStore((s) => s.count());

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Lumara
          </span>
          <span className="text-xs font-medium text-muted-foreground">.id</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/products" className={pathname.startsWith("/products") ? "text-primary" : "text-foreground hover:text-primary transition-colors"}>
            Produk
          </Link>
          <Link href="/categories" className={pathname.startsWith("/categories") ? "text-primary" : "text-foreground hover:text-primary transition-colors"}>
            Kategori
          </Link>
          <Link href="/promo" className="text-foreground hover:text-primary transition-colors">
            Promo
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/search" className="p-2 hover:bg-muted rounded-full transition-colors" aria-label="Cari">
            <Search size={20} />
          </Link>

          <Link href="/wishlist" className="p-2 hover:bg-muted rounded-full transition-colors relative" aria-label="Wishlist">
            <Heart size={20} />
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishCount > 9 ? "9+" : wishCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative" aria-label="Keranjang">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <Link href="/auth/login" className="hidden md:block ml-2 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-[12px] hover:bg-primary/90 transition-colors">
            Masuk
          </Link>

          <button className="md:hidden p-2 hover:bg-muted rounded-full transition-colors" aria-label="Menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
