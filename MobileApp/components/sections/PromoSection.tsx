import Link from "next/link";

export function PromoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 overflow-hidden text-white">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-2 -bottom-2 w-20 h-20 bg-white/10 rounded-full" />
          <p className="text-sm font-semibold opacity-80 mb-1">Flash Sale</p>
          <h3 className="text-2xl font-extrabold mb-2">Diskon 30%</h3>
          <p className="text-sm opacity-80 mb-4">Untuk semua koleksi hijab premium</p>
          <Link
            href="/products?category=hijab"
            className="inline-block px-4 py-2 bg-white text-primary text-sm font-bold rounded-[12px] hover:bg-white/90 transition-colors"
          >
            Belanja Sekarang
          </Link>
        </div>

        <div className="relative bg-gradient-to-br from-[#0F0A1E] to-[#1a0f2e] rounded-2xl p-6 overflow-hidden text-white">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/20 rounded-full" />
          <p className="text-sm font-semibold opacity-80 mb-1">Bundle Hemat</p>
          <h3 className="text-2xl font-extrabold mb-2">3 Item = 25% OFF</h3>
          <p className="text-sm opacity-80 mb-4">Gamis + Hijab + Aksesoris pilihan kamu</p>
          <Link
            href="/products?category=bundle"
            className="inline-block px-4 py-2 bg-primary text-white text-sm font-bold rounded-[12px] hover:bg-primary/80 transition-colors"
          >
            Lihat Bundle
          </Link>
        </div>
      </div>
    </section>
  );
}
