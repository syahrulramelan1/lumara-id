import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sidebar, SearchInput } from "../components";
import CategoryTable from "../components/CategoryTable";
import { HiOutlinePlus } from "react-icons/hi";
import { categoriesApi } from "../lib/api";

const Categories = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then((r) => r.data.data),
  });

  const categories = (data ?? []).filter((c: any) =>
    search ? c.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Semua Kategori</h2>
            <p className="page-subtitle">
              {data ? `${data.length} kategori terdaftar` : "Kelola kategori produk"}
            </p>
          </div>
          <Link to="/categories/create-category" className="btn-primary flex items-center gap-2 text-sm">
            <HiOutlinePlus className="text-base" />
            Tambah Kategori
          </Link>
        </div>

        <div className="p-3 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari kategori..."
              className="w-72"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="card p-12 text-center text-[var(--text-muted)]">Tidak ada kategori ditemukan</div>
          ) : (
            <div className="card overflow-hidden">
              <CategoryTable categories={categories} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Categories;
