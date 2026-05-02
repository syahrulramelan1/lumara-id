"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageZoomProps {
  images:      string[];
  activeIndex: number;
  productName: string;
  discount?:   number | null;
  onIndexChange?: (index: number) => void;
}

/**
 * Zoom interaction untuk foto produk — gabungan dua pattern yang umum di
 * e-commerce besar (Shopee/Tokopedia):
 *
 *   1. **Inner hover zoom (desktop)** — saat kursor masuk image, image scale
 *      2.2× dengan `transform-origin` mengikuti posisi cursor real-time.
 *      Bagus untuk inspect detail bahan tanpa modal.
 *
 *   2. **Lightbox full-screen (mobile + desktop)** — klik image membuka
 *      modal full-screen. Di mobile, browser native pinch-zoom + pan via
 *      `touch-action: pinch-zoom` + `overflow:auto`. Tombol arrow + ESC
 *      untuk navigasi & close.
 *
 * Mobile (no hover): inner zoom tidak trigger, langsung lightbox saat tap.
 */
export function ProductImageZoom({
  images,
  activeIndex,
  productName,
  discount,
  onIndexChange,
}: ProductImageZoomProps) {
  const [hoverZoom, setHoverZoom]     = useState(false);
  const [origin, setOrigin]           = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Saat user pindah ke gambar lain dari thumbnail, reset hover state
  useEffect(() => {
    setHoverZoom(false);
    setOrigin({ x: 50, y: 50 });
  }, [activeIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: clamp(x, 0, 100), y: clamp(y, 0, 100) });
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={() => setHoverZoom(true)}
        onMouseLeave={() => setHoverZoom(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-primary/5 cursor-zoom-in select-none"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 transition-transform duration-200 ease-out will-change-transform"
            style={{
              transform: hoverZoom ? "scale(2.2)" : "scale(1)",
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          >
            {images[activeIndex] && (
              <Image
                src={images[activeIndex]}
                alt={productName}
                fill
                className="object-contain pointer-events-none"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full z-10 pointer-events-none">
            -{discount}%
          </span>
        )}

        {/* Hint icon — fade out saat hover zoom aktif */}
        <div
          className={`absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white p-2 rounded-full pointer-events-none transition-opacity ${
            hoverZoom ? "opacity-0" : "opacity-100"
          }`}
        >
          <ZoomIn size={16} />
        </div>
      </div>

      {/* Lightbox modal — full screen, pinch-zoom, ESC/arrows */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={images}
            activeIndex={activeIndex}
            productName={productName}
            onClose={() => setLightboxOpen(false)}
            onPrev={() => onIndexChange?.((activeIndex - 1 + images.length) % images.length)}
            onNext={() => onIndexChange?.((activeIndex + 1) % images.length)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  images:      string[];
  activeIndex: number;
  productName: string;
  onClose: () => void;
  onPrev:  () => void;
  onNext:  () => void;
}

function Lightbox({ images, activeIndex, productName, onClose, onPrev, onNext }: LightboxProps) {
  // Keyboard: ESC tutup, arrow kiri/kanan navigate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")    onClose();
      if (e.key === "ArrowLeft"  && images.length > 1) onPrev();
      if (e.key === "ArrowRight" && images.length > 1) onNext();
    };
    document.addEventListener("keydown", handler);
    // Disable body scroll selama lightbox terbuka
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext, images.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${productName}`}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Tutup"
      >
        <X size={24} />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
          {activeIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Foto berikutnya"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Image — touch-action pinch-zoom enables native pinch on mobile.
          overflow:auto enables panning saat user pinch in. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full max-w-5xl max-h-[90vh] overflow-auto flex items-center justify-center"
        style={{ touchAction: "pinch-zoom" }}
      >
        {images[activeIndex] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={images[activeIndex]}
            alt={productName}
            className="max-w-full max-h-full object-contain mx-auto select-none"
            draggable={false}
          />
        )}
      </div>

      {/* Hint footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs hidden sm:block pointer-events-none">
        ESC untuk tutup • ← → untuk pindah foto • Pinch untuk zoom (mobile)
      </div>
    </motion.div>
  );
}

// ─── Util ─────────────────────────────────────────────────────────────────────

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
