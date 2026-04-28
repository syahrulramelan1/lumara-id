import type { Metadata } from "next";

export const metadata: Metadata = { title: "Info Pengiriman" };

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Informasi Pengiriman</h1>
      <p className="text-muted-foreground mb-10">Kami mengirim ke seluruh Indonesia</p>

      <div className="space-y-6">
        <div className="bg-card border border-card-border rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4">Ekspedisi Tersedia</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["JNE", "J&T Express", "SiCepat", "Anteraja", "Pos Indonesia", "Ninja Express", "Lion Parcel", "Wahana"].map((courier) => (
              <div key={courier} className="bg-muted rounded-lg px-3 py-2 text-sm text-center font-medium">{courier}</div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4">Estimasi Waktu Pengiriman</h2>
          <div className="space-y-3 text-sm">
            {[
              { area: "Pulau Jawa", time: "1-3 hari kerja" },
              { area: "Pulau Sumatera", time: "2-4 hari kerja" },
              { area: "Kalimantan & Sulawesi", time: "3-6 hari kerja" },
              { area: "Indonesia Timur", time: "5-8 hari kerja" },
            ].map(({ area, time }) => (
              <div key={area} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground">{area}</span>
                <span className="font-medium">{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-2 text-primary">Free Ongkir</h2>
          <p className="text-sm text-muted-foreground">Dapatkan gratis ongkir untuk pembelian min. <strong>Rp 300.000</strong> ke seluruh wilayah Jawa, atau gunakan kode promo <strong className="text-primary">FREEONGKIR</strong> untuk area lainnya.</p>
        </div>
      </div>
    </div>
  );
}
