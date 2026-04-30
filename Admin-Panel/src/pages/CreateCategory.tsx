import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSave, HiOutlineArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";
import { ImageUpload, Sidebar } from "../components";
import { categoriesApi } from "../lib/api";

const CreateCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const autoSlug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const createMutation = useMutation({
    mutationFn: (payload: FormData | Record<string, string>) => categoriesApi.create(payload),
    onSuccess: () => {
      toast.success("Kategori berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/categories");
    },
    onError: (err: unknown) => {
      const msg = (err as any)?.response?.data?.error || "Gagal membuat kategori";
      toast.error(msg);
    },
  });

  const handleSubmit = () => {
    if (!form.name || !form.slug) { toast.error("Nama dan slug wajib diisi"); return; }
    if (imageFile) {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("slug", form.slug);
      fd.append("description", form.description);
      fd.append("image", imageFile);
      createMutation.mutate(fd);
    } else {
      createMutation.mutate({ name: form.name, slug: form.slug, description: form.description });
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Tambah Kategori</h2>
            <p className="page-subtitle">Isi informasi kategori baru</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/categories")} className="btn-ghost flex items-center gap-2 text-sm">
              <HiOutlineArrowLeft />
              Batal
            </button>
            <button onClick={handleSubmit} disabled={createMutation.isPending} className="btn-primary flex items-center gap-2 text-sm">
              <HiOutlineSave />
              {createMutation.isPending ? "Menyimpan..." : "Simpan Kategori"}
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text)] mb-4">Informasi Dasar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Nama Kategori *</label>
                <input className="input-base" type="text" placeholder="Gamis, Hijab, Khimar..."
                  value={form.name}
                  onChange={(e) => { set("name", e.target.value); set("slug", autoSlug(e.target.value)); }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Slug *</label>
                <input className="input-base" type="text" placeholder="gamis"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Deskripsi</label>
                <textarea className="input-base resize-none" rows={4} placeholder="Deskripsi kategori..."
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card p-6 h-fit">
            <h3 className="font-semibold text-[var(--text)] mb-4">Gambar Kategori</h3>
            <ImageUpload onFileSelect={(f) => setImageFile(f)} />
            <p className="text-xs text-[var(--text-muted)] mt-2">Gambar opsional. Akan ditampilkan di halaman kategori.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateCategory;
