import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components";
import ReviewsTable from "../components/ReviewsTable";
import { HiOutlineChevronRight, HiOutlineSearch } from "react-icons/hi";
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
    <div className="h-auto border-t dark:border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">Semua Ulasan</h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base flex items-center gap-1">
                <span>Dashboard</span>
                <HiOutlineChevronRight />
                <span>Ulasan</span>
                {data?.total !== undefined && (
                  <span className="ml-2 text-sm dark:text-gray-400 text-gray-500">({data.total} ulasan)</span>
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
                placeholder="Cari pengguna / produk..."
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 dark:border-white border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 dark:text-gray-400 text-gray-500">Tidak ada ulasan ditemukan</div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8">
              <ReviewsTable reviews={reviews} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Reviews;
