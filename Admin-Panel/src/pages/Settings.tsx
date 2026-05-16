import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../components";
import { settingsApi, SiteSettings } from "../lib/api";
import {
  HiOutlineSave, HiOutlineGlobeAlt, HiOutlinePhone,
  HiOutlineChatAlt2, HiOutlineOfficeBuilding, HiOutlinePhotograph,
} from "react-icons/hi";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import toast from "react-hot-toast";

type Tab = "umum" | "kontak" | "sosmed";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "umum",   label: "Umum",        icon: HiOutlineBuildingStorefront },
  { id: "kontak", label: "Kontak",      icon: HiOutlinePhone },
  { id: "sosmed", label: "Sosial Media", icon: HiOutlineGlobeAlt },
];

const Field = ({
  label, name, value, onChange, type = "text", placeholder, hint, rows,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string; placeholder?: string; hint?: string; rows?: number;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-[var(--text)]">{label}</label>
    {rows ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-2)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
      />
    )}
    {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
  </div>
);

const LogoUpload = ({
  label, hint, currentUrl, variant, onUploaded,
}: {
  label: string; hint: string; currentUrl: string;
  variant: "dark" | "white"; onUploaded: (url: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("File harus berupa gambar"); return; }
    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    try {
      const res = await settingsApi.uploadLogo(file, variant);
      const url = res.data.url;
      onUploaded(url);
      setPreview(url);
      toast.success(`${label} berhasil diupload!`);
    } catch {
      toast.error("Upload gagal");
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--text)]">{label}</label>
      <div className="flex items-center gap-4">
        <div
          className={`w-36 h-16 rounded-xl border-2 border-dashed border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0 ${variant === "white" ? "bg-gray-900" : "bg-white"}`}
        >
          {preview ? (
            <img src={preview} alt={label} className="h-full w-full object-contain p-1" />
          ) : (
            <HiOutlinePhotograph className="text-2xl text-[var(--text-muted)]" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="btn-primary text-xs px-3 py-1.5 disabled:opacity-60"
          >
            {uploading ? "Mengupload..." : "Ganti Logo"}
          </button>
          {preview && (
            <p className="text-[10px] text-[var(--text-muted)] break-all max-w-xs truncate">{preview}</p>
          )}
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>("umum");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get().then((r) => r.data.data),
  });

  const defaultSite: SiteSettings = {
    site_name: "Lumara.id",
    site_tagline: "Modest Fashion Premium Indonesia",
    site_email: "hello@lumara.id",
    site_phone: "+62 852-8573-3391",
    site_address: "Jl. Munggang No.52, Kramat Jati",
    site_address2: "Jakarta Timur 13530",
    site_maps_url: "https://maps.app.goo.gl/YP6yXntqmPhmMrQ87",
    site_hours: "Senin – Sabtu\n09.00 – 17.00 WIB",
    whatsapp_number: "6285285733391",
    whatsapp_message: "Halo Lumara.id, saya mau tanya tentang produk kakak.",
    instagram_handle: "@lumara.ind",
    instagram_url: "https://www.instagram.com/lumara.ind",
    tiktok_handle: "@lumaraid",
    tiktok_url: "https://www.tiktok.com/@lumaraid",
    shopee_handle: "lumaraid",
    shopee_url: "https://shopee.co.id/lumaraid",
    logo_dark_url: "",
    logo_white_url: "",
  };

  const [form, setForm] = useState<SiteSettings>(defaultSite);
  const [initialized, setInitialized] = useState(false);

  if (data?.site && !initialized) {
    setForm({ ...defaultSite, ...data.site });
    setInitialized(true);
  }

  const save = useMutation({
    mutationFn: () => settingsApi.updateSite(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings berhasil disimpan!");
    },
    onError: () => toast.error("Gagal menyimpan settings"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="page-header">
          <div>
            <h2 className="page-title">Pengaturan Website</h2>
            <p className="page-subtitle">Kelola informasi, kontak, dan sosial media toko</p>
          </div>
          <button
            onClick={() => save.mutate()}
            disabled={save.isPending}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-60"
          >
            <HiOutlineSave className="text-base" />
            {save.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

        <div className="p-3 sm:p-6 max-w-3xl w-full">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-[var(--bg-2)] border border-[var(--border)] rounded-xl p-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-gradient-to-r from-brand-700 to-brand-500 text-white shadow-sm"
                    : "text-[var(--text-muted)] hover:text-[var(--brand)]"
                }`}
              >
                <Icon className="text-base shrink-0" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab: Umum */}
          {activeTab === "umum" && (
            <div className="flex flex-col gap-5">
              {/* Informasi Toko */}
              <div className="card p-5 sm:p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2 mb-1">
                  <HiOutlineBuildingStorefront className="text-[var(--brand)] text-xl" />
                  <h3 className="font-semibold text-[var(--text)]">Informasi Toko</h3>
                </div>
                <Field label="Nama Toko" name="site_name" value={form.site_name} onChange={handleChange} placeholder="Lumara.id" />
                <Field label="Tagline" name="site_tagline" value={form.site_tagline} onChange={handleChange} placeholder="Modest Fashion Premium Indonesia" hint="Tampil di footer dan meta description" />
                <Field label="Pesan Default WhatsApp" name="whatsapp_message" value={form.whatsapp_message} onChange={handleChange} rows={3} hint="Pesan yang muncul saat user klik tombol WhatsApp" />
                <Field label="Nomor WhatsApp" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="6285285733391" hint="Format internasional tanpa + atau 0 di depan" />
              </div>

              {/* Logo Toko */}
              <div className="card p-5 sm:p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2 mb-1">
                  <HiOutlinePhotograph className="text-[var(--brand)] text-xl" />
                  <h3 className="font-semibold text-[var(--text)]">Logo Toko</h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] -mt-2">Upload logo baru akan langsung aktif di website. Format: PNG/SVG/JPEG. Rekomendasi: PNG transparan.</p>
                <LogoUpload
                  label="Logo Light Mode"
                  hint="Tampil di navbar saat tema terang — gunakan logo warna gelap / berwarna di background putih"
                  currentUrl={form.logo_dark_url}
                  variant="dark"
                  onUploaded={(url) => setForm((p) => ({ ...p, logo_dark_url: url }))}
                />
                <div className="border-t border-[var(--border)]" />
                <LogoUpload
                  label="Logo Dark Mode"
                  hint="Tampil di navbar saat tema gelap — gunakan logo putih / terang di background hitam"
                  currentUrl={form.logo_white_url}
                  variant="white"
                  onUploaded={(url) => setForm((p) => ({ ...p, logo_white_url: url }))}
                />
              </div>
            </div>
          )}

          {/* Tab: Kontak */}
          {activeTab === "kontak" && (
            <div className="card p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2 mb-1">
                <HiOutlineOfficeBuilding className="text-[var(--brand)] text-xl" />
                <h3 className="font-semibold text-[var(--text)]">Informasi Kontak</h3>
              </div>
              <Field label="Email" name="site_email" value={form.site_email} onChange={handleChange} type="email" placeholder="hello@lumara.id" />
              <Field label="Nomor Telepon" name="site_phone" value={form.site_phone} onChange={handleChange} placeholder="+62 852-8573-3391" />
              <Field label="Alamat Baris 1" name="site_address" value={form.site_address} onChange={handleChange} placeholder="Jl. Munggang No.52, Kramat Jati" />
              <Field label="Alamat Baris 2" name="site_address2" value={form.site_address2} onChange={handleChange} placeholder="Jakarta Timur 13530" />
              <Field label="Link Google Maps" name="site_maps_url" value={form.site_maps_url} onChange={handleChange} placeholder="https://maps.app.goo.gl/..." hint="URL Google Maps lokasi toko" />
              <Field label="Jam Operasional" name="site_hours" value={form.site_hours} onChange={handleChange} rows={2} placeholder={"Senin – Sabtu\n09.00 – 17.00 WIB"} />
            </div>
          )}

          {/* Tab: Sosial Media */}
          {activeTab === "sosmed" && (
            <div className="flex flex-col gap-5">
              {/* WhatsApp */}
              <div className="card p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <HiOutlineChatAlt2 className="text-green-500 text-xl" />
                  <h3 className="font-semibold text-[var(--text)]">WhatsApp</h3>
                </div>
                <Field label="Nomor WA" name="whatsapp_number" value={form.whatsapp_number} onChange={handleChange} placeholder="6285285733391" hint="Format: 628xxx tanpa + atau 0" />
              </div>

              {/* Instagram */}
              <div className="card p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 inline-block" />
                  <h3 className="font-semibold text-[var(--text)]">Instagram</h3>
                </div>
                <Field label="Username" name="instagram_handle" value={form.instagram_handle} onChange={handleChange} placeholder="@lumara.ind" />
                <Field label="URL" name="instagram_url" value={form.instagram_url} onChange={handleChange} placeholder="https://www.instagram.com/lumara.ind" />
              </div>

              {/* TikTok */}
              <div className="card p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-black inline-block flex items-center justify-center text-white text-[10px] font-bold">T</span>
                  <h3 className="font-semibold text-[var(--text)]">TikTok</h3>
                </div>
                <Field label="Username" name="tiktok_handle" value={form.tiktok_handle} onChange={handleChange} placeholder="@lumaraid" />
                <Field label="URL" name="tiktok_url" value={form.tiktok_url} onChange={handleChange} placeholder="https://www.tiktok.com/@lumaraid" />
              </div>

              {/* Shopee */}
              <div className="card p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-orange-500 inline-block" />
                  <h3 className="font-semibold text-[var(--text)]">Shopee</h3>
                </div>
                <Field label="Nama Toko" name="shopee_handle" value={form.shopee_handle} onChange={handleChange} placeholder="lumaraid" />
                <Field label="URL" name="shopee_url" value={form.shopee_url} onChange={handleChange} placeholder="https://shopee.co.id/lumaraid" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
