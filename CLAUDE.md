# lumara.id — Project Guide

> **E-commerce fashion modest** dengan dua app: storefront publik (`MobileApp`) dan dashboard admin (`Admin-Panel`). Mobile-first, Indonesia, modest luxury aesthetic.

---

## Tech Stack (Aktual per package.json)

### MobileApp (`/MobileApp`) → `https://lumara-id.onrender.com`
| Kategori | Library | Versi |
|----------|---------|-------|
| Framework | Next.js (App Router) | **15.0.3** |
| Bahasa | TypeScript | 5 |
| UI Lib | React + React DOM | 18.3.1 |
| Styling | Tailwind CSS | **3.4.15** |
| ORM | Prisma + @prisma/client | 5.22.0 |
| Auth | @supabase/ssr | 0.5.2 |
| Auth Client | @supabase/supabase-js | 2.46.1 |
| State | Zustand | 5.0.1 |
| Form | react-hook-form + zod + @hookform/resolvers | 7.53 / 3.23 / 3.9 |
| Icons | lucide-react | 0.460 |
| Animation | framer-motion | 11.11 |
| Theme | next-themes | 0.4 |
| Toast | sonner | 1.7 |
| Image | sharp | 0.33 |
| shadcn util | @radix-ui/react-slot, cva, clsx, tailwind-merge | — |

> ⚠️ **shadcn/ui belum dipasang penuh** — utility-nya saja. Belum ada folder `components/ui/`. Komponen UI dibuat manual dengan token dari `globals.css` + Tailwind extend.

### Admin-Panel (`/Admin-Panel`) → `https://admni-panel.onrender.com`
| Kategori | Library | Versi |
|----------|---------|-------|
| Build | Vite | 5.2 |
| UI Lib | React | 18.2 |
| Routing | react-router-dom | 6.23 |
| HTTP | axios | 1.15 |
| Async State | @tanstack/react-query | 5.100 |
| Global State | @reduxjs/toolkit + react-redux | 2.2 / 9.1 |
| Toast | react-hot-toast | 2.6 |
| Icons | react-icons | 5.2 |
| Charts | recharts | 2.12 |
| Styling | tailwindcss | 3.4 |

### Shared
- **Database**: Supabase PostgreSQL (1 DB, di-share)
- **Auth**: Supabase Auth + role di tabel Prisma `User.role` (`USER` | `ADMIN`)
- **Storage**: Supabase Storage bucket `lumara-id`
- **Deploy**: Render (kedua service via `render.yaml`)

---

## Database Schema (Prisma)

Semua model di `MobileApp/prisma/schema.prisma`. Mapping snake_case ke Postgres via `@map`/`@@map`.

| Model | Tabel | Field Utama | Relasi |
|-------|-------|-------------|--------|
| **User** | `users` | id, email (unique), name, avatar, phone, role (default `USER`), timestamps | hasMany: orders, wishlist, reviews |
| **Category** | `categories` | id, name, slug (unique), image, description | hasMany: products |
| **Product** | `products` | id, name, slug (unique), description, price (Int), originalPrice, images (Json), stock, sku, categoryId, sizes/colors (Json), rating, reviewCount, isFeatured, isNew, timestamps | belongsTo: category; hasMany: reviews, wishlist, orderItems |
| **Order** | `orders` | id, userId, status (default `PENDING`), total, shippingAddress (Json), paymentMethod, **courier, courierService, trackingNumber, shippedAt, estimatedArrival**, timestamps | belongsTo: user; hasMany: items, trackings |
| **OrderTracking** | `order_trackings` | id, orderId, status, description, location?, createdAt | belongsTo: order (cascade delete) |
| **OrderItem** | `order_items` | id, orderId, productId, quantity, size, color, price | belongsTo: order, product |
| **Wishlist** | `wishlists` | id, userId, productId, createdAt + `@@unique([userId, productId])` | belongsTo: user, product (cascade) |
| **Review** | `reviews` | id, userId, productId, rating, comment, images (Json), createdAt | belongsTo: user, product (cascade) |
| **AppSetting** | `app_settings` | key (PK), value, updatedAt | — |

