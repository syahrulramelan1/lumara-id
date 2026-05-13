# lumara.id — Project Guide

> **E-commerce fashion modest** dengan dua app: storefront publik (`MobileApp`) dan dashboard admin (`Admin-Panel`). Mobile-first, Indonesia, modest luxury aesthetic.

---

## Tech Stack

### MobileApp (`/MobileApp`) → `https://lumara-id.vercel.app`

| Kategori    | Library                                         | Versi             |
| ----------- | ----------------------------------------------- | ----------------- |
| Framework   | Next.js (App Router)                            | **15.0.3**        |
| Bahasa      | TypeScript                                      | 5                 |
| UI Lib      | React + React DOM                               | 18.3.1            |
| Styling     | Tailwind CSS                                    | **3.4.15**        |
| ORM         | Prisma + @prisma/client                         | 5.22.0            |
| Auth        | @supabase/ssr                                   | 0.5.2             |
| Auth Client | @supabase/supabase-js                           | 2.46.1            |
| State       | Zustand                                         | 5.0.1             |
| Form        | react-hook-form + zod + @hookform/resolvers     | 7.53 / 3.23 / 3.9 |
| Icons       | lucide-react + react-icons                      | 0.460 / 5.6       |
| Animation   | framer-motion                                   | 11.11             |
| Theme       | next-themes                                     | 0.4               |
| Toast       | sonner                                          | 1.7               |
| Image       | sharp                                           | 0.33              |
| shadcn util | @radix-ui/react-slot, cva, clsx, tailwind-merge | —                 |

> ⚠️ **shadcn/ui belum dipasang penuh** — utility-nya saja. Belum ada folder `components/ui/`. Komponen UI dibuat manual dengan token dari `globals.css` + Tailwind extend.

### Admin-Panel (`/Admin-Panel`) → `https://admni-panel.onrender.com`

| Kategori     | Library                        | Versi     |
| ------------ | ------------------------------ | --------- |
| Build        | Vite                           | 5.2       |
| UI Lib       | React                          | 18.2      |
| Routing      | react-router-dom               | 6.23      |
| HTTP         | axios                          | 1.15      |
| Async State  | @tanstack/react-query          | 5.100     |
| Global State | @reduxjs/toolkit + react-redux | 2.2 / 9.1 |
| Toast        | react-hot-toast                | 2.6       |
| Icons        | react-icons                    | 5.2       |
| Charts       | recharts                       | 2.12      |
| Styling      | tailwindcss                    | 3.4       |

### Shared

- **Database**: Supabase PostgreSQL (1 DB, di-share)
- **Auth**: Supabase Auth + role di tabel Prisma `User.role` (`USER` | `ADMIN`)
- **Storage**: Supabase Storage bucket `lumara-id`
- **Deploy**: Render (kedua service via `render.yaml`)

---

## Bahasa & Tooling

### MobileApp

- **Bahasa utama**: TypeScript 5.x dengan `strict: true`
- **Runtime server**: Node 20+ (Render default)
- **Module resolution**: `bundler` mode dengan path alias `@/*` → root MobileApp/
- **Rendering**: Next.js App Router — server components by default; `"use client"` untuk komponen interaktif
- **Build output**: conditional — `output: "standalone"` kalau env `RENDER` ada (Render.com), undefined untuk Vercel (serverless functions)
- **Komentar code**: Bahasa Indonesia santai (sesuai konvensi proyek)

### Admin-Panel

- **Bahasa**: TypeScript 5.2 dengan strict mode
- **Build tool**: Vite 5 (esbuild-based, fast dev/HMR)
- **Style**: SPA murni — semua route di-handle client-side via react-router-dom
- **HTTP client**: axios instance di `src/lib/api.ts` dengan baseURL `${VITE_API_URL}/api/admin` & header `x-admin-secret`
- **Docker**: `dockerfile` + `compose.yml` tersedia untuk dev lokal (`docker compose up` → Vite dev server di `0.0.0.0:5173`)

### next.config.js — Detail Penting

```js
output: process.env.RENDER ? "standalone" : undefined
images: { unoptimized: true }                            // ⚠️ trade-off build cepat vs gambar tidak di-compress
experimental: { serverActions: { bodySizeLimit: "2mb" } } // untuk image upload via Server Action
remotePatterns: *.supabase.co, images.unsplash.com, api.dicebear.com, *.onrender.com
```

> `unoptimized: true` → gambar diserve as-is, tidak di-resize/compress. Pertimbangkan disable kalau upgrade ke paid plan.

### Convention TypeScript Wajib

- `interface` untuk shape object yang ada method/extension; `type` untuk union/intersection/utility
- Hindari `any` — pakai `unknown` + narrowing
- Server actions/route handlers: try/catch + return `{ success: boolean; error?: string; data?: T }`
- Komponen React: tipe props pakai `interface XxxProps`
- Singleton services/models: `private static instance` + `static getInstance()` + lowercase named export

---

## Database Schema (Prisma)

Semua model di `MobileApp/prisma/schema.prisma`. Mapping snake_case ke Postgres via `@map`/`@@map`.

