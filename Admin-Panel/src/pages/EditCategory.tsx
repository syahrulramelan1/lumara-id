import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSave, HiOutlineArrowLeft, HiOutlinePlus, HiOutlinePencil } from "react-icons/hi";
import toast from "react-hot-toast";
import { ImageUpload, Sidebar } from "../components";
import { categoriesApi, productsApi } from "../lib/api";
import { firstImage } from "../lib/jsonUtils";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["category", id],
    queryFn: () => categoriesApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  });

  const { data: productsData } = useQuery({
    queryKey: ["products-by-category", id],
    queryFn: () => productsApi.list({ categoryId: id, limit: 50 }).then((r) => r.data),
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
      queryClient.invalidateQueries({ queryKey: ["category", id] });
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

  const products = productsData?.data ?? [];

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

        <div className="p-3 sm:p-6 space-y-6">
          {/* Top row: form + image */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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

          {/* Products in this category */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div>
                <h3 className="font-semibold text-[var(--text)]">Produk dalam Kategori</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{products.length} produk</p>
              </div>
              <Link
                to={`/products/create-product?categoryId=${id}`}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                <HiOutlinePlus />
                Tambah Produk
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="p-12 text-center text-[var(--text-muted)]">
                <p className="mb-3">Belum ada produk di kategori ini</p>
                <Link to={`/products/create-product?categoryId=${id}`} className="btn-primary text-sm inline-flex items-center gap-2">
                  <HiOutlinePlus />
                  Tambah Produk Pertama
                </Link>
              </div>
            ) : (
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th className="text-right pr-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const img = firstImage(p.images);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            {img ? (
                              <img src={img} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[var(--bg-3)] flex-shrink-0" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-[var(--text)] truncate max-w-[200px]">{p.name}</p>
                              <p className="text-xs text-[var(--text-muted)]">{p.sku || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-sm text-[var(--text)]">
                          {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.price)}
                        </td>
                        <td>
                          <span className={`badge ${p.stock > 0 ? "badge-green" : "badge-red"}`}>
                            {p.stock} pcs
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-end pr-4">
                            <Link to={`/products/${p.id}`} className="btn-icon" title="Edit produk">
                              <HiOutlinePencil />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditCategory;
