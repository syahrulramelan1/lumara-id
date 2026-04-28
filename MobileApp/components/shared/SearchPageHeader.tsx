"use client";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";

interface Props {
  q?: string;
  total?: number;
}

export function SearchPageHeader({ q, total }: Props) {
  const { language } = useUIStore();
  const t = getT(language);
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{t.pages.search.title}</h1>
      {q && (
        <p className="text-sm text-muted-foreground mb-4">
          {total ?? 0} {t.pages.search.results_suffix} &ldquo;<strong>{q}</strong>&rdquo;
        </p>
      )}
      {!q && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-medium">{t.pages.search.type_to_search}</p>
        </div>
      )}
    </>
  );
}
