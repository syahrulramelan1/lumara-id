import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import type { ColorVariant } from "../types/colorVariant";

interface ColorVariantInputProps {
  /** Daftar varian warna saat ini */
  value: ColorVariant[];
  /** Callback saat list berubah (add/remove/edit) */
  onChange: (next: ColorVariant[]) => void;
  /**
   * Daftar URL image produk yang sudah diupload, untuk dipilih sebagai
   * variant.image. Disediakan oleh parent (existingImages dari product).
   */
  availableImages?: string[];
}

/**
 * Form input untuk variant warna — dipakai di CreateProduct & EditProduct.
 *
 * Setiap row merepresentasikan satu varian, punya:
 *   - Color picker (HTML5 type="color") + input nama warna
 *   - Dropdown pilih image (dari availableImages) — opsional
 *   - Input number stok — opsional
 *   - Tombol hapus
 *
 * Output via onChange selalu array bersih (tanpa null/empty name).
 *
 * Catatan integrasi:
 *   - State parent: `colors: ColorVariant[]` (bukan string lagi).
 *   - Saat submit form, lakukan `JSON.stringify(colors)` lalu kirim ke backend
 *     sebagai field `colors` di FormData. Backend & Prisma `Json` field accept
 *     format ini langsung.
 *   - Saat load existing product: `parseColors(product.colors)`.
 */
export default function ColorVariantInput({
  value,
  onChange,
  availableImages = [],
}: ColorVariantInputProps) {

  const updateAt = (index: number, patch: Partial<ColorVariant>) => {
    const next = value.map((c, i) => (i === index ? { ...c, ...patch } : c));
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const addNew = () => {
    onChange([...value, { name: "", colorCode: "#000000" }]);
  };

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <div className="border border-dashed border-[var(--border)] rounded-xl p-6 text-center text-[var(--text-muted)] text-sm">
          Belum ada varian warna. Klik tombol di bawah untuk menambah.
        </div>
      )}

      {value.map((color, index) => (
        <div
          key={index}
          className="border border-[var(--border)] rounded-xl p-4 bg-[var(--bg-2)] dark:bg-[var(--bg-3)] space-y-3 relative"
        >
          {/* Hapus button */}
          <button
            type="button"
            onClick={() => removeAt(index)}
            className="absolute top-2 right-2 p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
            aria-label={`Hapus warna ${color.name || index + 1}`}
            title="Hapus"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>

          {/* Row 1: color picker + nama */}
          <div className="flex gap-3">
            {/* Color picker — input native, di-style supaya lebih elegant */}
            <div className="flex-shrink-0">
              <label className="block text-xs text-[var(--text-muted)] mb-1">Kode Warna</label>
              <input
                type="color"
                value={color.colorCode ?? "#000000"}
                onChange={(e) => updateAt(index, { colorCode: e.target.value })}
                className="w-12 h-[38px] rounded-lg border border-[var(--border)] cursor-pointer bg-transparent"
                aria-label={`Pilih kode warna untuk varian ${color.name || index + 1}`}
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs text-[var(--text-muted)] mb-1">Nama Warna *</label>
              <input
                type="text"
                placeholder="cth: Hitam, Cream, Tosca"
                value={color.name}
                onChange={(e) => updateAt(index, { name: e.target.value })}
                className="input-base"
              />
            </div>
          </div>

          {/* Row 2: image dropdown + stok */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">
                Foto Khusus Warna (opsional)
              </label>
              {availableImages.length === 0 ? (
                <input
                  type="text"
                  placeholder="Upload foto produk dulu, lalu pilih di sini"
                  value={color.image ?? ""}
                  onChange={(e) => updateAt(index, { image: e.target.value || undefined })}
                  className="input-base"
                />
              ) : (
                <select
                  value={color.image ?? ""}
                  onChange={(e) => updateAt(index, { image: e.target.value || undefined })}
                  className="input-base"
                >
                  <option value="">— Pakai foto utama —</option>
                  {availableImages.map((img, i) => (
                    <option key={img} value={img}>
                      Foto #{i + 1} ({img.split("/").pop()?.slice(0, 30)}…)
                    </option>
                  ))}
                </select>
              )}
              {color.image && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={color.image}
                    alt={color.name}
                    className="w-12 h-12 object-cover rounded-lg border border-[var(--border)]"
                  />
                  <span className="text-xs text-[var(--text-muted)] truncate">{color.image}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">
                Stok Varian (opsional)
              </label>
              <input
                type="number"
                min={0}
                placeholder="kosongkan = ikut stok produk"
                value={color.stock ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  updateAt(index, { stock: val === "" ? undefined : Number(val) });
                }}
                className="input-base"
              />
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                Isi 0 untuk &quot;Stok habis&quot; — tombol warna ini akan disabled di storefront.
              </p>
            </div>
          </div>

          {/* Preview row: swatch + nama final */}
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--border)]">
            <span className="text-xs text-[var(--text-muted)]">Preview:</span>
            <div
              className="w-5 h-5 rounded-full border border-[var(--border)]"
              style={{ backgroundColor: color.colorCode || "#999" }}
            />
            <span className="text-xs font-medium text-[var(--text)]">
              {color.name || "(belum diisi)"}
            </span>
            {color.stock === 0 && (
              <span className="badge badge-red text-[10px]">Habis</span>
            )}
            {typeof color.stock === "number" && color.stock > 0 && (
              <span className="badge badge-green text-[10px]">Stok {color.stock}</span>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addNew}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--brand)] hover:text-[var(--brand)] text-[var(--text-muted)] text-sm transition-colors"
      >
        <HiOutlinePlus className="w-4 h-4" />
        Tambah Warna
      </button>
    </div>
  );
}
