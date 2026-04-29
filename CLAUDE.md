# lumara.id — Project Guide

## Stack
- **MobileApp**: Next.js 15 App Router (`/MobileApp`) → `https://lumara-id.onrender.com`
- **Admin-Panel**: React 18 + Vite + TypeScript (`/Admin-Panel`) → `https://admni-panel.onrender.com`
- **Database**: Supabase PostgreSQL (shared satu DB untuk kedua app)
- **Auth**: Supabase Auth + role di tabel Prisma `User.role` (`USER` | `ADMIN`)
- **Storage**: Supabase Storage bucket `lumara-id`
- **ORM**: Prisma

## Deploy Admin-Panel ke repo terpisah
Setiap ada perubahan di `Admin-Panel/`, jalankan:
```bash
git subtree split --prefix Admin-Panel -b tmp && git push https://github.com/UsedZ/admni-panel.git tmp:main --force && git branch -D tmp
```

---

## ✅ Sudah Selesai

- Admin-Panel: semua CRUD (Products, Categories, Orders, Reviews, Users, Dashboard) terhubung ke API
- Admin-Panel: role gate — hanya ADMIN yang bisa masuk (ProtectedRoute cek role dari `/api/admin/me`)
- Admin-Panel: tidak ada halaman register — admin dibuat manual via Supabase + SQL
- MobileApp: semua endpoint `/api/admin/*` (products, categories, orders, reviews, users, dashboard, me)
- MobileApp: forgot password + reset password flow
- MobileApp: register auto-sync user ke DB dengan role USER via `/api/auth/sync-user`
- Render: `render.yaml` dikonfigurasi untuk kedua service
- SPA routing fix: `Admin-Panel/public/_redirects`

---

## ⏳ Yang Harus Dijalankan Selanjutnya

### [WAJIB] Setup sekali — manual oleh user
- [x] SQL sudah dijalankan — `admin@lumara.id` (ADMIN) dan `siti@gmail.com` (USER) sudah ada di DB
- [ ] Pastikan Supabase **Site URL** sudah diubah ke `https://lumara-id.onrender.com`
- [ ] Tambah `NEXT_PUBLIC_ADMIN_URL=https://admni-panel.onrender.com` ke MobileApp env di Render

### [FITUR] MobileApp — Yang Belum Ada
- [ ] **Sync user on login** — saat ini hanya sync saat register; user lama yang login belum tentu ada di tabel Prisma. Solusi: panggil `POST /api/auth/sync-user` juga saat login berhasil
- [ ] **Halaman profil user** — tampilkan nama, avatar, email; bisa edit nama & foto profil
- [ ] **Checkout flow** — form alamat pengiriman, pilih metode bayar, buat Order di DB
- [ ] **Halaman pesanan user** (`/orders`) — list pesanan milik user yang login beserta statusnya
- [ ] **Detail pesanan** (`/orders/[id]`) — item-item dalam pesanan, status, total

### [FITUR] Admin-Panel — Yang Belum Ada
- [ ] **Login auto-sync** — setelah admin login, panggil sync-user juga agar record-nya ada di DB
- [ ] **Halaman Edit User** — sudah ada form tapi perlu dipastikan PATCH role berfungsi di produksi
- [ ] **Pagination** di halaman Orders, Reviews, Users (saat ini load semua sekaligus)

### [KUALITAS] Technical Debt
- [ ] **Code splitting Admin-Panel** — chunk sekarang 1MB+, bisa pakai `React.lazy` + `Suspense` untuk split per route
- [ ] **User tidak ada di DB saat login** — MobileApp tidak sync user kalau mereka login (bukan register). Harus fix agar semua user selalu ada di tabel Prisma.

---

## Konvensi Penting

### Jangan Pernah
- Tambahkan route `/register` atau self-register di Admin-Panel
- Simpan role di Supabase metadata — role hanya di tabel Prisma `User`
- Gunakan endpoint `/api/admin/*` tanpa header `x-admin-secret`

### Selalu
- Jalankan `git subtree split` setiap push perubahan Admin-Panel ke Render
- Wrap semua halaman Admin-Panel dengan `<ProtectedRoute>`
- Panggil `checkAdminSecret(req)` di awal setiap handler `/api/admin/*`
- User yang daftar via MobileApp selalu dapat `role: "USER"` — tidak bisa jadi ADMIN dari MobileApp
