import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar, WhiteButton } from "../components";
import ProductTable from "../components/ProductTable";
import { HiOutlinePlus, HiOutlineChevronRight, HiOutlineSearch } from "react-icons/hi";
import { productsApi } from "../lib/api";

const Products = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("terbaru");

  const { data, isLoading } = useQuery({
    queryKey: ["products", search, sort],
    queryFn: () => productsApi.list({ search, sortBy: sort, limit: 50 }).then((r) => r.data),
  });

  const products = data?.data ?? [];

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">Semua Produk</h2>
              <p className="dark:text-whiteSecondary text-blackPrimary text-base flex items-center gap-1">
                <span>Dashboard</span>
                <HiOutlineChevronRight />
                <span>Produk</span>
                {data?.total !== undefined && (
                  <span className="ml-2 text-sm dark:text-gray-400 text-gray-500">({data.total} produk)</span>
                )}
              </p>
            </div>
            <WhiteButton link="/products/create-product" text="Tambah Produk">
              <HiOutlinePlus className="dark:text-blackPrimary text-whiteSecondary" />
            </WhiteButton>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center mt-5 max-sm:flex-col max-sm:gap-2">
            <div className="relative">
              <HiOutlineSearch className="text-gray-400 text-lg absolute top-3 left-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-60 h-10 border dark:bg-blackPrimary bg-white border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 indent-10 focus:border-gray-500"
                placeholder="Cari produk..."
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-48 h-10 dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 cursor-pointer hover:border-gray-500"
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlaris">Terlaris</option>
              <option value="harga-terendah">Harga Terendah</option>
              <option value="harga-tertinggi">Harga Tertinggi</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 dark:border-white border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 dark:text-gray-400 text-gray-500">Tidak ada produk ditemukan</div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8">
              <ProductTable products={products} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Products;
