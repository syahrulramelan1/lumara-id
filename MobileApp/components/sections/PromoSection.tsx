"use client";
import Link from "next/link";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

export function PromoSection() {
  const { language } = useUIStore();
  const t = getT(language);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 overflow-hidden text-white">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-2 w-20 h-20 bg-white/10 rounded-full" />
          <p className="text-sm font-semibold opacity-80 mb-1">{t.promo.flash_label}</p>
          <h3 className="text-2xl font-extrabold mb-2">{t.promo.flash_title}</h3>
          <p className="text-sm opacity-80 mb-4">{t.promo.flash_desc}</p>
          <Link
            href="/products?category=hijab"
            className="inline-block px-4 py-2 bg-white text-primary text-sm font-bold rounded-[12px] hover:bg-white/90 transition-colors"
          >
            {t.promo.shop_now}
          </Link>
        </div>

        <div className="relative bg-gradient-to-br from-[#0F0A1E] to-[#1a0f2e] rounded-2xl p-6 overflow-hidden text-white">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/20 rounded-full" />
          <p className="text-sm font-semibold opacity-80 mb-1">{t.promo.bundle_label}</p>
          <h3 className="text-2xl font-extrabold mb-2">{t.promo.bundle_title}</h3>
          <p className="text-sm opacity-80 mb-4">{t.promo.bundle_desc}</p>
          <Link
            href="/products?category=bundle"
            className="inline-block px-4 py-2 bg-primary text-white text-sm font-bold rounded-[12px] hover:bg-primary/80 transition-colors"
          >
            {t.promo.view_bundle}
          </Link>
        </div>
      </div>
    </section>
  );
}
