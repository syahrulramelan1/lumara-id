"use client";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCartStore();
  const { language } = useUIStore();
  const t = getT(language);
  const totalAmount = total();
  const totalItems = count();

  if (totalItems === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t.cart.empty_title}</h1>
        <p className="text-muted-foreground mb-6">{t.cart.empty_desc}</p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
        >
          {t.cart.shop_now}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t.cart.title} ({totalItems} {t.cart.items})</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={`${item.productId}-${item.size}-${item.color}`} className="bg-card border border-card-border rounded-[14px] p-4 flex gap-4">
              <div className="relative w-20 h-24 rounded-[10px] overflow-hidden bg-muted shrink-0">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.size} · {item.color}</p>
                <p className="font-bold text-primary mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center border border-border rounded-[8px] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-muted text-sm font-bold"
                    >−</button>
                    <span className="px-3 py-1 text-sm border-x border-border">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-muted text-sm font-bold"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-card-border rounded-[14px] p-5 h-fit sticky top-20">
          <h2 className="font-bold text-lg mb-4">{t.cart.summary}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.cart.subtotal} ({totalItems} {t.cart.items})</span>
              <span className="font-medium">{formatPrice(totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t.cart.shipping}</span>
              <span className="text-green-600 font-medium">{t.cart.free}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-base">
              <span>{t.cart.total}</span>
              <span className="text-primary">{formatPrice(totalAmount)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block mt-4 w-full text-center py-3 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-colors"
          >
            {t.cart.checkout_now}
          </Link>
          <Link
            href="/products"
            className="block mt-2 w-full text-center py-2.5 text-primary text-sm font-medium hover:underline"
          >
            {t.cart.continue_shopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
