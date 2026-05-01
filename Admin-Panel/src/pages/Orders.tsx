import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar, SearchInput, Pagination } from "../components";
import OrderTable from "../components/OrderTable";
import { ordersApi } from "../lib/api";

const statusOptions = ["SEMUA", "PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const PER_PAGE = 20;

const Orders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("SEMUA");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => ordersApi.list(page).then((r) => r.data),
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

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
              {total > 0 ? `${total} pesanan masuk` : "Kelola pesanan pelanggan"}
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari di halaman ini..."
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
              <div className="w-10 h-10 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="card p-12 text-center text-[var(--text-muted)]">Tidak ada pesanan ditemukan</div>
          ) : (
            <>
              <div className="card overflow-hidden">
                <OrderTable orders={orders} />
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                perPage={PER_PAGE}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Orders;
