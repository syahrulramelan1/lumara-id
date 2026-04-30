import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";
import { Sidebar } from "../components";
import { ordersApi } from "../lib/api";
import { parseJsonArr } from "../lib/jsonUtils";

const STATUS_FLOW = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusBadge: Record<string, string> = {
  PENDING:    "badge-yellow",
  PROCESSING: "badge-blue",
  SHIPPED:    "badge badge-purple",
  DELIVERED:  "badge-green",
  CANCELLED:  "badge-red",
};

const statusLabel: Record<string, string> = {
  PENDING:    "Pending",
  PROCESSING: "Diproses",
  SHIPPED:    "Dikirim",
  DELIVERED:  "Selesai",
  CANCELLED:  "Dibatalkan",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const EditOrder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => ordersApi.updateStatus(id!, status),
    onSuccess: (_, status) => {
      toast.success(`Status diperbarui ke ${statusLabel[status] ?? status}`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: () => toast.error("Gagal memperbarui status"),
  });

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
          {/* Left: Status + Customer + Address */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Status Pesanan</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className={`badge ${statusBadge[order.status] ?? "badge-purple"}`}>
                  {statusLabel[order.status] ?? order.status}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mb-3">Ubah status:</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.map((s) => (
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
                    {statusLabel[s] ?? s}
                  </button>
                ))}
              </div>
            </div>

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
                  <span className="text-[var(--text)]">{new Date(order.createdAt).toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

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
          </div>

          {/* Right: Items + Total */}
          <div className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditOrder;
