"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, Menu, X, Globe, Sun, Moon, Home, Grid3X3, Tag, User, Package, LayoutDashboard } from "lucide-react";
import { useTheme } from "next-themes";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { useMounted } from "@/hooks/useMounted";

export function Navbar() {
  const pathname   = usePathname();
  const mounted    = useMounted();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cartCount  = useCartStore((s) => s.count());
  const wishCount  = useWishlistStore((s) => s.count());
  const { language, toggleLanguage } = useUIStore();
  const { resolvedTheme, setTheme }  = useTheme();

  // Use safe (SSR-consistent) values before mount
  const safeCartCount  = mounted ? cartCount  : 0;
  const safeWishCount  = mounted ? wishCount  : 0;
  const safeLang       = mounted ? language   : "id";
  const safeTheme      = mounted ? resolvedTheme : undefined;
  const t = getT(safeLang);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const mobileNavItems = [
    { href: "/",          icon: Home,      label: t.bottom_nav.home },
    { href: "/products",  icon: Package,   label: t.nav.products },
    { href: "/categories",icon: Grid3X3,   label: t.nav.categories },
    { href: "/promo",     icon: Tag,       label: t.nav.promo },
    { href: "/wishlist",  icon: Heart,     label: t.bottom_nav.wishlist },
    { href: "/account",   icon: User,      label: t.bottom_nav.account },
  ];

  return (
    <>
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
              title={safeLang === "id" ? "Switch to English" : "Ganti ke Indonesia"}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Globe size={15} />
              <span className="text-xs font-semibold uppercase">{safeLang}</span>
            </button>

            {/* Light / Dark toggle */}
            <button
              onClick={() => setTheme(safeTheme === "dark" ? "light" : "dark")}
              title={safeTheme === "dark" ? "Switch to light" : "Switch to dark"}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              suppressHydrationWarning
            >
              {safeTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link href="/search" className="p-2 hover:bg-muted rounded-full transition-colors" aria-label="Search">
              <Search size={20} />
            </Link>

            <Link href="/wishlist" className="p-2 hover:bg-muted rounded-full transition-colors relative" aria-label={t.bottom_nav.wishlist}>
              <Heart size={20} />
              {safeWishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {safeWishCount > 9 ? "9+" : safeWishCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative" aria-label={t.cart.title}>
              <ShoppingBag size={20} />
              {safeCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {safeCartCount > 9 ? "9+" : safeCartCount}
                </span>
              )}
            </Link>

            <Link href="/login" className="hidden md:block ml-1 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-[12px] hover:bg-primary/90 transition-colors">
              {t.nav.login}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-[70] bg-background border-l border-border shadow-2xl md:hidden
          transform transition-transform duration-300 ease-in-out
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <span className="text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            lumara.id
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col px-3 py-4 gap-1">
          {mobileNavItems.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
                {label}
                {href === "/wishlist" && safeWishCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {safeWishCount > 9 ? "9+" : safeWishCount}
                  </span>
                )}
                {href === "/cart" && safeCartCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {safeCartCount > 9 ? "9+" : safeCartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-5 py-5 border-t border-border space-y-3">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(safeTheme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium text-foreground hover:bg-muted transition-colors"
            suppressHydrationWarning
          >
            {safeTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            {safeTheme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Globe size={18} />
            {safeLang === "id" ? "Switch to English" : "Ganti ke Indonesia"}
          </button>

          <Link
            href="/login"
            className="block w-full text-center py-3 bg-primary text-white text-sm font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
          >
            {t.nav.login}
          </Link>

          {/* Admin Panel cross-redirect */}
          <a
            href={process.env.NEXT_PUBLIC_ADMIN_URL || "https://lumara-id-admin.onrender.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LayoutDashboard size={16} />
            Admin Panel
          </a>
        </div>
      </div>
    </>
  );
}
