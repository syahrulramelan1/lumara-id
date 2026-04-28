import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/lib/services/ProductService";
import { ProductGrid } from "@/components/shared/ProductGrid";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sortBy?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await productService.getCategoryWithProducts(slug, { page: 1 });
  if (!category) return { title: "Kategori tidak ditemukan" };
  return { title: category.name, description: category.description ?? undefined };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const { category, products } = await productService.getCategoryWithProducts(slug, {
    page: sp.page ? Number(sp.page) : 1,
    sortBy: sp.sortBy as never,
  });

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">{products.total} produk</p>
      </div>
      <ProductGrid products={products.data} cols={4} priority={8} />
    </div>
  );
}
