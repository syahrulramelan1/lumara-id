import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HiOutlineSave, HiOutlineArrowLeft, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar, HiOutlineShieldCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import { Sidebar } from "../components";
import { usersApi } from "../lib/api";

const ROLE_OPTIONS = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
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
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
        Pengguna tidak ditemukan
      </div>
    </div>
  );

  const initials = (user.name || user.email).charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Edit Pengguna</h2>
            <p className="page-subtitle">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/users")} className="btn-ghost flex items-center gap-2 text-sm">
              <HiOutlineArrowLeft />
              Batal
            </button>
            <button
              onClick={() => updateMutation.mutate(role)}
              disabled={updateMutation.isPending}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <HiOutlineSave />
              {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* User info card (read-only) */}
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text)] mb-5">Informasi Pengguna</h3>

            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[var(--border)]">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                  {initials}
                </div>
              )}
              <div>
                <p className="font-semibold text-[var(--text)]">{user.name || "—"}</p>
                <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
                <span className={`badge mt-1 inline-block ${user.role === "ADMIN" ? "badge-purple" : "badge-gray"}`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <HiOutlineMail className="text-[var(--text-muted)] flex-shrink-0" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">Email</p>
                  <p className="text-[var(--text)]">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <HiOutlinePhone className="text-[var(--text-muted)] flex-shrink-0" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">Telepon</p>
                  <p className="text-[var(--text)]">{user.phone || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <HiOutlineCalendar className="text-[var(--text-muted)] flex-shrink-0" />
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-0.5">Bergabung</p>
                  <p className="text-[var(--text)]">{new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Role editor */}
          <div className="card p-6 h-fit">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineShieldCheck className="text-[var(--brand)]" />
              <h3 className="font-semibold text-[var(--text)]">Ubah Role</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Nama, email, dan telepon dikelola oleh Supabase Auth dan tidak dapat diubah dari sini.
            </p>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Role *</label>
              <select
                className="input-base"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                Admin memiliki akses penuh ke panel ini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditUser;
