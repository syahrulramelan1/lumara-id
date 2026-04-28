"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.count());
  const wishCount = useWishlistStore((s) => s.count());
  const { language, toggleLanguage } = useUIStore();
  const { resolvedTheme, setTheme } = useTheme();
  const t = getT(language);

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
            {t.nav.products}
          </Link>
          <Link href="/categories" className={pathname.startsWith("/categories") ? "text-primary" : "text-foreground hover:text-primary transition-colors"}>
            {t.nav.categories}
          </Link>
          <Link href="/promo" className={pathname === "/promo" ? "text-primary" : "text-foreground hover:text-primary transition-colors"}>
            {t.nav.promo}
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title={language === "id" ? "Switch to English" : "Ganti ke Indonesia"}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Globe size={15} />
            <span className="text-xs font-semibold uppercase">{language}</span>
          </button>

          {/* White / Dark segmented toggle */}
          <div className="flex items-center rounded-lg border border-border bg-muted p-0.5 gap-0.5">
            <button
              onClick={() => setTheme("light")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                resolvedTheme !== "dark"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              White
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                resolvedTheme === "dark"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dark
            </button>
          </div>

          <Link href="/search" className="p-2 hover:bg-muted rounded-full transition-colors" aria-label={t.nav.products}>
            <Search size={20} />
          </Link>

          <Link href="/wishlist" className="p-2 hover:bg-muted rounded-full transition-colors relative" aria-label={t.bottom_nav.wishlist}>
            <Heart size={20} />
            {wishCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {wishCount > 9 ? "9+" : wishCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative" aria-label={t.cart.title}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <Link href="/auth/login" className="hidden md:block ml-1 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-[12px] hover:bg-primary/90 transition-colors">
            {t.nav.login}
          </Link>

          <button className="md:hidden p-2 hover:bg-muted rounded-full transition-colors" aria-label="Menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
