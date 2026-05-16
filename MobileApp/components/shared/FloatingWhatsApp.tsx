"use client";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface FloatingWhatsAppProps {
  message?: string;
  hidden?: boolean;
}

export function FloatingWhatsApp({ message, hidden }: FloatingWhatsAppProps) {
  const [mounted, setMounted] = useState(false);
  const settings = useSiteSettings();
  useEffect(() => setMounted(true), []);

  if (!mounted || hidden) return null;

  const number = settings.whatsapp_number;
  const text = encodeURIComponent(message ?? settings.whatsapp_message);
  const href = `https://wa.me/${number}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat dengan Lumara.id via WhatsApp"
      className="fixed right-4 z-[45] group bottom-above-nav"
    >
      <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
      <div className="relative flex items-center justify-center md:justify-start md:gap-2 bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105 active:scale-95 w-12 h-12 md:w-auto md:h-auto md:pl-3 md:pr-4 md:py-3">
        <FaWhatsapp size={22} className="shrink-0" />
        <span className="hidden md:inline text-sm font-semibold whitespace-nowrap">
          Chat Sekarang
        </span>
      </div>
    </a>
  );
}
