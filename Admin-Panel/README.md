# lumara.id — Admin Panel

Dashboard internal untuk mengelola toko fashion modest **lumara.id**.  
Dibangun di atas Vite + React 18 + TypeScript, terhubung ke backend Next.js di Vercel.

---

## Fitur

- **Dashboard** — statistik pesanan, pendapatan, produk terlaris
- **Produk** — CRUD lengkap: nama, harga, stok, ukuran, variasi warna (dengan gambar & stok per warna), deskripsi rich text (bold/italic/heading/list/alignment)
- **Kategori** — CRUD kategori dengan gambar
- **Pesanan** — list + detail, update status, tandai dikirim (kurir, no. resi, estimasi), tambah update tracking manual
- **Ulasan** — moderasi review pembeli
- **Pengguna** — list user, ubah role (USER/ADMIN), hapus akun
- **Maintenance Mode** — toggle langsung dari dashboard, efek instan ke storefront

---

## Tech Stack

| Kategori    | Library                             |
| ----------- | ----------------------------------- |
| Build       | Vite 5                              |
| UI          | React 18 + TypeScript               |
| Routing     | react-router-dom 6                  |
| HTTP        | axios (baseURL → `/api/admin`)      |
| Async State | TanStack Query v5                   |
| State       | Redux Toolkit + react-redux         |
| Styling     | Tailwind CSS 3.4                    |
| Charts      | Recharts                            |
| Toast       | react-hot-toast                     |
| Icons       | react-icons 5                       |

---

## Environment Variables

Buat file `.env.local` di root `Admin-Panel/`:

```env
VITE_API_URL=https://lumara-id.vercel.app
VITE_ADMIN_SECRET=your_admin_secret
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> `VITE_ADMIN_SECRET` harus sama persis dengan `ADMIN_SECRET` di environment MobileApp.

---

## Menjalankan Lokal

```bash
cd Admin-Panel
npm install
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173).

Login menggunakan akun Supabase yang memiliki `role = "ADMIN"` di tabel `users`.

---

## Deploy

Di-deploy ke **Render** sebagai Static Site dari repo `UsedZ/admni-panel`.

```
Build command : npm run build
Publish dir   : dist
```

---

## Koneksi ke MobileApp

Admin Panel tidak punya database sendiri — semua request diteruskan ke API Next.js MobileApp:

```
Admin Panel → axios → https://lumara-id.vercel.app/api/admin/*
                          ↓ header: x-admin-secret
                       Next.js route → Service → Prisma → Supabase PostgreSQL
```
