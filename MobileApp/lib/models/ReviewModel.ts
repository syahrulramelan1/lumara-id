import { prisma } from "@/lib/prisma";
import type { Review } from "@prisma/client";
import type { ReviewWithUser } from "@/types";

export class ReviewModel {
  private static instance: ReviewModel;
  static getInstance() {
    if (!this.instance) this.instance = new ReviewModel();
    return this.instance;
  }

  async findByProduct(productId: string, limit = 20): Promise<ReviewWithUser[]> {
    return prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async create(data: { userId: string; productId: string; rating: number; comment: string; images?: string }): Promise<Review> {
    const review = await prisma.review.create({
      data: { ...data, images: data.images ?? "[]" },
    });
    await this.recalcRating(data.productId);
    return review;
  }

  async delete(id: string): Promise<void> {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return;
    await prisma.review.delete({ where: { id } });
    await this.recalcRating(review.productId);
  }

  private async recalcRating(productId: string): Promise<void> {
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: agg._avg.rating ?? 0,
        reviewCount: agg._count.rating,
      },
    });
  }
}

export const reviewModel = ReviewModel.getInstance();
