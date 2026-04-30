"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, CreditCard, ShoppingBag, CheckCircle, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import type { ShippingAddress } from "@/types";

const PAYMENT_METHODS = [
  { id: "Transfer BCA",     label: "Transfer BCA",      desc: "1234567890 a.n. Lumara ID" },
  { id: "Transfer Mandiri", label: "Transfer Mandiri",  desc: "9876543210 a.n. Lumara ID" },
  { id: "QRIS",             label: "QRIS",              desc: "Bayar dengan semua dompet digital" },
  { id: "COD",              label: "COD (Bayar di Tempat)", desc: "Bayar saat barang tiba" },
];

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const EMPTY_ADDR: ShippingAddress = {
  name: "", phone: "", province: "", city: "",
  district: "", postalCode: "", address: "", notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { dbUser, loading: authLoading } = useAuthStore();

  const [addr, setAddr] = useState<ShippingAddress>(EMPTY_ADDR);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const setField = (k: keyof ShippingAddress, v: string) =>
    setAddr((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) { toast.error("Pilih metode pembayaran"); return; }
    if (!dbUser?.id)    { toast.error("Silakan masuk terlebih dahulu"); return; }
    if (items.length === 0) { toast.error("Keranjang kosong"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: dbUser.id,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            price: i.price,
          })),
          shippingAddress: addr,
          paymentMethod,
        }),
      });
      const data = await res.json() as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error ?? "Gagal membuat pesanan");

      clearCart();
      setDone(true);
      setTimeout(() => router.push("/orders"), 2500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal checkout");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="max-w-xl mx-auto px-4 py-8">
      <div className="h-40 bg-muted animate-pulse rounded-2xl" />
    </div>;
  }

  if (!dbUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn size={28} className="text-primary" />
        </div>
        <h2 className="font-bold text-lg mb-2">Masuk untuk Checkout</h2>
        <p className="text-muted-foreground text-sm mb-5">Kamu harus masuk untuk melanjutkan pembayaran</p>
        <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-[12px]">
          <LogIn size={16} /> Masuk Sekarang
        </Link>
      </div>
    );
  }

  if (items.length === 0 && !done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <ShoppingBag size={40} className="mx-auto text-muted-foreground mb-3" />
        <p className="font-semibold">Keranjang kamu kosong</p>
        <Link href="/products" className="mt-4 inline-block px-6 py-3 bg-primary text-white font-semibold rounded-[12px] text-sm">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Pesanan Diterima!</h2>
        <p className="text-muted-foreground text-sm">Pesananmu sudah kami terima. Kamu akan diarahkan ke halaman pesanan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={16} /> Kembali ke Keranjang
      </Link>

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Alamat pengiriman */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-primary" /> Alamat Pengiriman
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {([
              { key: "name",       label: "Nama Penerima",   col: 2, placeholder: "Nama lengkap" },
              { key: "phone",      label: "Nomor HP",        col: 2, placeholder: "08xxxxxxxxxx" },
              { key: "province",   label: "Provinsi",        col: 1, placeholder: "DKI Jakarta" },
              { key: "city",       label: "Kota/Kabupaten",  col: 1, placeholder: "Jakarta Selatan" },
              { key: "district",   label: "Kecamatan",       col: 1, placeholder: "Kebayoran Baru" },
              { key: "postalCode", label: "Kode Pos",        col: 1, placeholder: "12190" },
              { key: "address",    label: "Alamat Lengkap",  col: 2, placeholder: "Jl. ... No. ..., RT/RW ..." },
              { key: "notes",      label: "Catatan (opsional)", col: 2, placeholder: "Patokan atau catatan tambahan" },
            ] as { key: keyof ShippingAddress; label: string; col: number; placeholder: string }[]).map(({ key, label, col, placeholder }) => (
              <div key={key} className={col === 2 ? "col-span-2" : ""}>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
                <input
                  value={addr[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  placeholder={placeholder}
                  required={key !== "notes"}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Metode pembayaran */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <CreditCard size={16} className="text-primary" /> Metode Pembayaran
          </h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentMethod(m.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-[12px] border text-left transition-all ${
                  paymentMethod === m.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${
                  paymentMethod === m.id ? "border-primary bg-primary" : "border-muted-foreground"
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Ringkasan */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <ShoppingBag size={16} className="text-primary" /> Ringkasan Pesanan
          </h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="flex justify-between text-muted-foreground">
                <span className="truncate mr-2">{item.name} ({item.size}/{item.color}) ×{item.quantity}</span>
                <span className="shrink-0">{formatIDR(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{formatIDR(total())}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-primary text-white font-bold rounded-[14px] hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
        >
          {submitting ? "Memproses..." : `Buat Pesanan • ${formatIDR(total())}`}
        </button>
      </form>
    </div>
  );
}
