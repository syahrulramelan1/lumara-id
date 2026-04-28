import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSave } from "react-icons/hi";
import toast from "react-hot-toast";
import { InputWithLabel, Sidebar, SimpleInput } from "../components";
import SelectInput from "../components/SelectInput";
import { usersApi } from "../lib/api";

const roleList = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => usersApi.get(id!).then((r) => r.data.data),
    enabled: !!id,
  });

  const [role, setRole] = useState("USER");

  useEffect(() => {
    if (user) setRole(user.role);
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (newRole: string) => usersApi.updateRole(id!, newRole),
    onSuccess: () => {
      toast.success("Role pengguna diperbarui");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: () => toast.error("Gagal memperbarui role"),
  });

  if (isLoading) return (
    <div className="flex h-screen dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 dark:border-white border-black border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!user) return (
    <div className="flex h-screen dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center dark:text-gray-400 text-gray-500">
        Pengguna tidak ditemukan
      </div>
    </div>
  );

  return (
    <div className="h-auto border-t dark:border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b dark:border-gray-800 border-gray-200 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <h2 className="text-3xl font-bold dark:text-whiteSecondary text-blackPrimary">Edit Pengguna</h2>
            <div className="flex gap-x-2">
              <button
                onClick={() => navigate("/users")}
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-32 py-2 text-lg hover:border-gray-400 duration-200 flex items-center justify-center dark:text-whiteSecondary text-blackPrimary"
              >
                Batal
              </button>
              <button
                onClick={() => updateMutation.mutate(role)}
                disabled={updateMutation.isPending}
                className="dark:bg-whiteSecondary bg-blackPrimary w-44 py-2 text-lg dark:hover:bg-white hover:bg-blackSecondary duration-200 flex items-center justify-center gap-x-2 disabled:opacity-50"
              >
                <HiOutlineSave className="dark:text-blackPrimary text-whiteSecondary text-xl" />
                <span className="dark:text-blackPrimary text-whiteSecondary font-semibold">
                  {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
                </span>
              </button>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            <div>
              <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-5">Informasi Pengguna</h3>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 mb-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full dark:bg-gray-600 bg-gray-300 flex items-center justify-center text-2xl font-bold dark:text-white text-black">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium dark:text-whiteSecondary text-blackPrimary">{user.name || "—"}</p>
                    <p className="text-sm dark:text-gray-400 text-gray-500">{user.email}</p>
                  </div>
                </div>

                <InputWithLabel label="Nama">
                  <SimpleInput type="text" placeholder="" value={user.name || ""} onChange={() => {}} />
                </InputWithLabel>

                <InputWithLabel label="Email">
                  <SimpleInput type="text" placeholder="" value={user.email} onChange={() => {}} />
                </InputWithLabel>

                <InputWithLabel label="Telepon">
                  <SimpleInput type="text" placeholder="" value={user.phone || ""} onChange={() => {}} />
                </InputWithLabel>

                <InputWithLabel label="Role">
                  <SelectInput
                    selectList={roleList}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </InputWithLabel>

                <div className="text-xs dark:text-gray-400 text-gray-500">
                  Bergabung: {new Date(user.createdAt).toLocaleDateString("id-ID")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditUser;
