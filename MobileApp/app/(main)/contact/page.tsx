import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kontak Kami" };

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Kontak Kami</h1>
      <p className="text-muted-foreground mb-10">Kami siap membantu Anda</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[
            { icon: "📞", label: "WhatsApp / Telepon", value: "+62 812-3456-7890", sub: "Senin – Sabtu, 09.00 – 17.00 WIB" },
            { icon: "✉️", label: "Email", value: "hello@lumara.id", sub: "Dibalas dalam 1x24 jam" },
            { icon: "📍", label: "Alamat", value: "Jakarta Selatan, Indonesia", sub: "Tidak melayani kunjungan langsung" },
            { icon: "📸", label: "Instagram", value: "@lumara.id", sub: "DM untuk pertanyaan produk" },
          ].map(({ icon, label, value, sub }) => (
            <div key={label} className="bg-card border border-card-border rounded-2xl p-5 flex gap-4">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="font-semibold text-sm">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-card-border rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Kirim Pesan</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nama Anda"
              className="w-full px-4 py-2.5 rounded-[10px] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <input
              type="email"
              placeholder="Email Anda"
              className="w-full px-4 py-2.5 rounded-[10px] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <textarea
              rows={4}
              placeholder="Pesan Anda..."
              className="w-full px-4 py-2.5 rounded-[10px] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors text-center text-sm"
            >
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