### Enums (disimpan sebagai String, tanpa enum Prisma)
- `Role`: `USER` | `ADMIN`
- `OrderStatus`: `PENDING` | `PAID` | `PROCESSING` | `SHIPPED` | `DELIVERED` | `CANCELLED`

### Catatan tipe Json
- `Product.images`, `Product.sizes`, `Product.colors`, `Product.images` (review) → `Json @default("[]")`
- `Order.shippingAddress` → `Json @default("{}")` (bukan String — sudah migrasi)

---

## Arsitektur OOP

### Pattern wajib: **API Route → Service → Model → Prisma**

```
HTTP request
    ↓
app/api/.../route.ts        (controller, validasi & response)
    ↓
lib/services/*Service.ts    (orkestrasi bisnis, multi-model)
    ↓
lib/models/*Model.ts        (akses Prisma, query primitif)
    ↓
prisma client
```

### `BaseModel` (lib/models/BaseModel.ts)
Abstract class dengan static helper `findById<T>` dan `count`.
**⚠️ Tidak di-extend oleh model konkret saat ini** — semua model pakai singleton manual. Boleh dipakai untuk model baru, tapi konsisten dulu dengan pola existing.

### Models (semuanya singleton via `getInstance()` + named export instance lowercase)

| Class | File | Method Utama |
|-------|------|--------------|
| `ProductModel` | ProductModel.ts | findById, findBySlug, findFeatured, findNew, findRelated, findWithFilters, create, update, delete, decrementStock |
| `CategoryModel` | CategoryModel.ts | findAll, findBySlug, findById, create, update, delete |
| `UserModel` | UserModel.ts | findById, findByEmail, create, updateProfile, findAll |
| `WishlistModel` | WishlistModel.ts | findByUser, isWishlisted, toggle, countByUser, remove |
| `ReviewModel` | ReviewModel.ts | findByProduct, create, delete, list |
| `OrderModel` | OrderModel.ts | findById, findByUser, findAll, create, updateStatus, **shipOrder, addTracking, confirmDelivery**, findRecent |
| `AppSettingModel` | AppSettingModel.ts | getMaintenanceMode, setMaintenanceMode, get, set |

### Services (orkestrasi & utilitas)

| Class | Method Utama |
|-------|--------------|
| `ProductService` | getProductBySlug, getProductById, getFeaturedProducts, getNewProducts, getRelatedProducts, getProducts (filter), parseImages/Sizes/Colors, getDiscountPercent, getCategoryWithProducts |
| `WishlistService` | getWishlist, toggle, isWishlisted, getCount |
| `OrderService` | createOrder (validasi stok + decrement), getOrder, getUserOrders, getAllOrders, updateStatus, parseShippingAddress |
| `AuthService` | getOrCreateUser, getUserById, getUserByEmail, updateProfile, isAdmin |

### State Management — Zustand stores (`/store/`)

| Store | Persisted? | Tujuan |
|-------|------------|--------|
| `cartStore` | ya (localStorage) | items, add/update/remove, total |
| `wishlistStore` | ya (localStorage) | productIds local + syncFromServer |
| `uiStore` | ya | theme, language, search history |
| `authStore` | tidak | user (Supabase) + dbUser (Prisma) + loading |

---

## API Routes (`MobileApp/app/api/`)

