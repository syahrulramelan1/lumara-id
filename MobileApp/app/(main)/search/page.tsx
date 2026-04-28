import type { Metadata } from "next";
import { productService } from "@/lib/services/ProductService";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { SearchBar } from "@/components/shared/SearchBar";

export const metadata: Metadata = { title: "Cari Produk" };
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
      <h1 className="text-2xl font-bold mb-4">Cari Produk</h1>
      <SearchBar className="mb-6" placeholder="Cari gamis, hijab, abaya..." autoFocus />

      {q && (
        <p className="text-sm text-muted-foreground mb-4">
          {result?.total ?? 0} hasil untuk &ldquo;<strong>{q}</strong>&rdquo;
        </p>
      )}

      {result && <ProductGrid products={result.data} cols={3} />}

      {!q && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-medium">Ketik untuk mulai mencari</p>
        </div>
      )}
    </div>
  );
}
