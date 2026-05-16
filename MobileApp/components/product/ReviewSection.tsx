"use client";
import { useState, useMemo } from "react";
import { Star, User } from "lucide-react";
import Image from "next/image";
import type { ReviewWithUser } from "@/types";

interface ReviewSectionProps {
  reviews: ReviewWithUser[];
  rating: number;
  reviewCount: number;
}

type FilterKey = "all" | 5 | 4 | 3 | 2 | 1 | "comments" | "media";

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

function parseImages(val: unknown): string[] {
  if (Array.isArray(val)) return val as string[];
  try { return JSON.parse(val as string) ?? []; } catch { return []; }
}

function StarRow({ filled, size = 14 }: { filled: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < filled ? "fill-orange-500 text-orange-500" : "fill-zinc-200 text-zinc-200"}
        />
      ))}
    </div>
  );
}

const PAGE_SIZE = 10;

export function ReviewSection({ reviews, rating, reviewCount }: ReviewSectionProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Hitung distribusi bintang
  const dist = useMemo(() => {
    const counts = [0, 0, 0, 0, 0]; // index 0=1★…4=5★
    reviews.forEach((r) => { counts[r.rating - 1]++; });
    return counts;
  }, [reviews]);

  const withComments = useMemo(() => reviews.filter((r) => r.comment?.trim()), [reviews]);
  const withMedia = useMemo(() => reviews.filter((r) => parseImages(r.images).length > 0), [reviews]);

  const filtered = useMemo(() => {
    if (filter === "all") return reviews;
    if (filter === "comments") return withComments;
    if (filter === "media") return withMedia;
    return reviews.filter((r) => r.rating === filter);
  }, [reviews, filter, withComments, withMedia]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  if (!reviews.length) return null;

  const ratingInt = Math.floor(rating);
  const ratingFrac = rating - ratingInt;

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: reviewCount },
    { key: 5, label: "5 Bintang", count: dist[4] },
    { key: 4, label: "4 Bintang", count: dist[3] },
    { key: 3, label: "3 Bintang", count: dist[2] },
    { key: 2, label: "2 Bintang", count: dist[1] },
    { key: 1, label: "1 Bintang", count: dist[0] },
    { key: "comments", label: "Ada Komentar", count: withComments.length },
    { key: "media", label: "Ada Foto/Video", count: withMedia.length },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-5">Rating Produk</h2>

      {/* ── Rating summary box ── */}
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-[16px] p-5 mb-5">
        <div className="flex gap-6 items-center">
          {/* Angka + "out of 5" */}
          <div className="flex flex-col items-center min-w-[80px] gap-1">
            <span className="text-5xl font-bold text-orange-500 leading-none">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-orange-400 font-medium">dari 5</span>
            {/* Partial-fill stars */}
            <div className="flex items-center gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const fill = i < ratingInt ? 1 : i === ratingInt ? ratingFrac : 0;
                return (
                  <span key={i} className="relative inline-block" style={{ width: 15, height: 15 }}>
                    <Star size={15} className="fill-zinc-200 text-zinc-200 absolute inset-0" />
                    <span
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${fill * 100}%` }}
                    >
                      <Star size={15} className="fill-orange-500 text-orange-500" />
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Progress bars 5→1 */}
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = dist[star - 1];
              const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
              return (
                <button
                  key={star}
                  onClick={() => { setFilter((f) => (f === star ? "all" : (star as FilterKey))); setPage(1); }}
                  className={`w-full flex items-center gap-2 rounded px-1 py-0.5 transition-colors ${
                    filter === star ? "bg-orange-100/60 dark:bg-orange-900/20" : "hover:bg-orange-50 dark:hover:bg-orange-950/10"
                  }`}
                >
                  <span className="text-xs text-muted-foreground w-3 shrink-0">{star}</span>
                  <Star size={10} className="fill-orange-400 text-orange-400 shrink-0" />
                  <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full transition-all duration-500"
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
        {filters.map(({ key, label, count }) => (
          <button
            key={String(key)}
            onClick={() => { setFilter(key); setPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
              filter === key
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white dark:bg-card text-muted-foreground border-zinc-200 dark:border-zinc-700 hover:border-orange-300"
            }`}
          >
            {label}
            {count > 0 && (
              <span className={`ml-1 ${filter === key ? "opacity-90" : "text-muted-foreground"}`}>
                ({count >= 1000 ? `${(count / 1000).toFixed(1)}rb` : count.toLocaleString("id-ID")})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Kartu ulasan ── */}
      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground py-6 text-center">Tidak ada ulasan untuk filter ini.</p>
        )}
        {visible.map((review) => {
          const imgs = parseImages(review.images);
          return (
            <div
              key={review.id}
              className="bg-white dark:bg-card border border-zinc-100 dark:border-zinc-800 rounded-[14px] p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {/* Avatar — generic person icon (Shopee style) */}
                <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                  <User size={18} className="text-zinc-400" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Username */}
                  <p className="text-sm font-semibold text-foreground">
                    {review.user.name ?? "Pembeli"}
                  </p>

                  {/* Stars */}
                  <StarRow filled={review.rating} size={13} />

                  {/* Tanggal */}
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {formatDate(review.createdAt)}
                  </p>

                  {/* Komentar */}
                  {review.comment && (
                    <p className="text-sm text-foreground/85 mt-2 leading-relaxed whitespace-pre-line">
                      {review.comment}
                    </p>
                  )}

                  {/* Foto ulasan */}
                  {imgs.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {imgs.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setLightboxSrc(src)}
                          className="relative w-16 h-16 rounded-[8px] overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0"
                        >
                          <Image
                            src={src}
                            alt={`Foto ulasan ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Load more ── */}
      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="w-full mt-4 py-2.5 rounded-[12px] border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-muted-foreground hover:border-orange-400 hover:text-orange-500 transition-colors"
        >
          Muat {Math.min(PAGE_SIZE, filtered.length - visible.length)} ulasan lagi
        </button>
      )}

      {/* ── Lightbox foto ulasan ── */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-w-lg w-full max-h-[80vh]">
            <Image
              src={lightboxSrc}
              alt="Foto ulasan"
              width={600}
              height={600}
              className="object-contain w-full h-full rounded-[12px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
