"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import type { OrderWithItems } from "@/types";
import type { ShippingAddress } from "@/types";

const STATUS_LABEL: Record<string, string> = {
  PENDING:    "Menunggu Pembayaran",
  PAID:       "Sudah Dibayar",
  PROCESSING: "Sedang Diproses",
  SHIPPED:    "Dalam Pengiriman",
  DELIVERED:  "Pesanan Selesai",
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
  return new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function getImage(imgs: unknown): string | null {
  if (Array.isArray(imgs) && imgs.length > 0) return imgs[0] as string;
  if (typeof imgs === "string") {
    try { const p = JSON.parse(imgs) as string[]; return p[0] ?? null; } catch { return imgs || null; }
  }
  return null;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d: { success: boolean; data?: OrderWithItems }) => {
        if (d.success) setOrder(d.data ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <div className="bg-card border border-card-border rounded-2xl p-5 animate-pulse h-32" />
        <div className="bg-card border border-card-border rounded-2xl p-5 animate-pulse h-48" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <Package size={40} className="mx-auto text-muted-foreground mb-3" />
        <p className="font-semibold">Pesanan tidak ditemukan</p>
        <Link href="/orders" className="mt-4 inline-block text-sm text-primary hover:underline">
          Kembali ke Pesanan
        </Link>
      </div>
    );
  }

  const shipping = order.shippingAddress as unknown as ShippingAddress;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Back */}
      <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={16} /> Kembali ke Pesanan
      </Link>

      {/* Header */}
      <div className="bg-card border border-card-border rounded-2xl p-5 mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-xs text-muted-foreground font-mono">ID Pesanan</p>
            <p className="font-bold text-sm mt-0.5">#{order.id.slice(-12).toUpperCase()}</p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${STATUS_COLOR[order.status] ?? STATUS_COLOR.PENDING}`}>
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{formatDate(order.createdAt.toString())}</p>
      </div>

      {/* Items */}
      <div className="bg-card border border-card-border rounded-2xl p-5 mb-4">
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <Package size={16} className="text-primary" /> Item Pesanan
        </h3>
        <div className="space-y-4">
          {order.items.map((item) => {
            const img = getImage(item.product?.images);
            return (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 rounded-[10px] bg-muted overflow-hidden shrink-0">
                  {img
                    ? <img src={img} alt={item.product?.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-muted-foreground" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-tight">{item.product?.name ?? "Produk"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.size && `Ukuran: ${item.size}`}{item.color && ` • Warna: ${item.color}`}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-muted-foreground">{item.quantity}x {formatIDR(item.price)}</p>
                    <p className="text-sm font-semibold">{formatIDR(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-base font-bold text-primary">{formatIDR(order.total)}</span>
        </div>
      </div>

      {/* Shipping address */}
      {shipping?.name && (
        <div className="bg-card border border-card-border rounded-2xl p-5 mb-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-primary" /> Alamat Pengiriman
          </h3>
          <p className="text-sm font-medium">{shipping.name}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{shipping.phone}</p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            {shipping.address}, {shipping.district}, {shipping.city}, {shipping.province} {shipping.postalCode}
          </p>
          {shipping.notes && <p className="text-xs text-muted-foreground mt-1 italic">Catatan: {shipping.notes}</p>}
        </div>
      )}

      {/* Payment */}
      {order.paymentMethod && (
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <CreditCard size={16} className="text-primary" /> Metode Pembayaran
          </h3>
          <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
        </div>
      )}
    </div>
  );
}
