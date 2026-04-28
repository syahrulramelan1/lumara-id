import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Sidebar } from "../components";
import { ordersApi } from "../lib/api";

const STATUS_FLOW = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusClass: Record<string, string> = {
  PENDING:    "bg-yellow-700 text-white",
  PROCESSING: "bg-blue-700 text-white",
  SHIPPED:    "bg-indigo-700 text-white",
  DELIVERED:  "bg-green-700 text-white",
  CANCELLED:  "bg-red-700 text-white",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function parseImages(raw: string): string[] {
  try { const a = JSON.parse(raw); return Array.isArray(a) ? a : []; }
  catch { return []; }
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
      toast.success(`Status diperbarui ke ${status}`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: () => toast.error("Gagal memperbarui status"),
  });

  if (isLoading) return (
    <div className="flex h-screen dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 dark:border-white border-black border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!order) return (
    <div className="flex h-screen dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center dark:text-gray-400 text-gray-500">
        Pesanan tidak ditemukan
      </div>
    </div>
  );

  const address = (() => {
    try { return JSON.parse(order.shippingAddress); }
    catch { return null; }
  })();

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b dark:border-gray-800 border-gray-200 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div>
              <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">Detail Pesanan</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <button
              onClick={() => navigate("/orders")}
              className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg hover:border-gray-400 duration-200 flex items-center justify-center dark:text-whiteSecondary text-blackPrimary"
            >
              Kembali
            </button>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Left: Info & Status */}
            <div className="space-y-8">
              {/* Status Flow */}
              <section>
                <h3 className="text-xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">Status Pesanan</h3>
                <div className="flex items-center mb-4">
                  <span className={`text-sm font-semibold px-3 py-1 rounded ${statusClass[order.status] ?? "bg-gray-600 text-white"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUS_FLOW.map((s) => (
                    <button
                      key={s}
                      disabled={order.status === s || statusMutation.isPending}
                      onClick={() => statusMutation.mutate(s)}
                      className={`px-3 py-1.5 text-sm font-medium border transition-colors disabled:opacity-50 ${
                        order.status === s
                          ? "border-blue-500 dark:text-blue-400 text-blue-600"
                          : "dark:border-gray-600 border-gray-300 dark:text-whiteSecondary text-blackPrimary hover:border-gray-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              {/* Customer Info */}
              <section>
                <h3 className="text-xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">Informasi Pelanggan</h3>
                <div className="flex items-center gap-3 mb-4">
                  {order.user.avatar ? (
                    <img src={order.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full dark:bg-gray-600 bg-gray-300 flex items-center justify-center font-bold dark:text-white text-black">
                      {(order.user.name || order.user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium dark:text-whiteSecondary text-blackPrimary">{order.user.name || "—"}</p>
                    <p className="text-sm dark:text-gray-400 text-gray-500">{order.user.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm dark:text-whiteSecondary text-blackPrimary">
                  <div className="flex justify-between">
                    <span className="dark:text-gray-400 text-gray-500">Metode Bayar</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="dark:text-gray-400 text-gray-500">Tanggal</span>
                    <span>{new Date(order.createdAt).toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              {address && (
                <section>
                  <h3 className="text-xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">Alamat Pengiriman</h3>
                  <div className="space-y-1 text-sm dark:text-whiteSecondary text-blackPrimary">
                    {address.name && <p className="font-medium">{address.name}</p>}
                    {address.phone && <p className="dark:text-gray-400 text-gray-500">{address.phone}</p>}
                    {address.address && <p>{address.address}</p>}
                    {(address.city || address.province) && (
                      <p>{[address.city, address.province].filter(Boolean).join(", ")}</p>
                    )}
                    {address.postalCode && <p>{address.postalCode}</p>}
                  </div>
                </section>
              )}
            </div>

            {/* Right: Items & Total */}
            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">
                  Produk Dipesan ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map((item) => {
                    const imgs = parseImages(item.product.images);
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-3 border dark:border-gray-700 border-gray-200">
                        {imgs[0] ? (
                          <img src={imgs[0]} alt="" className="w-14 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-14 h-14 rounded dark:bg-gray-700 bg-gray-200" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium dark:text-whiteSecondary text-blackPrimary truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs dark:text-gray-400 text-gray-500">
                            {[item.size, item.color].filter(Boolean).join(" · ")}
                          </p>
                          <p className="text-xs dark:text-gray-400 text-gray-500">
                            {item.quantity}x {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="text-sm font-bold dark:text-rose-300 text-rose-600 whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">Ringkasan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between dark:text-whiteSecondary text-blackPrimary">
                    <span>Subtotal ({order.items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                    <span>{formatPrice(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t dark:border-gray-700 border-gray-200">
                    <span className="font-bold dark:text-whiteSecondary text-blackPrimary">Total</span>
                    <span className="font-bold text-lg dark:text-rose-300 text-rose-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditOrder;
