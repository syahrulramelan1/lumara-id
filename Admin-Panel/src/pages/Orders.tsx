import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components";
import OrderTable from "../components/OrderTable";
import { HiOutlineChevronRight, HiOutlineSearch } from "react-icons/hi";
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
    <div className="h-auto border-t dark:border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">Semua Pesanan</h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base flex items-center gap-1">
                <span>Dashboard</span>
                <HiOutlineChevronRight />
                <span>Pesanan</span>
                {data?.total !== undefined && (
                  <span className="ml-2 text-sm dark:text-gray-400 text-gray-500">({data.total} pesanan)</span>
                )}
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
                placeholder="Cari nama / email..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48 h-10 dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 cursor-pointer hover:border-gray-500"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 dark:border-white border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 dark:text-gray-400 text-gray-500">Tidak ada pesanan ditemukan</div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8">
              <OrderTable orders={orders} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Orders;
