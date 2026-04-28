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
    onError: () => toast.error("Gagal menghapus kategori"),
  });

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <thead className="border-b dark:border-white/10 border-gray-200 text-sm dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Kategori</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Slug</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Jumlah Produk</th>
          <th className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-6 lg:pr-8">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y dark:divide-white/5 divide-gray-100">
        {categories.map((cat) => (
          <tr key={cat.id}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-4">
                {cat.image ? (
                  <img src={cat.image} alt="" className="h-10 w-10 rounded object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded dark:bg-gray-700 bg-gray-200" />
                )}
                <span className="text-sm font-medium dark:text-whiteSecondary text-blackPrimary">{cat.name}</span>
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm font-mono dark:text-whiteSecondary text-blackPrimary">{cat.slug}</td>
            <td className="py-4 pl-0 pr-8 text-sm dark:text-whiteSecondary text-blackPrimary">{cat._count?.products ?? 0}</td>
            <td className="py-4 pl-0 pr-4 text-right sm:pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link to={`/categories/${cat.id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-gray-400 transition-colors">
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <a href={`${import.meta.env.VITE_STORE_URL || ""}/categories/${cat.slug}`} target="_blank" rel="noopener noreferrer"
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-gray-400 transition-colors">
                  <HiOutlineEye className="text-lg" />
                </a>
                <button onClick={() => { if (window.confirm(`Hapus kategori "${cat.name}"?`)) deleteMutation.mutate(cat.id); }}
                  disabled={deleteMutation.isPending}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-rose-400 text-rose-500 border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-rose-400 transition-colors disabled:opacity-50">
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default CategoryTable;
