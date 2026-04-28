"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Search, Heart, User } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

export function BottomNav() {
  const pathname = usePathname();
  const wishCount = useWishlistStore((s) => s.count());
  const language = useUIStore((s) => s.language);
  const t = getT(language);

  const navItems = [
    { href: "/", icon: Home, label: t.bottom_nav.home },
    { href: "/categories", icon: Grid3X3, label: t.bottom_nav.categories },
    { href: "/search", icon: Search, label: t.bottom_nav.search },
    { href: "/wishlist", icon: Heart, label: t.bottom_nav.wishlist },
    { href: "/account", icon: User, label: t.bottom_nav.account },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-2 relative"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={active ? "text-primary" : "text-muted-foreground"}
                  strokeWidth={active ? 2.5 : 1.5}
                />
                {href === "/wishlist" && wishCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                    {wishCount > 9 ? "9" : wishCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
              {active && (
                <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
