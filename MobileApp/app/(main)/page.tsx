import { productService } from "@/lib/services/ProductService";
import { categoryModel } from "@/lib/models/CategoryModel";
import { HeroSection } from "@/components/sections/HeroSection";
import { CategorySection } from "@/components/sections/CategorySection";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { NewArrivalsSection } from "@/components/sections/NewArrivalsSection";
import { PromoSection } from "@/components/sections/PromoSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, newArrivals, categories] = await Promise.all([
    productService.getFeaturedProducts(8),
    productService.getNewProducts(4),
    categoryModel.findAllWithCount(),
  ]);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategorySection categories={categories} />
      <FeaturedSection products={featured} />
      <PromoSection />
      <NewArrivalsSection products={newArrivals} />
    </div>
  );
}
