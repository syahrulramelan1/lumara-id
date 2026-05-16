import type { Metadata } from "next";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaTiktok } from "react-icons/fa";
import { SiShopee } from "react-icons/si";
import { Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { appSettingModel } from "@/lib/models/AppSettingModel";

export const metadata: Metadata = { title: "Kontak Kami" };

const ICON_MAP = {
  whatsapp:  FaWhatsapp,
  instagram: FaInstagram,
  tiktok:    FaTiktok,
  shopee:    SiShopee,
} as const;

export default async function ContactPage() {
  const site = await appSettingModel.getSiteSettings();

  const SOCIAL_CHANNELS = [
    {
      id: "whatsapp" as const,
      label: "WhatsApp",
      handle: "Chat Sekarang",
      url: `https://wa.me/${site.whatsapp_number}?text=${encodeURIComponent(site.whatsapp_message)}`,
      desc: "Live chat 24 jam — paling cepat dibalas.",
      brandHex: "#25D366",
    },
    {
      id: "instagram" as const,
      label: "Instagram",
      handle: site.instagram_handle,
      url: site.instagram_url,
      desc: "Foto produk terbaru, behind the scene, dan promo eksklusif.",
      brandHex: "#E4405F",
    },
    {
      id: "tiktok" as const,
      label: "TikTok",
      handle: site.tiktok_handle,
      url: site.tiktok_url,
      desc: "Video styling, mix & match outfit, dan konten lifestyle modest.",
      brandHex: "#000000",
    },
    {
      id: "shopee" as const,
      label: "Shopee",
      handle: site.shopee_handle,
      url: site.shopee_url,
      desc: "Belanja di Shopee — gratis ongkir, voucher, dan cashback.",
      brandHex: "#EE4D2D",
    },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-14">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Kontak Kami</h1>
        <p className="text-muted-foreground">Pilih channel paling nyaman buat kamu — kami balas cepat 🙌</p>
      </div>

      {/* PRIMARY CTA: WhatsApp livechat */}
      <a
        href={`https://wa.me/${site.whatsapp_number}?text=${encodeURIComponent(site.whatsapp_message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-br from-[#25D366] to-[#1EBE5A] rounded-2xl p-6 md:p-8 mb-6 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all hover:scale-[1.01]"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <FaWhatsapp size={28} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold opacity-90">CHAT TERCEPAT</p>
            <h2 className="text-xl font-bold mt-0.5">WhatsApp Livechat</h2>
            <p className="text-sm opacity-90 mt-1">Sapa langsung admin Lumara — biasanya dibalas dalam 5 menit.</p>
          </div>
          <ExternalLink size={20} className="opacity-80 shrink-0 hidden sm:block" />
        </div>
      </a>

      {/* SOSMED + MARKETPLACE GRID */}
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Channel Lainnya</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        {SOCIAL_CHANNELS.filter((c) => c.id !== "whatsapp").map((c) => {
          const Icon = ICON_MAP[c.id];
          return (
            <a
              key={c.id}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-card-border rounded-2xl p-5 flex items-start gap-4 hover:border-primary/30 hover:shadow-violet-sm transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: c.brandHex }}
              >
                <Icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold">{c.label}</h4>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-primary font-medium mt-0.5">{c.handle}</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{c.desc}</p>
              </div>
            </a>
          );
        })}
      </div>

      {/* INFO LAINNYA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Mail,    label: "Email",     value: site.site_email,    sub: "Dibalas 1x24 jam",  href: null },
          { icon: MapPin,  label: "Alamat",    value: site.site_address,  sub: site.site_address2,  href: site.site_maps_url },
          { icon: Clock,   label: "Jam Kerja", value: site.site_hours.split("\n")[0], sub: site.site_hours.split("\n")[1] ?? "", href: null },
        ].map(({ icon: Icon, label, value, sub, href }) => {
          const inner = (
            <>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon size={16} />
                <p className="text-xs font-semibold uppercase tracking-wider">{label}</p>
                {href && <ExternalLink size={12} className="ml-auto text-primary/60" />}
              </div>
              <p className="font-semibold text-sm">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </>
          );
          return href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-card-border rounded-2xl p-5 hover:border-primary/30 transition-colors block"
            >
              {inner}
            </a>
          ) : (
            <div key={label} className="bg-card border border-card-border rounded-2xl p-5">
              {inner}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-8">
        Butuh tahu cara order?{" "}
        <Link href="/how-to-order" className="text-primary hover:underline font-medium">
          Lihat panduan belanja
        </Link>
      </p>
    </div>
  );
}
