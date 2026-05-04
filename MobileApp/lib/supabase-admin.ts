import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase admin client — pakai SERVICE_ROLE_KEY untuk operasi yang bypass RLS
 * dan akses ke Auth admin API (mis. delete user dari auth.users).
 *
 * JANGAN expose ke browser. Cuma boleh dipanggil dari server (route handlers).
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_URL belum di-set di environment."
    );
  }
  cached = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}

/**
 * Cari Supabase Auth user UUID berdasarkan email.
 * Pakai listUsers (perPage=1000) — cukup untuk skala UMKM.
 * Return null kalau tidak ditemukan.
 */
export async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  const sb = getSupabaseAdmin();
  const target = email.toLowerCase().trim();
  // listUsers paginate; loop sampai habis atau ketemu
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`Gagal list Supabase Auth users: ${error.message}`);
    const found = data.users.find((u) => u.email?.toLowerCase() === target);
    if (found) return found.id;
    if (data.users.length < perPage) return null; // halaman terakhir
    page += 1;
  }
}
