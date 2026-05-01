"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle2,
  Clock, XCircle, AlertCircle,
} from "lucide-react";
import type { OrderWithItems, OrderTracking } from "@/types";
import type { ShippingAddress } from "@/types";
import { createClientComponent } from "@/lib/supabase-browser";

// ─── Constants ────────────────────────────────────────────────────────────────

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

function formatDate(s: string | null | undefined) {
  if (!s) return "—";
  return new Date(s).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateOnly(s: string | null | undefined) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function getImage(imgs: unknown): string | null {
  if (Array.isArray(imgs) && imgs.length > 0) return imgs[0] as string;
  if (typeof imgs === "string") {
    try { const p = JSON.parse(imgs) as string[]; return p[0] ?? null; } catch { return imgs || null; }
  }
  return null;
}

// ─── Tracking Item ────────────────────────────────────────────────────────────

function TrackingEntry({ item, isFirst }: { item: OrderTracking; isFirst: boolean }) {
  const statusLower = item.status.toLowerCase();
  const isSuccess = statusLower.includes("diterima") || statusLower.includes("selesai") || statusLower.includes("tiba");
  const isFailed  = statusLower.includes("gagal") || statusLower.includes("batal");

  return (
    <div className="relative flex gap-3.5">
      {/* Vertical line */}
      {!isFirst && (
        <div className="absolute left-[11px] bottom-full h-3 w-px bg-border" />
      )}
      {/* Icon */}
      <div className="shrink-0 mt-0.5">
        {isSuccess ? (
          <CheckCircle2 size={22} className="text-green-500" />
        ) : isFailed ? (
          <XCircle size={22} className="text-red-500" />
        ) : (
          <div className="w-[22px] h-[22px] rounded-full border-2 border-primary bg-background flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        )}
      </div>
      {/* Text */}
      <div className="pb-5 flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">{item.status}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
        {item.location && (
          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
            <MapPin size={11} className="shrink-0" /> {item.location}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Clock size={11} className="shrink-0" />
          {formatDate(item.createdAt.toString())}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder]       = useState<OrderWithItems | null>(null);
  const [loading, setLoading]   = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d: { success: boolean; data?: OrderWithItems }) => {
        if (d.success) setOrder(d.data ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleConfirm() {
    if (!confirm("Konfirmasi bahwa pesanan sudah kamu terima?")) return;
    setConfirming(true);
    try {
      const supabase = createClientComponent();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert("Sesi habis, silakan login ulang.");
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/orders/${id}/confirm`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json() as { success: boolean; error?: string };
      if (json.success) {
        setOrder((prev) => prev ? { ...prev, status: "DELIVERED" } : prev);
        // Refresh full data to get the new tracking entry
        const refreshed = await fetch(`/api/orders/${id}`).then((r) => r.json()) as { success: boolean; data?: OrderWithItems };
        if (refreshed.success && refreshed.data) setOrder(refreshed.data);
      } else {
        alert(json.error || "Gagal mengkonfirmasi pesanan");
      }
    } finally {
      setConfirming(false);
    }
  }

  // ── Loading ──
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

  const shipping = (() => {
    if (!order.shippingAddress) return null;
    if (typeof order.shippingAddress === "object") return order.shippingAddress as unknown as ShippingAddress;
    try { return JSON.parse(order.shippingAddress as string) as ShippingAddress; } catch { return null; }
  })();

  // Tracking sorted oldest → newest (natural read order for buyer)
  const trackings = [...(order.trackings ?? [])].sort(
    (a, b) => new Date(a.createdAt.toString()).getTime() - new Date(b.createdAt.toString()).getTime()
  );

  const isShipped   = order.status === "SHIPPED";
  const hasShipping = !!order.courier;

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

      {/* Konfirmasi diterima — only when SHIPPED */}
      {isShipped && (
        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground mb-1">Pesanan sudah sampai?</p>
              <p className="text-xs text-muted-foreground mb-3">
                Klik tombol di bawah untuk mengkonfirmasi bahwa paket sudah kamu terima. Tindakan ini tidak bisa dibatalkan.
              </p>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-white text-sm font-semibold rounded-[12px] hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                <CheckCircle2 size={16} />
                {confirming ? "Mengkonfirmasi…" : "Konfirmasi Pesanan Diterima"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shipping info — if courier filled */}
      {hasShipping && (
        <div className="bg-card border border-card-border rounded-2xl p-5 mb-4">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Truck size={16} className="text-primary" /> Informasi Pengiriman
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground">Kurir</span>
            <span className="font-medium text-right">{order.courier} — {order.courierService}</span>
            <span className="text-muted-foreground">No. Resi</span>
            <span className="font-mono font-bold text-primary text-right">{order.trackingNumber}</span>
            <span className="text-muted-foreground">Tgl Kirim</span>
            <span className="text-right">{formatDate(order.shippedAt)}</span>
            <span className="text-muted-foreground">Est. Tiba</span>
            <span className="font-medium text-right">{formatDateOnly(order.estimatedArrival)}</span>
          </div>
        </div>
      )}

      {/* Tracking timeline */}
      {trackings.length > 0 && (
        <div className="bg-card border border-card-border rounded-2xl p-5 mb-4">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Clock size={16} className="text-primary" /> Riwayat Pengiriman
          </h3>
          <div className="relative pl-1">
            {/* Continuous vertical line */}
            {trackings.length > 1 && (
              <div className="absolute left-[10px] top-[22px] bottom-5 w-px bg-border" />
            )}
            {trackings.map((t, i) => (
              <TrackingEntry key={t.id} item={t} isFirst={i === 0} />
            ))}
          </div>
        </div>
      )}

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
            {[shipping.address, shipping.district, shipping.city, shipping.province, shipping.postalCode].filter(Boolean).join(", ")}
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
