import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components";
import { RechartsBarChart } from "../components/chart";
import { dashboardApi, settingsApi } from "../lib/api";
import {
  HiOutlineShoppingBag, HiOutlineTag, HiOutlineClipboardList,
  HiOutlineCurrencyDollar, HiOutlineClock, HiOutlineUsers,
} from "react-icons/hi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

const statCards = (stats: {
  totalProducts: number; totalCategories: number; totalOrders: number;
  totalRevenue: number; pendingOrders: number; totalUsers: number;
}) => [
  { label: "Total Produk",     value: String(stats.totalProducts),    icon: HiOutlineShoppingBag,   bg: "bg-purple-100 dark:bg-purple-900/30", color: "text-purple-600 dark:text-purple-400" },
  { label: "Kategori",         value: String(stats.totalCategories),  icon: HiOutlineTag,           bg: "bg-blue-100 dark:bg-blue-900/30",    color: "text-blue-600 dark:text-blue-400" },
  { label: "Total Pesanan",    value: String(stats.totalOrders),      icon: HiOutlineClipboardList, bg: "bg-indigo-100 dark:bg-indigo-900/30",color: "text-indigo-600 dark:text-indigo-400" },
  { label: "Total Pendapatan", value: formatPrice(stats.totalRevenue), icon: HiOutlineCurrencyDollar,bg: "bg-green-100 dark:bg-green-900/30",  color: "text-green-600 dark:text-green-400" },
  { label: "Pesanan Pending",  value: String(stats.pendingOrders),    icon: HiOutlineClock,         bg: "bg-yellow-100 dark:bg-yellow-900/30",color: "text-yellow-600 dark:text-yellow-400" },
  { label: "Total Pengguna",   value: String(stats.totalUsers),       icon: HiOutlineUsers,         bg: "bg-rose-100 dark:bg-rose-900/30",    color: "text-rose-600 dark:text-rose-400" },
];

const Landing = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.stats().then((r) => r.data.data),
  });

  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get().then((r) => r.data.data),
  });

  const toggleMaintenance = useMutation({
    mutationFn: (active: boolean) => settingsApi.setMaintenance(active).then((r) => r.data.data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["settings"], { maintenance: updated.maintenance });
    },
  });

  const isMaintenance = settingsData?.maintenance ?? false;

  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Admin";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Page header */}
        <div className="page-header">
          <div>
            <h2 className="page-title">{greeting}, {displayName} 👋</h2>
            <p className="page-subtitle">Berikut ringkasan toko Anda hari ini</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Maintenance Toggle */}
            <button
              onClick={() => toggleMaintenance.mutate(!isMaintenance)}
              disabled={settingsLoading || toggleMaintenance.isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                isMaintenance
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50"
                  : "bg-[var(--bg-3)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--bg-2)]"
              }`}
            >
              <HiOutlineWrenchScrewdriver className="text-base" />
              {toggleMaintenance.isPending || settingsLoading
                ? "Memproses..."
                : isMaintenance
                ? "Maintenance ON — Klik untuk Matikan"
                : "Mode Maintenance"}
            </button>
            <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-3)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data ? (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {statCards(data).map((card) => (
                  <div key={card.label} className="stat-card card-hover">
                    <div className={`stat-icon ${card.bg}`}>
                      <card.icon className={card.color} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--text)]">{card.value}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">Ikhtisar Penjualan</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Data penjualan bulanan</p>
                  </div>
                  <span className="badge badge-purple">2025</span>
                </div>
                <div style={{ height: 300 }}>
                  <RechartsBarChart />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-[var(--text-muted)]">Gagal memuat data</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Landing;
