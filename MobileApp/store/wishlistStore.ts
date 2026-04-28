"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  productIds: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  count: () => number;
  syncFromServer: (ids: string[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggle: (productId) => {
        const ids = get().productIds;
        set({
          productIds: ids.includes(productId)
            ? ids.filter((id) => id !== productId)
            : [...ids, productId],
        });
      },

      isWishlisted: (productId) => get().productIds.includes(productId),

      count: () => get().productIds.length,

      syncFromServer: (ids) => set({ productIds: ids }),
    }),
    { name: "lumara-wishlist" }
  )
);
