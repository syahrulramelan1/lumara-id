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

## ⚠️ PENTING — Dua File Schema Prisma
Render build command meng-copy `schema.production.prisma` → `schema.prisma` sebelum build:
```
cp prisma/schema.production.prisma prisma/schema.prisma && ...
```
**Setiap kali ada perubahan model di `schema.prisma`, WAJIB update `schema.production.prisma` juga.**
Perbedaan keduanya: production schema pakai `directUrl = env("DIRECT_URL")` dan field `@db.Text` di beberapa kolom.

---

## ✅ Sudah Selesai

### Admin-Panel
- Semua CRUD (Products, Categories, Orders, Reviews, Users, Dashboard) terhubung ke API
- Role gate — hanya ADMIN yang bisa masuk (ProtectedRoute cek role dari `/api/admin/me`)
- Tidak ada halaman register — admin dibuat manual via Supabase + SQL
- Mobile responsiveness — tabel responsive (hide kolom di layar kecil), sidebar overlay di mobile
- Design system baru — semua halaman pakai CSS variables, card, badge, btn-primary, dll
- **Maintenance mode toggle** — 1 tombol di dashboard untuk ON/OFF website lumara-id
- **EditOrder** — form "Tandai Dikirim" (kurir, layanan, no. resi, estimasi), template cepat tracking, tracking timeline

### MobileApp
- Semua endpoint `/api/admin/*` (products, categories, orders, reviews, users, dashboard, me, settings)
- Forgot password + reset password flow
- Register auto-sync user ke DB dengan role USER via `/api/auth/sync-user`
- Search multi-strategi: token splitting + alias fashion Indonesia (pasmina↔pashmina, hijab↔jilbab, dll)
- Search case-insensitive (`mode: "insensitive"` → PostgreSQL ILIKE)
- Fix cache: `dynamic = "force-dynamic"` di categories page dan product detail page
- **Maintenance mode**: cek di `(main)/layout.tsx` → redirect ke `/maintenance` jika aktif
- **Halaman `/maintenance`**: tampil ke pengunjung saat maintenance ON (di luar group `(main)`)
- **`/api/admin/settings`**: GET + PATCH untuk baca/tulis maintenance mode
- **Sistem tracking pengiriman manual** — seller input update dari website kurir, buyer lihat timeline di-app (tidak perlu buka browser eksternal)
- **`/orders/[id]`**: tampil shipping info card, tracking timeline, tombol "Konfirmasi Pesanan Diterima" (status SHIPPED saja)

### Database — Tabel `app_settings`
Sudah dibuat di Supabase. SQL:
```sql
CREATE TABLE IF NOT EXISTS app_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO app_settings (key, value, "updatedAt")
VALUES ('maintenance_mode', 'false', NOW())
ON CONFLICT (key) DO NOTHING;
```
RLS: **enabled, tanpa policy** → blokir akses via REST API (anon key), Prisma tetap jalan via postgres superuser.

### Infrastructure
- Render: `render.yaml` dikonfigurasi untuk kedua service
- SPA routing fix: `Admin-Panel/public/_redirects`

---

## ⏳ Yang Belum Ada (Next Steps)

### [FITUR] MobileApp
- [ ] **Sync user on login** — saat ini hanya sync saat register; panggil `POST /api/auth/sync-user` juga saat login berhasil
- [ ] **Halaman profil user** — tampilkan nama, avatar, email; edit nama & foto profil
- [ ] **Checkout flow** — form alamat pengiriman, pilih metode bayar, buat Order di DB

### [FITUR] Admin-Panel
- [ ] **Login auto-sync** — setelah admin login, panggil sync-user agar record ada di DB
- [ ] **Pagination** di Orders, Reviews, Users (saat ini load semua sekaligus)

### [KUALITAS]
- [ ] **Code splitting Admin-Panel** — chunk 1MB+, pakai `React.lazy` + `Suspense` per route

---

## Arsitektur Sistem Pengiriman Manual

Lumara.id tidak pakai API kurir. Seller cek website kurir secara manual, lalu input update ke admin panel.

