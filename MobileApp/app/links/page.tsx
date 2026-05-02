import type { Metadata } from "next";
import { SplashLinkTree } from "@/components/splash/SplashLinkTree";

export const metadata: Metadata = {
  title: "Lumara.id — Semua Channel Resmi",
  description:
    "Linktree resmi Lumara.id — WhatsApp livechat, Instagram, TikTok, Shopee, Tokopedia, dan website resmi.",
};

/**
 * URL khusus `/links` untuk pasang di bio Instagram, TikTok, dll.
 * Sama persis dengan splash di `/`, tapi terpisah supaya kalau nanti
 * mau di-track berbeda atau di-customize, gampang.
 */
export default function LinksPage() {
  return <SplashLinkTree />;
}
