import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi, type ApiUser } from "../lib/api";

const roleClass: Record<string, string> = {
  ADMIN: "bg-purple-700 text-white",
  USER:  "bg-gray-600 text-white",
};

const UserTable = ({ users }: { users: ApiUser[] }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => { toast.success("Pengguna dihapus"); queryClient.invalidateQueries({ queryKey: ["users"] }); },
    onError: () => toast.error("Gagal menghapus pengguna"),
  });

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <thead className="border-b dark:border-white/10 border-gray-200 text-sm dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Pengguna</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Email</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Role</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Telepon</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Bergabung</th>
          <th className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-6 lg:pr-8">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y dark:divide-white/5 divide-gray-100">
        {users.map((user) => (
          <tr key={user.id}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
              <div className="flex items-center gap-x-3">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-full dark:bg-gray-600 bg-gray-300 flex items-center justify-center text-sm font-bold dark:text-white text-black">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium dark:text-whiteSecondary text-blackPrimary">{user.name || "—"}</span>
              </div>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm dark:text-gray-400 text-gray-500">{user.email}</td>
            <td className="py-4 pl-0 pr-8">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${roleClass[user.role] ?? "bg-gray-600 text-white"}`}>
                {user.role}
              </span>
            </td>
            <td className="py-4 pl-0 pr-8 text-sm dark:text-gray-400 text-gray-500">{user.phone || "—"}</td>
            <td className="py-4 pl-0 pr-8 text-sm dark:text-gray-400 text-gray-500">
              {new Date(user.createdAt).toLocaleDateString("id-ID")}
            </td>
            <td className="py-4 pl-0 pr-4 text-right sm:pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link to={`/users/${user.id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-gray-400 transition-colors">
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <button
                  onClick={() => { if (window.confirm(`Hapus pengguna "${user.name || user.email}"?`)) deleteMutation.mutate(user.id); }}
                  disabled={deleteMutation.isPending}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-rose-400 text-rose-500 border dark:border-gray-600 border-gray-300 w-8 h-8 flex justify-center items-center hover:border-rose-400 transition-colors disabled:opacity-50">
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default UserTable;
