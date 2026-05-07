"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  ShoppingBag,
  CheckCircle,
  LogIn,
  Loader2,
  LocateFixed,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { createClientComponent } from "@/lib/supabase-browser";
import type { ShippingAddress } from "@/types";

/** Pembayaran detail menyusul (sesuai permintaan — tanpa rekening/QR di UI). */
const PAYMENT_PENDING = "Menunggu_konfirmasi_pembayaran";

interface RoProvince {
  province_id: string;
  province: string;
}

interface RoCity {
  city_id: string;
  type: string;
  city_name: string;
}

interface ShipOption {
  courier: string;
  courierName: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

const EMPTY_ADDR: ShippingAddress = {
  name: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  postalCode: "",
  address: "",
  notes: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { dbUser, loading: authLoading } = useAuthStore();

  const [addr, setAddr] = useState<ShippingAddress>(EMPTY_ADDR);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [provinces, setProvinces] = useState<RoProvince[]>([]);
  const [cities, setCities] = useState<RoCity[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCost, setLoadingCost] = useState(false);

  const [weightKg, setWeightKg] = useState(1);
  const [shipOptions, setShipOptions] = useState<ShipOption[]>([]);
  const [selectedShip, setSelectedShip] = useState<ShipOption | null>(null);

  const [geoLoading, setGeoLoading] = useState(false);

  const setField = (k: keyof ShippingAddress, v: string) =>
    setAddr((prev) => ({ ...prev, [k]: v }));

  const subtotal = total();

  // Master provinsi (cache 24h di server)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/shipping/provinces");
        const j = (await r.json()) as { success?: boolean; data?: RoProvince[]; error?: string };
        if (!r.ok || !j.success) throw new Error(j.error ?? "Gagal memuat provinsi");
        if (!cancelled) setProvinces(j.data ?? []);
      } catch (e) {
        if (!cancelled) toast.error(e instanceof Error ? e.message : "Gagal memuat provinsi");
      } finally {
        if (!cancelled) setLoadingProvinces(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadCities = async (provinceId: string) => {
    setLoadingCities(true);
    setCities([]);
    setShipOptions([]);
    setSelectedShip(null);
    try {
      const r = await fetch(`/api/shipping/cities?province_id=${encodeURIComponent(provinceId)}`);
      const j = (await r.json()) as { success?: boolean; data?: RoCity[]; error?: string };
      if (!r.ok || !j.success) throw new Error(j.error ?? "Gagal memuat kota");
      setCities(j.data ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memuat kota");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    const p = provinces.find((x) => x.province_id === provinceId);
    if (!p) return;
    setAddr((a) => ({
      ...a,
      province: p.province,
      provinceId: p.province_id,
      city: "",
      cityId: undefined,
      district: "",
      postalCode: "",
    }));
    void loadCities(p.province_id);
  };

  const handleCityChange = (cityId: string) => {
    const c = cities.find((x) => x.city_id === cityId);
    if (!c) return;
    const label = `${c.type} ${c.city_name}`.trim();
    setAddr((a) => ({ ...a, city: label, cityId: c.city_id }));
    setShipOptions([]);
    setSelectedShip(null);
  };

  const hitungOngkir = async () => {
    if (!addr.cityId) {
      toast.error("Pilih kota tujuan dulu");
      return;
    }
    const wGrams = Math.max(100, Math.round(weightKg * 1000));
    setLoadingCost(true);
    setShipOptions([]);
    setSelectedShip(null);
    try {
      const r = await fetch("/api/shipping/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: addr.cityId, weight: wGrams }),
      });
      const j = (await r.json()) as { success?: boolean; data?: ShipOption[]; error?: string };
      if (!r.ok || !j.success) throw new Error(j.error ?? "Gagal hitung ongkir");
      const opts = j.data ?? [];
      if (opts.length === 0) {
        toast.message("Tidak ada layanan ongkir untuk rute ini — coba berat atau kota lain.");
      }
      setShipOptions(opts);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal hitung ongkir");
    } finally {
      setLoadingCost(false);
    }
  };

  const useMyLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Browser tidak mendukung geolocation");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddr((a) => ({
          ...a,
          geoLat: pos.coords.latitude,
          geoLng: pos.coords.longitude,
        }));
        toast.success("Koordinat lokasi tersimpan (membantu patokan pengantaran)");
        setGeoLoading(false);
      },
      () => {
        toast.error("Izinkan akses lokasi di browser");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12_000 }
    );
  };

  const grandTotal = subtotal + (selectedShip?.cost ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUser?.id) {
      toast.error("Silakan masuk terlebih dahulu");
      return;
    }
    if (items.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }
    if (!selectedShip || !addr.cityId) {
      toast.error("Hitung ongkir dan pilih kurir layanan");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClientComponent();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast.error("Sesi habis, silakan login ulang");
        setSubmitting(false);
        return;
      }

      const weightGrams = Math.max(100, Math.round(weightKg * 1000));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: dbUser.id,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            image: i.image,
            quantity: i.quantity,
            size: i.size,
            color: i.color,
            price: i.price,
          })),
          shippingAddress: addr,
          paymentMethod: PAYMENT_PENDING,
          shippingCost: selectedShip.cost,
          courier: selectedShip.courier,
          courierService: selectedShip.service,
          weightGrams,
        }),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
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
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="h-40 bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn size={28} className="text-primary" />
        </div>
        <h2 className="font-bold text-lg mb-2">Masuk untuk Checkout</h2>
        <p className="text-muted-foreground text-sm mb-5">Kamu harus masuk untuk melanjutkan pembayaran</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-[12px]"
        >
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
        <Link
          href="/products"
          className="mt-4 inline-block px-6 py-3 bg-primary text-white font-semibold rounded-[12px] text-sm"
        >
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
        <p className="text-muted-foreground text-sm">
          Pesananmu sudah kami terima. Kamu akan diarahkan ke halaman pesanan...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Kembali ke Keranjang
      </Link>

      <h1 className="text-2xl font-bold mb-2">Checkout</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Ongkir dihitung dari kota asal gudang (zona Raja Ongkir). Alamat lengkap gudang tidak ditampilkan di website—hanya dipakai sistem sebagai titik asal lewat konfigurasi server.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <MapPin size={16} className="text-primary" /> Alamat pengiriman
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nama penerima</label>
              <input
                value={addr.name}
                onChange={(e) => setField("name", e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Nomor HP</label>
              <input
                value={addr.phone}
                onChange={(e) => setField("phone", e.target.value)}
                required
                placeholder="08xxxxxxxxxx"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Provinsi (Raja Ongkir)</label>
              <select
                value={addr.provinceId ?? ""}
                onChange={(e) => handleProvinceChange(e.target.value)}
                required
                disabled={loadingProvinces}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">{loadingProvinces ? "Memuat provinsi…" : "Pilih provinsi"}</option>
                {provinces.map((p) => (
                  <option key={p.province_id} value={p.province_id}>
                    {p.province}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Kota / kabupaten (Raja Ongkir)</label>
              <select
                value={addr.cityId ?? ""}
                onChange={(e) => handleCityChange(e.target.value)}
                required
                disabled={!addr.provinceId || loadingCities}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">
                  {!addr.provinceId ? "Pilih provinsi dulu" : loadingCities ? "Memuat kota…" : "Pilih kota"}
                </option>
                {cities.map((c) => (
                  <option key={c.city_id} value={c.city_id}>
                    {c.type} {c.city_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Kecamatan</label>
              <input
                value={addr.district}
                onChange={(e) => setField("district", e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Kode pos</label>
              <input
                value={addr.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
                required
                className="w-full px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Alamat lengkap</label>
              <textarea
                value={addr.address}
                onChange={(e) => setField("address", e.target.value)}
                required
                rows={3}
                placeholder="Jalan, RT/RW, patokan"
                className="w-full px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-y"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Catatan (opsional)</label>
              <input
                value={addr.notes ?? ""}
                onChange={(e) => setField("notes", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="col-span-2 flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={useMyLocation}
                disabled={geoLoading}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-[10px] border border-border bg-background hover:bg-muted/40 transition-colors disabled:opacity-50"
              >
                {geoLoading ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
                Simpan koordinat lokasi saya
              </button>
              {addr.geoLat != null && addr.geoLng != null && (
                <span className="text-xs text-muted-foreground">
                  Koordinat: {addr.geoLat.toFixed(5)}, {addr.geoLng.toFixed(5)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Berat + ongkir */}
        <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Truck size={16} className="text-primary" /> Ongkir (Raja Ongkir)
          </h2>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Berat paket (kg)</label>
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={weightKg}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setWeightKg(Number.isFinite(v) && v > 0 ? v : 1);
                  setShipOptions([]);
                  setSelectedShip(null);
                }}
                className="w-28 px-3 py-2.5 text-sm border border-border rounded-[10px] bg-background"
              />
            </div>
            <button
              type="button"
              onClick={hitungOngkir}
              disabled={loadingCost || !addr.cityId}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-[12px] disabled:opacity-50"
            >
              {loadingCost ? <Loader2 size={16} className="animate-spin" /> : null}
              Hitung ongkir
            </button>
          </div>

          {shipOptions.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {shipOptions.map((o) => {
                const active =
                  selectedShip?.courier === o.courier &&
                  selectedShip?.service === o.service &&
                  selectedShip?.cost === o.cost;
                return (
                  <button
                    key={`${o.courier}-${o.service}-${o.cost}`}
                    type="button"
                    onClick={() => setSelectedShip(o)}
                    className={`w-full text-left px-3 py-2.5 rounded-[12px] border text-sm transition-colors ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="font-medium">
                      {o.courierName} — {o.service}
                    </span>
                    <span className="text-muted-foreground"> · ETD {o.etd}</span>
                    <div className="text-primary font-semibold mt-0.5">{formatIDR(o.cost)}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pembayaran — tanpa detail rekening/QR */}
        <div className="bg-card border border-card-border rounded-2xl p-5 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-1">Pembayaran</p>
          <p>
            Detail transfer bank / QR dan instruksi pembayaran akan dikonfirmasi oleh tim (menyusul). Pesanan tetap terekam dengan status menunggu konfirmasi.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <ShoppingBag size={16} className="text-primary" /> Ringkasan
          </h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex justify-between text-muted-foreground"
              >
                <span className="truncate mr-2">
                  {item.name} ({item.size}/{item.color}) ×{item.quantity}
                </span>
                <span className="shrink-0">{formatIDR(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal produk</span>
              <span>{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Ongkir</span>
              <span>{selectedShip ? formatIDR(selectedShip.cost) : "—"}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary">{formatIDR(grandTotal)}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !selectedShip}
          className="w-full py-4 bg-primary text-white font-bold rounded-[14px] hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
        >
          {submitting ? "Memproses..." : `Buat pesanan • ${formatIDR(grandTotal)}`}
        </button>
      </form>
    </div>
  );
}
