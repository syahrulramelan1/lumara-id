import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSave } from "react-icons/hi";
import toast from "react-hot-toast";
import { ImageUpload, InputWithLabel, Sidebar, SimpleInput, TextAreaInput } from "../components";
import SelectInput from "../components/SelectInput";
import { productsApi, categoriesApi } from "../lib/api";

const stockStatusList = [
  { label: "In Stock", value: "in-stock" },
  { label: "Out of Stock", value: "out-of-stock" },
];

const CreateProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then((r) => r.data.data),
  });

  const categoryList = [
    { label: "Pilih kategori", value: "" },
    ...(catData ?? []).map((c) => ({ label: c.name, value: c.id })),
  ];

  const [form, setForm] = useState({
    name: "", slug: "", description: "", categoryId: "",
    price: "", originalPrice: "", stock: "", sku: "",
    sizes: "", colors: "",
    isFeatured: false, isNew: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));
  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => productsApi.create(fd),
    onSuccess: () => {
      toast.success("Produk berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: () => toast.error("Gagal membuat produk"),
  });

  const handleSubmit = () => {
    if (!form.name || !form.categoryId || !form.price || !form.stock) {
      toast.error("Nama, kategori, harga, dan stok wajib diisi");
      return;
    }
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("slug", form.slug || autoSlug(form.name));
    fd.append("description", form.description);
    fd.append("categoryId", form.categoryId);
    fd.append("price", form.price);
    if (form.originalPrice) fd.append("originalPrice", form.originalPrice);
    fd.append("stock", form.stock);
    if (form.sku) fd.append("sku", form.sku);
    fd.append("sizes", JSON.stringify(form.sizes.split(",").map((s) => s.trim()).filter(Boolean)));
    fd.append("colors", JSON.stringify(form.colors.split(",").map((c) => c.trim()).filter(Boolean)));
    fd.append("isFeatured", String(form.isFeatured));
    fd.append("isNew", String(form.isNew));
    imageFiles.forEach((f) => fd.append("images", f));
    createMutation.mutate(fd);
  };

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="py-10">
          {/* Header */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b dark:border-gray-800 border-gray-200 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">Tambah Produk</h2>
            <div className="flex gap-x-2">
              <button onClick={() => navigate("/products")}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg hover:border-gray-400 duration-200 flex items-center justify-center dark:text-whiteSecondary text-blackPrimary">
                Batal
              </button>
              <button onClick={handleSubmit} disabled={createMutation.isPending}
                className="dark:bg-whiteSecondary bg-blackPrimary w-44 py-2 text-lg dark:hover:bg-white hover:bg-blackSecondary duration-200 flex items-center justify-center gap-x-2 disabled:opacity-50">
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  {createMutation.isPending ? "Menyimpan..." : "Simpan Produk"}
                </span>
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* Left */}
            <div className="space-y-10">
              <section>
                <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">Informasi Dasar</h3>
                <div className="flex flex-col gap-4">
                  <InputWithLabel label="Nama Produk *">
                    <SimpleInput type="text" placeholder="Gamis Syar'i Premium..."
                      value={form.name}
                      onChange={(e) => { set("name", e.target.value); set("slug", autoSlug(e.target.value)); }} />
                  </InputWithLabel>
                  <InputWithLabel label="Slug">
                    <SimpleInput type="text" placeholder="gamis-syari-premium"
                      value={form.slug}
                      onChange={(e) => set("slug", e.target.value)} />
                  </InputWithLabel>
                  <InputWithLabel label="Deskripsi">
                    <TextAreaInput rows={5} cols={50} placeholder="Deskripsi produk..."
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)} />
                  </InputWithLabel>
                  <InputWithLabel label="Kategori *">
                    <SelectInput selectList={categoryList} value={form.categoryId}
                      onChange={(e) => set("categoryId", e.target.value)} />
                  </InputWithLabel>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">Harga & Inventori</h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1">
                    <InputWithLabel label="Harga *">
                      <SimpleInput type="number" placeholder="150000"
                        value={form.price} onChange={(e) => set("price", e.target.value)} />
                    </InputWithLabel>
                    <InputWithLabel label="Harga Coret">
                      <SimpleInput type="number" placeholder="200000"
                        value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} />
                    </InputWithLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1">
                    <InputWithLabel label="Stok *">
                      <SimpleInput type="number" placeholder="50"
                        value={form.stock} onChange={(e) => set("stock", e.target.value)} />
                    </InputWithLabel>
                    <InputWithLabel label="SKU">
                      <SimpleInput type="text" placeholder="LMR-GAM-001"
                        value={form.sku} onChange={(e) => set("sku", e.target.value)} />
                    </InputWithLabel>
                  </div>
                  <InputWithLabel label="Status Stok">
                    <SelectInput selectList={stockStatusList}
                      value={form.stock === "0" ? "out-of-stock" : "in-stock"}
                      onChange={() => {}} />
                  </InputWithLabel>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">Variasi</h3>
                <div className="flex flex-col gap-4">
                  <InputWithLabel label="Ukuran (pisahkan dengan koma)">
                    <SimpleInput type="text" placeholder="S, M, L, XL, XXL"
                      value={form.sizes} onChange={(e) => set("sizes", e.target.value)} />
                  </InputWithLabel>
                  <InputWithLabel label="Warna (pisahkan dengan koma)">
                    <SimpleInput type="text" placeholder="Hitam, Putih, Navy, Maroon"
                      value={form.colors} onChange={(e) => set("colors", e.target.value)} />
                  </InputWithLabel>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">Visibilitas</h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)}
                      className="w-4 h-4 accent-blue-500" />
                    <span className="dark:text-whiteSecondary text-blackPrimary">Tampilkan di Pilihan Terbaik (Featured)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.isNew} onChange={(e) => set("isNew", e.target.checked)}
                      className="w-4 h-4 accent-blue-500" />
                    <span className="dark:text-whiteSecondary text-blackPrimary">Tandai sebagai Produk Baru</span>
                  </label>
                </div>
              </section>
            </div>

            {/* Right */}
            <div>
              <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">Foto Produk</h3>
              <ImageUpload multiple onFilesSelect={setImageFiles} />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-2">Upload beberapa foto sekaligus. Foto pertama jadi gambar utama.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateProduct;
