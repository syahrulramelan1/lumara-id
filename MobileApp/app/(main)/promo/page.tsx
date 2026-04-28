import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Promo" };

export default function PromoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Promo Spesial</h1>
      <p className="text-muted-foreground mb-8">Penawaran terbaik untuk Anda</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Diskon Akhir Bulan", desc: "Hemat hingga 40% untuk semua gamis premium", code: "AKHIRBULAN40", bg: "from-purple-500 to-pink-500" },
          { title: "Free Ongkir", desc: "Gratis ongkir ke seluruh Indonesia min. pembelian Rp 300.000", code: "FREONGKIR", bg: "from-emerald-500 to-teal-500" },
          { title: "Bundle Hemat", desc: "Beli gamis + hijab, hemat 25%", code: "BUNDLE25", bg: "from-orange-500 to-amber-500" },
          { title: "New Member", desc: "Diskon 15% untuk pembelian pertama", code: "NEWMEMBER15", bg: "from-blue-500 to-indigo-500" },
        ].map((promo) => (
          <div key={promo.code} className={`bg-gradient-to-br ${promo.bg} rounded-2xl p-6 text-white`}>
            <h2 className="text-xl font-bold mb-1">{promo.title}</h2>
            <p className="text-white/80 text-sm mb-4">{promo.desc}</p>
            <div className="bg-white/20 rounded-lg px-4 py-2 inline-block">
              <span className="font-mono font-bold tracking-wider">{promo.code}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="inline-flex px-8 py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors">
          Belanja Sekarang
        </Link>
      </div>
    </div>
  );
}