| Model             | Tabel             | Field Utama                                                                                                                                                                                                   | Relasi                                                      |
| ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **User**          | `users`           | id, email (unique), name, avatar, phone, role (default `USER`), timestamps                                                                                                                                    | hasMany: orders, wishlist, reviews                          |
| **Category**      | `categories`      | id, name, slug (unique), image, description                                                                                                                                                                   | hasMany: products                                           |
| **Product**       | `products`        | id, name, slug (unique), description, price (Int), originalPrice, images (Json), stock, sku, categoryId, sizes/colors (Json), rating, reviewCount, isFeatured, isNew, timestamps                              | belongsTo: category; hasMany: reviews, wishlist, orderItems |
| **Order**         | `orders`          | id, userId, status (default `PENDING`), total, **shippingCost (Int @default 0)**, shippingAddress (Json), paymentMethod, **courier, courierService, trackingNumber, shippedAt, estimatedArrival**, timestamps | belongsTo: user; hasMany: items, trackings                  |
| **OrderTracking** | `order_trackings` | id, orderId, status, description, location?, createdAt                                                                                                                                                        | belongsTo: order (cascade delete)                           |
| **OrderItem**     | `order_items`     | id, orderId, productId, quantity, size, color, price                                                                                                                                                          | belongsTo: order, product                                   |
| **Wishlist**      | `wishlists`       | id, userId, productId, createdAt + `@@unique([userId, productId])`                                                                                                                                            | belongsTo: user, product (cascade)                          |
| **Review**        | `reviews`         | id, userId, productId, rating, comment, images (Json), createdAt                                                                                                                                              | belongsTo: user, product (cascade)                          |
| **AppSetting**    | `app_settings`    | key (PK), value, updatedAt                                                                                                                                                                                    | —                                                           |

### Enums (disimpan sebagai String, tanpa enum Prisma)

- `Role`: `USER` | `ADMIN`
- `OrderStatus`: `PENDING` | `PAID` | `PROCESSING` | `SHIPPED` | `DELIVERED` | `CANCELLED`

### Catatan Tipe Json

- `Product.images`, `Product.sizes`, `Product.colors`, `Review.images` → `Json @default("[]")`
- `Order.shippingAddress` → `Json @default("{}")` (bukan String)

### ⚠️ Dua File Schema Prisma

Render build meng-copy `schema.production.prisma` → `schema.prisma` saat deploy:

```
cp prisma/schema.production.prisma prisma/schema.prisma && npx prisma generate && ...
```

**Setiap perubahan model di `schema.prisma`, WAJIB sync ke `schema.production.prisma`.**

Perbedaan production schema:

- `datasource`: tambah `directUrl = env("DIRECT_URL")` untuk Supabase connection pooling
- Kolom teks panjang (`description`, `comment`, `trackingNumber`, dll) pakai `@db.Text`
- `binaryTargets: ["native", "rhel-openssl-1.0.x"]` untuk kompatibilitas Vercel Lambda

---

## Tipe Data Inti (TypeScript)

Semua tipe domain di `MobileApp/types/index.ts`:

```ts
type Role = 'USER' | 'ADMIN';
type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

type ProductWithCategory = Product & { category: Category };
type ProductWithReviews = Product & {
  category: Category;
  reviews: ReviewWithUser[];
};
type ReviewWithUser = Review & { user: Pick<User, 'id' | 'name' | 'avatar'> };
type CategoryWithCount = Category & { _count: { products: number } };
type WishlistWithProduct = Wishlist & { product: ProductWithCategory };

type OrderWithItems = Order & {
  items: (OrderItem & { product: Pick<Product, 'id' | 'name' | 'images'> })[];
  user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>;
  trackings: OrderTracking[];
  courier: string | null;
  courierService: string | null;
  trackingNumber: string | null;
  shippedAt: Date | string | null;
  estimatedArrival: Date | string | null;
};

interface OrderTracking {
  id: string;
  orderId: string;
  status: string; // label pendek: "Dikemas", "Diserahkan", dll
  description: string; // kalimat lengkap untuk buyer
  location: string | null;
  createdAt: Date | string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  address: string;
  notes?: string;
  provinceId?: string;
  cityId?: string; // RajaOngkir IDs untuk hitung ongkir
  geoLat?: number;
  geoLng?: number; // koordinat GPS opsional (patokan antar)
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### Auth State (Zustand — `store/authStore.ts`)

```ts
interface DbUser {
  id: string; email: string;
  name: string | null; avatar: string | null;
  phone: string | null; role: string;
}
interface AuthStore {
  user: SupabaseUser | null;   // Supabase Auth user
  dbUser: DbUser | null;       // Record di Prisma User table
  loading: boolean;
  setUser / setDbUser / setLoading / clear: ...
}
```

> `user` ada saat login; `dbUser` ada setelah sync via `/api/auth/sync-user`. UI yang butuh role pakai `dbUser.role`.

### Social Channel (Single Source of Truth — `lib/social.ts`)

```ts
const WHATSAPP_NUMBER = '6285285733391'; // format internasional, no plus, no zero
function buildWhatsAppUrl(message?: string): string;
function withUtm(url: string, source: string, medium: string): string;
type SocialChannel = { id; label; handle; url; desc; brandHex };
const SOCIAL_CHANNELS: SocialChannel[]; // 4 entry: WA, IG, TikTok, Shopee
```

> Edit nomor WA & link di file ini → `<FloatingWhatsApp>`, `<SocialLinks>`, dan `/contact` semua ikut otomatis.

---

## Arsitektur OOP

### Pattern Wajib: API Route → Service → Model → Prisma

```
HTTP request
    ↓
app/api/.../route.ts        (controller: validasi input + format response)
    ↓
