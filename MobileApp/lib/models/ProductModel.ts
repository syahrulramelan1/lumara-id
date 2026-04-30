import { prisma } from "@/lib/prisma";
import type { Product, Prisma } from "@prisma/client";
import type { ProductWithCategory, ProductWithReviews, FilterParams, PaginationResult } from "@/types";

export class ProductModel {
  private static instance: ProductModel;
  static getInstance() {
    if (!this.instance) this.instance = new ProductModel();
    return this.instance;
  }

  async findById(id: string): Promise<ProductWithCategory | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async findBySlug(slug: string): Promise<ProductWithReviews | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  }

  async findFeatured(limit = 8): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
      where: { isFeatured: true, stock: { gt: 0 } },
      include: { category: true },
      orderBy: { rating: "desc" },
      take: limit,
    });
  }

  async findNew(limit = 8): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
      where: { isNew: true, stock: { gt: 0 } },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async findRelated(categoryId: string, excludeId: string, limit = 4): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
      where: { categoryId, id: { not: excludeId }, stock: { gt: 0 } },
      include: { category: true },
      orderBy: { rating: "desc" },
      take: limit,
    });
  }

  async findWithFilters(params: FilterParams & { categoryId?: string }): Promise<PaginationResult<ProductWithCategory>> {
    const { category, categoryId, search, minPrice, maxPrice, sortBy = "terbaru", page = 1, limit = 12 } = params;
    const skip = (page - 1) * limit;

    // Admin requests (categoryId) show all products; public requests filter to in-stock only
    const where: Record<string, unknown> = categoryId ? {} : { stock: { gt: 0 } };

    if (categoryId) where.categoryId = categoryId;
    else if (category) where.category = { slug: category };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) (where.price as Record<string, number>).gte = minPrice;
      if (maxPrice !== undefined) (where.price as Record<string, number>).lte = maxPrice;
    }

    const orderBy: Record<string, string> = {
      terbaru: "createdAt",
      terlaris: "reviewCount",
      "harga-terendah": "price",
      "harga-tertinggi": "price",
      rating: "rating",
    };

    const orderDir: Record<string, string> = {
      terbaru: "desc",
      terlaris: "desc",
      "harga-terendah": "asc",
      "harga-tertinggi": "desc",
      rating: "desc",
    };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { [orderBy[sortBy]]: orderDir[sortBy] },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      totalPages,
      currentPage: page,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(id: string, data: Prisma.ProductUncheckedUpdateInput): Promise<Product> {
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  }

  async decrementStock(id: string, quantity: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });
  }
}

export const productModel = ProductModel.getInstance();
