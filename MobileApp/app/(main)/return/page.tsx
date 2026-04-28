import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kebijakan Pengembalian" };

export default function ReturnPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Kebijakan Pengembalian</h1>
      <p className="text-muted-foreground mb-10">Kami menjamin kepuasan Anda</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <div className="bg-card border border-card-border rounded-2xl p-6">
          <h2 className="font-semibold text-base mb-3">Syarat Pengembalian</h2>
          <ul className="space-y-2 text-muted-foreground">
            {[
              "Produk dikembalikan dalam 7 hari setelah diterima",
              "Produk masih dalam kondisi original, belum dipakai dan belum dicuci",
              "Label/tag produk masih terpasang",
              "Terdapat cacat produksi atau kesalahan pengiriman dari kami",
              "Disertai foto bukti produk yang cacat",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-primary mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6">
          <h2 className="font-semibold text-base mb-3">Prosedur Pengembalian</h2>
          <ol className="space-y-3 text-muted-foreground list-decimal list-inside">
            <li>Hubungi tim CS kami via WhatsApp di +62 812-3456-7890</li>
            <li>Sertakan nomor pesanan dan foto produk yang bermasalah</li>
            <li>Tim kami akan memverifikasi dalam 1x24 jam</li>
            <li>Kirim produk ke alamat gudang kami setelah mendapat persetujuan</li>
            <li>Penggantian produk atau refund diproses dalam 3-5 hari kerja</li>
          </ol>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <h2 className="font-semibold text-base mb-2 text-amber-700 dark:text-amber-400">Catatan Penting</h2>
          <p className="text-muted-foreground">Pengembalian <strong>tidak dapat diterima</strong> untuk produk sale/promo, produk yang sudah dipakai, atau ketidakcocokan selera warna (karena perbedaan layar).</p>
        </div>
      </div>
    </div>
  );
}
