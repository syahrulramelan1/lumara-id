import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tentang Kami" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Tentang Lumara.id</h1>
      <p className="text-muted-foreground mb-8">Platform modest fashion premium Indonesia</p>

      <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <p>
          <strong className="text-foreground">Lumara.id</strong> adalah platform belanja modest fashion premium yang hadir untuk wanita muslimah Indonesia yang modern, elegan, dan tetap syar'i. Kami berkomitmen menghadirkan koleksi berkualitas tinggi dengan desain yang cantik dan harga yang terjangkau.
        </p>
        <p>
          Didirikan dengan visi menjadi destinasi utama belanja modest fashion di Indonesia, Lumara.id menawarkan koleksi gamis, hijab, abaya, dan aksesoris yang dipilih dengan cermat dari produsen terpercaya.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {[
            { label: "Produk Premium", value: "500+" },
            { label: "Pelanggan Puas", value: "10.000+" },
            { label: "Kota Jangkauan", value: "500+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card border border-card-border rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-foreground mt-8">Visi & Misi</h2>
        <p><strong>Visi:</strong> Menjadi platform modest fashion terpercaya dan terdepan di Indonesia.</p>
        <p><strong>Misi:</strong> Menghadirkan produk berkualitas premium dengan layanan terbaik, memudahkan wanita muslimah tampil anggun dan percaya diri setiap hari.</p>
      </div>
    </div>
  );
}
