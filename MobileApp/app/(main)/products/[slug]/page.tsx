import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/lib/services/ProductService";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/shared/ProductGrid";
import { RelatedProductsHeader } from "@/components/shared/RelatedProductsHeader";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) return { title: "Not Found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) notFound();

  const related = await productService.getRelatedProducts(product.categoryId, product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <div className="mt-16">
          <RelatedProductsHeader />
          <ProductGrid products={related} cols={4} />
        </div>
      )}
    </div>
  );
}
