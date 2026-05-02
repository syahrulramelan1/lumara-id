"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, ShoppingBag, Heart, Menu, X, Globe, Sun, Moon,
  Home, Grid3X3, Tag, User, Package,
  LogOut, LogIn, ChevronDown, Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { useMounted } from "@/hooks/useMounted";
import { createClientComponent } from "@/lib/supabase-browser";

export function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const mounted   = useMounted();
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const cartCount  = useCartStore((s) => s.count());
  const wishCount  = useWishlistStore((s) => s.count());
  const { language, toggleLanguage } = useUIStore();
  const { resolvedTheme, setTheme }  = useTheme();
  const { dbUser, loading: authLoading } = useAuthStore();

  const safeCartCount = mounted ? cartCount  : 0;
  const safeWishCount = mounted ? wishCount  : 0;
  const safeLang      = mounted ? language   : "id";
  const safeTheme     = mounted ? resolvedTheme : undefined;
  const safeUser      = mounted ? dbUser : null;
  const t = getT(safeLang);

  const userInitials = safeUser
    ? (safeUser.name ?? safeUser.email).slice(0, 2).toUpperCase()
    : null;

  useEffect(() => { setDrawerOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    setDrawerOpen(false);
    const supabase = createClientComponent();
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    router.push("/");
  };

  const mobileNavItems = [
    { href: "/",           icon: Home,    label: t.bottom_nav.home },
    { href: "/products",   icon: Package, label: t.nav.products },
    { href: "/categories", icon: Grid3X3, label: t.nav.categories },
    { href: "/promo",      icon: Tag,     label: t.nav.promo },
    ...(safeUser ? [
      { href: "/orders",   icon: Package,  label: "Pesanan Saya" },
      { href: "/wishlist", icon: Heart,    label: t.bottom_nav.wishlist },
    ] : []),
    { href: "/account",    icon: User,    label: t.bottom_nav.account },
  ];

  const Avatar = ({ size = "sm" }: { size?: "sm" | "md" | "lg" }) => {
    const dims = size === "sm" ? "w-7 h-7 text-xs" : size === "md" ? "w-10 h-10 text-sm" : "w-14 h-14 text-base";
    return (
      <div className={`${dims} rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white font-bold shrink-0`}>
        {safeUser?.avatar
          ? <img src={safeUser.avatar} alt="avatar" className="w-full h-full object-cover" />
          : userInitials}
      </div>
    );
  };

  return (
    <>
      {/* ── Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Lumara
            </span>
            <span className="text-xs font-medium text-muted-foreground">.id</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {[
              { href: "/products",   label: t.nav.products },
              { href: "/categories", label: t.nav.categories },
              { href: "/promo",      label: t.nav.promo },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className={pathname.startsWith(href) ? "text-primary" : "text-foreground hover:text-primary transition-colors"}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Language */}
            <button onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Globe size={15} />
              <span className="text-xs font-semibold uppercase">{safeLang}</span>
            </button>

            {/* Theme */}
            <button onClick={() => setTheme(safeTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              suppressHydrationWarning>
              {safeTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Search */}
            <Link href="/search" className="p-2 hover:bg-muted rounded-full transition-colors">
              <Search size={20} />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 hover:bg-muted rounded-full transition-colors relative">
              <Heart size={20} />
              {safeWishCount > 0 && safeUser && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {safeWishCount > 9 ? "9+" : safeWishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative">
              <ShoppingBag size={20} />
              {safeCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {safeCartCount > 9 ? "9+" : safeCartCount}
                </span>
              )}
            </Link>

            {/* ── Desktop: profile dropdown ── */}
            {mounted && !authLoading && (
              <div className="hidden md:block ml-1" ref={profileRef}>
                {safeUser ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen((v) => !v)}
                      className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-[14px] hover:bg-muted transition-colors border border-transparent hover:border-border"
                    >
                      <Avatar size="sm" />
                      <span className="text-sm font-medium max-w-[90px] truncate">
                        {safeUser.name ?? safeUser.email.split("@")[0]}
                      </span>
                      <ChevronDown size={14} className={`text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown */}
                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-card-border rounded-2xl shadow-lg overflow-hidden z-[80]">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-semibold truncate">{safeUser.name ?? "—"}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{safeUser.email}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
                            {safeUser.role}
                          </span>
                        </div>
                        {/* Links */}
                        <nav className="py-1">
                          {[
                            { href: "/account", icon: User,    label: "Profil Saya" },
                            { href: "/orders",  icon: Package, label: "Pesanan Saya" },
                            { href: "/wishlist",icon: Heart,   label: "Wishlist" },
                          ].map(({ href, icon: Icon, label }) => (
                            <Link key={href} href={href}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors">
                              <Icon size={15} className="text-muted-foreground" />
                              {label}
                            </Link>
                          ))}
                        </nav>
                        <div className="border-t border-border py-1">
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <LogOut size={15} />
                            Keluar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login"
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-[12px] hover:bg-primary/90 transition-colors">
                    <LogIn size={14} />
                    {t.nav.login}
                  </Link>
                )}
              </div>
            )}

            {/* ── Mobile: mini avatar OR hamburger ── */}
            <div className="md:hidden flex items-center gap-1">
              {mounted && safeUser && (
                <Link href="/account" className="p-1">
                  <Avatar size="sm" />
                </Link>
              )}
              <button onClick={() => setDrawerOpen(true)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Open menu">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Drawer overlay ─────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      )}

      {/* ── Drawer panel ───────────────────────────────── */}
      <div className={`fixed top-0 right-0 h-full w-[300px] z-[70] bg-background border-l border-border shadow-2xl md:hidden
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-5 h-14 shrink-0">
          <span className="text-sm font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            lumara.id
          </span>
          <button onClick={() => setDrawerOpen(false)}
            className="p-2 hover:bg-muted rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* ── Profile card ── */}
        {mounted && (
          safeUser ? (
            /* Logged-in card */
            <div className="mx-4 mb-2 rounded-2xl overflow-hidden border border-border">
              {/* Gradient banner */}
              <div className="h-14 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/10" />
              <div className="px-4 pb-4 -mt-7">
                <div className="flex items-end justify-between">
                  <div className="ring-4 ring-background rounded-full">
                    <Avatar size="lg" />
                  </div>
                  <Link href="/account" onClick={() => setDrawerOpen(false)}
                    className="mb-1 flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                    <Settings size={12} /> Edit Profil
                  </Link>
                </div>
                <p className="font-bold text-sm mt-2 truncate">{safeUser.name ?? "—"}</p>
                <p className="text-xs text-muted-foreground truncate">{safeUser.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
                  {safeUser.role}
                </span>
              </div>
            </div>
          ) : (
            /* Guest card */
            <div className="mx-4 mb-2 rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <User size={20} className="text-primary" />
              </div>
              <p className="text-sm font-semibold">Halo, Selamat Datang!</p>
              <p className="text-xs text-muted-foreground mt-0.5 mb-3">Masuk untuk pengalaman belanja lebih lengkap</p>
              <Link href="/login" onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-white text-sm font-semibold rounded-[10px] hover:bg-primary/90 transition-colors">
                <LogIn size={14} /> Masuk Sekarang
              </Link>
              <button onClick={() => { setDrawerOpen(false); router.push("/login"); }}
                className="mt-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                Belum punya akun? <span className="font-semibold text-primary">Daftar</span>
              </button>
            </div>
          )
        )}

        {/* ── Nav items (scrollable) ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {mobileNavItems.map(({ href, icon: Icon, label }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-sm font-medium transition-colors ${
                  active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={17} strokeWidth={active ? 2.5 : 1.5} />
                {label}
                {href === "/wishlist" && safeWishCount > 0 && safeUser && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {safeWishCount > 9 ? "9+" : safeWishCount}
                  </span>
                )}
                {href === "/cart" && safeCartCount > 0 && (
                  <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {safeCartCount > 9 ? "9+" : safeCartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom controls ── */}
        <div className="shrink-0 border-t border-border px-4 py-4 space-y-2">
          <div className="flex gap-2">
            <button onClick={() => setTheme(safeTheme === "dark" ? "light" : "dark")}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[10px] text-xs font-medium text-foreground hover:bg-muted transition-colors border border-border"
              suppressHydrationWarning>
              {safeTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {safeTheme === "dark" ? "Light" : "Dark"}
            </button>
            <button onClick={toggleLanguage}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[10px] text-xs font-medium text-foreground hover:bg-muted transition-colors border border-border">
              <Globe size={14} />
              {safeLang === "id" ? "English" : "Indonesia"}
            </button>
          </div>

          {mounted && safeUser && (
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-sm font-semibold text-red-500 border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <LogOut size={16} /> Keluar dari Akun
            </button>
          )}
        </div>
      </div>
    </>
  );
}
