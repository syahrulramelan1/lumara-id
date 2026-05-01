import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar, SearchInput, Pagination } from "../components";
import UserTable from "../components/UserTable";
import { usersApi } from "../lib/api";

const PER_PAGE = 20;

const Users = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => usersApi.list(page).then((r) => r.data),
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

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
              {total > 0 ? `${total} pengguna terdaftar` : "Kelola akun pengguna"}
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Cari di halaman ini..."
              className="w-72"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="card p-12 text-center text-[var(--text-muted)]">Tidak ada pengguna ditemukan</div>
          ) : (
            <>
              <div className="card overflow-hidden">
                <UserTable users={users} />
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                perPage={PER_PAGE}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Users;
