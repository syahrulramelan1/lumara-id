import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components";
import ReviewsTable from "../components/ReviewsTable";
import { HiOutlineSearch } from "react-icons/hi";
import { reviewsApi } from "../lib/api";

const Reviews = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => reviewsApi.list().then((r) => r.data),
  });

  const reviews = (data?.data ?? []).filter((r) =>
    search
      ? (r.user.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        r.user.email.toLowerCase().includes(search.toLowerCase()) ||
        r.product.name.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Semua Ulasan</h2>
            <p className="page-subtitle">
              {data?.total !== undefined ? `${data.total} ulasan produk` : "Kelola ulasan pelanggan"}
            </p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-base pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base pl-9 w-60"
                placeholder="Cari pengguna / produk..."
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="card p-12 text-center text-[var(--text-muted)]">Tidak ada ulasan ditemukan</div>
          ) : (
            <div className="card overflow-hidden">
              <ReviewsTable reviews={reviews} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Reviews;
