import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { productsApi, type ApiProduct } from "../lib/api";
import { firstImage } from "../lib/jsonUtils";

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
}

const ProductTable = ({ products }: { products: ApiProduct[] }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      toast.success("Produk dihapus");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg || "Gagal menghapus produk");
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            <th>Produk</th>
            <th className="hidden md:table-cell">SKU</th>
            <th>Status</th>
            <th className="hidden sm:table-cell">Harga</th>
            <th className="text-right pr-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            const img = firstImage(item.images);
            const inStock = item.stock > 0;
            return (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center gap-3">
                    {img ? (
                      <img src={img} alt="" className="h-10 w-10 rounded-lg object-cover bg-[var(--bg-3)] flex-shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-[var(--bg-3)] flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate max-w-[140px] sm:max-w-[200px]">{item.name}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.category?.name}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell font-mono text-xs text-[var(--text-muted)]">{item.sku || "—"}</td>
                <td>
                  <span className={`badge ${inStock ? "badge-green" : "badge-red"}`}>
                    {inStock ? `${item.stock}` : "Habis"}
                  </span>
                </td>
                <td className="hidden sm:table-cell font-semibold text-brand-600 dark:text-brand-400">{formatPrice(item.price)}</td>
                <td>
                  <div className="flex items-center justify-end gap-1.5 pr-2 sm:pr-4">
                    <Link to={`/products/${item.id}`} className="btn-icon" title="Edit">
                      <HiOutlinePencil />
                    </Link>
                    <a
                      href={`${import.meta.env.VITE_STORE_URL || ""}/products/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon hidden sm:flex"
                      title="Lihat"
                    >
                      <HiOutlineEye />
                    </a>
                    <button
                      onClick={() => { if (window.confirm(`Hapus produk "${item.name}"?`)) deleteMutation.mutate(item.id); }}
                      disabled={deleteMutation.isPending}
                      className="btn-icon btn-icon-danger disabled:opacity-40"
                      title="Hapus"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default ProductTable;
