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
 * Preset palette warna fashion modest yang umum dipakai.
 * Admin klik 1 preset → otomatis add row baru dengan colorCode + nama
 * (tidak perlu nyari hex code manual atau salah ketik nama).
 */
const PRESET_COLORS: { name: string; code: string }[] = [
  // Netral
  { name: "Hitam",       code: "#0F0F0F" },
  { name: "Putih",       code: "#FFFFFF" },
  { name: "Cream",       code: "#F5E6D3" },
  { name: "Beige",       code: "#D4B896" },
  { name: "Mocha",       code: "#8B6F47" },
  { name: "Coklat",      code: "#5D3A1A" },
  // Warm
  { name: "Maroon",      code: "#7A1F1F" },
  { name: "Burgundy",    code: "#5C1A1B" },
  { name: "Dusty Pink",  code: "#D4A5A5" },
  { name: "Coral",       code: "#FF7F7F" },
  { name: "Mustard",     code: "#D4A017" },
  // Cool
  { name: "Navy",        code: "#1E3A5F" },
  { name: "Sage",        code: "#9CAF88" },
  { name: "Tosca",       code: "#06A89E" },
  { name: "Olive",       code: "#7A8450" },
  { name: "Lavender",    code: "#B19CD9" },
  // Misc
  { name: "Abu-abu",     code: "#9CA3AF" },
  { name: "Hijau Army",  code: "#4B5320" },
  { name: "Ungu",        code: "#6B46C1" },
  { name: "Nude",        code: "#E8C4A0" },
];

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

  /**
   * Quick-add dari preset palette. Kalau warna sudah ada di list (case
   * insensitive name match), skip — biar tidak duplikat.
   */
  const addFromPreset = (preset: { name: string; code: string }) => {
    const exists = value.some(
      (c) => c.name.trim().toLowerCase() === preset.name.toLowerCase()
    );
    if (exists) return;
    onChange([...value, { name: preset.name, colorCode: preset.code }]);
  };

  return (
    <div className="space-y-3">
      {/* ── Preset palette: klik = quick add row ──────────────────── */}
      <div className="border border-[var(--border)] rounded-xl p-3 bg-[var(--bg-2)] dark:bg-[var(--bg-3)]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[var(--text)]">Pilih Cepat dari Palette</p>
          <p className="text-[10px] text-[var(--text-muted)]">Klik 1× untuk tambah</p>
        </div>
        <div className="grid grid-cols-10 sm:grid-cols-10 gap-1.5">
          {PRESET_COLORS.map((preset) => {
            const alreadyAdded = value.some(
              (c) => c.name.trim().toLowerCase() === preset.name.toLowerCase()
            );
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => addFromPreset(preset)}
                disabled={alreadyAdded}
                title={`${preset.name} (${preset.code})${alreadyAdded ? " — sudah ditambahkan" : ""}`}
                aria-label={`Tambah warna ${preset.name}`}
                className={`group relative aspect-square rounded-lg border-2 transition-all
                  ${alreadyAdded
                    ? "border-[var(--brand)] cursor-not-allowed"
                    : "border-[var(--border)] hover:border-[var(--brand)] hover:scale-110 cursor-pointer"
                  }`}
                style={{ backgroundColor: preset.code }}
              >
                {alreadyAdded && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow-md"
                        style={{ mixBlendMode: "difference" }}>
                    ✓
                  </span>
                )}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--text)] text-[var(--bg-1)] dark:bg-[var(--bg-1)] dark:text-[var(--text)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                  {preset.name}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-2">
          Total {PRESET_COLORS.length} preset siap pakai. Untuk warna custom, klik &quot;+ Tambah Warna&quot; di bawah.
        </p>
      </div>

      {value.length === 0 && (
        <div className="border border-dashed border-[var(--border)] rounded-xl p-6 text-center text-[var(--text-muted)] text-sm">
          Belum ada varian warna. Klik salah satu preset di atas atau tombol &quot;+ Tambah Warna&quot; di bawah.
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

          {/* Row 1: color picker + hex input + nama */}
          <div className="flex gap-3">
            {/* Color picker — input native, di-style supaya lebih elegant */}
            <div className="flex-shrink-0">
              <label className="block text-xs text-[var(--text-muted)] mb-1">Pilih</label>
              <input
                type="color"
                value={color.colorCode ?? "#000000"}
                onChange={(e) => updateAt(index, { colorCode: e.target.value })}
                className="w-12 h-[38px] rounded-lg border border-[var(--border)] cursor-pointer bg-transparent"
                aria-label={`Pilih kode warna untuk varian ${color.name || index + 1}`}
                title="Pilih warna custom dari color wheel"
              />
            </div>

            {/* Hex input — admin bisa paste hex code langsung */}
            <div className="w-24 flex-shrink-0">
              <label className="block text-xs text-[var(--text-muted)] mb-1">Hex</label>
              <input
                type="text"
                placeholder="#000000"
                value={color.colorCode ?? ""}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  // Auto-prepend # kalau user lupa, dan validate hex pattern
                  const normalized = v.startsWith("#") ? v : v ? `#${v}` : "";
                  updateAt(index, { colorCode: normalized || undefined });
                }}
                maxLength={7}
                className="input-base font-mono text-xs"
                aria-label="Hex color code"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs text-[var(--text-muted)] mb-1">
                Nama Warna * <span className="text-[10px] opacity-60">(autocomplete dari preset)</span>
              </label>
              <input
                type="text"
                placeholder="cth: Hitam, Cream, Tosca…"
                value={color.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  // Kalau user ngetik nama yang match preset, auto-suggest colorCode-nya juga
                  // (cuma kalau colorCode masih default kosong/black, supaya tidak override custom).
                  const matchedPreset = PRESET_COLORS.find(
                    (p) => p.name.toLowerCase() === newName.toLowerCase().trim()
                  );
                  if (matchedPreset && (!color.colorCode || color.colorCode === "#000000")) {
                    updateAt(index, { name: newName, colorCode: matchedPreset.code });
                  } else {
                    updateAt(index, { name: newName });
                  }
                }}
                list={`color-presets-${index}`}
                className="input-base"
              />
              {/* Datalist native HTML — autocomplete dropdown saat fokus + ngetik */}
              <datalist id={`color-presets-${index}`}>
                {PRESET_COLORS.map((p) => (
                  <option key={p.name} value={p.name} />
                ))}
              </datalist>
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
