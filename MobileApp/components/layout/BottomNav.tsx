"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Search, Heart, User } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { useMounted } from "@/hooks/useMounted";

export function BottomNav() {
  const pathname      = usePathname();
  const mounted       = useMounted();
  const wishCount     = useWishlistStore((s) => s.count());
  const language      = useUIStore((s) => s.language);
  const { dbUser }    = useAuthStore();

  const safeWishCount = mounted ? wishCount : 0;
  const safeUser      = mounted ? dbUser : null;
  const t = getT(mounted ? language : "id");

  const navItems = [
    { href: "/home",       icon: Home,    label: t.bottom_nav.home },
    { href: "/categories", icon: Grid3X3, label: t.bottom_nav.categories },
    { href: "/search",     icon: Search,  label: t.bottom_nav.search },
    { href: "/wishlist",   icon: Heart,   label: t.bottom_nav.wishlist },
    { href: "/account",    icon: User,    label: t.bottom_nav.account },
  ];

  const userInitials = safeUser
    ? (safeUser.name ?? safeUser.email).slice(0, 2).toUpperCase()
    : null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-pb">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = href === "/home" ? pathname === "/home" : pathname.startsWith(href);
          const isAccount = href === "/account";
          const isWishlist = href === "/wishlist";

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-2 relative min-w-[52px]"
            >
              {active && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 bg-primary/10 rounded-[14px]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              <motion.div
                animate={{ scale: active ? 1.1 : 1, y: active ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative"
              >
                {/* Account tab: avatar when logged in */}
                {isAccount && safeUser ? (
                  <div className={`w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white text-[9px] font-bold shrink-0 ring-2 transition-colors ${active ? "ring-primary" : "ring-border"}`}>
                    {safeUser.avatar
                      ? <img src={safeUser.avatar} alt="avatar" className="w-full h-full object-cover" />
                      : userInitials}
                  </div>
                ) : (
                  <Icon
                    size={22}
                    className={active ? "text-primary" : "text-muted-foreground"}
                    strokeWidth={active ? 2.5 : 1.5}
                  />
                )}

                {/* Wishlist badge — only when logged in */}
                {isWishlist && safeWishCount > 0 && safeUser && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                  >
                    {safeWishCount > 9 ? "9+" : safeWishCount}
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
