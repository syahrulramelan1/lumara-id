import type { Metadata } from "next";
import { productService } from "@/lib/services/ProductService";
import { categoryModel } from "@/lib/models/CategoryModel";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductsPageHeader } from "@/components/shared/ProductsPageHeader";
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

  const [result, categories] = await Promise.all([
    productService.getProducts(params),
    categoryModel.findAll(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductsPageHeader total={result.total} />

      <div className="flex gap-6">
        <aside className="hidden md:block w-56 shrink-0">
          <ProductFilters categories={categories} currentParams={params} />
        </aside>

        <div className="flex-1 min-w-0">
          <ProductGrid products={result.data} cols={3} priority={6} />

          {result.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`?${new URLSearchParams({ ...sp, page: String(p) }).toString()}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-[12px] text-sm font-medium transition-colors ${
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
