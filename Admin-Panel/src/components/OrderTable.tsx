import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ordersApi, type ApiOrder } from "../lib/api";

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

const OrderTable = ({ orders }: { orders: ApiOrder[] }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: ordersApi.delete,
    onSuccess: () => { toast.success("Pesanan dihapus"); queryClient.invalidateQueries({ queryKey: ["orders"] }); },
    onError: () => toast.error("Gagal menghapus pesanan"),
  });

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <thead className="border-b dark:border-white/10 border-gray-200 text-sm dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Pelanggan</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Status</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Total</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Tanggal</th>
          <th className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-6 lg:pr-8">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y dark:divide-white/5 divide-gray-100">
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-3">
                {order.user.avatar ? (
                  <img src={order.user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full dark:bg-gray-600 bg-gray-300 flex items-center justify-center text-sm font-bold dark:text-white text-black">
                    {(order.user.name || order.user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium dark:text-whiteSecondary text-blackPrimary">{order.user.name || "—"}</p>
                  <p className="text-xs dark:text-gray-400 text-gray-500">{order.user.email}</p>
                </div>
              </div>
            </td>
            <td className="py-4 pl-0 pr-8">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${statusClass[order.status] ?? "bg-gray-600 text-white"}`}>
                {order.status}
              </span>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm font-bold dark:text-rose-300 text-rose-600">{formatPrice(order.total)}</td>
            <td className="py-4 pl-0 pr-8 text-sm dark:text-gray-400 text-gray-500">
              {new Date(order.createdAt).toLocaleDateString("id-ID")}
            </td>
            <td className="py-4 pl-0 pr-4 text-right sm:pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link to={`/orders/${order.id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-gray-400 transition-colors">
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <Link to={`/orders/${order.id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-gray-400 transition-colors">
                  <HiOutlineEye className="text-lg" />
                </Link>
                <button onClick={() => { if (window.confirm("Hapus pesanan ini?")) deleteMutation.mutate(order.id); }}
                  disabled={deleteMutation.isPending}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-rose-400 text-rose-500 border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-rose-400 transition-colors disabled:opacity-50">
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default OrderTable;
