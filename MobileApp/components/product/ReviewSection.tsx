"use client";
import { useState, useMemo } from "react";
import { Star } from "lucide-react";
import type { ReviewWithUser } from "@/types";

interface ReviewSectionProps {
  reviews: ReviewWithUser[];
  rating: number;
  reviewCount: number;
}

// Nama disamarkan seperti Shopee: "Siti Rahayu" → "S*** R***"
function maskName(name: string | null): string {
  if (!name) return "Pembeli";
  return name
    .split(" ")
    .map((w) => (w.length <= 1 ? w : w[0] + "*".repeat(Math.min(w.length - 1, 3))))
    .join(" ");
}

// Tanggal relatif
function relativeDate(date: Date | string): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months= Math.floor(days / 30);
  if (mins  < 60)  return `${mins} menit lalu`;
  if (hours < 24)  return `${hours} jam lalu`;
  if (days  < 7)   return `${days} hari lalu`;
  if (weeks < 4)   return `${weeks} minggu lalu`;
  if (months < 12) return `${months} bulan lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// Warna avatar acak berdasarkan nama
const AVATAR_COLORS = [
  "bg-violet-100 text-violet-600",
  "bg-pink-100 text-pink-600",
  "bg-amber-100 text-amber-600",
  "bg-emerald-100 text-emerald-600",
  "bg-sky-100 text-sky-600",
  "bg-rose-100 text-rose-600",
  "bg-indigo-100 text-indigo-600",
  "bg-teal-100 text-teal-600",
];
function avatarColor(name: string | null): string {
  if (!name) return AVATAR_COLORS[0];
  const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function StarRow({ filled, size = 14 }: { filled: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < filled ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}

const PAGE_SIZE = 10;

export function ReviewSection({ reviews, rating, reviewCount }: ReviewSectionProps) {
  const [filter, setFilter] = useState<number | null>(null);
  const [page, setPage]     = useState(1);

  // Hitung distribusi bintang dari reviews yang dimuat
  const dist = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0=1★ ... 4=5★
    reviews.forEach(r => { counts[r.rating - 1]++; });
    return counts;
  }, [reviews]);

  const filtered = useMemo(
    () => filter ? reviews.filter(r => r.rating === filter) : reviews,
    [reviews, filter]
  );
  const visible  = filtered.slice(0, page * PAGE_SIZE);
  const hasMore  = visible.length < filtered.length;

  if (!reviews.length) return null;

  const ratingInt  = Math.floor(rating);
  const ratingFrac = rating - ratingInt;

  return (
    <div className="mt-12">
      {/* ── Header ── */}
      <h2 className="text-xl font-bold mb-6">Ulasan Produk</h2>

      {/* ── Rating Summary ── */}
      <div className="bg-card border border-card-border rounded-[16px] p-5 mb-6">
        <div className="flex gap-6 items-start">
          {/* Angka besar */}
          <div className="flex flex-col items-center min-w-[72px]">
            <span className="text-5xl font-bold text-foreground leading-none">
              {rating.toFixed(1)}
            </span>
            <div className="mt-2 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const fill = i < ratingInt ? 1 : i === ratingInt ? ratingFrac : 0;
                return (
                  <span key={i} className="relative inline-block" style={{ width: 16, height: 16 }}>
                    <Star size={16} className="fill-muted text-muted-foreground/20 absolute inset-0" />
                    <span
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${fill * 100}%` }}
                    >
                      <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    </span>
                  </span>
                );
              })}
            </div>
            <span className="text-xs text-muted-foreground mt-1">{reviewCount.toLocaleString("id-ID")} ulasan</span>
          </div>

          {/* Progress bars 5→1 */}
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = dist[star - 1];
              const pct   = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
              return (
                <button
                  key={star}
                  onClick={() => { setFilter(f => f === star ? null : star); setPage(1); }}
                  className={`w-full flex items-center gap-2 group rounded px-1 py-0.5 transition-colors ${
                    filter === star ? "bg-primary/8" : "hover:bg-muted/50"
                  }`}
                >
                  <span className="text-xs text-muted-foreground w-3 shrink-0">{star}</span>
                  <Star size={10} className="fill-yellow-400 text-yellow-400 shrink-0" />
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right shrink-0">
                    {count.toLocaleString("id-ID")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Filter chips ── */}
      <div className="flex gap-2 flex-wrap mb-5">
        {[null, 5, 4, 3, 2, 1].map((v) => (
          <button
            key={v ?? "all"}
            onClick={() => { setFilter(v); setPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filter === v
                ? "bg-primary text-white border-primary"
                : "bg-card text-muted-foreground border-card-border hover:border-primary/50"
            }`}
          >
            {v === null ? "Semua" : `${v} ★`}
          </button>
        ))}
      </div>

      {/* ── Kartu ulasan ── */}
      <div className="space-y-3">
        {visible.map((review) => (
          <div
            key={review.id}
            className="bg-card border border-card-border rounded-[14px] p-4"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor(review.user.name)}`}>
                {(review.user.name ?? "U").charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                {/* Nama + bintang + tanggal */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium truncate">{maskName(review.user.name)}</span>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {relativeDate(review.createdAt)}
                  </span>
                </div>

                <StarRow filled={review.rating} size={12} />

                {/* Komentar */}
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed whitespace-pre-line">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Load more ── */}
      {hasMore && (
        <button
          onClick={() => setPage(p => p + 1)}
          className="w-full mt-4 py-2.5 rounded-[12px] border border-card-border text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          Muat {Math.min(PAGE_SIZE, filtered.length - visible.length)} ulasan lagi
        </button>
      )}
    </div>
  );
}
