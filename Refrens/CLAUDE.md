# lumara-id — AI Agent Prompt Guide

> E-commerce Modest Fashion Indonesia
> Stack: Next.js 16 · Prisma · Supabase · Render
> Pattern: OOP + MVC · Mobile-first 390px

---

## Cara Pakai

1. Buka Claude Code
2. Copy prompt sesuai task yang dikerjakan
3. Paste ke Claude Code terminal
4. Copy output ke file yang sesuai di repo
5. Test di browser
6. Lanjut ke prompt berikutnya **secara berurutan**

> ⚠️ Jangan loncat phase. Setiap phase adalah fondasi phase berikutnya.

---

## Design System Reference

```
Primary violet:    #630ED4    → CTA, button, active state
Primary hover:     #7C3AED    → hover state
Primary container: #EDE0FF    → soft violet bg
Secondary fuchsia: #824790    → secondary elements
Secondary container:#F3AEFF   → soft fuchsia bg
Background:        #F9F9FF    → page background
Surface low:       #F0F3FF    → section alternate
Surface:           #E7EEFE    → elevated surface
Card:              #FFFFFF    → card background
Card border:       #EDE9FE    → card border
Text primary:      #151C27    → headings
Text secondary:    #4A4455    → body text
Text muted:        #7B7487    → muted/placeholder
Outline:           #CCC3D8    → borders, dividers
Success:           #4CAF7D    → stok tersedia
Error:             #BA1A1A    → error state
Rating gold:       #F0B429    → bintang rating
Dark bg:           #0F0A1E    → dark mode background
Dark surface:      #1A1330    → dark mode surface
Dark card:         #221A3A    → dark mode card
Dark card border:  #3B2F6B    → dark mode border

Font:              Plus Jakarta Sans
Card radius:       14px
Button radius:     12px
Chip radius:       999px (pill)
```

---

## Status Checklist

```
PHASE 1 — PROJECT SETUP
  [ ] 1.1 Init Project
  [ ] 1.2 Design System Token
  [ ] 1.3 Prisma Schema
  [ ] 1.4 Database Connection

PHASE 2 — OOP MODEL LAYER
  [ ] 2.1 BaseModel
  [ ] 2.2 ProductModel
  [ ] 2.3 CategoryModel
  [ ] 2.4 UserModel
  [ ] 2.5 WishlistModel
  [ ] 2.6 ReviewModel
  [ ] 2.7 OrderModel

PHASE 3 — SERVICE LAYER
  [ ] 3.1 ProductService
  [ ] 3.2 AuthService
  [ ] 3.3 WishlistService
  [ ] 3.4 SearchService

PHASE 4 — API ROUTES
  [ ] 4.1 Product API
  [ ] 4.2 Product Detail API
  [ ] 4.3 Category API
  [ ] 4.4 Wishlist API
  [ ] 4.5 Search API
  [ ] 4.6 Auth API

PHASE 5 — GLOBAL COMPONENTS
  [ ] 5.1 Navbar + BottomNav
  [ ] 5.2 Footer
  [ ] 5.3 FilterSheet
  [ ] 5.4 ProductCard + ProductGrid
  [ ] 5.5 SearchBar
  [ ] 5.6 Zustand Stores

PHASE 6 — HALAMAN
  [ ] 6.1 Landing Page
  [ ] 6.2 Product List Page
  [ ] 6.3 Product Detail Page
  [ ] 6.4 Category Page
  [ ] 6.5 Search Results Page
  [ ] 6.6 Login Page
  [ ] 6.7 Register Page
  [ ] 6.8 Forgot Password Page
  [ ] 6.9 Wishlist Page
  [ ] 6.10 Error Pages

PHASE 7 — FINISHING
  [ ] 7.1 Dark Mode
  [ ] 7.2 Loading States
  [ ] 7.3 Metadata & SEO
  [ ] 7.4 Environment Variables
  [ ] 7.5 Deploy ke Render
```

---

# PHASE 1 — PROJECT SETUP

---

## PROMPT 1.1 — Init Project

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript strict,
Tailwind CSS 4, Prisma, Supabase, Render.
REPO: syahrulramelan1/howto-id

TASK:
Setup project Next.js 16 dari awal dengan konfigurasi:

