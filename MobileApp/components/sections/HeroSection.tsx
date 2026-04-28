"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F9F9FF] via-[#EDE9FE] to-[#F0E6FF] dark:from-[#0F0A1E] dark:via-[#1a0f2e] dark:to-[#0F0A1E] min-h-[480px] flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
            <Sparkles size={14} />
            Koleksi Ramadhan 2025 Tersedia
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-foreground mb-4">
            Tampil Anggun,{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tetap Syar&apos;i
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-lg">
            Koleksi modest fashion premium pilihan untuk muslimah Indonesia. Kualitas terbaik, harga bersahabat.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-[12px] hover:bg-primary/90 transition-all hover:gap-3"
            >
              Belanja Sekarang
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-primary text-primary font-semibold rounded-[12px] hover:bg-primary/5 transition-colors"
            >
              Lihat Koleksi
            </Link>
          </div>

          <SearchBar className="max-w-md" placeholder="Cari gamis, hijab, abaya..." />

          <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">✅ Gratis ongkir s.d. Rp 500rb</span>
            <span className="flex items-center gap-1.5">✅ Bahan premium</span>
            <span className="flex items-center gap-1.5">✅ 7 hari retur</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
