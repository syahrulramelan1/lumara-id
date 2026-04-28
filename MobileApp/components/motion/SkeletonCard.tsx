export function SkeletonCard() {
  return (
    <div className="bg-card rounded-card border border-card-border overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-2 bg-muted rounded-full w-1/3" />
        <div className="h-3 bg-muted rounded-full w-4/5" />
        <div className="h-3 bg-muted rounded-full w-2/3" />
        <div className="h-4 bg-muted rounded-full w-2/5 mt-2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ cols = 2, count = 6 }: { cols?: 2 | 3 | 4; count?: number }) {
  const colClass = { 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" }[cols];
  return (
    <div className={`grid ${colClass} gap-3 sm:gap-4`}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
