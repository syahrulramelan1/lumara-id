import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar, SearchInput } from "../components";
import OrderTable from "../components/OrderTable";
import { ordersApi } from "../lib/api";

const statusOptions = ["SEMUA", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => ordersApi.list().then((r) => r.data),
  });

  const orders = (data?.data ?? []).filter((o) => {
    const matchStatus = statusFilter === "SEMUA" || o.status === statusFilter;
    const matchSearch = search
      ? (o.user.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        o.user.email.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Semua Pesanan</h2>
            <p className="page-subtitle">
              {data?.total !== undefined ? `${data.total} pesanan masuk` : "Kelola pesanan pelanggan"}
            </p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari nama / email..."
              className="w-72"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-base w-auto"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="card p-12 text-center text-[var(--text-muted)]">Tidak ada pesanan ditemukan</div>
          ) : (
            <div className="card overflow-hidden">
              <OrderTable orders={orders} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Orders;
