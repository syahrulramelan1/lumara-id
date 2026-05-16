import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components";
import { RechartsBarChart } from "../components/chart";
import { dashboardApi, settingsApi } from "../lib/api";
import {
  HiOutlineShoppingBag, HiOutlineTag, HiOutlineClipboardList,
  HiOutlineCurrencyDollar, HiOutlineClock, HiOutlineUsers, HiOutlineStar,
} from "react-icons/hi";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

function formatPrice(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

interface DashboardStats {
  totalProducts: number; totalCategories: number; totalOrders: number;
  totalRevenue: number; pendingOrders: number; totalUsers: number;
  storeRating: number; totalReviews: number;
  productRatings: { id: string; name: string; rating: number; reviewCount: number }[];
}

const statCards = (stats: DashboardStats) => [
  { label: "Total Produk",     value: String(stats.totalProducts),    icon: HiOutlineShoppingBag,   bg: "bg-purple-100 dark:bg-purple-900/30", color: "text-purple-600 dark:text-purple-400" },
  { label: "Kategori",         value: String(stats.totalCategories),  icon: HiOutlineTag,           bg: "bg-blue-100 dark:bg-blue-900/30",    color: "text-blue-600 dark:text-blue-400" },
  { label: "Total Pesanan",    value: String(stats.totalOrders),      icon: HiOutlineClipboardList, bg: "bg-indigo-100 dark:bg-indigo-900/30",color: "text-indigo-600 dark:text-indigo-400" },
  { label: "Total Pendapatan", value: formatPrice(stats.totalRevenue), icon: HiOutlineCurrencyDollar,bg: "bg-green-100 dark:bg-green-900/30",  color: "text-green-600 dark:text-green-400" },
  { label: "Pesanan Pending",  value: String(stats.pendingOrders),    icon: HiOutlineClock,         bg: "bg-yellow-100 dark:bg-yellow-900/30",color: "text-yellow-600 dark:text-yellow-400" },
  { label: "Total Pengguna",   value: String(stats.totalUsers),       icon: HiOutlineUsers,         bg: "bg-rose-100 dark:bg-rose-900/30",    color: "text-rose-600 dark:text-rose-400" },
];

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const frac = rating - full;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = i < full ? 1 : i === full ? frac : 0;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <HiOutlineStar className="absolute inset-0 text-yellow-300" style={{ width: size, height: size }} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <HiOutlineStar className="text-yellow-400" style={{ width: size, height: size, fill: "currentColor" }} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

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

              {/* Rating Toko */}
              {data.productRatings?.length > 0 && (
                <div className="card p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <HiOutlineStar className="text-yellow-400 text-lg" style={{ fill: "currentColor" }} />
                    <h3 className="font-semibold text-[var(--text)]">Rating Toko</h3>
                    <span className="ml-auto text-xs text-[var(--text-muted)] bg-[var(--bg-3)] px-2 py-1 rounded border border-[var(--border)]">
                      weighted avg dari semua produk
                    </span>
                  </div>

                  {/* Angka besar store rating */}
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center min-w-[110px] bg-[var(--bg-3)] rounded-xl p-4 border border-[var(--border)]">
                      <span className="text-5xl font-bold text-yellow-500 leading-none">
                        {data.storeRating?.toFixed(1) ?? "—"}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] mt-1">dari 5</span>
                      <div className="mt-2">
                        <StarDisplay rating={data.storeRating ?? 0} size={14} />
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] mt-1.5">
                        {(data.totalReviews ?? 0).toLocaleString("id-ID")} ulasan
                      </span>
                    </div>

                    {/* Breakdown per produk */}
                    <div className="flex-1 space-y-3 w-full">
                      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide mb-3">Breakdown per Produk</p>
                      {data.productRatings.map((p: { id: string; name: string; rating: number; reviewCount: number }) => {
                        const pct = (p.rating / 5) * 100;
                        const ratingColor =
                          p.rating >= 4.8 ? "text-emerald-600 dark:text-emerald-400" :
                          p.rating >= 4.5 ? "text-yellow-600 dark:text-yellow-400" :
                          p.rating >= 4.0 ? "text-orange-500" : "text-red-500";
                        const barColor =
                          p.rating >= 4.8 ? "bg-emerald-500" :
                          p.rating >= 4.5 ? "bg-yellow-400" :
                          p.rating >= 4.0 ? "bg-orange-400" : "bg-red-400";
                        return (
                          <div key={p.id} className="space-y-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm text-[var(--text)] truncate max-w-[260px]" title={p.name}>
                                {p.name}
                              </p>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-sm font-bold ${ratingColor}`}>
                                  {p.rating.toFixed(1)}
                                </span>
                                <StarDisplay rating={p.rating} size={12} />
                                <span className="text-[11px] text-[var(--text-muted)] w-20 text-right">
                                  {p.reviewCount.toLocaleString("id-ID")} ulasan
                                </span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-[var(--bg-3)] rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}

                      {/* Legenda warna */}
                      <div className="flex gap-4 flex-wrap mt-2 pt-2 border-t border-[var(--border)]">
                        {[
                          { label: "≥ 4.8", color: "bg-emerald-500" },
                          { label: "≥ 4.5", color: "bg-yellow-400" },
                          { label: "≥ 4.0", color: "bg-orange-400" },
                          { label: "< 4.0", color: "bg-red-400" },
                        ].map(l => (
                          <div key={l.label} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                            <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                            {l.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Chart */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div>
                    <h3 className="font-semibold text-[var(--text)]">Ikhtisar Penjualan</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">Pendapatan & keuntungan bulanan (IDR)</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Legend */}
                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />
                        Pendapatan
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                        Keuntungan
                      </span>
                    </div>
                    <span className="badge badge-purple">2026</span>
                  </div>
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
