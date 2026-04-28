import type { Metadata } from "next";
import { productService } from "@/lib/services/ProductService";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { SearchBar } from "@/components/shared/SearchBar";
import { SearchPageHeader } from "@/components/shared/SearchPageHeader";

export const metadata: Metadata = { title: "Search" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page } = await searchParams;

  const result = q
    ? await productService.getProducts({ search: q, page: page ? Number(page) : 1, limit: 12 })
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SearchPageHeader q={q} total={result?.total} />
      <SearchBar className="mb-6" autoFocus />
      {result && <ProductGrid products={result.data} cols={3} />}
    </div>
  );
}
