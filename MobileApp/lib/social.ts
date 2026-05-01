// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LUMARA.ID — Social & Marketplace Channels
// Single source of truth — edit di sini, semua komponen ikut.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ⚠️ Ganti dengan nomor WA real (format internasional, tanpa "+" atau "0").
// Contoh: 6281234567890 untuk +62 812-3456-7890
export const WHATSAPP_NUMBER = "6281234567890";

// Default text yang muncul saat klik tombol WA dari halaman umum.
export const WHATSAPP_DEFAULT_MESSAGE =
  "Halo Lumara.id, saya mau tanya tentang produk kakak.";

/**
 * Bangun URL `wa.me/...?text=...` dengan pesan ter-encode.
 * Contoh: buildWhatsAppUrl("Saya mau tanya order #ABCD")
 */
export function buildWhatsAppUrl(message?: string): string {
  const text = encodeURIComponent(message ?? WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Channel list — dipakai oleh Footer + halaman /contact
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type SocialChannel = {
  id:       "whatsapp" | "instagram" | "tiktok" | "shopee" | "tokopedia";
  label:    string;          // nama tampil di tombol/card
  handle:   string;          // username/handle yang ditampilkan
  url:      string;          // link target
  desc:     string;          // deskripsi singkat untuk /contact
  brandHex: string;          // warna brand untuk hover/icon background
};

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id:       "whatsapp",
    label:    "WhatsApp",
    handle:   "+62 812-3456-7890",
    url:      buildWhatsAppUrl(),
    desc:     "Live chat 24 jam — paling cepat dibalas. Tanya produk, order, atau resi.",
    brandHex: "#25D366",
  },
  {
    id:       "instagram",
    label:    "Instagram",
    handle:   "@lumara.id",
    url:      "https://instagram.com/lumara.id",
    desc:     "Foto produk terbaru, behind the scene, dan promo eksklusif.",
    brandHex: "#E4405F",
  },
  {
    id:       "tiktok",
    label:    "TikTok",
    handle:   "@lumara.id",
    url:      "https://tiktok.com/@lumara.id",
    desc:     "Video styling, mix & match outfit, dan konten lifestyle modest.",
    brandHex: "#000000",
  },
  {
    id:       "shopee",
    label:    "Shopee",
    handle:   "Lumara.id Official",
    url:      "https://shopee.co.id/lumara.id",
    desc:     "Belanja di Shopee — gratis ongkir, voucher, dan cashback.",
    brandHex: "#EE4D2D",
  },
  {
    id:       "tokopedia",
    label:    "Tokopedia",
    handle:   "lumara-id",
    url:      "https://tokopedia.com/lumara-id",
    desc:     "Tersedia juga di Tokopedia — pembayaran fleksibel & bebas ongkir.",
    brandHex: "#03AC0E",
  },
];
