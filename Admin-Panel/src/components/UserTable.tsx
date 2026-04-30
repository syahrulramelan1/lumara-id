import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi, type ApiUser } from "../lib/api";

const UserTable = ({ users }: { users: ApiUser[] }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => { toast.success("Pengguna dihapus"); queryClient.invalidateQueries({ queryKey: ["users"] }); },
    onError: () => toast.error("Gagal menghapus pengguna"),
  });

  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            <th>Pengguna</th>
            <th className="hidden sm:table-cell">Email</th>
            <th>Role</th>
            <th className="hidden md:table-cell">Telepon</th>
            <th className="hidden lg:table-cell">Bergabung</th>
            <th className="text-right pr-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-700 to-brand-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text)]">{user.name || "—"}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate max-w-[100px] sm:hidden">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="hidden sm:table-cell text-[var(--text-muted)] text-xs">{user.email}</td>
              <td>
                <span className={`badge ${user.role === "ADMIN" ? "badge-purple" : "badge-blue"}`}>
                  {user.role}
                </span>
              </td>
              <td className="hidden md:table-cell text-[var(--text-muted)]">{user.phone || "—"}</td>
              <td className="hidden lg:table-cell text-[var(--text-muted)]">{new Date(user.createdAt).toLocaleDateString("id-ID")}</td>
              <td>
                <div className="flex items-center justify-end gap-1.5 pr-2 sm:pr-4">
                  <Link to={`/users/${user.id}`} className="btn-icon" title="Edit">
                    <HiOutlinePencil />
                  </Link>
                  <button
                    onClick={() => { if (window.confirm(`Hapus pengguna "${user.name || user.email}"?`)) deleteMutation.mutate(user.id); }}
                    disabled={deleteMutation.isPending}
                    className="btn-icon btn-icon-danger disabled:opacity-40"
                    title="Hapus"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default UserTable;
