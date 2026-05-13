"use client";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import { FadeInView } from "@/components/motion/FadeInView";

export function ProductsPageHeader({ total }: { total: number }) {
  const { language } = useUIStore();
  const t = getT(language);
  return (
    <FadeInView className="mb-6">
      <h1 className="text-2xl font-bold">{t.pages.products.title}</h1>
      <p className="text-sm text-muted-foreground mt-1">
        {total} {t.pages.products.found_suffix}
      </p>
    </FadeInView>
  );
}