### Public (storefront)
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/products` | List + filter (search, category, price, sort, page) |
| GET | `/api/products/[id]` | Detail produk |
| GET | `/api/categories` | List kategori |
| GET/POST/DELETE | `/api/wishlist` | Get/toggle wishlist (perlu userId) |
| GET/POST | `/api/orders` | List orders user, create order |
| GET | `/api/orders/[id]` | Detail order |
| PATCH | `/api/orders/[id]/status` | Update status (legacy) |
| POST | `/api/orders/[id]/confirm` | Buyer konfirmasi terima (Bearer token) |
| GET/POST | `/api/reviews` | List/create review |
| GET/PATCH | `/api/profile` | Get/update profil user |
| GET | `/api/status` | Health check |
| POST | `/api/auth/sync-user` | Sync user Supabase → DB Prisma |
| GET | `/api/app-icon` | App icon assets |

### Admin (semua perlu header `x-admin-secret`)
| Method | Path | Deskripsi |
|--------|------|-----------|
| GET | `/api/admin/me` | Cek role admin |
| GET | `/api/admin/dashboard` | Stats |
| GET/PATCH | `/api/admin/settings` | Maintenance mode |
| GET/POST/PATCH/DELETE | `/api/admin/products[/id]` | CRUD produk |
| GET/POST/PATCH/DELETE | `/api/admin/categories[/id]` | CRUD kategori |
| GET | `/api/admin/orders` | List orders (paginate) |
| GET/PATCH/DELETE | `/api/admin/orders/[id]` | Detail/update status/delete |
| PATCH | `/api/admin/orders/[id]/status` | Update status (legacy) |
| POST | `/api/admin/orders/[id]/ship` | Tandai dikirim + input resi |
| POST | `/api/admin/orders/[id]/tracking` | Tambah update tracking manual |
| GET/DELETE | `/api/admin/reviews[/id]` | List/hapus review |
| GET/PATCH/DELETE | `/api/admin/users[/id]` | List/update role/delete user |

---

## Halaman MobileApp (App Router)

### `(main)` group — wrapped layout dengan Navbar + BottomNav + maintenance check
- `/` — landing (Hero, Featured, NewArrivals, Categories, Promo)
- `/products` + `/products/[slug]` — listing & detail
- `/categories` + `/categories/[slug]` — index & per-kategori
- `/search` — search results
- `/cart` — keranjang
- `/checkout` — form alamat + pilih bayar (form sudah ada, **endpoint create order belum sepenuhnya di-wire**)
- `/wishlist` — list wishlist (auth-gated)
- `/orders` — list pesanan user (auth-gated)
- `/orders/[id]` — detail + tracking timeline + tombol konfirmasi (status SHIPPED)
- `/account` — profil user
- `/promo`, `/about`, `/how-to-order`, `/shipping`, `/return`, `/contact` — halaman statis

### `(auth)` group
- `/login`, `/forgot-password`, `/reset-password`

### Standalone (di luar group)
- `/maintenance` — tampil saat maintenance mode ON

### Middleware
`MobileApp/middleware.ts` — ada (perlu cek scope-nya saat refactor)

---

## Komponen UI (`MobileApp/components/`)

### Layout
- `Navbar.tsx` — desktop dropdown + mobile drawer dengan profile card
- `BottomNav.tsx` — mobile bottom nav, account icon = avatar gradient
- `Footer.tsx`

### Product
- `ProductCard.tsx`, `ProductDetail.tsx`, `ProductFilters.tsx`, `MobileFilterDrawer.tsx` (pakai createPortal)

### Sections (dipakai di landing)
- `HeroSection`, `FeaturedSection`, `NewArrivalsSection`, `CategorySection`, `PromoSection`

### Shared
- `ProductGrid`, `SearchBar`, `LoadingSpinner`
- Page headers: `ProductsPageHeader`, `SearchPageHeader`, `CategoriesClientPage`, `RelatedProductsHeader`

### Motion
- `PageTransition`, `FadeInView`, `SkeletonCard` (Framer Motion)

### Providers
- `ThemeProvider` (next-themes), `UIProvider` (Supabase auth listener + wishlist clear on logout)

---

## Design System (final, dari `globals.css`)

### Light mode tokens
```
--primary:           #7C3AED   (purple violet)
--primary-hover:     #6D28D9
--primary-container: #EDE9FE
--secondary:         #9333EA
--background:        #FFFFFF
--surface-low:       #FAFAFA
--surface:           #F4F4F5
--card:              #FFFFFF
--card-border:       #E4E4E7
--text-primary:      #09090B
--text-secondary:    #3F3F46
--text-muted:        #71717A
--success:           #16A34A
--error:             #DC2626
--rating:            #F59E0B
```

### Dark mode (VSCode-inspired, purple nuance)
```
--primary:           #A78BFA
--background:        #1E1E1E
--card:              #252526
--card-border:       #3C3C3C
--text-primary:      #D4D4D4
```

### Tipografi & spacing
- **Font**: Plus Jakarta Sans (CSS var `--font-jakarta`)
- **Card radius**: `14px` (`rounded-card`)
- **Button radius**: `12px` (`rounded-btn`)
- **Pill radius**: `9999px` (`rounded-pill`)
- **Mobile-first**: 390px base (iPhone width)
- **Safe area**: `safe-bottom`, `safe-top` utilities tersedia

### Shadow
- `shadow-card`, `shadow-card-hover`
- `shadow-violet`, `shadow-violet-sm`, `shadow-violet-lg` (brand glow)

### Type scale
`display-lg/md`, `headline-lg/md`, `title-lg`, `body-lg/md/sm`, `label-lg/sm`

> **Catatan**: prompt awal menyebut primary `#630ED4`, BG `#F9F9FF`, dark `#0F0A1E` — itu **tidak match** dengan token aktual di `globals.css`. Acuan resmi adalah `globals.css`.

