import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ordersApi, type ApiOrder } from "../lib/api";

const statusBadge: Record<string, string> = {
  PENDING:    "badge-yellow",
  PROCESSING: "badge-blue",
  SHIPPED:    "badge-purple",
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

const OrderTable = ({ orders }: { orders: ApiOrder[] }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: ordersApi.delete,
    onSuccess: () => { toast.success("Pesanan dihapus"); queryClient.invalidateQueries({ queryKey: ["orders"] }); },
    onError: () => toast.error("Gagal menghapus pesanan"),
  });

  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            <th>Pelanggan</th>
            <th>Status</th>
            <th>Total</th>
            <th>Tanggal</th>
            <th className="text-right pr-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <div className="flex items-center gap-3">
                  {order.user.avatar ? (
                    <img src={order.user.avatar} alt="" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-700 to-brand-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {(order.user.name || order.user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text)]">{order.user.name || "—"}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate max-w-[160px]">{order.user.email}</p>
                  </div>
                </div>
              </td>
              <td>
                <span className={`badge ${statusBadge[order.status] ?? "badge-purple"}`}>
                  {statusLabel[order.status] ?? order.status}
                </span>
              </td>
              <td className="font-semibold text-brand-600 dark:text-brand-400">{formatPrice(order.total)}</td>
              <td className="text-[var(--text-muted)]">{new Date(order.createdAt).toLocaleDateString("id-ID")}</td>
              <td>
                <div className="flex items-center justify-end gap-1.5 pr-4">
                  <Link to={`/orders/${order.id}`} className="btn-icon" title="Edit">
                    <HiOutlinePencil />
                  </Link>
                  <Link to={`/orders/${order.id}`} className="btn-icon" title="Detail">
                    <HiOutlineEye />
                  </Link>
                  <button
                    onClick={() => { if (window.confirm("Hapus pesanan ini?")) deleteMutation.mutate(order.id); }}
                    disabled={deleteMutation.isPending}
                    className="btn-icon btn-icon-danger disabled:opacity-40"
                    title="Hapus"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default OrderTable;
