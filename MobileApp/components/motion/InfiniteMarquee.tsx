"use client";
import { motion } from "framer-motion";

const ITEMS = [
  "🚚 Gratis Ongkir",
  "✨ 100% Original",
  "💳 COD Tersedia",
  "🔄 Retur 7 Hari",
  "⭐ Rating 4.9+",
  "📦 Packing Aman & Rapih",
  "💎 Kualitas Premium",
  "🕌 Fashion Modest Terpercaya",
];

interface InfiniteMarqueeProps {
  className?: string;
  speed?: number;
}

export function InfiniteMarquee({ className = "", speed = 22 }: InfiniteMarqueeProps) {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex w-max"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-6 text-xs font-medium text-muted-foreground whitespace-nowrap"
          >
            {item}
            <span className="ml-4 text-primary/25">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
