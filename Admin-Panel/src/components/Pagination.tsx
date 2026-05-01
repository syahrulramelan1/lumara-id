import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  perPage?: number;
}

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, perPage }: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Window 5 nomor halaman dengan currentPage di tengah kalau bisa
  const windowSize = 5;
  let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let endPage = Math.min(totalPages, startPage + windowSize - 1);
  if (endPage - startPage + 1 < windowSize) {
    startPage = Math.max(1, endPage - windowSize + 1);
  }

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  // Range info "Menampilkan 1-20 dari 100"
  const rangeInfo = (() => {
    if (!totalItems || !perPage) return null;
    const from = (currentPage - 1) * perPage + 1;
    const to   = Math.min(currentPage * perPage, totalItems);
    return `${from}–${to} dari ${totalItems}`;
  })();

  const btnBase = "min-w-[36px] h-9 px-2 flex items-center justify-center text-sm font-medium rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {rangeInfo && (
        <p className="text-xs text-[var(--text-muted)]">{rangeInfo}</p>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]`}
          aria-label="Halaman sebelumnya"
        >
          <HiChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`${btnBase} border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]`}
            >
              1
            </button>
            {startPage > 2 && <span className="text-[var(--text-muted)] px-1">…</span>}
          </>
        )}

        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btnBase} ${
              p === currentPage
                ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
            }`}
          >
            {p}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-[var(--text-muted)] px-1">…</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`${btnBase} border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]`}
          aria-label="Halaman berikutnya"
        >
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
