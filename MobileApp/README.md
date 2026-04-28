# lumara.id

> E-commerce Modest Fashion Premium Indonesia
> *"Tampil Anggun, Tetap Syar'i"*

---

## 🚀 Tech Stack

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3 + shadcn/ui
- **Database:** Supabase (PostgreSQL) + Prisma ORM
- **Auth:** Supabase Auth (Email + Google OAuth)
- **State:** Zustand (cart, wishlist)
- **Forms:** React Hook Form + Zod validation
- **UI:** Lucide React, Framer Motion, Sonner (toast)
- **Deploy:** Render

---

## 🎨 Design System

```
Primary violet:    #630ED4
Secondary fuchsia: #824790
Background:        #F9F9FF
Dark bg:           #0F0A1E
Font:              Plus Jakarta Sans
Card radius:       14px
Button radius:     12px
Chip radius:       999px (pill)
```

Mobile-first, viewport 390px (Android primary target).

---

## 🛠️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

Copy `.env.local.example` ke `.env.local` lalu isi credential Supabase:

```bash
cp .env.local.example .env.local
```

### 3. Setup database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Project Structure

```
lumara-id/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth route group
│   ├── (main)/             # Main route group
│   ├── api/                # API Routes (Controller)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Navbar, Footer, BottomNav
│   ├── product/            # ProductCard, ProductGrid
│   ├── shared/             # FilterSheet, SearchBar
│   └── providers/          # ThemeProvider
├── lib/
│   ├── models/             # OOP Model Layer
│   ├── services/           # Business Logic
│   ├── prisma.ts
│   ├── supabase.ts
│   └── utils.ts
├── hooks/                  # Custom React hooks
├── store/                  # Zustand stores
├── types/                  # TypeScript types
└── prisma/
    └── schema.prisma
```

---

## 🏗️ OOP Architecture (MVC)

```
View Layer        → React Components
Controller Layer  → API Routes (app/api/)
Service Layer     → Business Logic (lib/services/)
Model Layer       → Data Access (lib/models/)
Database Layer    → Prisma + Supabase
```

---

## 📋 Phase Progress

- [x] **Phase 1.1** — Init Project ✅
- [ ] **Phase 1.2** — Design System Token
- [ ] **Phase 1.3** — Prisma Schema
- [ ] **Phase 1.4** — Database Connection
- [ ] **Phase 2** — OOP Model Layer
- [ ] **Phase 3** — Service Layer
- [ ] **Phase 4** — API Routes
- [ ] **Phase 5** — Global Components
- [ ] **Phase 6** — Pages
- [ ] **Phase 7** — Finishing & Deploy

---

## 📝 License

Private project.
