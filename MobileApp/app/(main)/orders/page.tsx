"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ChevronRight, LogIn, ShoppingBag } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { getT } from "@/lib/i18n";
import type { OrderWithItems } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  PENDING:    "Menunggu Pembayaran",
  PAID:       "Sudah Dibayar",
  PROCESSING: "Diproses",
  SHIPPED:    "Dikirim",
  DELIVERED:  "Selesai",
  CANCELLED:  "Dibatalkan",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAID:       "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PROCESSING: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  SHIPPED:    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED:  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function OrdersPage() {
  const { language } = useUIStore();
  const t = getT(language);
  const { dbUser, loading: authLoading } = useAuthStore();

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dbUser?.id) return;
    setLoading(true);
    fetch(`/api/orders?userId=${dbUser.id}`)
      .then((r) => r.json())
      .then((d: { success: boolean; data?: OrderWithItems[] }) => {
        if (d.success) setOrders(d.data ?? []);
      })
      .finally(() => setLoading(false));
  }, [dbUser?.id]);

  if (authLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-card-border rounded-2xl p-5 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t.pages.orders.title}</h1>
        <div className="bg-card border border-card-border rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground text-sm mb-4">{t.pages.orders.login_required}</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors">
            <LogIn size={16} /> {t.pages.orders.login_now}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.pages.orders.title}</h1>

      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="bg-card border border-card-border rounded-2xl p-5 animate-pulse h-28" />)}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="bg-card border border-card-border rounded-2xl p-10 text-center">
          <ShoppingBag size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="font-semibold text-sm">{t.pages.orders.empty}</p>
          <p className="text-xs text-muted-foreground mt-1 mb-4">{t.pages.orders.empty_sub}</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-[12px] hover:bg-primary/90 transition-colors">
            Mulai Belanja
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const firstImage = (() => {
              const imgs = order.items[0]?.product?.images;
              if (Array.isArray(imgs) && imgs.length > 0) return imgs[0] as string;
              if (typeof imgs === "string") {
                try { const p = JSON.parse(imgs) as string[]; return p[0]; } catch { return imgs; }
              }
              return null;
            })();

            return (
              <Link key={order.id} href={`/orders/${order.id}`}
                className="flex items-center gap-4 bg-card border border-card-border rounded-2xl p-4 hover:border-primary/30 transition-colors group">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-[12px] bg-muted overflow-hidden shrink-0">
                  {firstImage
                    ? <img src={firstImage} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Package size={20} className="text-muted-foreground" /></div>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs text-muted-foreground font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status] ?? STATUS_COLOR.PENDING}`}>
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {order.items.length} item • {formatIDR(order.total)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(order.createdAt.toString())}</p>
                </div>

                <ChevronRight size={16} className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