---

## Progress Saat Ini

### ✅ Sudah Selesai

#### Storefront (MobileApp)
- Landing page lengkap (Hero, Featured, NewArrivals, Categories, Promo)
- Listing & detail produk + filter + search multi-strategi (token + alias fashion ID + ILIKE)
- Wishlist (toggle, persisted, sync server, auth-gated, clear on logout)
- Cart + **checkout flow lengkap** (form alamat → POST /api/orders → clear cart → redirect /orders)
- Auth: login/forgot/reset, register sync ke DB, role-based redirect
- **Sync user on login** — UIProvider listen `SIGNED_IN` & `TOKEN_REFRESHED` → POST /api/auth/sync-user
- Maintenance mode (toggle dari admin → block storefront via `(main)/layout.tsx`)
- Halaman pesanan: `/orders` list, `/orders/[id]` detail
- **Tracking pengiriman manual**: shipping info card + timeline + tombol konfirmasi terima
- **Halaman /account** — profile card + inline edit (nama, phone) via PATCH /api/profile

#### Admin Panel
- CRUD: Products, Categories, Orders, Reviews, Users, Dashboard
- Role gate (`ProtectedRoute` cek `/api/admin/me`)
- Mobile responsive (tabel hide kolom, sidebar overlay)
- Maintenance toggle di Dashboard
- **EditOrder lengkap**: form "Tandai Dikirim", template tracking cepat, timeline
- **Pagination** di Orders, Users, Reviews (20 per page, controlled component)
- **Code splitting** via `React.lazy` + `<Suspense>` per route — bundle awal lebih kecil

#### Database
- Tabel `app_settings` (RLS enabled, no policy → blokir REST, Prisma OK via direct connection)
- Kolom shipping di `orders` + tabel `order_trackings`

### 🚧 In-Progress / Half-Wired
- `middleware.ts`: cuma CORS handler untuk `/api/admin/*` (allow `admni-panel.onrender.com` & localhost) — ✅ sudah benar, no changes needed

### 📋 Belum Dikerjakan (Next Steps)

#### MobileApp
- [ ] **Render free tier 139 issue** — masih perlu monitoring setelah optimasi. Kalau masih crash, upgrade plan ke Starter ($7).

