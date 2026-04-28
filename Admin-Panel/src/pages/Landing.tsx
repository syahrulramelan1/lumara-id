import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components";
import { RechartsBarChart } from "../components/chart";
import { dashboardApi } from "../lib/api";
import {
  HiOutlineShoppingBag, HiOutlineTag, HiOutlineClipboardList,
  HiOutlineCurrencyDollar, HiOutlineClock, HiOutlineUsers,
} from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const statCards = (stats: {
  totalProducts: number; totalCategories: number; totalOrders: number;
  totalRevenue: number; pendingOrders: number; totalUsers: number;
}) => [
  { label: "Total Produk",    value: String(stats.totalProducts),        icon: HiOutlineShoppingBag,    color: "text-blue-500" },
  { label: "Kategori",        value: String(stats.totalCategories),       icon: HiOutlineTag,            color: "text-purple-500" },
  { label: "Total Pesanan",   value: String(stats.totalOrders),           icon: HiOutlineClipboardList,  color: "text-indigo-500" },
  { label: "Total Pendapatan",value: formatPrice(stats.totalRevenue),     icon: HiOutlineCurrencyDollar, color: "text-green-500" },
  { label: "Pesanan Pending", value: String(stats.pendingOrders),         icon: HiOutlineClock,          color: "text-yellow-500" },
  { label: "Total Pengguna",  value: String(stats.totalUsers),            icon: HiOutlineUsers,          color: "text-rose-500" },
];

const Landing = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.stats().then((r) => r.data.data),
  });

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Admin";

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">
              Selamat datang, {displayName}
            </h2>
            <p className="text-base dark:text-gray-400 text-gray-500 mt-1">
              Berikut adalah ringkasan toko Anda hari ini.
            </p>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 dark:border-white border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {statCards(data).map((card) => (
                  <div key={card.label} className="border dark:border-gray-700 border-gray-200 p-5 flex items-center gap-4">
                    <div className={`text-3xl ${card.color}`}>
                      <card.icon />
                    </div>
                    <div>
                      <p className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary">{card.value}</p>
                      <p className="text-sm dark:text-gray-400 text-gray-500">{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="border dark:border-gray-700 border-gray-200 p-6">
                <h3 className="text-xl font-bold dark:text-whiteSecondary text-blackPrimary mb-5">
                  Ikhtisar Penjualan
                </h3>
                <div style={{ height: 300 }}>
                  <RechartsBarChart />
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default Landing;
