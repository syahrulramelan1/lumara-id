"use client";
import Link from "next/link";
import { User, Package, Heart, LogIn } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

export default function AccountPage() {
  const { language } = useUIStore();
  const t = getT(language);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.pages.account.title}</h1>

      <div className="bg-card border border-card-border rounded-2xl p-6 mb-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <User size={32} className="text-primary" />
        </div>
        <p className="text-muted-foreground text-sm">{t.pages.account.login_prompt}</p>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
        >
          <LogIn size={16} />
          {t.pages.account.login_now}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/orders" className="bg-card border border-card-border rounded-[14px] p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
          <Package size={24} className="text-primary" />
          <span className="text-sm font-medium">{t.pages.account.my_orders}</span>
        </Link>
        <Link href="/wishlist" className="bg-card border border-card-border rounded-[14px] p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
          <Heart size={24} className="text-primary" />
          <span className="text-sm font-medium">{t.wishlist.title}</span>
        </Link>
      </div>
    </div>
  );
}
