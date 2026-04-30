import { HiOutlineSave, HiOutlineCamera } from "react-icons/hi";
import { Sidebar } from "../components";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Admin";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const avatarSrc = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`;

  const [form, setForm] = useState({
    username: displayName,
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Profil Saya</h2>
            <p className="page-subtitle">Kelola informasi akun admin</p>
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm">
            <HiOutlineSave className="text-base" />
            Simpan Perubahan
          </button>
        </div>

        <div className="p-3 sm:p-6 flex flex-col xl:flex-row gap-6 max-w-5xl">
          {/* Avatar card */}
          <div className="card p-6 flex flex-col items-center gap-4 w-full xl:w-64 shrink-0 h-fit">
            <div className="relative">
              <img
                src={avatarSrc}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-[var(--border)]"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-400 flex items-center justify-center text-white shadow-md hover:opacity-90 transition-opacity">
                <HiOutlineCamera className="text-sm" />
              </button>
            </div>
            <div className="text-center">
              <p className="font-semibold text-[var(--text)]">{displayName}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{user?.email}</p>
            </div>
            <span className="badge badge-purple">Administrator</span>
          </div>

          {/* Form card */}
          <div className="card p-6 flex-1">
            <h3 className="font-semibold text-[var(--text)] mb-5">Informasi Akun</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Nama Pengguna</label>
                <input
                  className="input-base"
                  type="text"
                  placeholder="Nama kamu"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Email</label>
                <input
                  className="input-base"
                  type="email"
                  placeholder="email@lumara.id"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="border-t border-[var(--border)] pt-4 mt-2">
                <h4 className="text-sm font-medium text-[var(--text-muted)] mb-4">Ganti Password</h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Password Baru</label>
                    <input
                      className="input-base"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">Konfirmasi Password</label>
                    <input
                      className="input-base"
                      type="password"
                      placeholder="Ulangi password baru"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
