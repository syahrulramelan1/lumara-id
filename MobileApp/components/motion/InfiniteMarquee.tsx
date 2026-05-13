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
}

export function InfiniteMarquee({ className = "" }: InfiniteMarqueeProps) {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-6 text-xs font-medium text-muted-foreground dark:text-white/70 whitespace-nowrap"
          >
            {item}
            <span className="ml-4 text-primary/30">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
