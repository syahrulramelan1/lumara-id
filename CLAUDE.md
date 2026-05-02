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

## Bahasa & Tooling

### MobileApp
- **Bahasa utama**: TypeScript 5.x dengan `strict: true` (lihat `tsconfig.json`)
- **Runtime server**: Node 20+ (Render default)
- **Module resolution**: `bundler` mode dengan path alias `@/*` → root MobileApp/
- **Rendering**: Next.js App Router server components by default; mark `"use client"` untuk komponen interaktif
- **Build output**: standalone (`.next/standalone/server.js`) — copy `.next/static` saat start
- **Komentar code**: Bahasa Indonesia santai (sesuai konvensi proyek)

### Admin-Panel
- **Bahasa**: TypeScript 5.2 dengan strict mode
- **Build tool**: Vite 5 (esbuild-based, fast dev/HMR)
- **Style: SPA** murni — semua route di-handle client-side via react-router-dom
- **HTTP client**: axios instance di `src/lib/api.ts` dengan baseURL & header `x-admin-secret`

### Convention TS yang Wajib Diikuti
- Tipe `interface` untuk shape object yang ada method/extension; `type` untuk union/intersection/utility
- Hindari `any` — pakai `unknown` + narrowing kalau perlu
- Server actions/route handlers selalu punya try/catch + return shape `{ success: boolean; error?: string; data?: T }`
- Komponen React: tipe props pakai `interface XxxProps`
- Singleton services/models: `private static instance` + `static getInstance()` + lowercase named export

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

## Tipe Data Inti (TypeScript)

Semua tipe domain ada di `MobileApp/types/index.ts`. Ringkasan tipe yang sering dipakai:

```ts
// Enum string literal (bukan Prisma enum)
type Role = "USER" | "ADMIN";
type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// Composite Prisma types
type ProductWithCategory = Product & { category: Category };
type ProductWithReviews  = Product & { category: Category; reviews: ReviewWithUser[] };
type ReviewWithUser      = Review & { user: Pick<User, "id" | "name" | "avatar"> };
type CategoryWithCount   = Category & { _count: { products: number } };
type WishlistWithProduct = Wishlist & { product: ProductWithCategory };

// OrderWithItems — dipakai di /orders, /orders/[id], admin EditOrder
type OrderWithItems = Order & {
  items: (OrderItem & { product: Pick<Product, "id" | "name" | "images"> })[];
  user: Pick<User, "id" | "name" | "email" | "avatar">;
  trackings: OrderTracking[];                 // kosong/tidak ada di list mode
  courier: string | null;
  courierService: string | null;
  trackingNumber: string | null;
  shippedAt: Date | string | null;
  estimatedArrival: Date | string | null;
};

interface OrderTracking {
  id: string; orderId: string;
  status: string;              // label pendek: "Dikemas", "Diserahkan", dll
  description: string;         // kalimat lengkap untuk buyer
  location: string | null;
  createdAt: Date | string;
}

interface CartItem {
  productId: string; name: string; price: number; image: string;
  size: string; color: string; quantity: number;
}

interface ShippingAddress {
  name: string; phone: string;
  province: string; city: string; district: string; postalCode: string;
  address: string; notes?: string;
}

// API response shape — dipakai di seluruh /api/*
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination wrapper untuk list endpoints
interface PaginationResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

### Auth State (Zustand)
File `store/authStore.ts`:
```ts
interface DbUser {
  id: string; email: string;
  name: string | null; avatar: string | null;
  phone: string | null; role: string;
}
interface AuthStore {
  user: SupabaseUser | null;        // Supabase Auth user
  dbUser: DbUser | null;            // Record di Prisma User table
  loading: boolean;
  setUser / setDbUser / setLoading / clear: ...
}
```
> `user` (Supabase) ada saat login, `dbUser` (Prisma) ada setelah sync via `/api/auth/sync-user`. UI yang butuh role pakai `dbUser.role`.

### Social Channel (Single Source of Truth)
File `lib/social.ts`:
```ts
const WHATSAPP_NUMBER = "6285285733391";   // format internasional, no plus, no zero
const WHATSAPP_DEFAULT_MESSAGE = "Halo Lumara.id, ...";
function buildWhatsAppUrl(message?: string): string;
type SocialChannel = { id, label, handle, url, desc, brandHex };
const SOCIAL_CHANNELS: SocialChannel[];     // 4 entry: WA, IG, TikTok, Shopee
```
> Edit nomor WA & link di file ini → `<FloatingWhatsApp>`, `<SocialLinks>`, dan `/contact` semua ikut.

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

## Logika Bisnis Utama

### 1. Create Order (Checkout)
**Trigger**: Buyer klik "Buat Pesanan" di `/checkout`.
**Files**: `app/(main)/checkout/page.tsx` → `app/api/orders/route.ts` → `OrderService.createOrder()` → `OrderModel.create()`

**Algoritma**:
```
1. Frontend: validate auth (dbUser ada), keranjang > 0, paymentMethod terpilih
2. POST /api/orders {userId, items, shippingAddress, paymentMethod}
3. Server: validate field tidak kosong → 400 kalau gagal
4. OrderService:
   a. Loop tiap item → cek product.stock >= quantity → throw kalau tidak cukup
   b. Hitung total = sum(price × quantity)
   c. Buat order dengan status PENDING + nested create OrderItem[]
   d. Auto-create OrderTracking "Pesanan Masuk"
   e. Decrement product.stock paralel via Promise.all
