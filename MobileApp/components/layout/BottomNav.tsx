"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Search, Heart, User } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { useMounted } from "@/hooks/useMounted";

export function BottomNav() {
  const pathname   = usePathname();
  const mounted    = useMounted();
  const wishCount  = useWishlistStore((s) => s.count());
  const language   = useUIStore((s) => s.language);

  // Safe values: match server render until hydration completes
  const safeWishCount = mounted ? wishCount : 0;
  const safeLang      = mounted ? language  : "id";
  const t = getT(safeLang);

  const navItems = [
    { href: "/",           icon: Home,     label: t.bottom_nav.home },
    { href: "/categories", icon: Grid3X3,  label: t.bottom_nav.categories },
    { href: "/search",     icon: Search,   label: t.bottom_nav.search },
    { href: "/wishlist",   icon: Heart,    label: t.bottom_nav.wishlist },
    { href: "/account",    icon: User,     label: t.bottom_nav.account },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-2 relative"
            >
              {/* Sliding pill indicator */}
              {active && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 bg-primary/10 rounded-[14px]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              <motion.div
                animate={{ scale: active ? 1.12 : 1, y: active ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative"
              >
                <Icon
                  size={22}
                  className={active ? "text-primary" : "text-muted-foreground"}
                  strokeWidth={active ? 2.5 : 1.5}
                />
                {href === "/wishlist" && safeWishCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full"
                  >
                    {safeWishCount > 9 ? "9" : safeWishCount}
                  </motion.span>
                )}
              </motion.div>

              <span className={`text-[10px] font-medium relative z-10 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
