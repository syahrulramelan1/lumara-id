export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-2", lg: "h-12 w-12 border-3" }[size];
  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${s} border-primary border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-card rounded-[14px] overflow-hidden border border-card-border animate-pulse">
      <div className="aspect-[3/4] bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2 mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  );
}
