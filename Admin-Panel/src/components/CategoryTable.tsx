import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { categoriesApi, type ApiCategory } from "../lib/api";

const CategoryTable = ({ categories }: { categories: ApiCategory[] }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: categoriesApi.delete,
    onSuccess: () => { toast.success("Kategori dihapus"); queryClient.invalidateQueries({ queryKey: ["categories"] }); },
    onError: (e: unknown) => {
      // Tampilkan error message yang dikembalikan server (kalau ada),
      // jadi user tahu kenapa gagal — misal "masih ada N produk di kategori ini".
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || "Gagal menghapus kategori");
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            <th>Kategori</th>
            <th className="hidden sm:table-cell">Slug</th>
            <th>Jumlah Produk</th>
            <th className="text-right pr-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>
                <div className="flex items-center gap-3">
                  {cat.image ? (
                    <img src={cat.image} alt="" className="h-10 w-10 rounded-lg object-cover bg-[var(--bg-3)] flex-shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-[var(--bg-3)] flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium text-[var(--text)] truncate max-w-[120px] sm:max-w-none">{cat.name}</span>
                </div>
              </td>
              <td className="hidden sm:table-cell font-mono text-xs text-[var(--text-muted)]">{cat.slug}</td>
              <td>
                <span className="badge badge-purple">{cat._count?.products ?? 0} produk</span>
              </td>
              <td>
                <div className="flex items-center justify-end gap-1.5 pr-2 sm:pr-4">
                  <Link to={`/categories/${cat.id}`} className="btn-icon" title="Edit">
                    <HiOutlinePencil />
                  </Link>
                  <a
                    href={`${import.meta.env.VITE_STORE_URL || ""}/categories/${cat.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-icon hidden sm:flex"
                    title="Lihat"
                  >
                    <HiOutlineEye />
                  </a>
                  <button
                    onClick={() => { if (window.confirm(`Hapus kategori "${cat.name}"?`)) deleteMutation.mutate(cat.id); }}
                    disabled={deleteMutation.isPending}
                    className="btn-icon btn-icon-danger disabled:opacity-40"
                    title="Hapus"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CategoryTable;
