import Link from "next/link";
import { User, Package, Heart, LogIn } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Akun Saya" };

export default function AccountPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Akun Saya</h1>

      <div className="bg-card border border-card-border rounded-2xl p-6 mb-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <User size={32} className="text-primary" />
        </div>
        <p className="text-muted-foreground text-sm">Masuk untuk melihat profil dan riwayat pesananmu</p>
        <Link
          href="/auth/login"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
        >
          <LogIn size={16} />
          Masuk Sekarang
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/orders" className="bg-card border border-card-border rounded-[14px] p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
          <Package size={24} className="text-primary" />
          <span className="text-sm font-medium">Pesanan Saya</span>
        </Link>
        <Link href="/wishlist" className="bg-card border border-card-border rounded-[14px] p-4 flex flex-col items-center gap-2 hover:border-primary/30 transition-colors">
          <Heart size={24} className="text-primary" />
          <span className="text-sm font-medium">Wishlist</span>
        </Link>
      </div>
    </div>
  );
}
