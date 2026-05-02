import type { Metadata } from "next";
import { SplashLinkTree } from "@/components/splash/SplashLinkTree";

export const metadata: Metadata = {
  title: "Lumara.id — Modest Fashion Premium Indonesia",
  description:
    "Pilih channel paling nyaman buat kamu — WhatsApp, Instagram, TikTok, Shopee, atau langsung di website Lumara.id.",
};

export default function RootSplashPage() {
  return <SplashLinkTree />;
}
