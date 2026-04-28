import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-dark text-white mt-16 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
            Lumara.id
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Koleksi modest fashion premium untuk wanita modern yang elegan dan syar'i.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors" aria-label="YouTube">
              <Youtube size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Belanja</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {["Gamis", "Hijab", "Abaya", "Aksesoris", "Bundle"].map((item) => (
              <li key={item}>
                <Link href={`/categories/${item.toLowerCase()}`} className="hover:text-white transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Informasi</h4>
          <ul className="space-y-2 text-sm text-white/60">
            {[
              { label: "Tentang Kami", href: "/about" },
              { label: "Cara Pemesanan", href: "/how-to-order" },
              { label: "Pengiriman", href: "/shipping" },
              { label: "Pengembalian", href: "/return" },
              { label: "Kontak", href: "/contact" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Hubungi Kami</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li>📍 Jakarta, Indonesia</li>
            <li>📞 +62 812-3456-7890</li>
            <li>✉️ hello@lumara.id</li>
            <li className="mt-2">Senin – Sabtu<br />09.00 – 17.00 WIB</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Lumara.id — All rights reserved
      </div>
    </footer>
  );
}
