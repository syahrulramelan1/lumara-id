"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const items = get().items;
        const idx = items.findIndex(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
        );
        if (idx >= 0) {
          const updated = [...items];
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity };
          set({ items: updated });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId, size, color) => {
        set({ items: get().items.filter((i) => !(i.productId === productId && i.size === size && i.color === color)) });
      },

      updateQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.size === size && i.color === color ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "lumara-cart" }
  )
);
