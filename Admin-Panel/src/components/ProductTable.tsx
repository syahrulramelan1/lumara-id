import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { productsApi, type ApiProduct } from "../lib/api";

const inStock = "text-green-400 bg-green-400/10 flex-none rounded-full p-1";
const outStock = "text-rose-400 bg-rose-400/10 flex-none rounded-full p-1";

function parseImages(raw: string): string {
  try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr[0] ?? "" : ""; }
  catch { return raw || ""; }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
}

interface Props { products: ApiProduct[] }

const ProductTable = ({ products }: Props) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      toast.success("Produk dihapus");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => toast.error("Gagal menghapus produk"),
  });

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Hapus produk "${name}"?`)) deleteMutation.mutate(id);
  };

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-2/12" />
      </colgroup>
      <thead className="border-b dark:border-white/10 border-gray-200 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Produk</th>
          <th className="py-2 pl-0 pr-8 font-semibold">SKU</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Status</th>
          <th className="py-2 pl-0 pr-8 font-semibold lg:pr-20">Harga</th>
          <th className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-6 lg:pr-8">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y dark:divide-white/5 divide-gray-100">
        {products.map((item) => {
          const img = parseImages(item.images);
          const inStockBool = item.stock > 0;
          return (
            <tr key={item.id}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  {img ? (
                    <img src={img} alt="" className="h-10 w-10 rounded object-cover bg-gray-200" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700" />
                  )}
                  <div>
                    <p className="truncate text-sm font-medium dark:text-whiteSecondary text-blackPrimary max-w-[180px]">{item.name}</p>
                    <p className="text-xs dark:text-gray-400 text-gray-500">{item.category?.name}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 font-mono text-sm dark:text-whiteSecondary text-blackPrimary">
                {item.sku || "—"}
              </td>
              <td className="py-4 pl-0 pr-4 text-sm">
                <div className="flex items-center gap-x-2">
                  <div className={inStockBool ? inStock : outStock}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  </div>
                  <span className="dark:text-whiteSecondary text-blackPrimary">
                    {inStockBool ? `Stok: ${item.stock}` : "Habis"}
                  </span>
                </div>
              </td>
              <td className="py-4 pl-0 pr-8 text-sm dark:text-rose-200 text-rose-600 font-medium lg:pr-20">
                {formatPrice(item.price)}
              </td>
              <td className="py-4 pl-0 pr-4 text-right sm:pr-6 lg:pr-8">
                <div className="flex gap-x-1 justify-end">
                  <Link to={`/products/${item.id}`}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-gray-400 transition-colors">
                    <HiOutlinePencil className="text-lg" />
                  </Link>
                  <a href={`${import.meta.env.VITE_STORE_URL || ""}/products/${item.slug}`} target="_blank" rel="noopener noreferrer"
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-gray-400 transition-colors">
                    <HiOutlineEye className="text-lg" />
                  </a>
                  <button
                    onClick={() => confirmDelete(item.id, item.name)}
                    disabled={deleteMutation.isPending}
                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-rose-400 text-rose-500 border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-rose-400 transition-colors disabled:opacity-50">
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default ProductTable;
