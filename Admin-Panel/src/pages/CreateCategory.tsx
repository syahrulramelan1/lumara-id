import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSave } from "react-icons/hi";
import toast from "react-hot-toast";
import { ImageUpload, InputWithLabel, Sidebar, SimpleInput, TextAreaInput } from "../components";
import { categoriesApi } from "../lib/api";

const CreateCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const createMutation = useMutation({
    mutationFn: (fd: FormData) => categoriesApi.create(fd),
    onSuccess: () => {
      toast.success("Kategori berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      navigate("/categories");
    },
    onError: () => toast.error("Gagal membuat kategori"),
  });

  const handleSubmit = () => {
    if (!form.name || !form.slug) { toast.error("Nama dan slug wajib diisi"); return; }
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("slug", form.slug);
    fd.append("description", form.description);
    if (imageFile) fd.append("image", imageFile);
    createMutation.mutate(fd);
  };

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b dark:border-gray-800 border-gray-200 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">Tambah Kategori</h2>
            <div className="flex gap-x-2">
              <button
                onClick={() => navigate("/categories")}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg hover:border-gray-400 duration-200 flex items-center justify-center dark:text-whiteSecondary text-blackPrimary"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                className="dark:bg-whiteSecondary bg-blackPrimary w-44 py-2 text-lg dark:hover:bg-white hover:bg-blackSecondary duration-200 flex items-center justify-center gap-x-2 disabled:opacity-50"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  {createMutation.isPending ? "Menyimpan..." : "Simpan Kategori"}
                </span>
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            <div>
              <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-5">Informasi Dasar</h3>
              <div className="flex flex-col gap-5">
                <InputWithLabel label="Nama Kategori *">
                  <SimpleInput
                    type="text"
                    placeholder="Gamis, Hijab, Khimar..."
                    value={form.name}
                    onChange={(e) => { set("name", e.target.value); set("slug", autoSlug(e.target.value)); }}
                  />
                </InputWithLabel>
                <InputWithLabel label="Slug *">
                  <SimpleInput
                    type="text"
                    placeholder="gamis"
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                  />
                </InputWithLabel>
                <InputWithLabel label="Deskripsi">
                  <TextAreaInput
                    rows={4}
                    cols={50}
                    placeholder="Deskripsi kategori..."
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                  />
                </InputWithLabel>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-5">Gambar Kategori</h3>
              <ImageUpload onFileSelect={(f) => setImageFile(f)} />
              <p className="text-xs dark:text-gray-400 text-gray-500 mt-2">Gambar opsional. Akan ditampilkan di halaman kategori.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreateCategory;
