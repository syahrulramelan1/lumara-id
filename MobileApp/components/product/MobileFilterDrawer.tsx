"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { getT } from "@/lib/i18n";
import type { Category } from "@prisma/client";
import type { FilterParams } from "@/types";

interface Props {
  categories: Category[];
  currentParams: FilterParams;
  activeCount?: number;
}

export function MobileFilterDrawer({ categories, currentParams, activeCount = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const { language } = useUIStore();
  const t = getT(language);

  useEffect(() => { setMounted(true); }, []);

  // Cegah scroll body saat drawer terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const sortOptions = [
    { value: "terbaru",         label: t.product.sort_newest },
    { value: "terlaris",        label: t.product.sort_bestseller },
    { value: "harga-terendah",  label: t.product.sort_price_low },
    { value: "harga-tertinggi", label: t.product.sort_price_high },
    { value: "rating",          label: t.product.sort_rating },
  ];

  const currentSort = currentParams.sortBy ?? "terbaru";
  const currentCategory = currentParams.category;

  const apply = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(sp.toString());
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  const reset = () => {
    router.push("/products");
    setOpen(false);
  };

  const overlay = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — langsung di body, tidak kena stacking context parent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-[24px] shadow-2xl flex flex-col"
            style={{ zIndex: 9999, maxHeight: "75vh" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
              <h3 className="text-base font-bold">Filter & Urutkan</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 min-h-0 px-5 py-5 space-y-6">

              {/* Sort */}
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t.product.sort}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {sortOptions.map((opt) => {
                    const active = currentSort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => apply("sortBy", opt.value === "terbaru" ? undefined : opt.value)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-[12px] text-sm font-medium border transition-all ${
                          active
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-muted/50 border-transparent text-foreground hover:border-border"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {active && <Check size={14} className="shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Category */}
              <section>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {t.product.category_label}
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => apply("category", undefined)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-sm transition-all ${
                      !currentCategory
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <span>{t.product.all_categories}</span>
                    {!currentCategory && <Check size={14} className="shrink-0" />}
                  </button>
                  {categories.map((cat) => {
                    const active = currentCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => apply("category", cat.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] text-sm transition-all ${
                          active
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <span>{cat.name}</span>
                        {active && <Check size={14} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="px-5 pt-3 pb-6 border-t border-border shrink-0 flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 border border-border rounded-[14px] text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-3 bg-primary text-white font-semibold rounded-[14px] hover:bg-primary/90 transition-colors text-sm"
              >
                Terapkan
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Trigger */}
      <motion.button
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border border-border bg-card text-sm font-medium hover:border-primary/50 transition-colors relative shrink-0"
      >
        <SlidersHorizontal size={15} />
        Filter
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {activeCount}
          </span>
        )}
      </motion.button>

      {/* Portal — render backdrop + drawer langsung ke body */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
