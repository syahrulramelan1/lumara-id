import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../components";
import UserTable from "../components/UserTable";
import { HiOutlineSearch } from "react-icons/hi";
import { usersApi } from "../lib/api";

const Users = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.list().then((r) => r.data),
  });

  const users = (data?.data ?? []).filter((u) =>
    search
      ? (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div>
            <h2 className="page-title">Semua Pengguna</h2>
            <p className="page-subtitle">
              {data?.total !== undefined ? `${data.total} pengguna terdaftar` : "Kelola akun pengguna"}
            </p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-base pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base pl-9 w-60"
                placeholder="Cari nama / email..."
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="card p-12 text-center text-[var(--text-muted)]">Tidak ada pengguna ditemukan</div>
          ) : (
            <div className="card overflow-hidden">
              <UserTable users={users} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Users;
