import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSave, HiOutlineArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";
import { ImageUpload, Sidebar } from "../components";
import { productsApi, categoriesApi } from "../lib/api";
import { parseJsonArr, parseJsonArrToString } from "../lib/jsonUtils";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  });
  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then((r) => r.data.data),
  });

  const [form, setForm] = useState({
    name: "", slug: "", description: "", categoryId: "",
    price: "", originalPrice: "", stock: "", sku: "",
    sizes: "", colors: "", isFeatured: false, isNew: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        price: String(product.price),
        originalPrice: product.originalPrice ? String(product.originalPrice) : "",
        stock: String(product.stock),
        sku: product.sku ?? "",
        sizes: parseJsonArrToString(product.sizes),
        colors: parseJsonArrToString(product.colors),
        isFeatured: product.isFeatured,
        isNew: product.isNew,
      });
      setExistingImages(parseJsonArr(product.images));
    }
  }, [product]);

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const updateMutation = useMutation({
    mutationFn: (fd: FormData) => productsApi.update(id!, fd),
    onSuccess: () => {
      toast.success("Produk berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      navigate("/products");
    },
    onError: (err: unknown) => {
      const msg = (err as any)?.response?.data?.error || "Gagal memperbarui produk";
      toast.error(msg);
    },
  });

  const handleSubmit = () => {
    if (!form.name || !form.categoryId || !form.price || !form.stock) {
      toast.error("Nama, kategori, harga, dan stok wajib diisi");
      return;
    }
    const sizesArr = typeof form.sizes === "string"
      ? form.sizes.split(",").map(s => s.trim()).filter(Boolean)
      : parseJsonArr(form.sizes as unknown);
    const colorsArr = typeof form.colors === "string"
      ? form.colors.split(",").map(c => c.trim()).filter(Boolean)
      : parseJsonArr(form.colors as unknown);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("slug", form.slug);
    fd.append("description", form.description);
    fd.append("categoryId", form.categoryId);
    fd.append("price", form.price);
    if (form.originalPrice) fd.append("originalPrice", form.originalPrice);
    fd.append("stock", form.stock);
    if (form.sku) fd.append("sku", form.sku);
    fd.append("sizes", JSON.stringify(sizesArr));
    fd.append("colors", JSON.stringify(colorsArr));
    fd.append("isFeatured", String(form.isFeatured));
    fd.append("isNew", String(form.isNew));
    fd.append("existingImages", JSON.stringify(existingImages));
    imageFiles.forEach((f) => fd.append("images", f));
    updateMutation.mutate(fd);
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
            <h2 className="page-title">Edit Produk</h2>
            <p className="page-subtitle">{product?.name}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/products")} className="btn-ghost flex items-center gap-2 text-sm">
              <HiOutlineArrowLeft />
              Batal
            </button>
            <button onClick={handleSubmit} disabled={updateMutation.isPending} className="btn-primary flex items-center gap-2 text-sm">
              <HiOutlineSave />
              {updateMutation.isPending ? "Menyimpan..." : "Perbarui Produk"}
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Informasi Dasar</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Nama Produk *</label>
                  <input className="input-base" type="text" placeholder="Nama produk..." value={form.name}
                    onChange={(e) => set("name", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Slug</label>
                  <input className="input-base" type="text" placeholder="slug-produk" value={form.slug}
                    onChange={(e) => set("slug", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Deskripsi</label>
                  <textarea className="input-base resize-none" rows={4} placeholder="Deskripsi produk..." value={form.description}
                    onChange={(e) => set("description", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Kategori *</label>
                  <select className="input-base" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
                    <option value="">Pilih kategori...</option>
                    {(catData ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Harga & Inventori</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Harga *</label>
                    <input className="input-base" type="number" placeholder="150000" value={form.price}
                      onChange={(e) => set("price", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Harga Coret</label>
                    <input className="input-base" type="number" placeholder="200000" value={form.originalPrice}
                      onChange={(e) => set("originalPrice", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Stok *</label>
                    <input className="input-base" type="number" placeholder="50" value={form.stock}
                      onChange={(e) => set("stock", e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">SKU</label>
                    <input className="input-base" type="text" placeholder="LMR-GAM-001" value={form.sku}
                      onChange={(e) => set("sku", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Variasi</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Ukuran (pisahkan dengan koma)</label>
                  <input className="input-base" type="text" placeholder="S, M, L, XL, XXL" value={form.sizes}
                    onChange={(e) => set("sizes", e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Warna (pisahkan dengan koma)</label>
                  <input className="input-base" type="text" placeholder="Hitam, Putih, Navy" value={form.colors}
                    onChange={(e) => set("colors", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-[var(--text)] mb-4">Visibilitas</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="w-4 h-4 accent-violet-600" />
                  <span className="text-sm text-[var(--text)]">Tampilkan di Pilihan Terbaik</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.isNew} onChange={(e) => set("isNew", e.target.checked)} className="w-4 h-4 accent-violet-600" />
                  <span className="text-sm text-[var(--text)]">Tandai sebagai Produk Baru</span>
                </label>
              </div>
            </div>
          </div>

          <div className="card p-6 h-fit">
            <h3 className="font-semibold text-[var(--text)] mb-4">Foto Produk</h3>
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-[var(--text-muted)] mb-2">Foto saat ini:</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt="" className="w-20 h-20 object-cover rounded-lg border border-[var(--border)]" />
                      <button
                        onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ImageUpload multiple onFilesSelect={setImageFiles} />
            <p className="text-xs text-[var(--text-muted)] mt-2">Upload foto baru akan ditambahkan ke foto yang ada.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProduct;
