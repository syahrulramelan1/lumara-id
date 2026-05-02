"use client";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import type { ColorVariant } from "@/types/colorVariant";
import { isColorAvailable } from "@/types/colorVariant";

interface ColorSwatchProps {
  color:    ColorVariant;
  active:   boolean;
  onSelect: (color: ColorVariant) => void;
}

/**
 * Tombol satu varian warna (modular, dipakai oleh ProductDetail color picker).
 *
 * Visual:
 *   - Kalau `colorCode` ada → render swatch bulat dengan colorCode sebagai bg.
 *     Ada border ring saat active + ikon centang di tengah.
 *   - Kalau `colorCode` tidak ada → render pill text dengan nama warna.
 *   - Kalau `stock === 0` → opacity 50%, cursor not-allowed, garis silang
 *     diagonal di swatch, tooltip "Stok habis".
 *
 * Aksesibilitas:
 *   - role="radio" + aria-checked supaya screen reader paham ini selection
 *   - aria-label deskriptif: "Pilih warna {nama}, stok {n}"
 *   - Keyboard: Tab untuk fokus, Enter/Space untuk select
 *   - aria-disabled saat stok habis
 *
 * Tooltip:
 *   - Pakai CSS group-hover (no JS state) — tampil card kecil di atas swatch
 *     dengan nama warna + label stok kalau ada.
 */
export function ColorSwatch({ color, active, onSelect }: ColorSwatchProps) {
  const available  = isColorAvailable(color);
  const hasSwatch  = !!color.colorCode;
  const stockLabel = color.stock === undefined
    ? null
    : color.stock === 0
      ? "Stok habis"
      : `Stok: ${color.stock}`;

  // Jangan trigger select kalau stok habis
  const handleSelect = () => {
    if (!available) return;
    onSelect(color);
  };

  // ── Variant 1: ada colorCode → bulat swatch ──
  if (hasSwatch) {
    return (
      <motion.button
        type="button"
        role="radio"
        aria-checked={active}
        aria-disabled={!available}
        aria-label={`Pilih warna ${color.name}${stockLabel ? `, ${stockLabel.toLowerCase()}` : ""}`}
        onClick={handleSelect}
        disabled={!available}
        whileTap={available ? { scale: 0.92 } : undefined}
        className={`group relative w-10 h-10 rounded-full transition-all
          ${active
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
            : "ring-1 ring-border hover:ring-primary/50 hover:scale-105"
          }
          ${!available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        style={{ backgroundColor: color.colorCode }}
      >
        {/* Centang centered saat active */}
        {active && available && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Check
              size={18}
              strokeWidth={3}
              className="drop-shadow-md"
              // Heuristik kontras: warna terang → centang gelap, warna gelap → centang putih.
              // Pakai mix-blend supaya selalu kontras tanpa hitung luminance manual.
              style={{ mixBlendMode: "difference", color: "white" }}
            />
          </span>
        )}

        {/* Garis silang diagonal saat stok habis */}
        {!available && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <line x1="6" y1="34" x2="34" y2="6" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
        )}

        {/* Tooltip — muncul di atas swatch saat hover/focus */}
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-10 shadow-md"
        >
          {color.name}
          {stockLabel && (
            <span className="block text-[10px] opacity-80 mt-0.5">{stockLabel}</span>
          )}
          {/* Tail tooltip */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-foreground" />
        </span>
      </motion.button>
    );
  }

  // ── Variant 2: tidak ada colorCode → pill text ──
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={active}
      aria-disabled={!available}
      aria-label={`Pilih warna ${color.name}${stockLabel ? `, ${stockLabel.toLowerCase()}` : ""}`}
      onClick={handleSelect}
      disabled={!available}
      whileTap={available ? { scale: 0.96 } : undefined}
      className={`group relative px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all
        ${active
          ? "border-primary bg-primary/5 text-primary"
          : "border-border hover:border-primary/50 text-foreground"
        }
        ${!available
          ? "opacity-50 cursor-not-allowed line-through"
          : "cursor-pointer"
        }`}
    >
      {color.name}
      {stockLabel && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-foreground text-background text-[10px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-10 shadow-md">
          {stockLabel}
        </span>
      )}
    </motion.button>
  );
}