5. Frontend: clearCart() + setDone(true) + redirect /orders setelah 2.5s
```
**Race condition risk**: Step 5a-5e tidak transactional. Kalau decrement gagal di tengah, stok inkonsisten. **Acceptable** untuk skala UMKM saat ini.

### 2. Manual Shipping Tracking
**Trigger**: Admin tandai dikirim di EditOrder.
**Files**: `Admin-Panel/src/pages/EditOrder.tsx` → `POST /api/admin/orders/[id]/ship` → `OrderModel.shipOrder()`

**Algoritma `shipOrder()`**:
```
1. Validate body (courier, courierService, trackingNumber, estimatedArrival wajib)
2. UPDATE orders SET status='SHIPPED', courier=..., courier_service=...,
   tracking_number=..., shipped_at=NOW(), estimated_arrival=...
3. Auto-create OrderTracking "Diserahkan ke Kurir" + deskripsi resi
```

**Algoritma `addTracking()`**: simple insert ke order_trackings dengan status, description, location?
**Algoritma `confirmDelivery()`**: cek pemilik order via Bearer token → status SHIPPED → update DELIVERED + auto-tracking

### 3. Auto-Milestones (di OrderModel)
Saat status order berubah, otomatis buat OrderTracking entry:
| Status Baru | Tracking yang dibuat |
|-------------|----------------------|
| (saat create) | "Pesanan Masuk" |
| `PAID`        | "Pembayaran Dikonfirmasi" |
| `PROCESSING`  | "Dikemas" |
| (shipOrder)   | "Diserahkan ke Kurir" |
| `DELIVERED`   | "Pesanan Diterima" |
| `CANCELLED`   | "Dibatalkan" |

### 4. Maintenance Mode (Cache & Toggle Instan)
**Files**: `app/(main)/layout.tsx` + `app/maintenance/page.tsx` + `app/api/admin/settings/route.ts`

**Algoritma**:
```
Layout (server component):
  - export const dynamic = "force-dynamic" (skip static)
  - getMaintenanceStatus() = unstable_cache(...) dengan tags:["maintenance"], revalidate:60
  - if maintenance: redirect("/maintenance")

Admin toggle:
  - PATCH /api/admin/settings {maintenance: bool}
  - AppSettingModel.setMaintenanceMode(bool)
  - revalidateTag("maintenance") → cache di-invalidate INSTAN

