// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Color Variant types & helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ColorVariant {
  /** Nama warna untuk ditampilkan ("Hitam", "Cream", "Tosca") */
  name: string;
  /** CSS color value untuk swatch (e.g. "#000000", "rgb(...)"). Kalau tidak ada → render abu + label nama. */
  colorCode?: string;
  /** URL gambar khusus warna ini. Kalau ada → gambar utama berubah saat warna ini dipilih. */
  image?: string;
  /** Stok per varian. Kalau undefined → fallback ke product.stock keseluruhan. Kalau 0 → disabled. */
  stock?: number;
}

/**
 * Normalize raw colors data dari Prisma `Json` field ke `ColorVariant[]`.
 * Mendukung 3 format input untuk backward compatibility:
 *
 *   1. Legacy array of string: `["Hitam", "Cream"]`
 *      → `[{name:"Hitam"}, {name:"Cream"}]`
 *
 *   2. JSON string (saat field di-store sebagai serialized string):
 *      `'["Hitam", "Cream"]'` atau `'[{"name":"Hitam"}]'`
 *
 *   3. Array of object lengkap:
 *      `[{name:"Hitam", colorCode:"#000", image:"...", stock:5}]`
 */
export function parseColors(raw: unknown): ColorVariant[] {
  let arr: unknown[] = [];

  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) arr = parsed;
    } catch {
      return [];
    }
  } else {
    return [];
  }

  return arr
    .map((entry): ColorVariant | null => {
      // Format legacy: string saja → name only
      if (typeof entry === "string" && entry.trim().length > 0) {
        return { name: entry.trim() };
      }
      // Format object: extract field yang valid
      if (entry && typeof entry === "object" && "name" in entry) {
        const obj = entry as Partial<ColorVariant>;
        if (typeof obj.name !== "string" || !obj.name.trim()) return null;
        return {
          name:      obj.name.trim(),
          colorCode: typeof obj.colorCode === "string" ? obj.colorCode : undefined,
          image:     typeof obj.image     === "string" ? obj.image     : undefined,
          stock:     typeof obj.stock     === "number" ? obj.stock     : undefined,
        };
      }
      return null;
    })
    .filter((c): c is ColorVariant => c !== null);
}

/**
 * Resolve gambar utama yang dipakai untuk varian warna tertentu.
 * Priority: variant.image → fallback images[0] → placeholder.
 */
export function getImageForColor(
  color: ColorVariant | null,
  fallbackImages: string[]
): string {
  if (color?.image) return color.image;
  if (fallbackImages.length > 0) return fallbackImages[0];
  return "/placeholder.svg";
}

/**
 * Cek apakah varian warna available untuk dipilih.
 * - stock undefined (no tracking per-variant) → available
 * - stock > 0 → available
 * - stock === 0 → unavailable (disabled di UI)
 */
export function isColorAvailable(color: ColorVariant): boolean {
  return color.stock === undefined || color.stock > 0;
}
