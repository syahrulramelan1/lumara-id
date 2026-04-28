"use client";
import Link from "next/link";
import { Package, LogIn, ShoppingBag } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

export default function OrdersPage() {
  const { language } = useUIStore();
  const t = getT(language);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.pages.orders.title}</h1>

      {/* Login prompt — shown when user is not authenticated */}
      <div className="bg-card border border-card-border rounded-2xl p-8 text-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={32} className="text-primary" />
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          {t.pages.orders.login_required}
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
        >
          <LogIn size={16} />
          {t.pages.orders.login_now}
        </Link>
      </div>

      {/* Empty state illustration */}
      <div className="bg-surface-low border border-card-border rounded-2xl p-8 text-center">
        <ShoppingBag size={40} className="mx-auto text-muted-foreground mb-3" />
        <p className="font-semibold text-sm">{t.pages.orders.empty}</p>
        <p className="text-xs text-muted-foreground mt-1 mb-4">{t.pages.orders.empty_sub}</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
        >
          {t.sections.view_all}
        </Link>
      </div>
    </div>
  );
}