/maintenance page (client):
  - Polling /api/status tiap 30s (cache:"no-store")
  - Pause saat document.hidden, resume saat visible
  - Saat detect maintenance:false → window.location.href = "/" (HARD reload, bukan router.replace)
    → memastikan layout server di-evaluate fresh, no redirect loop
```

### 5. Auth Sync (Supabase ↔ Prisma)
**Files**: `components/providers/UIProvider.tsx` + `app/api/auth/sync-user/route.ts`

**Algoritma**:
```
UIProvider mount:
  - getSession() → set user state
  - syncUser(token) → POST /api/auth/sync-user → setDbUser

onAuthStateChange:
  - SIGNED_OUT: clear() + wishlist syncFromServer([])
  - SIGNED_IN | TOKEN_REFRESHED: syncUser(token)

syncUser endpoint:
  - Verify Bearer token via supabase.auth.getUser
  - findOrCreate user di Prisma berdasarkan email (default role USER)
  - Return DbUser shape
```

### 6. Wishlist Sync
- Local: Zustand `wishlistStore` (persisted localStorage) — `productIds: string[]`
- Server: tabel `wishlists` — `userId + productId` unique
- Sync: saat login → fetch server → `syncFromServer()`. Saat logout → `syncFromServer([])`.
- Toggle: panggil `POST /api/wishlist` (server) + update local store optimistic

### 7. Search Multi-Strategi (Indonesia Fashion Aliases)
**File**: `lib/models/ProductModel.ts` → `buildSearchTerms()` + `buildSearchOR()`
- Token splitting: "pasmina merah" → ["pasmina merah", "pasmina", "merah"]
- Alias fashion ID: pasmina ↔ pashmina, hijab ↔ jilbab ↔ kerudung, sifon ↔ chiffon, dll
- Prefix matching untuk query >= 5 huruf: "pasmi" → tambah prefix "pasm"
- ILIKE PostgreSQL via `mode: "insensitive"`
- OR di name + description

---

## Validasi

### Form Client (sebelum submit)
| Halaman | Validasi |
|---------|----------|
| `/login` | email format (HTML5 `type="email"`), password required |
| `/checkout` | semua field address required (kecuali notes), paymentMethod dipilih, items > 0, dbUser ada |
| `/account` (edit profil) | session ada (Bearer token tersedia) |
| `EditOrder` (Admin) ship form | courier dipilih, courierService/trackingNumber/estimatedArrival required |
| `EditOrder` tracking form | status & description tidak kosong (trim) |

### Server (route handler)
| Endpoint | Validasi |
|----------|----------|
| `POST /api/orders` | userId, items.length>0, shippingAddress, paymentMethod ada → 400 kalau tidak |
| `POST /api/admin/orders/[id]/ship` | semua field shipping wajib (trim) → 400 kalau kosong |
| `POST /api/admin/orders/[id]/tracking` | status & description wajib (trim) → 400 |
| `POST /api/orders/[id]/confirm` | Bearer token → verify Supabase user → cek email = dbUser.email = order.userId → status order harus SHIPPED |
| `PATCH /api/profile` | Bearer token → verify user → patch name/phone (semua opsional) |
| `PATCH /api/admin/settings` | header `x-admin-secret`, body `{maintenance: boolean}` → 400 kalau bukan boolean |
| Semua `/api/admin/*` | `checkAdminSecret(req)` → 401 kalau tidak match |

### Service Layer
| Service Method | Validasi Bisnis |
|----------------|-----------------|
| `OrderService.createOrder` | tiap product exists & stock >= qty → throw |
| `OrderService.updateStatus` | status ∈ valid set → throw "Status tidak valid" |
| `OrderModel.updateStatus` | sama (defense in depth) |

### Database (Prisma constraint)
- `User.email` UNIQUE
- `Product.slug`, `Category.slug` UNIQUE
- `Wishlist (userId, productId)` UNIQUE compound
- FK CASCADE: `OrderItem`, `OrderTracking`, `Wishlist`, `Review` ikut hapus saat parent dihapus

---

## Environment Variables

### MobileApp (`/MobileApp/.env.local` lokal, Render env vars production)

| Var | Wajib? | Tujuan |
|-----|--------|--------|
| `DATABASE_URL` | ✅ | Connection string Postgres (Supabase pooler) |
| `DIRECT_URL` | ✅ (production) | Connection string langsung untuk migrasi (Supabase direct) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Endpoint Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key (aman di client) |
| `SUPABASE_SERVICE_ROLE_KEY` | optional | Untuk operasi yang bypass RLS (saat ini tidak dipakai) |
| `NEXT_PUBLIC_APP_URL` | recommended | Base URL public (untuk meta tag, dll) |
| `ADMIN_SECRET` | ✅ | Secret untuk header `x-admin-secret` — harus match `VITE_ADMIN_SECRET` di Admin-Panel |

### Admin-Panel (`/Admin-Panel/.env.local` lokal, Render env vars production)

| Var | Wajib? | Tujuan |
|-----|--------|--------|
| `VITE_API_URL` | ✅ | URL MobileApp (`https://lumara-id.onrender.com`) — axios baseURL = `${VITE_API_URL}/api/admin` |
| `VITE_ADMIN_SECRET` | ✅ | Match `ADMIN_SECRET` di MobileApp |
| `VITE_SUPABASE_URL` | ✅ | Sama dengan MobileApp `NEXT_PUBLIC_SUPABASE_URL` |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Sama dengan MobileApp `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

> 🔑 **Auth flow Admin Panel**: admin login via Supabase → token dipakai untuk authentication ke Supabase saja. Untuk hit endpoint `/api/admin/*`, dikirim header `x-admin-secret`. Setelah login, panggil `GET /api/admin/me` untuk cek role; kalau `role !== "ADMIN"` → kicked out.

---

## Halaman MobileApp (App Router)

### Top-level (di luar group, no Navbar/BottomNav)
- `/` — **Splash linktree** (5 channel equal: WA, IG, TikTok, Shopee, Web). Tampil setiap kunjungan, tidak ada localStorage skip.
- `/links` — Linktree alias (pakai komponen sama dengan `/`). URL khusus untuk pasang di bio IG/TikTok.
- `/maintenance` — tampil saat maintenance mode ON

### `(main)` group — wrapped layout dengan Navbar + BottomNav + Footer + FloatingWA + maintenance check
- `/home` — landing storefront (Hero, Featured, NewArrivals, Categories, Promo)
- `/products` + `/products/[slug]` — listing & detail (detail page punya inner zoom + lightbox)
- `/categories` + `/categories/[slug]` — index & per-kategori
- `/search` — search results
- `/cart` — keranjang
- `/checkout` — form alamat + pilih bayar (lengkap: POST /api/orders → clear cart → redirect)
- `/wishlist` — list wishlist (auth-gated)
- `/orders` — list pesanan user (auth-gated)
- `/orders/[id]` — detail + tracking timeline + tombol konfirmasi (status SHIPPED)
- `/account` — profil user (inline edit nama & phone via PATCH /api/profile)
- `/promo`, `/about`, `/how-to-order`, `/shipping`, `/return`, `/contact` — halaman statis

### `(auth)` group
- `/login`, `/forgot-password`, `/reset-password`

### Middleware
`MobileApp/middleware.ts` — CORS handler khusus untuk `/api/admin/*` (allow `admni-panel.onrender.com` & localhost). ✅ Sudah benar, tidak perlu diubah.

---

## Komponen UI (`MobileApp/components/`)

### Layout
- `Navbar.tsx` — desktop dropdown + mobile drawer dengan profile card. Logo link ke `/home` (bukan `/` splash).
- `BottomNav.tsx` — mobile bottom nav, Home tab → `/home`, account icon = avatar gradient
- `Footer.tsx` — pakai `<SocialLinks variant="footer" />`, kontak `+62 852-8573-3391`

### Product
- `ProductCard.tsx` — listing/grid, `aspect-[3/4]` + `object-contain` (no crop)
- `ProductDetail.tsx` — detail page, pakai `<ProductImageZoom />`
- `ProductImageZoom.tsx` — **inner hover zoom (Shopee-style)** + **lightbox full-screen** (mobile pinch-zoom + ESC/← →)
- `ProductFilters.tsx`, `MobileFilterDrawer.tsx` (pakai createPortal)

### Sections (dipakai di /home)
- `HeroSection`, `FeaturedSection`, `NewArrivalsSection`, `CategorySection`, `PromoSection`

### Splash (top-level entry)
- `SplashLinkTree.tsx` — Claude-inspired minimalist white. Animated background blobs (4 pastel, blur-3xl, slow infinite), logo glow pulse, gradient shifting brand name, theme toggle pill (kanan-atas, sync ke seluruh website), 5 channel buttons stagger entrance + shimmer hover.

### Shared
- `FloatingWhatsApp.tsx` — fixed bottom-right pill (mobile: bottom-24 atas BottomNav; desktop: bottom-6). Pulse ring hijau, label "Chat Sekarang" di desktop. Render di `(main)/layout.tsx` — muncul di semua storefront page.
- `SocialLinks.tsx` — strip 4 icon brand (WA/IG/TikTok/Shopee). Variant `footer` (small bulat dark bg) dan `compact` (medium dengan label).
- `ProductGrid`, `SearchBar`, `LoadingSpinner`
- Page headers: `ProductsPageHeader`, `SearchPageHeader`, `CategoriesClientPage`, `RelatedProductsHeader`

### Motion
- `PageTransition`, `FadeInView`, `SkeletonCard` (Framer Motion)

### Providers
- `ThemeProvider` (next-themes, **defaultTheme: "light"**, enableSystem: false)
- `UIProvider` (Supabase auth listener + wishlist clear on logout + sync user pada SIGNED_IN/TOKEN_REFRESHED)

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
- **Default theme**: light (visitor baru langsung putih, dark mode opt-in via toggle splash)

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
- **Splash linktree** (`/` & `/links`) — 5 channel equal (WA/IG/TikTok/Shopee/Web), animated background blobs, theme toggle, Claude-inspired light mode.
- Landing storefront `/home` (Hero, Featured, NewArrivals, Categories, Promo)
- Listing & detail produk + filter + search multi-strategi (token + alias fashion ID + ILIKE)
- **Image zoom Shopee-style**: inner hover zoom 2.2× + lightbox full-screen (mobile pinch + keyboard ESC/← →)
- Wishlist (toggle, persisted, sync server, auth-gated, clear on logout)
- Cart + **checkout flow lengkap** (form alamat → POST /api/orders → clear cart → redirect /orders)
- Auth: login/forgot/reset, register sync ke DB, role-based redirect
- **Sync user on login** — UIProvider listen `SIGNED_IN` & `TOKEN_REFRESHED` → POST /api/auth/sync-user
- Maintenance mode (toggle dari admin → block storefront via `(main)/layout.tsx`)
- Halaman pesanan: `/orders` list, `/orders/[id]` detail
- **Tracking pengiriman manual**: shipping info card + timeline + tombol konfirmasi terima
- **Halaman /account** — profile card + inline edit (nama, phone) via PATCH /api/profile
- **Floating WhatsApp livechat** + **4-channel social bar** (WA, IG, TikTok, Shopee) di Footer + halaman `/contact` rewrite — single source of truth di `lib/social.ts`
- **Maintenance mode tag-based cache** — toggle dari Admin Panel langsung effective via `revalidateTag("maintenance")`, polling page maintenance hard-reload supaya tidak ke-loop
- **Default theme light** — visitor baru selalu putih, dark mode opt-in via toggle splash

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

### 2026-05-02 — Splash Linktree + Animasi + Theme Toggle (Claude-Style Light)
**Yang dikerjakan:**
- **Routing baru**: `/` jadi splash linktree (5 channel equal: WA/IG/TikTok/Shopee/Web), `/home` jadi storefront home (yang dulu di `/`), `/links` alias splash untuk bio sosmed. Update semua navigasi (Navbar logo, BottomNav, logout redirect, dst.) dari `/` ke `/home`.
- **Splash design Claude-inspired**: pure white background, 4 floating pastel blobs (violet/pink/amber/sky) blur-3xl 30-50% opacity dengan animasi slow 14-22s loop, logo glow pulse, brand name gradient shifting, sparkles tagline pill, soft elevated shadows (bukan border tebal), ArrowUpRight icon, easing organic `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Theme toggle splash**: pill button kanan-atas dengan `useTheme()` next-themes. `attribute: "class"` jadi toggle di splash sync ke seluruh website (storefront ikut tema saat user navigate).
- **Default theme `light`**: ThemeProvider config `defaultTheme: "light"`, `enableSystem: false`. Visitor baru selalu masuk dengan light mode. Dark masih ada via toggle.
- **Hapus channel Tokopedia**: type `SocialChannel.id` union, `SOCIAL_CHANNELS`, switch case di SplashLinkTree/SocialLinks/contact, file `components/icons/BrandIcons.tsx` (TokopediaIcon custom). Sekarang 4 channel saja.
- **Update handle TikTok/Shopee**: `@lumaraid` (bukan `lumara.id`), URL pakai TikTok deep link.
- **Ganti nomor WA brand**: ke `0852-8573-3391` (display) / `6285285733391` (wa.me). Sweep semua hardcoded di MobileApp + Refrens mockup.
- **UTM tracking**: helper `withUtm()` di `lib/social.ts`, splash auto-append `utm_source=lumara_splash&utm_medium=splash_linktree` ke link Shopee/IG/TikTok.
- **Image zoom Shopee-style**: `ProductImageZoom.tsx` — inner hover zoom 2.2× (transform-origin mengikuti cursor) + lightbox full-screen modal (touch-action pinch-zoom + keyboard ESC/← →).
- **Image cards no crop**: ProductCard & ProductDetail pakai `object-contain` di `aspect-[3/4]` container — foto upload tidak ke-crop kepala/kaki, gradient soft sebagai padding alami.
- **Fix delete kategori 400 (FK constraint)**: `CategoryModel.delete` dan `ProductModel.delete` pre-check children count, throw error message yang jelas. Frontend `*Table.tsx` extract `response.data.error` ke toast.
- **Fix maintenance bugs**: tag-based cache invalidation (`revalidateTag("maintenance")` di PATCH), hard reload bukan `router.replace` (cegah loop), polling 30s pause saat `document.hidden`.

### 2026-05-02 — Social Channels + Hapus Link Admin Panel + Doc Refresh
**Yang dikerjakan:**
- **Floating WhatsApp + 5-channel social bar**: file baru `lib/social.ts` (single source of truth), `components/shared/FloatingWhatsApp.tsx`, `components/shared/SocialLinks.tsx`, `components/icons/BrandIcons.tsx` (custom Tokopedia SVG karena react-icons belum ada). Footer + `/contact` rewrite total dengan grid 5 channel.
- **Tooling**: tambah `react-icons` v5.6 di MobileApp (tree-shake per import).
- **Hapus link Admin Panel** dari `Navbar.tsx` (mobile drawer) + `import LayoutDashboard` dihapus + `NEXT_PUBLIC_ADMIN_URL` dihapus dari `.env.example`. Admin Panel tetap accessible langsung via `https://admni-panel.onrender.com` — buyer tidak akan lihat link-nya.
- **CLAUDE.md upgrade**: tambah section **Bahasa & Tooling**, **Tipe Data Inti (TypeScript)**, **Logika Bisnis Utama** (7 alur kunci dengan pseudocode), **Validasi** (form/server/service/DB), **Environment Variables** lengkap.
- **Maintenance fix sebelumnya** sudah live: tag-based cache, hard reload, visibility-aware polling.

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
