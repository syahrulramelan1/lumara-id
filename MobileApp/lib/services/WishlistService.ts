import { wishlistModel } from "@/lib/models/WishlistModel";
import type { WishlistWithProduct } from "@/types";

export class WishlistService {
  private static instance: WishlistService;
  static getInstance() {
    if (!this.instance) this.instance = new WishlistService();
    return this.instance;
  }

  async getWishlist(userId: string): Promise<WishlistWithProduct[]> {
    return wishlistModel.findByUser(userId);
  }

  async toggle(userId: string, productId: string): Promise<{ added: boolean }> {
    return wishlistModel.toggle(userId, productId);
  }

  async isWishlisted(userId: string, productId: string): Promise<boolean> {
    return wishlistModel.isWishlisted(userId, productId);
  }

  async getCount(userId: string): Promise<number> {
    return wishlistModel.countByUser(userId);
  }
}

export const wishlistService = WishlistService.getInstance();