1. Init project dengan create-next-app:
   - TypeScript strict mode
   - Tailwind CSS
   - App Router
   - src/ directory: NO
   - import alias: @/*

2. Install semua dependencies:
   shadcn/ui, @prisma/client, prisma,
   @supabase/supabase-js, @supabase/ssr,
   zustand, framer-motion, react-hook-form,
   zod, lucide-react, next-themes, sonner,
   clsx, tailwind-merge, class-variance-authority

3. Init shadcn/ui dengan config:
   style: default, baseColor: slate,
   cssVariables: true

4. Konfigurasi tailwind.config.ts dengan
   font Plus Jakarta Sans

5. Buatkan .env.local template dengan:
   DATABASE_URL, DIRECT_URL,
   NEXT_PUBLIC_SUPABASE_URL,
   NEXT_PUBLIC_SUPABASE_ANON_KEY,
   SUPABASE_SERVICE_ROLE_KEY

RULES:
- Semua kode TypeScript strict
- Tidak ada any type
- Gunakan named exports kecuali page/layout

OUTPUT:
Tampilkan semua file yang dibuat/dimodifikasi
beserta isinya secara lengkap dan siap copy-paste.
```

---

## PROMPT 1.2 — Design System Token

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript strict,
Tailwind CSS 4, next-themes, Sonner.

TASK:
Buatkan design system token untuk lumara-id.

1. Update app/globals.css dengan CSS variables:

   LIGHT MODE:
   --primary: #630ED4
   --primary-hover: #7C3AED
   --primary-container: #EDE0FF
   --secondary: #824790
   --secondary-container: #F3AEFF
   --background: #F9F9FF
   --surface-low: #F0F3FF
   --surface: #E7EEFE
   --surface-high: #E2E8F8
   --card: #FFFFFF
   --card-border: #EDE9FE
   --text-primary: #151C27
   --text-secondary: #4A4455
   --text-muted: #7B7487
   --outline: #CCC3D8
   --success: #4CAF7D
   --error: #BA1A1A
   --rating: #F0B429

   DARK MODE (.dark class):
   --background: #0F0A1E
   --surface-low: #1A1330
   --surface: #221A3A
   --card: #221A3A
   --card-border: #3B2F6B
   --text-primary: #EBF1FF
   --text-secondary: #C5B8E0
   --text-muted: #9D95B0
   --outline: #4A3A6B

2. Update tailwind.config.ts extend colors
   dengan semua token di atas menggunakan
   hsl(var(--token)) pattern

3. Setup font Plus Jakarta Sans via
   next/font/google di app/layout.tsx

4. Buatkan components/providers/ThemeProvider.tsx
   menggunakan next-themes

5. Update app/layout.tsx dengan:
   - Font variable applied ke html element
   - ThemeProvider wrapper
   - Metadata dasar lumara-id
   - Sonner Toaster

RULES:
- CSS variables harus work di light dan dark mode
- Font harus preloaded dengan display: swap
- ThemeProvider defaultTheme: system
- enableSystem: true

OUTPUT:
Tampilkan semua file lengkap siap copy-paste.
```

---

## PROMPT 1.3 — Prisma Schema

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Prisma,
Supabase PostgreSQL.

TASK:
Buatkan prisma/schema.prisma lengkap untuk lumara-id.

Model yang dibutuhkan:

1. User
   id, email (unique), name, avatar, phone,
   role (enum: USER/ADMIN),
   createdAt, updatedAt
   Relations: orders, wishlist, reviews

2. Category
   id, name, slug (unique), image,
   description, createdAt
   Relations: products

3. Product
   id, name, slug (unique), description,
   price (Int), originalPrice (Int?),
   images (String[]), stock (Int),
   categoryId, sizes (String[]),
   colors (String[]),
   rating (Float default 0),
   reviewCount (Int default 0),
   isFeatured (Boolean default false),
   isNew (Boolean default false),
   createdAt, updatedAt
   Relations: category, reviews,
   wishlist, orderItems

4. Order
   id, userId,
   status (enum: PENDING/PAID/PROCESSING/
   SHIPPED/DELIVERED/CANCELLED),
   total (Int), shippingAddress (Json),
   paymentMethod (String?),
   createdAt, updatedAt
   Relations: user, items

5. OrderItem
   id, orderId, productId,
   quantity (Int), size (String),
   color (String), price (Int)
   Relations: order, product

6. Wishlist
   id, userId, productId, createdAt
   Relations: user, product
   Unique constraint: [userId, productId]

7. Review
   id, userId, productId,
   rating (Int 1-5), comment (String),
   images (String[]), createdAt
   Relations: user, product

Tambahkan:
- Index pada slug, categoryId, userId
- @@map untuk snake_case table names
- generator client dengan output path

RULES:
- Gunakan PostgreSQL provider
- Semua id menggunakan @default(cuid())
- createdAt: @default(now())
- updatedAt: @updatedAt

OUTPUT:
Tampilkan prisma/schema.prisma lengkap
siap copy-paste.
```

---

## PROMPT 1.4 — Database Connection

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript strict,
Prisma, Supabase, @supabase/ssr.

TASK:
Buatkan koneksi database dan utility files.

1. lib/prisma.ts
   Singleton PrismaClient pattern untuk
   mencegah multiple connections di development.
   Export: prisma (PrismaClient instance)

2. lib/supabase.ts
   Dua function:
   - createClientComponent()
     → browser client dengan createBrowserClient
   - createServerComponent()
     → server client dengan createServerClient
     menggunakan cookies dari next/headers

3. lib/utils.ts
   Helper functions:
   - cn() → clsx + tailwind-merge
   - formatPrice(price: number): string
     → "Rp 450.000" format IDR
   - formatDate(date: Date): string
     → Indonesian locale
   - calculateDiscount(original, current): number
     → return percentage integer
   - slugify(text: string): string
     → string ke URL slug lowercase
   - truncate(text: string, length: number): string
     → truncate dengan ellipsis

4. types/index.ts
   TypeScript interfaces:
   - ProductWithCategory (Product + category)
   - ProductWithReviews (Product + reviews + user)
   - CartItem (productId, name, price, qty,
     size, color, image)
   - FilterParams (category, search, minPrice,
     maxPrice, sortBy, page, limit)
   - PaginationResult<T> (data, total,
     totalPages, currentPage, hasNext, hasPrev)
   - ApiResponse<T> (success, data?, error?)

RULES:
- Prisma singleton menggunakan globalThis
- Supabase menggunakan environment variables
- Semua function harus fully typed
- Export semua types dari types/index.ts

OUTPUT:
Tampilkan semua 4 file lengkap siap copy-paste.
```

---

# PHASE 2 — OOP MODEL LAYER

---

## PROMPT 2.1 — BaseModel

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Prisma.
PATTERN: OOP — Abstract Base Class.

TASK:
Buatkan lib/models/BaseModel.ts

Requirements:
1. Abstract class BaseModel<T>
2. Protected abstract property: tableName string
3. Protected property: prisma instance

4. Public methods (semua async):
   findById(id: string): Promise<T | null>
   findAll(params?: object): Promise<T[]>
   create(data: Partial<T>): Promise<T>
   update(id: string, data: Partial<T>): Promise<T>
   delete(id: string): Promise<T>
   count(where?: object): Promise<number>

5. Protected method:
   handleError(error: unknown, context: string): never
   → throw new Error dengan pesan Indonesia

6. Implementasi menggunakan:
   (prisma as any)[this.tableName].method()
   untuk dynamic table access

OOP PRINCIPLES:
- Abstraction: sembunyikan detail Prisma
- Encapsulation: error handling terpusat
- Inheritance: child class extend ini

RULES:
- Tidak bisa diinstansiasi langsung (abstract)
- Semua method async dengan try/catch
- Error message dalam Bahasa Indonesia
- TypeScript strict, minimal any

OUTPUT:
Tampilkan lib/models/BaseModel.ts lengkap.
```

---

## PROMPT 2.2 — ProductModel

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Prisma.
PATTERN: OOP — ProductModel extends BaseModel.

PREREQUISITE:
lib/models/BaseModel.ts sudah ada.

TASK:
Buatkan lib/models/ProductModel.ts

1. class ProductModel extends BaseModel<Product>
2. tableName = 'product'

3. Override findAll(params?: FilterParams)
   Filter: category slug, search (contains),
   minPrice, maxPrice, sortBy
   Sort options:
     terbaru → createdAt desc
     terlaris → reviewCount desc
     harga-terendah → price asc
     harga-tertinggi → price desc
     rating → rating desc
   Include: category relation
   Support: skip/take pagination

4. Custom methods:
   findBySlug(slug: string)
   → include category + reviews.user + limit reviews 10

   findFeatured(limit = 8)
   → where isFeatured: true

   findByCategory(categoryId: string, limit = 12)
   → filter categoryId, include category

   findRelated(productId: string, categoryId: string)
   → same category, NOT current id, limit 4

   updateRating(productId: string): Promise<void>
   → aggregate avg dari reviews
   → update product.rating dan reviewCount

5. export default new ProductModel()

RULES:
- Semua query include category minimal
- Price dalam Integer Rupiah
- Import Product type dari @prisma/client

OUTPUT:
Tampilkan lib/models/ProductModel.ts lengkap.
```

---

## PROMPT 2.3 — CategoryModel

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Prisma.
PATTERN: OOP — CategoryModel extends BaseModel.

PREREQUISITE:
lib/models/BaseModel.ts sudah ada.

TASK:
Buatkan lib/models/CategoryModel.ts

1. class CategoryModel extends BaseModel<Category>
2. tableName = 'category'

3. Override findAll()
   → orderBy name asc
   → include _count products

4. Custom methods:
   findBySlug(slug: string): Promise<Category | null>
   → include products count

   findWithProductCount(): Promise<CategoryWithCount[]>
   → semua kategori + jumlah produk per kategori

5. export default new CategoryModel()

RULES:
- Import Category dari @prisma/client
- Type CategoryWithCount: Category & { _count: { products: number } }

OUTPUT:
Tampilkan lib/models/CategoryModel.ts lengkap.
```

---

## PROMPT 2.4 — UserModel

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Prisma.
PATTERN: OOP — UserModel extends BaseModel.

PREREQUISITE:
lib/models/BaseModel.ts sudah ada.

TASK:
Buatkan lib/models/UserModel.ts

1. class UserModel extends BaseModel<User>
2. tableName = 'user'

3. Custom methods:
   findByEmail(email: string): Promise<User | null>

   updateProfile(id: string, data: {
     name?: string
     phone?: string
     avatar?: string
   }): Promise<User>

   findWithOrders(id: string)
   → include orders dengan items

4. export default new UserModel()

RULES:
- Jangan expose password hash jika ada
- Import User dari @prisma/client

OUTPUT:
Tampilkan lib/models/UserModel.ts lengkap.
```

---

## PROMPT 2.5 — WishlistModel

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Prisma.
PATTERN: OOP — WishlistModel extends BaseModel.

PREREQUISITE:
lib/models/BaseModel.ts sudah ada.

TASK:
Buatkan lib/models/WishlistModel.ts

1. class WishlistModel extends BaseModel<Wishlist>
2. tableName = 'wishlist'

3. Custom methods:
   findByUser(userId: string)
   → include product.category
   → orderBy createdAt desc

   toggle(userId: string, productId: string): Promise<boolean>
   → cek existing, jika ada: delete return false
   → jika tidak ada: create return true

   isWishlisted(userId: string, productId: string): Promise<boolean>
   → findFirst where userId + productId
   → return boolean

   countByUser(userId: string): Promise<number>
   → count wishlist milik user

   removeByProduct(productId: string): Promise<void>
   → hapus semua wishlist untuk product ini

4. export default new WishlistModel()

OUTPUT:
Tampilkan lib/models/WishlistModel.ts lengkap.
```

---

## PROMPT 2.6 — ReviewModel

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Prisma.
PATTERN: OOP — ReviewModel extends BaseModel.

PREREQUISITE:
lib/models/BaseModel.ts sudah ada.

TASK:
Buatkan lib/models/ReviewModel.ts

1. class ReviewModel extends BaseModel<Review>
2. tableName = 'review'

3. Custom methods:
   findByProduct(productId: string, limit = 10)
   → include user (select: id, name, avatar)
   → orderBy createdAt desc

   findByUser(userId: string)
   → include product (select: id, name, images)

   calcAverageRating(productId: string): Promise<number>
   → aggregate avg rating
   → return 0 jika belum ada review

   hasUserReviewed(userId: string, productId: string): Promise<boolean>
   → cek apakah user sudah review produk ini

4. export default new ReviewModel()

OUTPUT:
Tampilkan lib/models/ReviewModel.ts lengkap.
```

---

## PROMPT 2.7 — OrderModel

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Prisma.
PATTERN: OOP — OrderModel extends BaseModel.

PREREQUISITE:
lib/models/BaseModel.ts sudah ada.

TASK:
Buatkan lib/models/OrderModel.ts

1. class OrderModel extends BaseModel<Order>
2. tableName = 'order'

3. Custom methods:
   findByUser(userId: string)
   → include items.product
   → orderBy createdAt desc

   findWithItems(orderId: string)
   → include items dengan product detail
   → include user

   updateStatus(orderId: string, status: OrderStatus): Promise<Order>
   → update status field

   findRecent(limit = 5)
   → untuk admin dashboard
   → include user + items count

4. export default new OrderModel()

RULES:
- Import Order, OrderStatus dari @prisma/client

OUTPUT:
Tampilkan lib/models/OrderModel.ts lengkap.
```

---

# PHASE 3 — SERVICE LAYER

---

## PROMPT 3.1 — ProductService

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict.
PATTERN: OOP Service Layer.

PREREQUISITE:
- lib/models/ProductModel.ts sudah ada
- lib/models/CategoryModel.ts sudah ada
- lib/utils.ts sudah ada (formatPrice, calculateDiscount)
- types/index.ts sudah ada (FilterParams, PaginationResult)

TASK:
Buatkan lib/services/ProductService.ts

1. class ProductService

2. Private properties:
   private productModel = ProductModel (singleton)
   private categoryModel = CategoryModel (singleton)

3. Public methods:

   async getProductList(params: FilterParams)
   : Promise<PaginationResult<ProductWithCategory>>
   → delegate ke productModel.findAll()
   → handle pagination skip/take
   → return data + pagination info

   async getProductDetail(slug: string)
   : Promise<ProductWithReviews>
   → delegate ke productModel.findBySlug()
   → throw error 'Produk tidak ditemukan'
     jika null

   async getFeaturedProducts(limit = 8)
   → delegate ke productModel.findFeatured()

   async getRelatedProducts(productId, categoryId)
   → delegate ke productModel.findRelated()

   async getAllCategories()
   → delegate ke categoryModel.findWithProductCount()

   formatPrice(price: number): string
   → delegate ke utils formatPrice()

   calculateDiscount(original: number, current: number): number
   → delegate ke utils calculateDiscount()

   isOnSale(product: ProductWithCategory): boolean
   → return true jika originalPrice exists
     dan originalPrice > price

4. export default new ProductService()

RULES:
- TIDAK ADA Prisma query langsung di Service
- Semua data access melalui Model layer
- Error messages dalam Bahasa Indonesia
- Singleton pattern

OUTPUT:
Tampilkan lib/services/ProductService.ts lengkap.
```

---

## PROMPT 3.2 — AuthService

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict,
Supabase Auth, @supabase/ssr.

PREREQUISITE:
- lib/models/UserModel.ts sudah ada
- lib/supabase.ts sudah ada

TASK:
Buatkan lib/services/AuthService.ts

1. class AuthService

2. Public methods:

   async login(email: string, password: string)
   → signInWithPassword via Supabase
   → throw error jika gagal
   → return session

   async loginWithGoogle()
   → signInWithOAuth provider: google
   → redirectTo: /auth/callback

   async register(data: {
     email: string
     password: string
     name: string
     phone?: string
   })
   → signUp via Supabase
   → create user record via UserModel
   → throw error jika email sudah ada

   async logout()
   → signOut via Supabase

   async resetPassword(email: string)
   → resetPasswordForEmail via Supabase
   → redirectTo: /auth/reset-password

   async getCurrentUser()
   → getUser dari Supabase server client
   → return User dari UserModel jika ada

   async updateProfile(userId: string, data: object)
   → delegate ke UserModel.updateProfile()

3. export default new AuthService()

RULES:
- Gunakan createServerComponent() untuk server
- Gunakan createClientComponent() untuk client
- Error messages dalam Bahasa Indonesia
- Jangan expose service role key

OUTPUT:
Tampilkan lib/services/AuthService.ts lengkap.
```

---

## PROMPT 3.3 — WishlistService

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict.
PATTERN: OOP Service Layer.

PREREQUISITE:
- lib/models/WishlistModel.ts sudah ada
- types/index.ts sudah ada

TASK:
Buatkan lib/services/WishlistService.ts

1. class WishlistService

2. Private properties:
   private wishlistModel = WishlistModel

3. Public methods:

   async getUserWishlist(userId: string)
   → delegate ke wishlistModel.findByUser()
   → return dengan product detail

   async toggleWishlist(userId: string, productId: string)
   : Promise<{ isWishlisted: boolean, message: string }>
   → delegate ke wishlistModel.toggle()
   → return status + pesan Indonesia

   async isProductWishlisted(userId, productId): Promise<boolean>
   → delegate ke wishlistModel.isWishlisted()

   async getWishlistCount(userId: string): Promise<number>
   → delegate ke wishlistModel.countByUser()

4. export default new WishlistService()

OUTPUT:
Tampilkan lib/services/WishlistService.ts lengkap.
```

---

## PROMPT 3.4 — SearchService

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Prisma.
PATTERN: OOP Service Layer.

PREREQUISITE:
- lib/models/ProductModel.ts sudah ada
- lib/models/CategoryModel.ts sudah ada
- lib/services/ProductService.ts sudah ada

TASK:
Buatkan lib/services/SearchService.ts

1. class SearchService

2. Private properties:
   private productModel = ProductModel
   private productService = ProductService

3. Public methods:

   async searchProducts(query: string, params?: FilterParams)
   → search by name CONTAINS query (case insensitive)
   → return PaginationResult

   async getSuggestions(query: string, limit = 5): Promise<string[]>
   → return array product names yang match
   → untuk autocomplete search bar

   async getRelatedKeywords(query: string): Promise<string[]>
   → return kategori dan tags yang relevan
   → untuk "Pencarian Terkait" section

   async getPopularSearches(limit = 8): Promise<string[]>
   → return hardcoded popular keywords
   → atau dari product names terlaris

4. export default new SearchService()

OUTPUT:
Tampilkan lib/services/SearchService.ts lengkap.
```

---

# PHASE 4 — API ROUTES

---

## PROMPT 4.1 — Product API

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript strict.
PATTERN: API Route sebagai Controller.

PREREQUISITE:
- lib/services/ProductService.ts sudah ada
- types/index.ts sudah ada

TASK:
Buatkan dua API routes:

1. app/api/produk/route.ts
   GET /api/produk
   Query params: category, search, minPrice,
   maxPrice, sortBy, page, limit

   Response sukses:
   { success: true, data: Product[],
     pagination: { total, totalPages,
     currentPage, hasNext, hasPrev } }

   Response error:
   { success: false, error: string }

2. app/api/produk/[id]/route.ts
   GET /api/produk/[id] (by slug)

   Response sukses:
   { success: true, data: ProductWithReviews }

   Response error 404:
   { success: false, error: 'Produk tidak ditemukan' }

RULES:
- Gunakan NextRequest dan NextResponse
- Validasi query params dengan Zod
- Delegasi ke ProductService
- HTTP status: 200, 400, 404, 500
- Tidak ada business logic di route file

OUTPUT:
Tampilkan kedua file route.ts lengkap.
```

---

## PROMPT 4.2 — Category API

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript strict.
PATTERN: API Route sebagai Controller.

PREREQUISITE:
- lib/models/CategoryModel.ts sudah ada

TASK:
Buatkan app/api/kategori/route.ts

GET /api/kategori
→ return semua kategori dengan product count

Response:
{ success: true, data: CategoryWithCount[] }

Buatkan juga app/api/kategori/[slug]/route.ts
GET /api/kategori/[slug]
→ return detail kategori by slug

RULES:
- Sama seperti Product API
- Gunakan CategoryModel langsung (tidak perlu Service)

OUTPUT:
Tampilkan kedua file route.ts lengkap.
```

---

## PROMPT 4.3 — Wishlist API

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript strict,
Supabase Auth.

PREREQUISITE:
- lib/services/WishlistService.ts sudah ada
- lib/supabase.ts sudah ada

TASK:
Buatkan app/api/wishlist/route.ts

GET /api/wishlist
→ return wishlist milik user yang login
→ Protected: harus authenticated

POST /api/wishlist
Body: { productId: string }
→ toggle wishlist (add/remove)
→ return { isWishlisted, message }
→ Protected: harus authenticated

Auth check:
→ Gunakan Supabase server client
→ getUser() untuk validasi session
→ Return 401 jika tidak authenticated:
  { success: false, error: 'Silakan masuk terlebih dahulu' }

RULES:
- Validasi body dengan Zod
- Delegasi ke WishlistService
- Error 401 jika tidak login

OUTPUT:
Tampilkan file route.ts lengkap.
```

---

## PROMPT 4.4 — Search API

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript strict.

PREREQUISITE:
- lib/services/SearchService.ts sudah ada

TASK:
Buatkan dua search routes:

1. app/api/cari/route.ts
   GET /api/cari?q=gamis&page=1&limit=12
   → full search dengan filter dan pagination
   → delegasi ke SearchService.searchProducts()

2. app/api/cari/suggestions/route.ts
   GET /api/cari/suggestions?q=gam
   → autocomplete suggestions
   → delegasi ke SearchService.getSuggestions()
   → return array of strings

RULES:
- Query 'q' wajib ada, return 400 jika kosong
- Suggestions limit 5 items
- Response cepat untuk suggestions

OUTPUT:
Tampilkan kedua file route.ts lengkap.
```

---

# PHASE 5 — GLOBAL COMPONENTS

---

## PROMPT 5.1 — Navbar + BottomNav

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript, Tailwind CSS 4,
Lucide React, Zustand, next/navigation.

DESIGN SYSTEM:
Primary: #630ED4, Background: #F9F9FF
Dark bg: #0F0A1E, Card border: #EDE9FE
Font: Plus Jakarta Sans, Mobile-first 390px

TASK:
Buatkan dua layout components:

1. components/layout/Navbar.tsx
   'use client' component
   - Sticky top-0, z-50, height 56px
   - Background white + backdrop-blur saat scroll
   - Border bottom 1px card-border
   - Logo: "lumara" text-primary + ".id" primary
     font Plus Jakarta Sans, weight 700, 20px
   - Right icons: Search, Heart, ShoppingBag
     dari lucide-react, size 22px
   - Cart count badge: dari cartStore Zustand
     Circle 16px, bg primary, white text 10px
     Position absolute top-right cart icon
   - Wishlist count: sama dari wishlistStore
   - Tap search: router.push('/cari')
   - Dark mode support penuh
   - Scroll listener untuk blur effect

2. components/layout/BottomNav.tsx
   'use client' component
   - Fixed bottom-0, z-50, height 60px
   - Background card + border-top card-border
   - Safe area: pb-safe atau padding-bottom env()
   - 5 tabs: Home, Grid2x2, Heart, ShoppingCart, User
     (icons dari lucide-react)
   - Labels: Beranda, Katalog, Wishlist,
     Keranjang, Akun
   - Active detection: usePathname()
     / → Beranda active
     /produk → Katalog active
     /wishlist → Wishlist active
     /keranjang → Keranjang active
     /akun → Akun active
   - Active: icon filled primary + label primary
   - Default: icon outline muted + label muted
   - Cart badge dari cartStore
   - Tap animation: scale 0.9 transition

RULES:
- Gunakan CSS variables untuk semua warna
- usePathname untuk active state
- Zustand store untuk badge counts
- Icons dari lucide-react only

OUTPUT:
Tampilkan kedua file component lengkap.
```

---

## PROMPT 5.2 — Footer

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript, Tailwind CSS 4,
Lucide React.

DESIGN SYSTEM:
Footer background: #151C27 (selalu dark)
Text: #9D95B0, Link hover: white
Primary: #630ED4

TASK:
Buatkan components/layout/Footer.tsx

Structure:
1. Background #151C27 selalu (light + dark mode)
2. Padding: 32px 16px 24px

3. Top section:
   - Logo "lumara.id" white
   - Tagline "Modest Fashion Premium"
     color #9D95B0, 12px

4. Accordion links (margin-top 24px):
   3 sections collapsible dengan useState:
   - Produk: Gamis, Hijab, Abaya,
     Aksesoris, Bundle
   - Layanan: Cara Pemesanan, Panduan Ukuran,
     Lacak Pesanan, Retur & Refund
   - Perusahaan: Tentang Kami, Blog,
     Karir, Hubungi Kami

   Section header: white 14px weight 600
   + ChevronDown icon rotates on open
   Links: #9D95B0 13px, hover white, py-2

5. Social icons (margin-top 24px):
   Label "Ikuti Kami" #9D95B0 13px
   3 icons: Instagram, Music2 (TikTok), MessageCircle (WA)
   Each: 40px circle
   Instagram: bg #2D1F4A, icon #D2BBFF
   TikTok: bg #1A1330, icon white
   WhatsApp: bg #1A3D2A, icon #4CAF7D

6. Bottom bar:
   Border-top #2A313D, padding-top 16px
   "© 2026 lumara-id. Semua hak dilindungi."
   11px #6B6480, text-center

RULES:
- Server Component (tidak perlu 'use client'
  kecuali accordion butuh state)
- Gunakan next/link untuk semua link

OUTPUT:
Tampilkan components/layout/Footer.tsx lengkap.
```

---

## PROMPT 5.3 — FilterSheet

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript, Tailwind CSS 4,
shadcn/ui Sheet, Lucide React.

DESIGN SYSTEM:
Primary: #630ED4, Card: #FFFFFF
Card border: #EDE9FE, Chip radius: 999px

TASK:
Buatkan components/shared/FilterSheet.tsx

Props interface:
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterParams) => void
  initialFilters?: FilterParams
  categories: CategoryWithCount[]

Structure (Bottom Sheet dari bawah):
1. Gunakan shadcn Sheet component
   side="bottom"
   border-radius: 20px 20px 0 0

2. Handle bar top center:
   40x4px pill, bg outline, margin auto

3. Header:
   "Filter Produk" 16px weight 700
   "Reset" link right primary color
   border-bottom

4. Scroll content area (max-h 70vh overflow-y-auto):

   Section KATEGORI (accordion):
   → list category pills flex-wrap
   → active: bg primary text white
   → default: border outline text secondary

   Section RENTANG HARGA:
   → dual range slider (gunakan shadcn Slider)
   → show current range "Rp X — Rp Y"
   → format IDR

   Section UKURAN:
   → chips: S M L XL XXL XXXL Freesize
   → multi-select
   → active: bg primary-container border primary

   Section WARNA:
   → color swatches 28px circles
   → 8 warna: Dusty Pink, Sage, Navy,
     Black, White, Maroon, Cream, Olive
   → active: border 2px primary + outer ring

   Section RATING:
   → radio buttons: 5★, 4★+, 3★+, Semua

   Section KETERSEDIAAN:
   → checkboxes: Tersedia, Pre-Order

5. Sticky bottom bar:
   "Reset" ghost button 40% width
   "Terapkan Filter" primary button 60%

RULES:
- Controlled component, semua state dari props
- Format price dengan formatPrice() dari utils
- Gunakan shadcn Slider untuk range price

OUTPUT:
Tampilkan components/shared/FilterSheet.tsx lengkap.
```

---

## PROMPT 5.4 — ProductCard + ProductGrid

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript, Tailwind CSS 4,
Framer Motion, Lucide React, next/image, Zustand.

DESIGN SYSTEM:
Primary: #630ED4, Card border: #EDE9FE
Card radius: 14px, Button radius: 12px
Chip radius: 999px, Mobile-first 390px

TASK:
Buatkan dua product components:

1. components/product/ProductCard.tsx

Props:
  product: ProductWithCategory
  showAddToCart?: boolean (default true)
  className?: string

Structure:
  Container: bg card, border card-border,
  radius 14px, overflow hidden,
  hover: translateY(-2px) framer-motion

  Image area (aspect-ratio 3/4):
  - next/image fill object-cover
  - 1px inner border rgba violet 0.08
  - Badges absolute top-left stacked gap 4px:
    Category: bg primary text white pill 10px
    TERLARIS: bg primary-container text primary
    BARU: same style
    Discount "-X%": bg secondary-container
                    text secondary pill
  - Wishlist heart top-right absolute:
    36px circle white opacity-90
    border card-border, heart icon 16px
    Filled red jika wishlisted (wishlistStore)
    onClick: toggle wishlist

  Card body padding 10px:
  - Name: 13px weight 600, line-clamp-2
  - Rating: stars gold + score 11px
  - Price: 14px weight 700 text-primary
  - Strikethrough: 11px text-muted
  - Tambah button: full width h-36px
    bg primary text white radius 12px
    ShoppingCart icon 14px + "Tambah"
    onClick: addToCart (cartStore)

  Skeleton variant:
  - Prop: isLoading?: boolean
  - Animate pulse dengan bg surface-low

2. components/product/ProductGrid.tsx

Props:
  products: ProductWithCategory[]
  isLoading?: boolean
  columns?: number (default 2)
  className?: string

Structure:
  grid grid-cols-2 gap-3
  Map products → ProductCard
  Jika isLoading: map 6 skeleton cards

RULES:
- Optimistic UI untuk wishlist toggle
- Gunakan Sonner toast untuk add to cart
- framer-motion hanya untuk hover subtle

OUTPUT:
Tampilkan kedua file component lengkap.
```

---

## PROMPT 5.5 — SearchBar

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript, Tailwind CSS 4,
Lucide React, next/navigation.

DESIGN SYSTEM:
Primary: #630ED4, Surface low: #F0F3FF
Card border: #EDE9FE, Chip radius: 999px

TASK:
Buatkan components/shared/SearchBar.tsx

Props:
  placeholder?: string
  initialValue?: string
  onSearch?: (query: string) => void
  showSuggestions?: boolean (default true)
  className?: string

Behavior:
1. Input dengan Search icon kiri
   Clear X button kanan (muncul jika ada value)
   Height 48px, bg surface-low
   Focus: border 2px primary + shadow violet

2. Debounce 300ms saat mengetik
   → fetch /api/cari/suggestions?q=value
   → tampilkan dropdown suggestions

3. Suggestions dropdown:
   Background card, border card-border
   radius 12px, shadow
   Each item: Search icon + text
   Highlight matching query text (bold violet)
   Max 5 items
   Click: navigate ke /cari?q=suggestion

4. Popular searches:
   Tampil saat input kosong + focused
   Label "Populer:" + pill chips
   Tap: langsung search

5. onSubmit (Enter atau tap search icon):
   → router.push('/cari?q=' + encodeURI(query))
   → atau call onSearch() jika ada

RULES:
- 'use client' component
- useDebounce custom hook untuk delay
- Keyboard: Escape menutup dropdown
- Accessible: role="combobox" aria labels

OUTPUT:
Tampilkan components/shared/SearchBar.tsx lengkap.
```

---

## PROMPT 5.6 — Zustand Stores

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16, TypeScript strict, Zustand.

TASK:
Buatkan dua Zustand stores:

1. store/cartStore.ts

State:
  items: CartItem[]
  isOpen: boolean (cart drawer)

Actions:
  addItem(item: CartItem): void
  → jika sudah ada (productId+size+color): increment qty
  → jika baru: push to items

  removeItem(productId: string, size: string, color: string): void

  updateQty(productId: string, size: string,
            color: string, qty: number): void
  → jika qty 0: remove item

  clearCart(): void

  toggleCart(): void
  openCart(): void
  closeCart(): void

Computed (getters):
  totalItems: number → sum semua qty
  totalPrice: number → sum price * qty
  itemCount: number → items.length

Persist: localStorage key 'lumara-cart'

2. store/wishlistStore.ts

State:
  items: string[] (array of productId)

Actions:
  toggle(productId: string): void
  → add jika belum ada, remove jika ada

  add(productId: string): void
  remove(productId: string): void
  clear(): void

Computed:
  isWishlisted(productId: string): boolean
  count: number

Persist: localStorage key 'lumara-wishlist'

RULES:
- Gunakan zustand/middleware persist
- TypeScript strict, semua typed
- Export hooks: useCartStore, useWishlistStore

OUTPUT:
Tampilkan kedua file store lengkap.
```

---

# PHASE 6 — HALAMAN

---

## PROMPT 6.1 — Landing Page

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router Server Component,
TypeScript, Tailwind CSS 4, Framer Motion.

DESIGN SYSTEM:
Primary: #630ED4, Secondary: #824790
Background: #F9F9FF, Dark bg: #0F0A1E
Font: Plus Jakarta Sans, Mobile-first 390px

PREREQUISITE:
Semua components Phase 5 sudah ada.
ProductService sudah ada.

TASK:
Buatkan app/(main)/page.tsx — Landing Page

Server Component — fetch data di atas:
  const featured = await ProductService.getFeaturedProducts(4)
  const categories = await ProductService.getAllCategories()

Sections (berurutan, semua padding 0 16px):

1. HERO BANNER (full-width no padding)
   height 480px, relative
   Background: gradient placeholder atau
   warna background primary-container
   Bottom overlay gradient dark
   Content absolute bottom:
   - Label pill "✦ Koleksi Terbaru 2026"
     bg white/15 border white/30 backdrop-blur
   - Headline 2 baris: "Tampil Anggun,"
     + "Tetap Syar'i" dalam primary color
   - Subtitle 14px white/80
   - 2 CTA buttons: primary + ghost
   - Stats row: terjual | rating | kirim

2. TRUST BAR (overflow-x-auto)
   5 items horizontal scroll
   Icons primary, text 12px

3. CATEGORY GRID (padding 24px 16px)
   Header "Kategori" + "Lihat Semua →"
   2x2 grid + 1 wide: gamis, hijab, abaya,
   aksesoris, bundle
   Each: aspect-square, image overlay,
   label + count

4. FLASH SALE BANNER (mx-16px)
   gradient primary→secondary rounded-20
   countdown "02:34:59", CTA white button

5. FEATURED PRODUCTS (padding 24px 16px)
   Header + category tabs scroll
   <ProductGrid products={featured} />
   Suspense fallback skeleton

6. NEW ARRIVALS horizontal scroll
   4 mini cards 150px

7. HOW IT WORKS 4 steps vertical
   Icon containers warna berbeda

8. TESTIMONIALS
   Rating summary + horizontal scroll 3 cards

9. WHY CHOOSE US 2x3 grid

10. CTA BANNER gradient rounded

11. <Footer />

RULES:
- Server Component, tidak ada 'use client'
- Gunakan Suspense untuk ProductGrid
- Image placeholder dengan bg surface-low
- Semua section animasi whileInView subtle

OUTPUT:
Tampilkan app/(main)/page.tsx lengkap.
```

---

## PROMPT 6.2 — Product List Page

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript,
Tailwind CSS 4, shadcn/ui.

PREREQUISITE:
- ProductService sudah ada
- FilterSheet, ProductGrid sudah ada
- Navbar, BottomNav sudah ada

TASK:
Buatkan app/(main)/produk/page.tsx

SearchParams: category, search, minPrice,
maxPrice, sortBy, page

Server Component fetch:
  const result = await ProductService.getProductList(searchParams)
  const categories = await ProductService.getAllCategories()

Layout:
1. TOOLBAR ROW
   Left: result count + active filter tags
   (dismissible pills, 'use client')
   Right: Filter button + Sort dropdown
   Filter tap: buka FilterSheet

2. ACTIVE FILTER TAGS
   Horizontal scroll pills
   Setiap filter aktif tampil sebagai pill
   X tap: hapus filter via router.push

3. PRODUCT GRID
   <ProductGrid products={result.data} />
   isLoading saat navigasi

4. LOAD MORE button
   "Muat Lebih Banyak" outlined primary
   count "Menampilkan X dari Y produk"

5. RELATED SEARCHES
   bg white, keyword chips

6. <FilterSheet /> client component
   controlled dengan useState isOpen

RULES:
- Gunakan useRouter + useSearchParams
  untuk filter navigation
- Filter perlu 'use client' wrapper component
- Server component untuk data fetch

OUTPUT:
Tampilkan app/(main)/produk/page.tsx lengkap.
```

---

## PROMPT 6.3 — Product Detail Page

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript,
Tailwind CSS 4, Framer Motion, shadcn/ui Tabs.

PREREQUISITE:
- ProductService sudah ada
- ProductGrid sudah ada
- cartStore, wishlistStore sudah ada

TASK:
Buatkan app/(main)/produk/[id]/page.tsx

Server fetch:
  const product = await ProductService.getProductDetail(params.id)
  const related = await ProductService.getRelatedProducts(...)

Layout sections:

1. BREADCRUMB
   Beranda > Produk > [category] > [name]

2. IMAGE GALLERY (client component)
   Main image next/image aspect-square
   Thumbnail strip 4 images horizontal
   Active thumbnail: border primary

3. PRODUCT INFO
   Category pill, name 22px weight 700
   Rating + terjual row
   Price + strikethrough + discount badge
   Stock status green dot

4. COLOR SELECTOR
   6 swatches circles, active ring primary

5. SIZE SELECTOR
   Pills grid S M L XL XXL
   Active: bg primary text white
   "Panduan Ukuran →" link right

6. QTY + ADD TO CART
   Stepper − [1] +
   "Tambah ke Keranjang" primary full-width
   "Beli Sekarang" secondary full-width

7. SHIPPING INFO
   3 rows: pengiriman, garansi, konsultasi

8. TABS (shadcn Tabs)
   Deskripsi | Spesifikasi |
   Panduan Ukuran | Ulasan (count)

9. RELATED PRODUCTS
   <ProductGrid products={related} />

10. STICKY BOTTOM BAR (fixed bottom saat scroll)
    Product thumbnail + name + price
    Compact stepper + Tambah button

RULES:
- Image gallery = 'use client'
- Tabs = 'use client'
- Sticky bar = 'use client' scroll listener
- Add to cart → cartStore + Sonner toast

OUTPUT:
Tampilkan app/(main)/produk/[id]/page.tsx lengkap.
```

---

## PROMPT 6.4 — Category Page

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript,
Tailwind CSS 4.

PREREQUISITE:
- CategoryModel, ProductService sudah ada
- FilterSheet, ProductGrid sudah ada

TASK:
Buatkan app/(main)/kategori/[slug]/page.tsx

Server fetch:
  const category = await CategoryModel.findBySlug(params.slug)
  const products = await ProductService.getProductList({ category: params.slug })
  const allCategories = await ProductService.getAllCategories()

Layout:

1. CATEGORY HERO BANNER
   Height 200px, bg gradient dark
   Overlay radial violet opacity-10
   Breadcrumb white/60
   Category name 32px weight 800 white
   Description white/70
   Stats: product count, rating, teknologi

2. SUBCATEGORY TABS
   Horizontal scroll
   Related subcategories sebagai tabs
   Active: border-bottom primary

3. TOOLBAR (sama seperti product list)
   Filter button + sort dropdown
   Active filter tags

4. PRODUCT GRID
   <ProductGrid products={products.data} />

5. PAGINATION
   "Menampilkan X dari Y produk"
   Page buttons

6. ALL CATEGORIES STRIP
   "Jelajahi Kategori Lainnya"
   4 category cards horizontal grid

RULES:
- notFound() jika category tidak ditemukan
- generateMetadata() untuk SEO

OUTPUT:
Tampilkan app/(main)/kategori/[slug]/page.tsx lengkap.
```

---

## PROMPT 6.5 — Search Results Page

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript,
Tailwind CSS 4.

PREREQUISITE:
- SearchService sudah ada
- FilterSheet, ProductGrid, SearchBar sudah ada

TASK:
Buatkan app/(main)/cari/page.tsx

SearchParams: q, category, minPrice,
maxPrice, sortBy, page

Server fetch:
  const results = await SearchService.searchProducts(q, params)
  const suggestions = await SearchService.getRelatedKeywords(q)
  const categories = await ProductService.getAllCategories()

Layout:

1. SEARCH BAR HEADER
   <SearchBar initialValue={q} />
   Full width, active/focused state
   Result summary: "X hasil untuk 'query'"
   Suggested keywords pills

2. ACTIVE FILTER TAGS + TOOLBAR
   Filter + Sort buttons
   <FilterSheet />

3. PRODUCT GRID atau EMPTY STATE
   Jika results.total > 0:
     <ProductGrid products={results.data} />
     Load more button

   Jika results.total === 0:
     Illustration magnifier
     "Produk Tidak Ditemukan"
     Suggested searches pills
     Reset + Lihat Semua buttons

4. RELATED SEARCHES
   Keyword chips grid flex-wrap

RULES:
- q wajib, redirect ke /produk jika kosong
- Empty state terpusat di product area

OUTPUT:
Tampilkan app/(main)/cari/page.tsx lengkap.
```

---

## PROMPT 6.6 — Login Page

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript,
Tailwind CSS 4, React Hook Form, Zod, Sonner.

PREREQUISITE:
- AuthService sudah ada
- lib/supabase.ts sudah ada

TASK:
Buatkan app/(auth)/masuk/page.tsx
'use client' component

Structure:

TOP BRAND AREA (height 220px):
  Gradient primary → secondary
  border-radius 0 0 32px 32px
  Logo "lumara.id" white center
  Tagline "Modest Fashion Premium" white/70
  Dekoratif: 3 soft white circles opacity-6

FORM AREA (bg white, radius 24px 24px 0 0,
overlap -24px dari gradient):

  Heading "Masuk ke Akun" 22px weight 700
  Subtitle "Halo! Selamat datang kembali."

  Google OAuth button full-width

  Divider "atau masuk dengan email"

  React Hook Form + Zod schema:
  - Email: required, email format
  - Password: required, min 6

  Email input + password input (eye toggle)
  Remember me checkbox
  Lupa password link → /lupa-sandi

  Submit button "Masuk ke Akun" primary

  Error state per field + global error

  Link ke /daftar

RULES:
- Form validation client-side dengan Zod
- Submit: AuthService.login()
- Success: router.push('/') atau redirect param
- Error: tampilkan pesan Indonesia
- Loading state pada button saat submit

OUTPUT:
Tampilkan app/(auth)/masuk/page.tsx lengkap.
```

---

## PROMPT 6.7 — Register Page

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript,
Tailwind CSS 4, React Hook Form, Zod.

PREREQUISITE:
- AuthService sudah ada

TASK:
Buatkan app/(auth)/daftar/page.tsx
'use client' component

Sama struktur dengan Login Page tapi:

Heading: "Buat Akun Baru"
Subtitle: "Bergabung dengan 10.000+ pelanggan"

Zod schema:
- name: required, min 2 chars
- email: required, email format
- phone: optional, Indonesian format
- password: min 8 chars, ada angka
- confirmPassword: harus sama dengan password
- terms: must be true

Form fields:
- Nama Lengkap (+ checkmark valid icon)
- Email (+ checkmark valid icon)
- Nomor HP dengan prefix +62
- Password + strength indicator bar
  4 segments: weak/fair/good/strong
- Konfirmasi Password
- Terms checkbox dengan link

Button disabled jika terms belum checked
Loading state saat submit

RULES:
- Password strength: calc dari entropy
- Submit: AuthService.register()
- Confirm password mismatch error inline
- Link ke /masuk

OUTPUT:
Tampilkan app/(auth)/daftar/page.tsx lengkap.
```

---

## PROMPT 6.8 — Forgot Password Page

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript,
Tailwind CSS 4, React Hook Form, Zod.

PREREQUISITE:
- AuthService sudah ada

TASK:
Buatkan app/(auth)/lupa-sandi/page.tsx
'use client' component

Simple navbar:
  ← back arrow | "Lupa Password" center | empty right

Two states dengan useState:

STATE 1 — DEFAULT:
  Lock illustration circle bg primary-container
  Heading "Lupa Password?" centered
  Subtitle instruksi centered

  Email input + send button
  "Kirim Link Reset Password" primary full-width

  Link "← Kembali ke halaman masuk"

STATE 2 — SUCCESS (setelah submit):
  Checkmark illustration circle bg success/20
  "Email Terkirim!" heading
  Subtitle dengan email yang dikirim highlighted
  "Kembali ke Halaman Masuk" button

  Resend row: "Tidak menerima email?"
  + "Kirim Ulang" link
  Countdown timer "Kirim ulang dalam 00:45"
  useEffect countdown dari 45 detik

RULES:
- Submit: AuthService.resetPassword()
- Countdown disabled resend button
- Error: email tidak terdaftar

OUTPUT:
Tampilkan app/(auth)/lupa-sandi/page.tsx lengkap.
```

---

## PROMPT 6.9 — Wishlist Page

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript,
Tailwind CSS 4, Zustand, Sonner.

PREREQUISITE:
- WishlistService sudah ada
- ProductCard sudah ada
- cartStore, wishlistStore sudah ada

TASK:
Buatkan app/(main)/wishlist/page.tsx
Protected route — redirect ke /masuk jika tidak login

Two states:

STATE 1 — FILLED (ada produk):

  Navbar: ← back | "Wishlist (12)" | share icon

  Sort & Select bar:
  Pilih Semua checkbox + Sort dropdown

  Collection tabs:
  Semua | Gamis | Hijab | Abaya | Aksesoris
  Filter berdasarkan product category

  2-column product grid:
  Cards dengan selection checkbox (muncul saat
  "Pilih Semua" atau long press)
  Out of stock overlay pada card yang habis
  Wishlist heart merah (sudah saved)

  Share Wishlist banner:
  bg primary-container, rounded 14px
  Icon + text + "Bagikan →"

  Selection action bar (muncul jika ada selected):
  Fixed above bottom nav
  "X produk dipilih" + Hapus + Tambah Keranjang

STATE 2 — EMPTY:
  Heart illustration circle bg primary-container
  "Wishlist Masih Kosong" heading
  Subtitle + 2 CTA buttons
  "Mungkin Kamu Suka" horizontal scroll

Toast notifications:
- Remove: "Dihapus dari wishlist" + Undo
- Add to cart: "Ditambahkan ke keranjang!"

RULES:
- Check auth di server, redirect jika tidak login
- Optimistic update untuk remove
- Undo dalam 3 detik sebelum permanent delete

OUTPUT:
Tampilkan app/(main)/wishlist/page.tsx lengkap.
```

---

## PROMPT 6.10 — Error Pages

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

STACK: Next.js 16 App Router, TypeScript,
Tailwind CSS 4.

TASK:
Buatkan dua error pages:

1. app/not-found.tsx — 404 Page

Simple navbar: logo center only

Content centered padding 48px 24px:

  "404" display dengan styling khusus:
  "4" violet 96px weight 800 +
  "0" sebagai circle border violet
  dengan gamis icon illustration di dalam +
  "4" violet
  letter-spacing -0.02em

  Dekoratif: floating tiny icons
  (gamis, bintang, hati) violet opacity-20

  Heading: "Halaman Tidak Ditemukan" 22px
  Subtitle: pesan friendly Indonesia

  3 buttons:
  - "Kembali ke Beranda" primary
  - "Lihat Koleksi Terbaru" primary-container
  - "Hubungi Kami" outlined

  Category quick links:
  "Atau cari di kategori populer:"
  Pills: Gamis, Hijab, Abaya, Aksesoris, Bundle

2. app/error.tsx — 500 Page
  'use client' (required by Next.js)
  Props: error, reset

  "500" display dengan warna secondary
  Cloud/lightning illustration di "0"

  "Terjadi Kesalahan Server" heading
  Pulsing amber dot + "Sedang diperbaiki..."

  2 buttons:
  - "Coba Lagi" → reset()
  - "Kembali ke Beranda" → router.push('/')

  Contact support: WA + Email icon buttons

RULES:
- not-found.tsx: Server Component
- error.tsx: HARUS 'use client'
- Semua warna on-brand lumara-id
- generateMetadata() untuk 404

OUTPUT:
Tampilkan kedua file lengkap siap copy-paste.
```

---

# PHASE 7 — FINISHING

---

## PROMPT 7.1 — Dark Mode

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

TASK:
Audit dan perbaiki dark mode di seluruh project.

Checklist yang harus diverifikasi:

1. ThemeProvider sudah wrap seluruh app
   di app/layout.tsx dengan:
   defaultTheme: "system"
   enableSystem: true
   attribute: "class"

2. Semua komponen gunakan CSS variables
   TIDAK ada hardcoded hex color
   Contoh SALAH: className="text-[#151C27]"
   Contoh BENAR: className="text-[var(--text-primary)]"
   atau Tailwind custom color token

3. Dark mode CSS variables sudah definisi
   di globals.css untuk .dark class

4. Test setiap komponen:
   - Navbar ✓
   - BottomNav ✓
   - ProductCard ✓
   - FilterSheet ✓
   - Semua halaman ✓

5. Footer SELALU dark (#151C27)
   tidak berubah di dark mode

6. Theme toggle button di Navbar
   Sun icon → Light mode
   Moon icon → Dark mode
   System icon → System default

Buatkan components/ui/ThemeToggle.tsx
menggunakan useTheme dari next-themes
3-way toggle: light | dark | system

RULES:
- Audit semua file dan list yang perlu diperbaiki
- Perbaiki satu per satu

OUTPUT:
List file yang perlu diperbaiki +
ThemeToggle component lengkap.
```

---

## PROMPT 7.2 — Loading States

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

TASK:
Tambahkan loading states di semua routes.

1. Buatkan app/(main)/loading.tsx
   Skeleton untuk layout utama:
   - Navbar skeleton (sticky top)
   - Hero banner skeleton 480px
   - Product grid skeleton 2x4
   - BottomNav tetap visible

2. Buatkan app/(main)/produk/loading.tsx
   - Toolbar skeleton
   - Product grid 2x6 skeleton cards

3. Buatkan app/(main)/produk/[id]/loading.tsx
   - Image gallery skeleton aspect-square
   - Product info skeleton (lines)
   - Tabs skeleton

4. Buatkan app/(main)/cari/loading.tsx
   - Search bar skeleton
   - Product grid skeleton

5. Update components/product/ProductCard.tsx
   - isLoading prop → render skeleton
   - Skeleton: animate-pulse bg surface-low

6. Buatkan components/ui/Skeleton.tsx
   Base skeleton component:
   - variants: text, circle, rect, card
   - animate-pulse default

RULES:
- Skeleton ukuran sesuai konten aslinya
- Tidak ada layout shift saat loading selesai
- Gunakan Suspense boundaries yang tepat

OUTPUT:
Tampilkan semua loading.tsx files
dan Skeleton component lengkap.
```

---

## PROMPT 7.3 — Metadata & SEO

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

TASK:
Tambahkan SEO metadata di semua halaman.

1. app/layout.tsx — Root metadata:
   title: { default: 'lumara-id', template: '%s | lumara-id' }
   description: "Platform modest fashion premium..."
   openGraph: { siteName, locale: 'id_ID', type: 'website' }
   themeColor: '#630ED4'

2. app/(main)/page.tsx — Landing:
   title: 'Modest Fashion Premium Indonesia'
   description: "Temukan koleksi gamis, hijab..."

3. app/(main)/produk/page.tsx:
   title: 'Katalog Produk'

4. app/(main)/produk/[id]/page.tsx:
   generateMetadata({ params }) async
   → fetch product → return dynamic metadata
   title: product.name
   description: product.description truncated
   openGraph image: product.images[0]

5. app/(main)/kategori/[slug]/page.tsx:
   generateMetadata({ params }) async
   → fetch category → dynamic metadata

6. app/sitemap.ts:
   → static routes
   → dynamic product routes
   → dynamic category routes

7. app/robots.ts:
   allow semua kecuali /api/ dan /akun/

RULES:
- Semua metadata dalam Bahasa Indonesia
- OG image size: 1200x630
- canonical URLs

OUTPUT:
Tampilkan semua metadata config lengkap.
```

---

## PROMPT 7.4 — Environment & README

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

TASK:
Setup environment configuration dan dokumentasi.

1. Buatkan .env.example:
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
   SUPABASE_SERVICE_ROLE_KEY="xxx"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

2. Buatkan README.md lengkap:
   - Project overview
   - Tech stack
   - Design system summary
   - Getting started (clone, install, env, migrate, run)
   - Project structure
   - OOP architecture diagram ASCII
   - Available scripts
   - Deploy to Render guide

3. Buatkan render.yaml:
   services:
   - type: web
     name: lumara-id
     env: node
     buildCommand: npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     startCommand: npm start
     envVars: list semua env variables

RULES:
- README dalam Bahasa Indonesia
- render.yaml sesuai format Render Blueprint

OUTPUT:
Tampilkan .env.example, README.md,
dan render.yaml lengkap.
```

---

## PROMPT 7.5 — Deploy ke Render

```
Kamu adalah senior full-stack engineer mengerjakan
project "lumara-id" — e-commerce modest fashion Indonesia.

TASK:
Final checklist sebelum deploy ke Render.

Verifikasi dan perbaiki jika perlu:

1. next.config.ts:
   - images.domains: add Supabase storage domain
   - output: standalone (untuk Render)
   - experimental.serverComponentsExternalPackages:
     add ['@prisma/client', 'prisma']

2. package.json scripts:
   "build": "prisma generate && next build"
   "postinstall": "prisma generate"

3. Prisma:
   - schema.prisma generator output:
     "./node_modules/.prisma/client"
   - Verifikasi DATABASE_URL format Supabase

4. Supabase setup checklist:
   - Auth providers: Email + Google OAuth configured
   - Storage bucket: 'products' dibuat
   - RLS policies untuk semua table
   - Auth redirect URLs di Supabase dashboard

5. Final test sebelum deploy:
   npm run build → harus 0 error
   npm run lint → harus 0 error
   TypeScript tsc --noEmit → harus 0 error

6. Git:
   - .gitignore sudah include .env.local
   - Push ke GitHub syahrulramelan1/howto-id

7. Render setup:
   - Connect GitHub repo
   - Set semua environment variables
   - Deploy

OUTPUT:
Tampilkan next.config.ts final +
checklist lengkap dengan status.
```

---

## Quick Reference

### Urutan Task

```
Phase 1 (Setup)     → 1.1 → 1.2 → 1.3 → 1.4
Phase 2 (Models)    → 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6 → 2.7
Phase 3 (Services)  → 3.1 → 3.2 → 3.3 → 3.4
Phase 4 (API)       → 4.1 → 4.2 → 4.3 → 4.4
Phase 5 (Components)→ 5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6
Phase 6 (Pages)     → 6.1 → 6.2 → 6.3 → 6.4 → 6.5 → 6.6 → 6.7 → 6.8 → 6.9 → 6.10
Phase 7 (Finishing) → 7.1 → 7.2 → 7.3 → 7.4 → 7.5
```

### OOP Architecture

```
View Layer          → React Components (app/ + components/)
Controller Layer    → API Routes (app/api/)
Service Layer       → Business Logic (lib/services/)
Model Layer         → Data Access OOP (lib/models/)
Database Layer      → Prisma + Supabase PostgreSQL
```

### File Naming Convention

```
Components  → PascalCase.tsx      (ProductCard.tsx)
Pages       → lowercase/page.tsx  (produk/page.tsx)
Models      → PascalCase.ts       (ProductModel.ts)
Services    → PascalCase.ts       (ProductService.ts)
Stores      → camelCase.ts        (cartStore.ts)
Utils       → camelCase.ts        (utils.ts)
Types       → lowercase.ts        (index.ts)
```
