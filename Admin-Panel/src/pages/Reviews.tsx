import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar, SearchInput } from "../components";
import ReviewsTable from "../components/ReviewsTable";
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
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari pengguna / produk..."
              className="w-72"
            />
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
