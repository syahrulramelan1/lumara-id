import { prisma } from "@/lib/prisma";
import type { WishlistWithProduct } from "@/types";

export class WishlistModel {
  private static instance: WishlistModel;
  static getInstance() {
    if (!this.instance) this.instance = new WishlistModel();
    return this.instance;
  }

  async findByUser(userId: string): Promise<WishlistWithProduct[]> {
    return prisma.wishlist.findMany({
      where: { userId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async isWishlisted(userId: string, productId: string): Promise<boolean> {
    const item = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return !!item;
  }

  async toggle(userId: string, productId: string): Promise<{ added: boolean }> {
    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (existing) {
      await prisma.wishlist.delete({ where: { userId_productId: { userId, productId } } });
      return { added: false };
    }
    await prisma.wishlist.create({ data: { userId, productId } });
    return { added: true };
  }

  async countByUser(userId: string): Promise<number> {
    return prisma.wishlist.count({ where: { userId } });
  }

  async remove(userId: string, productId: string): Promise<void> {
    await prisma.wishlist.delete({ where: { userId_productId: { userId, productId } } });
  }
}

export const wishlistModel = WishlistModel.getInstance();
