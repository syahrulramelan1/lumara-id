import { HiOutlineTrash, HiStar } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { reviewsApi, type ApiReview } from "../lib/api";
import { parseJsonArr } from "../lib/jsonUtils";

const ReviewsTable = ({ reviews }: { reviews: ApiReview[] }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: reviewsApi.delete,
    onSuccess: () => { toast.success("Ulasan dihapus"); queryClient.invalidateQueries({ queryKey: ["reviews"] }); },
    onError: () => toast.error("Gagal menghapus ulasan"),
  });

  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            <th>Pengguna</th>
            <th className="hidden sm:table-cell">Produk</th>
            <th>Rating</th>
            <th className="hidden md:table-cell">Komentar</th>
            <th className="hidden lg:table-cell">Tanggal</th>
            <th className="text-right pr-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => {
            const productImgs = parseJsonArr(review.product.images);
            return (
              <tr key={review.id}>
                <td>
                  <div className="flex items-center gap-3">
                    {review.user.avatar ? (
                      <img src={review.user.avatar} alt="" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-700 to-brand-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(review.user.name || review.user.email).charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text)]">{review.user.name || "—"}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate max-w-[100px]">{review.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    {productImgs[0] ? (
                      <img src={productImgs[0]} alt="" className="h-9 w-9 rounded-lg object-cover bg-[var(--bg-3)] flex-shrink-0" />
                    ) : (
                      <div className="h-9 w-9 rounded-lg bg-[var(--bg-3)] flex-shrink-0" />
                    )}
                    <span className="text-sm text-[var(--text)] truncate max-w-[120px]">{review.product.name}</span>
                  </div>
                </td>
                <td>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiStar key={i} className={i < review.rating ? "text-yellow-400" : "text-[var(--border-2)]"} />
                    ))}
                  </div>
                </td>
                <td className="hidden md:table-cell text-[var(--text-muted)] max-w-[200px]">
                  <p className="truncate">{review.comment}</p>
                </td>
                <td className="hidden lg:table-cell text-[var(--text-muted)]">
                  {new Date(review.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td>
                  <div className="flex items-center justify-end pr-2 sm:pr-4">
                    <button
                      onClick={() => { if (window.confirm("Hapus ulasan ini?")) deleteMutation.mutate(review.id); }}
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
export default ReviewsTable;
