import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl mb-4">🧕</p>
      <h1 className="text-4xl font-extrabold text-foreground mb-2">404</h1>
      <p className="text-xl font-semibold mb-2">Halaman Tidak Ditemukan</p>
      <p className="text-muted-foreground mb-8">Maaf, halaman yang kamu cari tidak tersedia.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
