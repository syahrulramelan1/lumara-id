import { productModel } from "@/lib/models/ProductModel";
import { categoryModel } from "@/lib/models/CategoryModel";
import type { FilterParams, ProductWithCategory, ProductWithReviews, PaginationResult } from "@/types";

export class ProductService {
  private static instance: ProductService;
  static getInstance() {
    if (!this.instance) this.instance = new ProductService();
    return this.instance;
  }

  async getProductBySlug(slug: string): Promise<ProductWithReviews | null> {
    return productModel.findBySlug(slug);
  }

  async getProductById(id: string): Promise<ProductWithCategory | null> {
    return productModel.findById(id);
  }

  async getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
    return productModel.findFeatured(limit);
  }

  async getNewProducts(limit = 8): Promise<ProductWithCategory[]> {
    return productModel.findNew(limit);
  }

  async getRelatedProducts(categoryId: string, excludeId: string): Promise<ProductWithCategory[]> {
    return productModel.findRelated(categoryId, excludeId, 4);
  }

  async getProducts(params: FilterParams): Promise<PaginationResult<ProductWithCategory>> {
    return productModel.findWithFilters(params);
  }

  parseImages(images: string): string[] {
    try { return JSON.parse(images); } catch { return []; }
  }

  parseSizes(sizes: string): string[] {
    try { return JSON.parse(sizes); } catch { return []; }
  }

  parseColors(colors: string): string[] {
    try { return JSON.parse(colors); } catch { return []; }
  }

  getDiscountPercent(price: number, originalPrice: number | null): number | null {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  async getCategoryWithProducts(categorySlug: string, params: FilterParams): Promise<{
    category: Awaited<ReturnType<typeof categoryModel.findBySlug>>;
    products: PaginationResult<ProductWithCategory>;
  }> {
    const [category, products] = await Promise.all([
      categoryModel.findBySlug(categorySlug),
      productModel.findWithFilters({ ...params, category: categorySlug }),
    ]);
    return { category, products };
  }
}

export const productService = ProductService.getInstance();
