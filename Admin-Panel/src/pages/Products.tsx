import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components";
import ProductTable from "../components/ProductTable";
import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";
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
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Semua Produk</h2>
            <p className="page-subtitle">
              {data?.total !== undefined ? `${data.total} produk terdaftar` : "Kelola data produk toko"}
            </p>
          </div>
          <Link to="/products/create-product" className="btn-primary flex items-center gap-2 text-sm">
            <HiOutlinePlus className="text-base" />
            Tambah Produk
          </Link>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-base pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base pl-9 w-60"
                placeholder="Cari produk..."
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-base w-auto"
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
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="card p-12 text-center text-[var(--text-muted)]">Tidak ada produk ditemukan</div>
          ) : (
            <div className="card overflow-hidden">
              <ProductTable products={products} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Products;
