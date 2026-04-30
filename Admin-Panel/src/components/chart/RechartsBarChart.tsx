import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// Data penjualan bulanan dalam IDR (realistis untuk toko modest fashion)
const salesData = [
  { name: "Jan", pendapatan: 12500000, keuntungan: 4200000 },
  { name: "Feb", pendapatan: 9800000,  keuntungan: 3100000 },
  { name: "Mar", pendapatan: 28400000, keuntungan: 9800000 }, // Ramadan
  { name: "Apr", pendapatan: 18200000, keuntungan: 6400000 }, // Lebaran
  { name: "Mei", pendapatan: 14600000, keuntungan: 5100000 },
  { name: "Jun", pendapatan: 11200000, keuntungan: 3800000 },
];

const formatIDR = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000)     return `${(value / 1_000).toFixed(0)}rb`;
  return `${value}`;
};

const formatIDRFull = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl shadow-2xl overflow-hidden min-w-[180px]"
         style={{ background: "var(--bg-1)", border: "1px solid var(--border)" }}>
      <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
          {label} 2026
        </p>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: p.dataKey === "pendapatan" ? "#7c3aed" : "#10b981" }} />
              <span className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                {p.dataKey === "pendapatan" ? "Pendapatan" : "Keuntungan"}
              </span>
            </div>
            <span className="text-xs font-bold" style={{ color: "var(--text)" }}>
              {formatIDRFull(p.value)}
            </span>
          </div>
        ))}
        {payload.length === 2 && (
          <div className="pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Margin</span>
              <span className="text-xs font-bold text-emerald-500">
                {((payload[1].value / payload[0].value) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Warna bar berdasarkan nilai tertinggi (highlight Maret = Ramadan)
const maxPendapatan = Math.max(...salesData.map((d) => d.pendapatan));

const RechartsBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={salesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barGap={4} barCategoryGap="30%">
        <defs>
          <linearGradient id="gradPendapatan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="gradKeuntungan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="gradPendapatanPeak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d28d9" stopOpacity={1} />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.85} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="4 4"
          stroke="var(--border)"
          vertical={false}
          opacity={0.6}
        />

        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "var(--text-muted)", fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
          dy={6}
        />

        <YAxis
          tickFormatter={formatIDR}
          tick={{ fontSize: 10, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
          width={42}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border)", opacity: 0.4, radius: 6 }} />

        <Bar dataKey="pendapatan" radius={[6, 6, 0, 0]} maxBarSize={28}>
          {salesData.map((entry) => (
            <Cell
              key={entry.name}
              fill={entry.pendapatan === maxPendapatan ? "url(#gradPendapatanPeak)" : "url(#gradPendapatan)"}
            />
          ))}
        </Bar>

        <Bar dataKey="keuntungan" radius={[6, 6, 0, 0]} maxBarSize={28} fill="url(#gradKeuntungan)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RechartsBarChart;