```
Seller antar paket ke kurir → cek website kurir → copy status/lokasi
    ↓
Admin panel EditOrder → form "Tandai Dikirim" (kurir, layanan, no. resi, estimasi)
    → POST /api/admin/orders/[id]/ship
    → OrderModel.shipOrder() → status "SHIPPED" + auto-tracking "Diserahkan ke Kurir"
    ↓
Update berkala (seller copy dari website kurir):
    Admin panel → template cepat ATAU form manual (status + deskripsi + lokasi opsional)
    → POST /api/admin/orders/[id]/tracking
    → OrderModel.addTracking() → buat entri OrderTracking baru
    ↓
Buyer buka /orders/[id]:
    - Shipping info card (kurir, no. resi, estimasi tiba)
    - Tracking timeline (chronological, oldest at top)
    - Tombol "Konfirmasi Pesanan Diterima" (hanya saat status SHIPPED)
    → POST /api/orders/[id]/confirm (dengan Bearer token)
    → OrderModel.confirmDelivery() → status "DELIVERED" + auto-tracking "Pesanan Diterima"
```

### Database — Kolom & Tabel Baru (jalankan di Supabase SQL Editor)

```sql
-- Kolom pengiriman di tabel orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS courier          TEXT,
  ADD COLUMN IF NOT EXISTS courier_service  TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number  TEXT,
  ADD COLUMN IF NOT EXISTS shipped_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS estimated_arrival TIMESTAMPTZ;

-- Tabel tracking pengiriman
CREATE TABLE IF NOT EXISTS order_trackings (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id    TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  description TEXT NOT NULL,
  location    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### API Endpoints Baru

| Method | Path | Deskripsi |
|--------|------|-----------|
| PATCH | `/api/admin/orders/[id]` | Update status (bukan SHIPPED — pakai /ship) |
| POST | `/api/admin/orders/[id]/ship` | Tandai dikirim + input resi |
| POST | `/api/admin/orders/[id]/tracking` | Tambah update tracking manual |
| POST | `/api/orders/[id]/confirm` | Buyer konfirmasi terima (Bearer token) |

### Auto-Milestones (dibuat otomatis oleh OrderModel)

| Event | Status | Deskripsi |
|-------|--------|-----------|
| Order dibuat | Pesanan Masuk | Pesanan kamu berhasil dibuat |
| Status → PAID | Pembayaran Dikonfirmasi | Pembayaran dikonfirmasi, sedang disiapkan |
| Status → PROCESSING | Dikemas | Sedang dikemas oleh Lumara.id |
| shipOrder() | Diserahkan ke Kurir | Paket diserahkan ke kurir + no. resi |
| Status → DELIVERED | Pesanan Diterima | Pesanan dikonfirmasi diterima |
| Status → CANCELLED | Dibatalkan | Pesanan dibatalkan |

---

## Arsitektur Maintenance Mode

```
Admin klik toggle di admni-panel.onrender.com
    ↓
PATCH /api/admin/settings → { maintenance: true }
    ↓
AppSettingModel.setMaintenanceMode(true) → upsert ke tabel app_settings
    ↓
Pengunjung buka lumara-id.onrender.com
    ↓
(main)/layout.tsx cek DB → maintenance = true → redirect("/maintenance")
    ↓
Halaman /maintenance tampil (di luar group (main), tidak redirect loop)
```

Admin panel (`admni-panel.onrender.com`) dan API routes (`/api/*`) tidak ter-affect — hanya halaman publik `(main)` yang di-block.

---

## Konvensi Penting

### Jangan Pernah
- Tambahkan route `/register` atau self-register di Admin-Panel
- Simpan role di Supabase metadata — role hanya di tabel Prisma `User`
- Gunakan endpoint `/api/admin/*` tanpa header `x-admin-secret`
- Edit `schema.prisma` tanpa juga edit `schema.production.prisma`

### Selalu
- Jalankan `git subtree split` setiap push perubahan Admin-Panel ke Render
- Wrap semua halaman Admin-Panel dengan `<ProtectedRoute>`
- Panggil `checkAdminSecret(req)` di awal setiap handler `/api/admin/*`
- User yang daftar via MobileApp selalu dapat `role: "USER"` — tidak bisa jadi ADMIN dari MobileApp
- Setelah tambah model baru ke Prisma schema → jalankan `npx prisma generate` di `/MobileApp`
