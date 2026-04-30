"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import type { Category } from "@prisma/client";
import type { FilterParams } from "@/types";

interface ProductFiltersProps {
  categories: Category[];
  currentParams: FilterParams;
}

export function ProductFilters({ categories, currentParams }: ProductFiltersProps) {
  const router = useRouter();
  const sp = useSearchParams();
  const { language } = useUIStore();
  const t = getT(language);

  const sortOptions = [
    { value: "terbaru", label: t.product.sort_newest },
    { value: "terlaris", label: t.product.sort_bestseller },
    { value: "harga-terendah", label: t.product.sort_price_low },
    { value: "harga-tertinggi", label: t.product.sort_price_high },
    { value: "rating", label: t.product.sort_rating },
  ];

  const update = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(sp.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">{t.product.category_label}</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => update("category", undefined)}
              className={`w-full text-left px-3 py-2 rounded-[10px] text-sm transition-colors ${
                !currentParams.category ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"
              }`}
            >
              {t.product.all_categories}
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => update("category", cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-[10px] text-sm transition-colors ${
                  currentParams.category === cat.slug ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">{t.product.sort}</h3>
        <ul className="space-y-1">
          {sortOptions.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => update("sortBy", opt.value)}
                className={`w-full text-left px-3 py-2 rounded-[10px] text-sm transition-colors ${
                  (currentParams.sortBy ?? "terbaru") === opt.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
