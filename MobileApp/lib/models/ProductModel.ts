import { prisma } from "@/lib/prisma";
import type { Product, Prisma } from "@prisma/client";
import type { ProductWithCategory, ProductWithReviews, FilterParams, PaginationResult } from "@/types";

// ─── Search Utilities ─────────────────────────────────────────────────────────

// Variasi ejaan umum produk fashion Indonesia
const FASHION_ALIASES: Record<string, string[]> = {
  pasmina:   ["pashmina"],
  pashmina:  ["pasmina"],
  sifon:     ["chiffon", "syifon", "shiffon"],
  chiffon:   ["sifon", "syifon"],
  syifon:    ["sifon", "chiffon"],
  voal:      ["voile"],
  voile:     ["voal"],
  brokat:    ["brocade", "brukat"],
  brukat:    ["brokat", "brocade"],
  ceruti:    ["cerutti"],
  cerutti:   ["ceruti"],
  katun:     ["cotton"],
  cotton:    ["katun"],
  abaya:     ["abayah"],
  abayah:    ["abaya"],
  gamis:     ["dress"],
  hijab:     ["jilbab", "kerudung"],
  jilbab:    ["hijab", "kerudung"],
  kerudung:  ["hijab", "jilbab"],
  premium:   ["mewah"],
  lasercut:  ["laser cut", "laser-cut"],
};

/**
 * Ubah query menjadi daftar istilah yang diperluas:
 * - Tiap kata dipisah dan dicari sendiri (token)
 * - Variasi ejaan umum fashion Indonesia ditambahkan
 * - Duplikat dihilangkan
 */
function buildSearchTerms(query: string): string[] {
  const q = query.trim().toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length >= 2);
  const terms = new Set<string>();

  // Tambah query asli dan tiap kata
  terms.add(q);
  words.forEach((w) => terms.add(w));

  // Tambah alias untuk tiap kata
  words.forEach((w) => {
    (FASHION_ALIASES[w] ?? []).forEach((alias) => terms.add(alias));
  });

  // Jika query adalah 1 kata panjang (>= 5 huruf), tambah prefix 4 huruf pertama
  // agar "pasmi" cocok dengan "pashmina" dst (partial prefix matching)
  if (words.length === 1 && q.length >= 5) {
    terms.add(q.slice(0, 4));
  }

  return [...terms];
}

/**
 * Bangun kondisi OR Prisma dari daftar istilah.
 * Tiap istilah dicari di: nama produk dan deskripsi.
 */
function buildSearchOR(terms: string[]): object[] {
  return terms.flatMap((term) => [
    { name:        { contains: term, mode: "insensitive" } },
    { description: { contains: term, mode: "insensitive" } },
  ]);
}

// ─── Model ────────────────────────────────────────────────────────────────────

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
      const terms = buildSearchTerms(search);
      where.OR = buildSearchOR(terms);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) (where.price as Record<string, number>).gte = minPrice;
      if (maxPrice !== undefined) (where.price as Record<string, number>).lte = maxPrice;
    }

    const orderBy: Record<string, string> = {
      terbaru:         "createdAt",
      terlaris:        "reviewCount",
      "harga-terendah": "price",
      "harga-tertinggi": "price",
      rating:          "rating",
    };

    const orderDir: Record<string, string> = {
      terbaru:          "desc",
      terlaris:         "desc",
      "harga-terendah": "asc",
      "harga-tertinggi": "desc",
      rating:           "desc",
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
    // Product yang sudah pernah dibeli punya OrderItem yang reference dia
    // dengan FK Restrict (default). Cek dulu, kasih pesan yang jelas.
    const orderCount = await prisma.orderItem.count({ where: { productId: id } });
    if (orderCount > 0) {
      throw new Error(
        `Tidak bisa menghapus — produk ini sudah pernah dipesan (${orderCount} order item). Pertimbangkan untuk set stock = 0 atau ubah visibilitas.`
      );
    }
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