lib/services/*Service.ts    (orkestrasi bisnis, bisa panggil multi-model)
    ↓
lib/models/*Model.ts        (akses Prisma, query primitif)
    ↓
prisma client
```

### Models (singleton via `getInstance()` + named export lowercase)

| Class             | File               | Method Utama                                                                                                               |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `ProductModel`    | ProductModel.ts    | findById, findBySlug, findFeatured, findNew, findRelated, findWithFilters, create, update, delete, decrementStock          |
| `CategoryModel`   | CategoryModel.ts   | findAll, findAllWithCount, findBySlug, findById, create, update, delete                                                    |
| `UserModel`       | UserModel.ts       | findById, findByEmail, create, updateProfile, findAll                                                                      |
| `WishlistModel`   | WishlistModel.ts   | findByUser, isWishlisted, toggle, countByUser, remove                                                                      |
| `ReviewModel`     | ReviewModel.ts     | findByProduct, create, delete, list; `recalcRating()` private (auto-update rating agregat di Product setelah write/delete) |
| `OrderModel`      | OrderModel.ts      | findById, findByUser, findAll, create, updateStatus, **shipOrder, addTracking, confirmDelivery**, findRecent               |
| `AppSettingModel` | AppSettingModel.ts | getMaintenanceMode, setMaintenanceMode, get, set                                                                           |
| `BaseModel`       | BaseModel.ts       | Abstract class: `findById<T>`, `count`. ⚠️ Tidak di-extend oleh model konkret saat ini — pakai pola existing dulu          |

**OrderModel** punya dua include preset untuk hemat memory:

- `LIST_INCLUDE` — tanpa array `trackings` (hanya `_count`), dipakai di `findAll`, `findByUser`, `findRecent`
- `DETAIL_INCLUDE` — full `trackings`, dipakai di `findById`

**ProductModel** punya search engine internal:

- `buildSearchTerms()` — token splitting + alias fashion ID (pasmina↔pashmina, hijab↔jilbab↔kerudung, sifon↔chiffon, dll)
- `buildSearchOR()` — ILIKE PostgreSQL via `mode: "insensitive"`, prefix matching query ≥5 huruf

### Services

| Class             | Method Utama                                                                                                                                                                           |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProductService`  | getProductBySlug, getProductById, getFeaturedProducts, getNewProducts, getRelatedProducts, getProducts (filter), parseImages/Sizes/Colors, getDiscountPercent, getCategoryWithProducts |
| `WishlistService` | getWishlist, toggle, isWishlisted, getCount                                                                                                                                            |
| `OrderService`    | createOrder (validasi stok + decrement), getOrder, getUserOrders, getAllOrders, updateStatus, parseShippingAddress                                                                     |
| `AuthService`     | getOrCreateUser, getUserById, getUserByEmail, updateProfile, isAdmin                                                                                                                   |

### State Management — Zustand (`/store/`)

| Store           | Persisted?        | Tujuan                                      |
| --------------- | ----------------- | ------------------------------------------- |
| `cartStore`     | ya (localStorage) | items, add/update/remove, total             |
| `wishlistStore` | ya (localStorage) | productIds local + syncFromServer           |
| `uiStore`       | ya                | `language: "id" \| "en"` + toggleLanguage() |
| `authStore`     | tidak             | user (Supabase) + dbUser (Prisma) + loading |

---

## API Routes (`MobileApp/app/api/`)

### Public (storefront)

| Method          | Path                       | Deskripsi                                                        |
| --------------- | -------------------------- | ---------------------------------------------------------------- |
| GET             | `/api/products`            | List + filter (search, category, price, sort, page)              |
| GET             | `/api/products/[id]`       | Detail produk                                                    |
| GET             | `/api/categories`          | List kategori                                                    |
| GET/POST/DELETE | `/api/wishlist`            | Get/toggle wishlist (perlu userId)                               |
| GET/POST        | `/api/orders`              | List orders user / create order                                  |
| GET             | `/api/orders/[id]`         | Detail order                                                     |
| GET             | `/api/orders/[id]/status`  | Get status order (legacy)                                        |
| POST            | `/api/orders/[id]/confirm` | Buyer konfirmasi terima (Bearer token)                           |
| GET/POST        | `/api/reviews`             | List / create review                                             |
| GET/PATCH       | `/api/profile`             | Get / update profil user                                         |
| GET             | `/api/status`              | Health check                                                     |
| POST            | `/api/auth/sync-user`      | Sync user Supabase → DB Prisma                                   |
| GET             | `/api/app-icon`            | App icon assets                                                  |
| GET             | `/api/logo/[variant]`      | Logo image (dark/white variant)                                  |
| GET             | `/api/shipping/provinces`  | Master provinsi RajaOngkir (cache 24h)                           |
| GET             | `/api/shipping/cities`     | Master kota per provinsi (`?province_id=`, cache 24h)            |
| POST            | `/api/shipping/cost`       | Hitung ongkir paralel JNE/TIKI/POS/J&T — `{destination, weight}` |

### Admin (semua perlu header `x-admin-secret`)

| Method                | Path                              | Deskripsi                       |
| --------------------- | --------------------------------- | ------------------------------- |
| GET                   | `/api/admin/me`                   | Cek role admin                  |
| GET                   | `/api/admin/dashboard`            | Stats                           |
| GET/PATCH             | `/api/admin/settings`             | Maintenance mode                |
| GET/POST/PATCH/DELETE | `/api/admin/products[/id]`        | CRUD produk                     |
| GET/POST/PATCH/DELETE | `/api/admin/categories[/id]`      | CRUD kategori                   |
| GET                   | `/api/admin/orders`               | List orders (paginate 20/page)  |
| GET/PATCH/DELETE      | `/api/admin/orders/[id]`          | Detail / update status / delete |
| PATCH                 | `/api/admin/orders/[id]/status`   | Update status (legacy)          |
| POST                  | `/api/admin/orders/[id]/ship`     | Tandai dikirim + input resi     |
| POST                  | `/api/admin/orders/[id]/tracking` | Tambah update tracking manual   |
| GET/DELETE            | `/api/admin/reviews[/id]`         | List / hapus review             |
| GET/PATCH/DELETE      | `/api/admin/users[/id]`           | List / update role / delete     |

---

## Logika Bisnis Utama

### 1. Create Order (Checkout)

**Files**: `app/(main)/checkout/page.tsx` → `app/api/orders/route.ts` → `OrderService.createOrder()` → `OrderModel.create()`

```
1. Frontend:
   - Load master provinsi (cache 24h); user pilih provinsi → load kota
   - User input berat (kg, default 1) → klik "Hitung Ongkir" → POST /api/shipping/cost
   - Tampil layanan JNE/TIKI/POS/J&T, user pilih satu (selectedShip)
   - Tombol "Pakai Lokasiku" (opsional): simpan geoLat/geoLng sebagai patokan antar
     TIDAK auto-fill provinsi/kota (Nominatim ↔ RajaOngkir sering mismatch)
   - Validasi: dbUser ada, cart > 0, selectedShip terpilih, cityId ada

2. POST /api/orders {userId, items, shippingAddress, paymentMethod, shippingCost, courier, courierService}
   - paymentMethod default "Menunggu_konfirmasi_pembayaran"
   - Detail QRIS/transfer dikonfirmasi manual via WA setelah order masuk

3. Server: validate field → 400 kalau kosong; verify Bearer token

4. OrderService.createOrder():
   a. Tiap item: cek product.stock >= quantity → throw kalau kurang
   b. total = sum(price × qty) + shippingCost
   c. Buat order PENDING + OrderItem[] + auto-tracking "Pesanan Masuk"
   d. Decrement stock paralel via Promise.all

5. Frontend: clearCart() → redirect /orders setelah 2.5s
```

> ⚠️ Race condition: step 4a–4d tidak transactional. Stok bisa inkonsisten kalau decrement gagal di tengah. Acceptable untuk skala UMKM.

### 2. Shipping Cost (RajaOngkir Komerce)

**⚠️ Endpoint Starter lama (`api.rajaongkir.com/starter`) DEAD** — sudah migrasi ke `https://rajaongkir.komerce.id/api/v1/`. API key sama, response shape & city IDs **berubah total**.

**Files**: `lib/shipping/rajaongkir.ts` + `lib/shipping/cache.ts` + `lib/shipping/static.ts`

```
- RAJAONGKIR_API_KEY: akun Komerce gratis (100 hits/hari)
- RAJAONGKIR_ORIGIN_CITY_ID: ID Komerce gudang (default 139 = Jaktim, rec 137 = Jakpus)
  Referensi DKI: 135=Jakbar, 136=Jaksel, 137=Jakpus, 138=Jakut, 139=Jaktim, 141=Kep.Seribu
  → disimpan di server saja, tidak pernah tampil di UI publik

- Provinces: GET /destination/province (cache 24 jam)
- Cities:    GET /destination/city/{province_id} (PATH param, cache 24 jam)
- Cost:      POST /calculate/domestic-cost form-encoded (origin, destination, weight, courier)
             → paralel ke 4 kurir (JNE/TIKI/POS/J&T) via Promise.allSettled
             → flatten + sort ascending by cost
             → output: [{courier, courierName, service, description, cost, etd}]

- isFashionFriendly(): filter layanan trucking/kargo
- parseMaxEtdDays(): "1-3 hari" → 3

- lib/shipping/cache.ts: in-memory TTL cache (ONE_MINUTE/ONE_HOUR/ONE_DAY)
  → cacheGet<T>(), cacheSet<T>() per kombinasi (origin, dest, weight)

- lib/shipping/static.ts: fallback flat-rate per provinsi
  → aktif saat Komerce quota habis atau API error
```

> City IDs Komerce ≠ Starter lama. Jakarta Pusat: lama 152 → baru 137.

### 3. Manual Shipping Tracking

**Files**: `Admin-Panel/src/pages/EditOrder.tsx` → `POST /api/admin/orders/[id]/ship` → `OrderModel.shipOrder()`

```
Admin klik "Tandai Dikirim":
  - Input: courier, courierService, trackingNumber, estimatedArrival (semua wajib)
  - shipOrder(): UPDATE orders SET status=SHIPPED + auto-tracking "Diserahkan ke Kurir"

Admin tambah update berkala (7 template cepat + form manual):
  - addTracking(): INSERT order_trackings (status, description, location?)

Buyer /orders/[id]:
  - Shipping info card (kurir, resi, estimasi)
  - Timeline chronological (oldest at top)
  - Tombol "Konfirmasi Terima" (hanya saat status SHIPPED)
  - POST /api/orders/[id]/confirm (Bearer token)
  - confirmDelivery(): status → DELIVERED + auto-tracking "Pesanan Diterima"
```

### 4. Auto-Milestones (OrderModel)

| Event               | Tracking yang dibuat      |
| ------------------- | ------------------------- |
| Order dibuat        | "Pesanan Masuk"           |
| Status → PAID       | "Pembayaran Dikonfirmasi" |
| Status → PROCESSING | "Dikemas"                 |
| `shipOrder()`       | "Diserahkan ke Kurir"     |
| Status → DELIVERED  | "Pesanan Diterima"        |
| Status → CANCELLED  | "Dibatalkan"              |

### 5. Maintenance Mode

**Files**: `app/(main)/layout.tsx` + `app/maintenance/page.tsx` + `app/api/admin/settings/route.ts`

```
Layout (server):
  - export const dynamic = "force-dynamic"
  - unstable_cache(tags:["maintenance"], revalidate:60)
  - if maintenance → redirect("/maintenance")

Admin toggle:
  - PATCH /api/admin/settings {maintenance: bool}
  - AppSettingModel.setMaintenanceMode()
  - revalidateTag("maintenance") → cache invalidate INSTAN

/maintenance page (client):
  - Polling /api/status tiap 30s (cache:"no-store")
  - Pause saat document.hidden
  - Saat maintenance=false → window.location.href = "/" (HARD reload, bukan router.replace)
```

### 6. Auth Sync (Supabase ↔ Prisma)

**Files**: `components/providers/UIProvider.tsx` + `app/api/auth/sync-user/route.ts`

```
UIProvider mount:
  - getSession() → set user state
  - syncUser(token) → POST /api/auth/sync-user → setDbUser

onAuthStateChange:
  - SIGNED_OUT:                   clear() + wishlist.syncFromServer([])
  - SIGNED_IN | TOKEN_REFRESHED:  syncUser(token)

syncUser endpoint:
  - Verify Bearer token via supabase.auth.getUser
  - findOrCreate user di Prisma (default role USER)
  - Return DbUser shape
```

### 7. Wishlist Sync

- Local: Zustand `wishlistStore` (persisted) — `productIds: string[]`
- Server: tabel `wishlists` — `userId + productId` unique
- Sync: saat login → fetch server → `syncFromServer()`. Saat logout → `syncFromServer([])`.
- Toggle: optimistic update local + call `POST /api/wishlist`

---

## Validasi

### Form Client

| Halaman                       | Validasi                                                                                  |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `/login`                      | email format, password required                                                           |
| `/checkout`                   | semua field address required (kecuali notes), selectedShip terpilih, cart > 0, dbUser ada |
| `/account`                    | session ada (Bearer token tersedia)                                                       |
| `EditOrder` ship form (Admin) | courier dipilih, courierService/trackingNumber/estimatedArrival required                  |
| `EditOrder` tracking form     | status & description tidak kosong (trim)                                                  |

### Server (route handler)

| Endpoint                               | Validasi                                                                         |
| -------------------------------------- | -------------------------------------------------------------------------------- |
| `POST /api/orders`                     | userId, items.length>0, shippingAddress, paymentMethod → 400 kalau kosong        |
| `POST /api/admin/orders/[id]/ship`     | semua field shipping wajib (trim) → 400                                          |
| `POST /api/admin/orders/[id]/tracking` | status & description wajib (trim) → 400                                          |
| `POST /api/orders/[id]/confirm`        | Bearer token → verify Supabase user → cek email match → status harus SHIPPED     |
| `PATCH /api/profile`                   | Bearer token → verify user → patch name/phone                                    |
| `PATCH /api/admin/settings`            | header `x-admin-secret`, body `{maintenance: boolean}` → 400 kalau bukan boolean |
| Semua `/api/admin/*`                   | `checkAdminSecret(req)` → 401 kalau tidak match                                  |

### Service Layer

| Method                      | Validasi Bisnis                                 |
| --------------------------- | ----------------------------------------------- |
| `OrderService.createOrder`  | tiap product exists & stock >= qty → throw      |
| `OrderService.updateStatus` | status ∈ valid set → throw "Status tidak valid" |
| `OrderModel.updateStatus`   | sama (defense in depth)                         |

### Database Constraints

- `User.email` UNIQUE
- `Product.slug`, `Category.slug` UNIQUE
- `Wishlist (userId, productId)` UNIQUE compound
- FK CASCADE: `OrderItem`, `OrderTracking`, `Wishlist`, `Review` ikut hapus saat parent dihapus

---

## Environment Variables

### MobileApp (`.env.local` lokal / Render env vars production)

| Var                             | Wajib?          | Tujuan                                                                                     |
| ------------------------------- | --------------- | ------------------------------------------------------------------------------------------ |
| `DATABASE_URL`                  | ✅              | Connection string Postgres (Supabase pooler)                                               |
| `DIRECT_URL`                    | ✅ (production) | Connection string langsung untuk migrasi (Supabase direct)                                 |
| `NEXT_PUBLIC_SUPABASE_URL`      | ✅              | Endpoint Supabase project                                                                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅              | Public anon key (aman di client)                                                           |
| `SUPABASE_SERVICE_ROLE_KEY`     | optional        | Server-side bypass RLS (dipakai di `lib/supabase-admin.ts`)                                |
| `NEXT_PUBLIC_APP_URL`           | recommended     | Base URL public (untuk meta tag, OG, dll)                                                  |
| `ADMIN_SECRET`                  | ✅              | Secret untuk header `x-admin-secret` — harus match `VITE_ADMIN_SECRET` di Admin-Panel      |
| `RAJAONGKIR_API_KEY`            | ✅              | API key Komerce (gratis, 100 hits/hari)                                                    |
| `RAJAONGKIR_ORIGIN_CITY_ID`     | ✅              | City ID Komerce asal gudang (default `139` = Jaktim, rekomendasi `137` = Jakpus). Private. |
| `RENDER`                        | auto            | Di-set oleh Render.com — trigger `output: "standalone"` di next.config.js                  |

### Admin-Panel (`.env.local` lokal / Render env vars production)

| Var                      | Wajib? | Tujuan                                                           |
| ------------------------ | ------ | ---------------------------------------------------------------- |
| `VITE_API_URL`           | ✅     | URL MobileApp — axios baseURL = `${VITE_API_URL}/api/admin`      |
| `VITE_ADMIN_SECRET`      | ✅     | Match `ADMIN_SECRET` di MobileApp                                |
| `VITE_SUPABASE_URL`      | ✅     | Sama dengan `NEXT_PUBLIC_SUPABASE_URL`                           |
| `VITE_SUPABASE_ANON_KEY` | ✅     | Sama dengan `NEXT_PUBLIC_SUPABASE_ANON_KEY`                      |
| `VITE_STORE_URL`         | ✅     | URL storefront publik — untuk link "Lihat Toko" dari Admin-Panel |

> **Auth flow Admin-Panel**: login via Supabase → token untuk Supabase saja. Hit `/api/admin/*` pakai header `x-admin-secret`. Setelah login, `GET /api/admin/me` cek role; kalau `role !== "ADMIN"` → kicked out.

---

## Halaman MobileApp (App Router)

### Top-level (di luar group, tanpa Navbar/BottomNav)

- `/` — **Splash linktree** (5 channel: WA, IG, TikTok, Shopee, Web). Tampil tiap kunjungan.
- `/links` — alias splash untuk bio IG/TikTok
- `/maintenance` — tampil saat maintenance ON (di luar group = no redirect loop)
- `opengraph-image.tsx` — OG image generator (Next.js `ImageResponse`)
- `manifest.ts` — Web App Manifest (PWA: name, icons, theme_color)

### `(main)` group — Navbar + BottomNav + Footer + FloatingWA + maintenance check

- `/home` — landing storefront (Hero, Featured, NewArrivals, Categories, Promo)
- `/products` + `/products/[slug]` — listing & detail (zoom + lightbox)
- `/categories` + `/categories/[slug]` — index & per-kategori
- `/search` — search results
- `/cart` — keranjang
- `/checkout` — form alamat + hitung ongkir + buat pesanan
- `/wishlist` — list wishlist (auth-gated)
- `/orders` — list pesanan user (auth-gated)
- `/orders/[id]` — detail + tracking timeline + tombol konfirmasi (status SHIPPED)
- `/account` — profil user (inline edit nama & phone)
- `/promo`, `/about`, `/how-to-order`, `/shipping`, `/return`, `/contact` — halaman statis

### `(auth)` group

- `/login`, `/forgot-password`, `/reset-password`

### Middleware

`MobileApp/middleware.ts` — CORS handler untuk `/api/admin/*`. Allow: `admni-panel.onrender.com` & localhost. ✅ Sudah benar.

---

## Komponen UI (`MobileApp/components/`)

### Layout

- `Navbar.tsx` — desktop dropdown + mobile drawer + profile card. Logo → `/home`.
- `BottomNav.tsx` — mobile bottom nav. Home tab → `/home`.
- `Footer.tsx` — pakai `<SocialLinks variant="footer" />`, kontak `+62 852-8573-3391`

### Product

- `ProductCard.tsx` — listing/grid, `aspect-[3/4]` + `object-contain` (no crop)
- `ProductDetail.tsx` — detail page, pakai `<ProductImageZoom />`
- `ProductImageZoom.tsx` — **inner hover zoom 2.2× (Shopee-style)** + **lightbox full-screen** (mobile pinch-zoom + ESC/← →)
- `ProductFilters.tsx`, `MobileFilterDrawer.tsx` (pakai `createPortal`)
- `ColorSwatch.tsx` — swatch warna untuk pilihan variant produk

### Sections (dipakai di `/home`)

- `HeroSection`, `FeaturedSection`, `NewArrivalsSection`, `CategorySection`, `PromoSection`

### Splash

- `SplashLinkTree.tsx` — Claude-inspired minimalist. 4 animated pastel blobs, logo glow pulse, gradient shifting brand name, theme toggle pill (kanan-atas), 5 channel buttons stagger entrance + shimmer hover, UTM append ke link.

### Shared

- `FloatingWhatsApp.tsx` — fixed bottom-right pill. Mobile: `bottom-24` di atas BottomNav; desktop: `bottom-6`. Pulse ring hijau. Render di `(main)/layout.tsx`.
- `SocialLinks.tsx` — strip 4 icon brand. Variant `footer` dan `compact`.
- `ProductGrid`, `SearchBar`, `LoadingSpinner`
- Page headers: `ProductsPageHeader`, `SearchPageHeader`, `CategoriesClientPage`, `RelatedProductsHeader`

### Motion

- `PageTransition`, `FadeInView`, `SkeletonCard` (Framer Motion)
- `variants.ts` — animation variants reusable

### Providers

- `ThemeProvider` — next-themes, **`defaultTheme: "light"`**, `enableSystem: false`. Visitor baru selalu light, dark opt-in via toggle splash.
- `UIProvider` — Supabase auth listener, wishlist clear on logout, sync user SIGNED_IN/TOKEN_REFRESHED.

### Lib & Utilities (`MobileApp/lib/`)

| File                  | Tujuan                                                                      |
| --------------------- | --------------------------------------------------------------------------- |
| `prisma.ts`           | Prisma client singleton                                                     |
| `supabase.ts`         | Supabase client (SSR via `@supabase/ssr`)                                   |
| `supabase-browser.ts` | Supabase browser-only (`createBrowserClient`)                               |
| `supabase-admin.ts`   | Supabase server-side service role (bypass RLS)                              |
| `admin.ts`            | `checkAdminSecret(req)`, `adminUnauthorized()`, `uploadImage(file, bucket)` |
| `social.ts`           | Single source of truth sosial channel + WA URL builder + UTM helper         |
| `utils.ts`            | `cn()`, `formatDate()`, `formatPrice()`, dll                                |
| `i18n.ts`             | Translation map ID/EN (seed multi-bahasa, belum full dipakai)               |

### Hooks & Scripts

- `hooks/` — custom React hooks (useDebounce, dll)
- `prisma/seed.ts` — seed script (`npx tsx prisma/seed.ts`)

---

## Admin-Panel — Halaman & Komponen

### Route Lengkap (`src/App.tsx`)

| Path                     | Halaman             | Keterangan                         |
| ------------------------ | ------------------- | ---------------------------------- |
| `/`                      | Landing (Dashboard) | Stats cards, charts, recent orders |
| `/products`              | Products            | Tabel + create/edit                |
| `/categories`            | Categories          | Tabel + create/edit                |
| `/orders`                | Orders              | Tabel + detail + ship + tracking   |
| `/reviews`               | Reviews             | Tabel + delete                     |
| `/users`                 | Users               | Tabel + edit role + delete         |
| `/orders/create-order`   | CreateOrder         | Buat order manual                  |
| `/reviews/create-review` | CreateReview        | Input review manual                |
| `/users/create-user`     | CreateUser          | Buat user manual                   |
| `/help-desk`             | HelpDesk            | FAQ & panduan admin internal       |
| `/notifications`         | Notifications       | Notification center                |
| `/profile`               | Profile             | Profil admin yang login            |
| `/login`                 | Login               | Login (unprotected)                |

> Semua route kecuali `/login` di-wrap `<ProtectedRoute>`.

### Komponen Utama Admin-Panel

- **Tables**: `ProductTable`, `OrderTable`, `ReviewsTable`, `CategoryTable`, `UserTable` (pagination 20/page via controlled component)
- **Forms**: `InputWithLabel`, `SelectInput`, `TextAreaInput`, `ColorVariantInput` (preset 20 warna + hex + datalist), `ImageUpload`
- **Charts**: `RechartsBarChart`, `ActivitiesByCountry`, `ActivitiesByDevices`, `ActivityByTime`, `ConversionRateBySource`
- **Auth**: `ProtectedRoute`, `AuthContext` (`src/context/AuthContext.tsx`) — session + role check
- **UI**: `Header`, `Sidebar`, `Footer`, `Pagination`, `SearchInput`, `WhiteButton`
- **Code splitting**: `React.lazy` + `<Suspense>` per route di `App.tsx` — bundle awal hanya load HomeLayout + Login

---

## Design System (dari `globals.css`)

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

### Dark mode (VSCode-inspired)

```
--primary:           #A78BFA
--background:        #1E1E1E
--card:              #252526
--card-border:       #3C3C3C
--text-primary:      #D4D4D4
```

### Tipografi & Spacing

- **Font**: Plus Jakarta Sans (`--font-jakarta`)
- **Card radius**: `14px` (`rounded-card`)
- **Button radius**: `12px` (`rounded-btn`)
- **Pill radius**: `9999px` (`rounded-pill`)
- **Mobile-first**: 390px base (iPhone width)
- **Safe area**: `safe-bottom`, `safe-top` utilities tersedia
- **Default theme**: light

### Shadow

- `shadow-card`, `shadow-card-hover`
- `shadow-violet`, `shadow-violet-sm`, `shadow-violet-lg` (brand glow)

### Type Scale

`display-lg/md`, `headline-lg/md`, `title-lg`, `body-lg/md/sm`, `label-lg/sm`

> Token aktual selalu di `globals.css`. Jangan percaya nilai lain yang mungkin ada di prompt lama.

---

## Progress Saat Ini (per 2026-05-14)

### ✅ Selesai

**MobileApp — Storefront**

- Splash linktree `/` & `/links` — 5 channel, animated blobs, theme toggle, UTM tracking
- Storefront `/home` — Hero, Featured, NewArrivals, Categories, Promo
- Listing & detail produk + filter + search multi-strategi (token + alias fashion ID + ILIKE)
- Image zoom Shopee-style: hover zoom 2.2× + lightbox full-screen (pinch + keyboard)
- Cart + checkout lengkap: form alamat, dropdown provinsi/kota, hitung ongkir 4 kurir, buat order
- Auth: login/forgot/reset, sync ke DB, role-based redirect
- Wishlist: persisted, sync server, auth-gated, clear on logout
- Orders: `/orders` list, `/orders/[id]` detail + tracking timeline + konfirmasi terima
- Account: `/account` inline edit nama & phone
- Maintenance mode: tag-based cache, hard-reload anti-loop, polling visibility-aware
- Floating WhatsApp + social bar 4 channel (WA/IG/TikTok/Shopee)
- Default theme light, dark opt-in

**MobileApp — Backend**

- Semua API routes (public + admin) lengkap
- RajaOngkir Komerce integration: provinces, cities, cost 4 kurir paralel + fallback static
- OrderModel: LIST vs DETAIL include untuk hemat memory
- Auth sync UIProvider (SIGNED_IN + TOKEN_REFRESHED)
- Maintenance toggle instan via revalidateTag

**Admin-Panel**

- CRUD: Products, Categories, Orders, Reviews, Users, Dashboard
- EditOrder: form "Tandai Dikirim" + 7 template tracking + timeline
- ColorVariantInput: preset 20 warna + hex + datalist autocomplete
- Pagination 20/page (Orders, Users, Reviews)
- Code splitting via React.lazy + Suspense
- Mobile responsive
- Maintenance toggle di Dashboard

**Database**

- Schema lengkap: 9 model, semua relasi + FK cascade
- Tabel `order_trackings`, kolom shipping di `orders`, `app_settings`
- Dual schema (dev + production) — production pakai `@db.Text` + `directUrl`

### 📋 Belum Dikerjakan

| Item                         | Keterangan                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| **Admin login auto-sync**    | Admin login via Supabase belum auto-call sync-user → DB record belum guaranteed ada |
| **Server-side search admin** | Filter Orders/Users/Reviews masih client-side (hanya current page)                  |
| **Image optimization**       | `unoptimized: true` — pertimbangkan enable kalau upgrade ke paid plan               |
| **Render free tier 139**     | Monitoring SIGSEGV — kalau masih crash upgrade ke Starter ($7)                      |
| **shadcn/ui penuh**          | Saat ini cuma utility (cva, clsx); `npx shadcn init` kalau perlu komponen ready     |
| **BaseModel konsistensikan** | Model konkret pakai singleton manual, belum extend BaseModel                        |

---

## Deploy & Infrastruktur

### Dua Repo GitHub Terpisah

| Service     | Repo                        | URL                                |
| ----------- | --------------------------- | ---------------------------------- |
| MobileApp   | `syahrulramelan1/lumara-id` | `https://lumara-id.onrender.com`   |
| Admin-Panel | `UsedZ/admni-panel`         | `https://admni-panel.onrender.com` |

### Push Admin-Panel ke Repo Terpisah

```bash
git subtree split --prefix Admin-Panel -b tmp
git push https://github.com/UsedZ/admni-panel.git tmp:main --force
git branch -D tmp
```

Lakukan setiap ada perubahan Admin-Panel yang perlu di-deploy.

### Render Build Commands (via `render.yaml`)

**MobileApp:**

```
buildCommand:
  cp prisma/schema.production.prisma prisma/schema.prisma
  && npm install --include=dev
  && npx prisma generate
  && npx prisma db push
  && npm run build
  && cp -r .next/static .next/standalone/.next/static
  && cp -r public .next/standalone/public

startCommand: HOSTNAME=0.0.0.0 node .next/standalone/server.js
```

> Copy `static` + `public` HARUS di buildCommand (bukan startCommand) agar tersedia tiap deploy termasuk restart tanpa rebuild.

**Admin-Panel:**

```
buildCommand: npm install && npm run build
staticPublishPath: ./dist
routes: /* → /index.html (SPA rewrite)
```

### Supabase Config

- Bucket storage: `lumara-id` (public)
- Site URL: `https://lumara-id.onrender.com`
- Redirect URL: `https://lumara-id.onrender.com/reset-password`
- `app_settings`: RLS enabled, no policy → blokir REST API, Prisma OK via direct connection

---

## Konvensi & Preferensi

### Bahasa

- **Bahasa Indonesia santai/casual** untuk semua komunikasi & komentar code
- Toast/UI text dalam Bahasa Indonesia

### Pattern Wajib

- API route **tidak boleh** akses Prisma langsung — wajib lewat Service → Model
- Mobile-first (390px base, scale up)
- Singleton via `getInstance()` + named lowercase export
- Sebelum tambah model baru → cek apakah butuh Service juga
- Setelah edit `schema.prisma` → edit juga `schema.production.prisma`
- Setelah tambah/ubah model → `npx prisma generate` di `MobileApp`

### Jangan Pernah

- Tambah `/register` atau self-register di Admin-Panel
- Simpan role di Supabase metadata (role hanya di Prisma `User`)
- Akses `/api/admin/*` tanpa header `x-admin-secret`
- Bypass service layer untuk akses Prisma langsung di route

### Selalu

- Wrap halaman Admin-Panel dengan `<ProtectedRoute>`
- Panggil `checkAdminSecret(req)` di awal handler `/api/admin/*`
- User dari MobileApp → role `USER` (tidak bisa jadi ADMIN dari MobileApp)
- Jalankan `git subtree split` setiap push perubahan Admin-Panel
- Prefer dependency-light, paste-ready code (avoid bloat library)
- Email transactional via Supabase built-in saja (rate limit 2/jam) — Gmail/Brevo/Resend perlu domain custom
