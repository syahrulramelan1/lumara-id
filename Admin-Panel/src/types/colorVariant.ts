// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Color Variant — mirror dari MobileApp/types/colorVariant.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ColorVariant {
  /** Nama warna ("Hitam", "Cream", "Tosca") — wajib */
  name: string;
  /** CSS color value untuk swatch ("#000000", "#F5DEB3"). Tanpa ini → render pill text. */
  colorCode?: string;
  /** URL gambar khusus warna ini (dari product.images yang sudah upload). */
  image?: string;
  /** Stok per varian. Undefined → fallback ke product.stock. 0 → disabled. */
  stock?: number;
}

/**
 * Normalize raw colors data dari backend ke `ColorVariant[]`.
 * Mendukung 3 format input:
 *   1. Array of string (legacy): `["Hitam", "Cream"]` → `[{name:"Hitam"}, {name:"Cream"}]`
 *   2. JSON string yang perlu di-parse dulu
 *   3. Array of object lengkap
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
      if (typeof entry === "string" && entry.trim().length > 0) {
        return { name: entry.trim() };
      }
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
