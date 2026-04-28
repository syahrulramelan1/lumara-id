import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Cara Pemesanan" };

const steps = [
  { no: "01", title: "Pilih Produk", desc: "Jelajahi koleksi kami dan pilih produk yang Anda inginkan. Pilih ukuran dan warna yang sesuai." },
  { no: "02", title: "Tambah ke Keranjang", desc: "Klik tombol 'Tambah ke Keranjang' dan lanjutkan belanja atau langsung checkout." },
  { no: "03", title: "Isi Data Pengiriman", desc: "Masukkan alamat pengiriman lengkap dan pilih metode pengiriman yang tersedia." },
  { no: "04", title: "Pilih Pembayaran", desc: "Pilih metode pembayaran yang Anda inginkan: transfer bank, e-wallet, atau COD." },
  { no: "05", title: "Konfirmasi Pesanan", desc: "Periksa kembali detail pesanan dan konfirmasi. Anda akan menerima email konfirmasi." },
  { no: "06", title: "Terima Paket", desc: "Pesanan diproses dalam 1-2 hari kerja dan dikirim ke alamat Anda. Nikmati belanja!" },
];

export default function HowToOrderPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Cara Pemesanan</h1>
      <p className="text-muted-foreground mb-10">Mudah, cepat, dan aman</p>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.no} className="flex gap-4 bg-card border border-card-border rounded-2xl p-5">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">{step.no}</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/products" className="inline-flex px-8 py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors">
          Mulai Belanja
        </Link>
      </div>
    </div>
  );
}
