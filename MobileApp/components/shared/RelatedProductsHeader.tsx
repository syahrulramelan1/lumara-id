"use client";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

export function RelatedProductsHeader() {
  const { language } = useUIStore();
  const t = getT(language);
  return <h2 className="text-xl font-bold mb-6">{t.product.related}</h2>;
}
