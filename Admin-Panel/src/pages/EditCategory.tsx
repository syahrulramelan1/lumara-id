import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSave, HiOutlineArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";
import { ImageUpload, Sidebar } from "../components";
import { categoriesApi } from "../lib/api";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => categoriesApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  });

  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (data) setForm({ name: data.name, slug: data.slug, description: data.description ?? "", image: data.image ?? "" });
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (payload: FormData | Record<string, string>) => categoriesApi.update(id!, payload),
    onSuccess: () => {
      toast.success("Kategori berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/categories");
    },
    onError: (err: unknown) => {
      const msg = (err as any)?.response?.data?.error || "Gagal memperbarui kategori";
      toast.error(msg);
    },
  });

  const handleSave = () => {
    if (!form.name || !form.slug) { toast.error("Nama dan slug wajib diisi"); return; }
    if (imageFile) {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("slug", form.slug);
      fd.append("description", form.description);
      fd.append("image", imageFile);
      updateMutation.mutate(fd);
    } else {
      updateMutation.mutate({ name: form.name, slug: form.slug, description: form.description });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Edit Kategori</h2>
            <p className="page-subtitle">{data?.name}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/categories")} className="btn-ghost flex items-center gap-2 text-sm">
              <HiOutlineArrowLeft />
              Batal
            </button>
            <button onClick={handleSave} disabled={updateMutation.isPending} className="btn-primary flex items-center gap-2 text-sm">
              <HiOutlineSave />
              {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text)] mb-4">Informasi Dasar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Nama Kategori *</label>
                <input className="input-base" type="text" placeholder="Nama kategori..."
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Slug *</label>
                <input className="input-base" type="text" placeholder="slug-kategori"
                  value={form.slug}
                  onChange={(e) => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Deskripsi</label>
                <textarea className="input-base resize-none" rows={4} placeholder="Deskripsi kategori..."
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className="card p-6 h-fit">
            <h3 className="font-semibold text-[var(--text)] mb-4">Gambar Kategori</h3>
            <ImageUpload onFileSelect={(f) => setImageFile(f)} />
            {form.image && !imageFile && (
              <div className="mt-4">
                <img src={form.image} alt="current" className="w-36 h-32 object-cover rounded-lg border border-[var(--border)]" />
                <p className="text-xs text-[var(--text-muted)] mt-1">Gambar saat ini</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditCategory;