#### Admin-Panel
- [ ] **Login auto-sync** — admin login → panggil sync-user (record DB belum guaranteed ada)
- [ ] **Server-side search filter** untuk Orders/Users/Reviews — saat ini search filter cuma jalan di current page (dataset >20 perlu pindah ke server)

#### Optional / Polish
- [ ] **shadcn/ui** — install penuh kalau mau pakai komponen ready (`npx shadcn init`) — saat ini cuma utility yang dipasang
- [ ] **Hapus BaseModel** atau migrasi semua model untuk extend BaseModel — konsistensikan

---

## Catatan Khusus

### ⚠️ Dua File Schema Prisma
Render build command meng-copy `schema.production.prisma` → `schema.prisma`:
```
cp prisma/schema.production.prisma prisma/schema.prisma && ...
```
**Setiap perubahan model di `schema.prisma`, WAJIB sync ke `schema.production.prisma`.**
Beda: production pakai `directUrl = env("DIRECT_URL")` + field `@db.Text` di kolom panjang.

### Deploy Admin-Panel ke repo terpisah
Admin-Panel di-deploy dari repo lain (`UsedZ/admni-panel`). Setelah perubahan:
```bash
git subtree split --prefix Admin-Panel -b tmp && git push https://github.com/UsedZ/admni-panel.git tmp:main --force && git branch -D tmp
```

### Render Standalone Output
Build pakai Next.js standalone (`.next/standalone/server.js`). Memory free tier ≈ 512MB — pernah crash 139 saat traffic.

---

## Arsitektur Sistem Pengiriman Manual

Lumara.id **tidak pakai API kurir**. Seller cek website kurir manual, lalu input update ke admin panel.

```
Seller antar paket → cek website kurir → copy status/lokasi
    ↓
Admin EditOrder → "Tandai Dikirim" (kurir, layanan, no. resi, estimasi)
    → POST /api/admin/orders/[id]/ship
    → OrderModel.shipOrder() → status SHIPPED + auto-tracking "Diserahkan ke Kurir"
    ↓
Update berkala (template cepat / form manual)
    → POST /api/admin/orders/[id]/tracking
    → OrderModel.addTracking() → entri OrderTracking baru
    ↓
Buyer /orders/[id]:
    - Shipping info card (kurir, resi, estimasi)
    - Tracking timeline (oldest at top)
    - Tombol "Konfirmasi Pesanan Diterima" (status SHIPPED only)
    → POST /api/orders/[id]/confirm (Bearer token)
    → OrderModel.confirmDelivery() → DELIVERED + auto-tracking
```

### Auto-Milestones (`OrderModel`)
| Event | Status Tracking | Deskripsi |
|-------|-----------------|-----------|
| Order dibuat | Pesanan Masuk | Pesanan berhasil dibuat |
| Status → PAID | Pembayaran Dikonfirmasi | Pembayaran dikonfirmasi |
| Status → PROCESSING | Dikemas | Sedang dikemas |
| `shipOrder()` | Diserahkan ke Kurir | Paket + no. resi |
| Status → DELIVERED | Pesanan Diterima | Konfirmasi diterima |
| Status → CANCELLED | Dibatalkan | Pesanan dibatalkan |

---

## Arsitektur Maintenance Mode

```
Admin toggle di admni-panel.onrender.com
    → PATCH /api/admin/settings { maintenance: true }
    → AppSettingModel.setMaintenanceMode(true) → upsert app_settings
    ↓
Pengunjung lumara-id.onrender.com
    → (main)/layout.tsx cek DB → maintenance=true → redirect("/maintenance")
    → Halaman /maintenance tampil (di luar group, no redirect loop)
```
Admin panel & `/api/*` tidak ter-affect — hanya halaman publik `(main)`.

---

## Konvensi & Preferensi

### Bahasa
- **Bahasa Indonesia santai/casual** untuk semua komunikasi & komentar code
- Toast/UI text dalam Bahasa Indonesia

