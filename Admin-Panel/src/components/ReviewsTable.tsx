import { Link } from "react-router-dom";
import { HiOutlineTrash, HiStar } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reviewsApi, type ApiReview } from "../lib/api";

function parseImages(raw: string): string[] {
  try { const a = JSON.parse(raw); return Array.isArray(a) ? a : []; }
  catch { return []; }
}

const ReviewsTable = ({ reviews }: { reviews: ApiReview[] }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: reviewsApi.delete,
    onSuccess: () => { toast.success("Ulasan dihapus"); queryClient.invalidateQueries({ queryKey: ["reviews"] }); },
    onError: () => toast.error("Gagal menghapus ulasan"),
  });

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <thead className="border-b dark:border-white/10 border-gray-200 text-sm dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Pengguna</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Produk</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Rating</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Komentar</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Tanggal</th>
          <th className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-6 lg:pr-8">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y dark:divide-white/5 divide-gray-100">
        {reviews.map((review) => {
          const productImgs = parseImages(review.product.images);
          return (
            <tr key={review.id}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-3">
                  {review.user.avatar ? (
                    <img src={review.user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-full dark:bg-gray-600 bg-gray-300 flex items-center justify-center text-sm font-bold dark:text-white text-black">
                      {(review.user.name || review.user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium dark:text-whiteSecondary text-blackPrimary">{review.user.name || "—"}</p>
                    <p className="text-xs dark:text-gray-400 text-gray-500">{review.user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-8">
                <div className="flex items-center gap-2">
                  {productImgs[0] ? (
                    <img src={productImgs[0]} alt="" className="h-8 w-8 object-cover rounded" />
                  ) : (
                    <div className="h-8 w-8 rounded dark:bg-gray-700 bg-gray-200" />
                  )}
                  <span className="text-sm dark:text-whiteSecondary text-blackPrimary max-w-[120px] truncate">
                    {review.product.name}
                  </span>
                </div>
              </td>
              <td className="py-4 pl-0 pr-8">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HiStar key={i} className={i < review.rating ? "text-yellow-400" : "dark:text-gray-600 text-gray-300"} />
                  ))}
                </div>
              </td>
              <td className="py-4 pl-0 pr-8 text-sm dark:text-gray-300 text-gray-600 max-w-[200px]">
                <p className="truncate">{review.comment}</p>
              </td>
              <td className="py-4 pl-0 pr-8 text-sm dark:text-gray-400 text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("id-ID")}
              </td>
              <td className="py-4 pl-0 pr-4 text-right sm:pr-6 lg:pr-8">
                <button
                  onClick={() => { if (window.confirm("Hapus ulasan ini?")) deleteMutation.mutate(review.id); }}
                  disabled={deleteMutation.isPending}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-rose-400 text-rose-500 border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-rose-400 transition-colors disabled:opacity-50"
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default ReviewsTable;
