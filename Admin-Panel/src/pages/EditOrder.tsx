import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineArrowLeft } from "react-icons/hi";
import {
  HiTruck, HiPlus, HiCheckCircle, HiExclamationCircle,
  HiLocationMarker, HiClock,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { Sidebar } from "../components";
import { ordersApi, ApiOrderTracking } from "../lib/api";
import { parseJsonArr } from "../lib/jsonUtils";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_MANUAL = ["PENDING", "PAID", "PROCESSING", "DELIVERED", "CANCELLED"] as const;

const statusBadge: Record<string, string> = {
  PENDING:    "badge-yellow",
  PAID:       "badge-blue",
  PROCESSING: "badge-blue",
  SHIPPED:    "badge badge-purple",
  DELIVERED:  "badge-green",
  CANCELLED:  "badge-red",
};

const statusLabel: Record<string, string> = {
  PENDING:    "Pending",
  PAID:       "Dibayar",
  PROCESSING: "Diproses",
  SHIPPED:    "Dikirim",
  DELIVERED:  "Selesai",
  CANCELLED:  "Dibatalkan",
};

const COURIERS = ["JNE", "J&T Express", "SiCepat", "Anteraja", "Ninja Express", "Pos Indonesia", "TIKI"];

const TRACKING_TEMPLATES = [
  { status: "Dikemas",           description: "Pesanan sedang dikemas oleh Lumara.id." },
  { status: "Diserahkan ke Kurir", description: "Paket telah diserahkan ke kurir." },
  { status: "Di Gudang Kurir",   description: "Paket sedang berada di gudang kurir." },
  { status: "Dalam Perjalanan",  description: "Paket sedang dalam perjalanan menuju kota tujuan." },
  { status: "Tiba Kota Tujuan",  description: "Paket telah tiba di kota tujuan." },
  { status: "Sedang Diantar",    description: "Paket sedang dalam proses pengantaran ke alamat tujuan." },
  { status: "Gagal Antar",       description: "Pengiriman gagal. Kurir akan mencoba kembali pada hari berikutnya." },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(s: string | null | undefined) {
  if (!s) return "—";
  return new Date(s).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function formatDateOnly(s: string | null | undefined) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("id-ID", { dateStyle: "long" });
}

// ─── Tracking Timeline Item ───────────────────────────────────────────────────

function TrackingItem({ item, last }: { item: ApiOrderTracking; last: boolean }) {
  const isDelivered = item.status.toLowerCase().includes("diterima") || item.status.toLowerCase().includes("selesai");
  const isFailed    = item.status.toLowerCase().includes("gagal") || item.status.toLowerCase().includes("batal");

  return (
    <div className="relative flex gap-4">
      {/* Line */}
      {!last && (
        <div className="absolute left-[13px] top-7 bottom-0 w-px bg-[var(--border)]" />
      )}
      {/* Dot */}
      <div className="flex-shrink-0 mt-1">
        {isDelivered ? (
          <HiCheckCircle className="w-7 h-7 text-green-500" />
        ) : isFailed ? (
          <HiExclamationCircle className="w-7 h-7 text-red-500" />
        ) : (
          <div className="w-7 h-7 rounded-full border-2 border-[var(--brand)] bg-[var(--bg)] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--brand)]" />
          </div>
        )}
      </div>
      {/* Content */}
      <div className="pb-5 flex-1 min-w-0">
        <p className="font-semibold text-sm text-[var(--text)]">{item.status}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.description}</p>
        {item.location && (
          <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-1">
            <HiLocationMarker className="w-3 h-3 flex-shrink-0" />
            {item.location}
          </p>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
          <HiClock className="w-3 h-3 flex-shrink-0" />
          {formatDate(item.createdAt)}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const EditOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Ship form
  const [shipForm, setShipForm] = useState({
    courier: "", courierService: "", trackingNumber: "", estimatedArrival: "", note: "",
  });

  // Tracking form
  const [trackForm, setTrackForm] = useState({ status: "", description: "", location: "" });

  // ── Queries ──

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  });

  // ── Mutations ──

  const statusMutation = useMutation({
    mutationFn: (status: string) => ordersApi.updateStatus(id!, status),
    onSuccess: (_, status) => {
      toast.success(`Status diubah ke ${statusLabel[status] ?? status}`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || "Gagal mengubah status");
    },
  });

  const shipMutation = useMutation({
    mutationFn: () => ordersApi.ship(id!, {
      courier: shipForm.courier,
      courierService: shipForm.courierService,
      trackingNumber: shipForm.trackingNumber,
      estimatedArrival: shipForm.estimatedArrival,
      note: shipForm.note || undefined,
    }),
    onSuccess: () => {
      toast.success("Pesanan ditandai dikirim!");
      setShipForm({ courier: "", courierService: "", trackingNumber: "", estimatedArrival: "", note: "" });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || "Gagal mengubah status ke dikirim");
    },
  });

  const trackMutation = useMutation({
    mutationFn: (data: { status: string; description: string; location?: string }) =>
      ordersApi.addTracking(id!, data),
    onSuccess: () => {
      toast.success("Update pengiriman ditambahkan");
      setTrackForm({ status: "", description: "", location: "" });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || "Gagal menambah update");
    },
  });

  const handleQuickTemplate = (tpl: { status: string; description: string }) => {
    trackMutation.mutate({ status: tpl.status, description: tpl.description });
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackForm.status.trim() || !trackForm.description.trim()) {
      toast.error("Status dan deskripsi wajib diisi");
      return;
    }
    trackMutation.mutate({
      status: trackForm.status.trim(),
      description: trackForm.description.trim(),
      location: trackForm.location.trim() || undefined,
    });
  };

  const handleShipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipForm.courier || !shipForm.courierService.trim() || !shipForm.trackingNumber.trim() || !shipForm.estimatedArrival) {
      toast.error("Semua kolom pengiriman wajib diisi");
      return;
    }
    shipMutation.mutate();
  };

  // ── Render guards ──

  if (isLoading) return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
        Pesanan tidak ditemukan
      </div>
    </div>
  );

  const address = (() => {
    try { return JSON.parse(order.shippingAddress as string); }
    catch { return null; }
  })();

  const trackings = [...(order.trackings ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const canShip  = order.status === "PAID" || order.status === "PROCESSING";
  const hasShipped = order.status === "SHIPPED" || order.status === "DELIVERED";

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Detail Pesanan</h2>
            <p className="page-subtitle">#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={() => navigate("/orders")} className="btn-ghost flex items-center gap-2 text-sm">
            <HiOutlineArrowLeft />
            Kembali
          </button>
        </div>

        <div className="p-3 sm:p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-6">

            {/* Status */}
            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Status Pesanan</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className={`badge ${statusBadge[order.status] ?? "badge-purple"}`}>
                  {statusLabel[order.status] ?? order.status}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Ubah status (gunakan form "Kirim Paket" untuk menandai DIKIRIM):
              </p>
              <div className="flex flex-wrap gap-2">
                {STATUS_MANUAL.map((s) => (
                  <button
                    key={s}
                    disabled={order.status === s || statusMutation.isPending}
                    onClick={() => statusMutation.mutate(s)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${
                      order.status === s
                        ? "border-[var(--brand)] text-[var(--brand)] bg-[var(--brand-light)]"
                        : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    }`}
                  >
                    {statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer */}
            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Informasi Pelanggan</h3>
              <div className="flex items-center gap-3 mb-4">
                {order.user.avatar ? (
                  <img src={order.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-2)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {(order.user.name || order.user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-[var(--text)]">{order.user.name || "—"}</p>
                  <p className="text-sm text-[var(--text-muted)]">{order.user.email}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Metode Bayar</span>
                  <span className="font-medium text-[var(--text)]">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Tanggal</span>
                  <span className="text-[var(--text)]">{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            {address && (
              <div className="card p-6">
                <h3 className="font-semibold text-[var(--text)] mb-4">Alamat Pengiriman</h3>
                <div className="space-y-1 text-sm text-[var(--text)]">
                  {address.name && <p className="font-medium">{address.name}</p>}
                  {address.phone && <p className="text-[var(--text-muted)]">{address.phone}</p>}
                  {address.address && <p>{address.address}</p>}
                  {(address.city || address.province) && (
                    <p>{[address.city, address.province].filter(Boolean).join(", ")}</p>
                  )}
                  {address.postalCode && <p>{address.postalCode}</p>}
                </div>
              </div>
            )}

            {/* Shipping info (if already shipped) */}
            {hasShipped && order.courier && (
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <HiTruck className="w-5 h-5 text-[var(--brand)]" />
                  <h3 className="font-semibold text-[var(--text)]">Informasi Pengiriman</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Kurir</span>
                    <span className="font-medium text-[var(--text)]">{order.courier} — {order.courierService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">No. Resi</span>
                    <span className="font-mono font-bold text-[var(--brand)]">{order.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Dikirim</span>
                    <span className="text-[var(--text)]">{formatDate(order.shippedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Est. Tiba</span>
                    <span className="font-medium text-[var(--text)]">{formatDateOnly(order.estimatedArrival)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ship form (only when can ship) */}
            {canShip && (
              <div className="card p-6 border-[var(--brand)] border-2">
                <div className="flex items-center gap-2 mb-4">
                  <HiTruck className="w-5 h-5 text-[var(--brand)]" />
                  <h3 className="font-semibold text-[var(--text)]">Tandai Dikirim</h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-4">
                  Isi data pengiriman setelah paket diserahkan ke kurir.
                </p>
                <form onSubmit={handleShipSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Kurir *</label>
                    <select
                      value={shipForm.courier}
                      onChange={(e) => setShipForm((f) => ({ ...f, courier: e.target.value }))}
                      className="input-base"
                      required
                    >
                      <option value="">Pilih kurir…</option>
                      {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Layanan *</label>
                    <input
                      type="text"
                      placeholder="cth: REG, YES, OKE"
                      value={shipForm.courierService}
                      onChange={(e) => setShipForm((f) => ({ ...f, courierService: e.target.value }))}
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">No. Resi *</label>
                    <input
                      type="text"
                      placeholder="Nomor resi pengiriman"
                      value={shipForm.trackingNumber}
                      onChange={(e) => setShipForm((f) => ({ ...f, trackingNumber: e.target.value }))}
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Estimasi Tiba *</label>
                    <input
                      type="date"
                      value={shipForm.estimatedArrival}
                      onChange={(e) => setShipForm((f) => ({ ...f, estimatedArrival: e.target.value }))}
                      className="input-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Catatan (opsional)</label>
                    <input
                      type="text"
                      placeholder="cth: Paket sudah dibungkus bubble wrap"
                      value={shipForm.note}
                      onChange={(e) => setShipForm((f) => ({ ...f, note: e.target.value }))}
                      className="input-base"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={shipMutation.isPending}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
                  >
                    <HiTruck className="w-4 h-4" />
                    {shipMutation.isPending ? "Menyimpan…" : "Tandai Dikirim"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-6">

            {/* Order items */}
            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">
                Produk Dipesan ({order.items.length})
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => {
                  const imgs = parseJsonArr(item.product.images);
                  return (
                    <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-2)] border border-[var(--border)]">
                      {imgs[0] ? (
                        <img src={imgs[0]} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-[var(--bg-3)] flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text)] truncate">{item.product.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {[item.size, item.color].filter(Boolean).join(" · ")}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {item.quantity}x {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[var(--brand)] whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Ringkasan</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[var(--text)]">
                  <span>Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                  <span>{formatPrice(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[var(--border)]">
                  <span className="font-bold text-[var(--text)]">Total</span>
                  <span className="font-bold text-base text-[var(--brand)]">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Tracking update section */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <HiPlus className="w-5 h-5 text-[var(--brand)]" />
                <h3 className="font-semibold text-[var(--text)]">Tambah Update Pengiriman</h3>
              </div>

              {/* Quick templates */}
              <p className="text-xs text-[var(--text-muted)] mb-2">Template cepat:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {TRACKING_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.status}
                    disabled={trackMutation.isPending}
                    onClick={() => handleQuickTemplate(tpl)}
                    className="px-2.5 py-1 text-xs rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors disabled:opacity-50"
                  >
                    {tpl.status}
                  </button>
                ))}
              </div>

              {/* Manual form */}
              <form onSubmit={handleTrackSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Status *</label>
                  <input
                    type="text"
                    placeholder="cth: Tiba di Kota Tujuan"
                    value={trackForm.status}
                    onChange={(e) => setTrackForm((f) => ({ ...f, status: e.target.value }))}
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Deskripsi *</label>
                  <textarea
                    rows={2}
                    placeholder="Detail update pengiriman…"
                    value={trackForm.description}
                    onChange={(e) => setTrackForm((f) => ({ ...f, description: e.target.value }))}
                    className="input-base resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Lokasi (opsional)</label>
                  <input
                    type="text"
                    placeholder="cth: Gudang Jakarta Timur"
                    value={trackForm.location}
                    onChange={(e) => setTrackForm((f) => ({ ...f, location: e.target.value }))}
                    className="input-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={trackMutation.isPending}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <HiPlus className="w-4 h-4" />
                  {trackMutation.isPending ? "Menyimpan…" : "Tambah Update"}
                </button>
              </form>
            </div>

            {/* Tracking timeline */}
            {trackings.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-[var(--text)] mb-5">
                  Riwayat Pengiriman ({trackings.length})
                </h3>
                <div>
                  {trackings.map((t, i) => (
                    <TrackingItem key={t.id} item={t} last={i === trackings.length - 1} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;
