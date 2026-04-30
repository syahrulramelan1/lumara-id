import type { Metadata } from "next";
import { Suspense } from "react";
import { productService } from "@/lib/services/ProductService";
import { categoryModel } from "@/lib/models/CategoryModel";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { MobileFilterDrawer } from "@/components/product/MobileFilterDrawer";
import { ProductsPageHeader } from "@/components/shared/ProductsPageHeader";
import { SkeletonGrid } from "@/components/motion/SkeletonCard";
import type { FilterParams } from "@/types";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<Record<string, string>>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;

  const params: FilterParams = {
    category: sp.category,
    search: sp.search,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    sortBy: (sp.sortBy as FilterParams["sortBy"]) ?? "terbaru",
    page: sp.page ? Number(sp.page) : 1,
    limit: 12,
  };

  const activeFilterCount = [sp.category, sp.search, sp.minPrice, sp.maxPrice, sp.sortBy && sp.sortBy !== "terbaru" ? sp.sortBy : null]
    .filter(Boolean).length;

  const [result, categories] = await Promise.all([
    productService.getProducts(params),
    categoryModel.findAll(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <ProductsPageHeader total={result.total} />

      {/* Mobile: sticky toolbar with search form + filter drawer */}
      <div className="md:hidden sticky top-16 z-30 bg-background/95 backdrop-blur-md -mx-4 px-4 py-3 mb-4 border-b border-border flex items-center gap-2">
        <form method="GET" action="/products" className="flex-1 relative">
          {/* Preserve other params */}
          {sp.category && <input type="hidden" name="category" value={sp.category} />}
          {sp.sortBy && <input type="hidden" name="sortBy" value={sp.sortBy} />}
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            name="search"
            defaultValue={sp.search ?? ""}
            placeholder="Cari produk..."
            autoComplete="off"
            inputMode="search"
            enterKeyHint="search"
            style={{ WebkitAppearance: "none", appearance: "none" }}
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-muted border border-border rounded-[12px] outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </form>
        <Suspense fallback={null}>
          <MobileFilterDrawer
            categories={categories}
            currentParams={params}
            activeCount={activeFilterCount}
          />
        </Suspense>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 shrink-0 sticky top-20 self-start">
          <Suspense fallback={null}>
            <ProductFilters categories={categories} currentParams={params} />
          </Suspense>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<SkeletonGrid cols={3} count={12} />}>
            <ProductGrid products={result.data} cols={3} priority={6} />
          </Suspense>

          {/* Pagination */}
          {result.totalPages > 1 && (
            <div className="flex justify-center flex-wrap gap-2 mt-8">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({ ...sp, page: String(p) }).toString()}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-[12px] text-sm font-medium transition-colors ${
                    p === result.currentPage
                      ? "bg-primary text-white"
                      : "bg-muted hover:bg-primary/10 text-foreground"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