### Pattern Wajib
- API route **tidak boleh** akses Prisma langsung — wajib lewat Service → Model
- Mobile-first selalu (390px base, scale up)
- Singleton via `getInstance()` + named lowercase export
- Sebelum tambah model baru → cek apakah perlu Service-nya juga
- Setelah edit `schema.prisma` → edit juga `schema.production.prisma`
- Setelah tambah model → `npx prisma generate` di `MobileApp`

### Jangan Pernah
- Tambah `/register` atau self-register di Admin-Panel
- Simpan role di Supabase metadata (role hanya di Prisma `User`)
- Akses `/api/admin/*` tanpa header `x-admin-secret`
- Bypass service layer untuk akses Prisma di route

### Selalu
- Wrap halaman Admin-Panel dengan `<ProtectedRoute>`
- Panggil `checkAdminSecret(req)` di awal handler `/api/admin/*`
- User dari MobileApp → role `USER` (tidak bisa jadi ADMIN dari MobileApp)
- Jalankan `git subtree split` setiap push perubahan Admin-Panel
- Prefer dependency-light, paste-ready code (avoid bloat library)

---

## Catatan dari Sesi Terbaru

### 2026-05-01 — Sweep Progress + Memory & Performance Fix
**Yang dikerjakan:**
- **OrderModel**: pisah `LIST_INCLUDE` (tanpa array trackings, hanya `_count`) vs `DETAIL_INCLUDE` (full trackings) — `findAll`, `findByUser`, `findRecent` sekarang jauh lebih hemat memory di Render free tier (kemungkinan fix 139)
- **Limit list endpoint admin**: turun dari 50 → 20 per page (orders, users, reviews)
- **Pagination Admin Panel**: `Pagination.tsx` di-rewrite jadi controlled component (props `currentPage`, `totalPages`, `onPageChange`, `totalItems`, `perPage`); diintegrasi ke Orders, Users, Reviews
- **Code splitting Admin Panel**: `App.tsx` pakai `React.lazy` + `<Suspense>` per route — bundle awal cuma load HomeLayout + Login, halaman lain di-load on-demand
- **Audit ulang**: ternyata 3 task yang sebelumnya saya tulis "belum ada" sudah implemented (checkout flow lengkap, sync user on login di UIProvider, edit profil inline di /account)
- **CLAUDE.md**: revisi besar — match realita Next.js 15 + Tailwind 3 + design system aktual

### 2026-04-30 / 2026-05-01 — Manual Shipping Tracking System
**Diimplementasikan:**
- Model `OrderTracking` + kolom shipping di `Order` (`courier`, `courierService`, `trackingNumber`, `shippedAt`, `estimatedArrival`)
- `OrderModel.shipOrder()`, `addTracking()`, `confirmDelivery()` + auto-milestones di `updateStatus()` & `create()`
- API: `POST /admin/orders/[id]/ship`, `/tracking`, `POST /orders/[id]/confirm`
- Admin Panel `EditOrder.tsx`: form ship + 7 template tracking + timeline
- Buyer `/orders/[id]/page.tsx`: shipping info card + chronological timeline + confirm button
- SQL migration `ALTER TABLE orders` + `CREATE TABLE order_trackings` (sudah dijalankan di Supabase)
- Fix TS build error: cast `shippingAddress` via `unknown`, `formatDate` accept `Date | string`

### 2026-05-01 — Render Deploy Issue
- Status 139 (SIGSEGV) ~13 detik setelah server ready
- Kemungkinan OOM di free tier (512MB) atau Prisma engine native crash
- Solusi yang dibahas: upgrade plan / optimasi response size / take-limit pada `trackings`

### Sesi sebelumnya
- Auth flow lengkap (login/logout, redirect, page guards untuk wishlist & checkout)
- Navbar redesign (desktop dropdown + mobile drawer dengan profile card)
- Maintenance mode (toggle + halaman + endpoint settings)
- Admin Panel CRUD lengkap + design system rebuild
