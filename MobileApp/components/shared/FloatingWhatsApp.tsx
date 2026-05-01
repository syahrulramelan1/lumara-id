"use client";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "@/lib/social";

interface FloatingWhatsAppProps {
  /** Pesan custom — kalau tidak diisi pakai default dari lib/social.ts */
  message?: string;
  /** Sembunyikan tombol di route tertentu (cek di parent) */
  hidden?: boolean;
}

export function FloatingWhatsApp({ message, hidden }: FloatingWhatsAppProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cegah hydration mismatch — render setelah mount.
  if (!mounted || hidden) return null;

  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat dengan Lumara.id via WhatsApp"
      className="fixed right-4 z-40 group bottom-24 md:bottom-6"
    >
      {/* Pulse ring — efek perhatian ringan */}
      <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />

      <div className="relative flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-105 active:scale-95 pl-3 pr-4 py-3">
        <FaWhatsapp size={22} className="shrink-0" />
        {/* Label muncul di desktop, hidden di mobile (cuma icon) */}
        <span className="hidden md:inline text-sm font-semibold whitespace-nowrap">
          Chat Sekarang
        </span>
      </div>
    </a>
  );
}
