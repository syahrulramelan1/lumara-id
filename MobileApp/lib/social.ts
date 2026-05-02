// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LUMARA.ID — Social & Marketplace Channels
// Single source of truth — edit di sini, semua komponen ikut.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Nomor WA Lumara.id (format internasional, tanpa "+" atau "0" di depan).
// 085285733391 → 6285285733391 (drop leading 0, prepend 62).
export const WHATSAPP_NUMBER = "6285285733391";

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

/**
 * Append UTM parameters ke URL — supaya bisa track di Shopee Seller
 * Insight / Google Analytics berapa traffic dari splash.
 *
 * Untuk URL yang bukan http (mis. wa.me, mailto), URL dikembalikan apa adanya.
 * Untuk wa.me URL kita tetap append (tidak break parsing-nya).
 */
export function withUtm(
  url: string,
  source = "lumara_splash",
  medium = "splash_linktree"
): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", source);
    u.searchParams.set("utm_medium", medium);
    return u.toString();
  } catch {
    return url;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Channel list — dipakai oleh Footer + halaman /contact + splash linktree
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type SocialChannel = {
  id:       "whatsapp" | "instagram" | "tiktok" | "shopee";
  label:    string;          // nama tampil di tombol/card
  handle:   string;          // username/handle yang ditampilkan
  url:      string;          // link target
  desc:     string;          // deskripsi singkat untuk /contact & splash
  brandHex: string;          // warna brand untuk hover/icon background
};

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id:       "whatsapp",
    label:    "WhatsApp",
    handle:   "+62 852-8573-3391",
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
    handle:   "@lumaraid",
    url:      "https://www.tiktok.com/@lumaraid?_r=1&_t=ZS-961guyaB8hY",
    desc:     "Video styling, mix & match outfit, dan konten lifestyle modest.",
    brandHex: "#000000",
  },
  {
    id:       "shopee",
    label:    "Shopee",
    handle:   "shopee.co.id/lumaraid",
    url:      "https://shopee.co.id/lumaraid",
    desc:     "Belanja di Shopee — gratis ongkir, voucher, dan cashback.",
    brandHex: "#EE4D2D",
  },
];
