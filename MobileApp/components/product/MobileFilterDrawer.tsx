"use client";
import { useState, Suspense } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductFilters } from "./ProductFilters";
import type { Category } from "@prisma/client";
import type { FilterParams } from "@/types";

interface Props {
  categories: Category[];
  currentParams: FilterParams;
  activeCount?: number;
}

export function MobileFilterDrawer({ categories, currentParams, activeCount = 0 }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] border border-border bg-card text-sm font-medium hover:border-primary/50 transition-colors relative"
      >
        <SlidersHorizontal size={15} />
        Filter
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {activeCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 38 }}
              className="fixed bottom-0 left-0 right-0 z-[70] bg-background rounded-t-[24px] shadow-2xl max-h-[88vh] flex flex-col"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="text-base font-bold">Filter & Urutkan</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1 px-5 py-4 pb-safe">
                <Suspense fallback={<div className="py-8 text-center text-muted-foreground text-sm">Memuat...</div>}>
                  <ProductFilters categories={categories} currentParams={currentParams} />
                </Suspense>
              </div>

              {/* Apply button */}
              <div className="px-5 py-4 border-t border-border">
                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-[14px] hover:bg-primary/90 transition-colors"
                >
                  Terapkan Filter
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
