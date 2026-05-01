"use client";
import { FaWhatsapp, FaInstagram, FaTiktok, FaShopify } from "react-icons/fa";
import { SiShopee } from "react-icons/si";
import { TokopediaIcon } from "@/components/icons/BrandIcons";
import { SOCIAL_CHANNELS } from "@/lib/social";

/**
 * Strip 5 ikon brand: WhatsApp, Instagram, TikTok, Shopee, Tokopedia.
 * Dipakai di Footer dan halaman /contact.
 *
 * Variant:
 *   - "footer"  → ikon kecil bulat di atas dark background (Footer)
 *   - "compact" → ikon medium dengan label, untuk di tempat lain
 */
export function SocialLinks({ variant = "footer" }: { variant?: "footer" | "compact" }) {
  // Mapping id → komponen ikon (avoid bundle full lib)
  const iconFor = (id: string, size: number) => {
    switch (id) {
      case "whatsapp":  return <FaWhatsapp  size={size} />;
      case "instagram": return <FaInstagram size={size} />;
      case "tiktok":    return <FaTiktok    size={size} />;
      case "shopee":    return <SiShopee      size={size} />;
      case "tokopedia": return <TokopediaIcon size={size} />;
      default:          return <FaShopify     size={size} />;
    }
  };

  if (variant === "footer") {
    return (
      <div className="flex flex-wrap gap-2">
        {SOCIAL_CHANNELS.map((c) => (
          <a
            key={c.id}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.label}
            title={`${c.label} — ${c.handle}`}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110"
            style={{ color: "white" }}
          >
            {iconFor(c.id, 16)}
          </a>
        ))}
      </div>
    );
  }

  // variant: compact (light bg, dengan label)
  return (
    <div className="flex flex-wrap gap-2">
      {SOCIAL_CHANNELS.map((c) => (
        <a
          key={c.id}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-card-border text-foreground hover:border-primary/40 hover:text-primary transition-all text-sm"
        >
          <span style={{ color: c.brandHex }}>{iconFor(c.id, 16)}</span>
          <span className="font-medium">{c.label}</span>
        </a>
      ))}
    </div>
  );
}
