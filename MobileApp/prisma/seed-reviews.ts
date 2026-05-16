/**
 * Seed ulasan realistis untuk produk Lumara.id
 * Jalankan: npx tsx prisma/seed-reviews.ts
 *
 * - Membuat akun user fiktif (tidak bisa login, hanya data DB)
 * - Menambah ulasan acak per produk
 * - Auto-update rating & reviewCount di tabel products
 */

import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

// ── Profil user fiktif ─────────────────────────────────────────────────────
const FAKE_USERS = [
  { name: "Siti Rahayu",      email: "siti.rahayu.82@gmail.com"   },
  { name: "Dewi Anggraeni",   email: "dewi.anggraeni91@gmail.com"  },
  { name: "Nurul Hidayah",    email: "nurul.hidayah@yahoo.com"    },
  { name: "Fatimah Azzahra",  email: "fatimah.az@gmail.com"       },
  { name: "Rina Kusumawati",  email: "rina.ksmw@gmail.com"        },
  { name: "Ayu Pramesti",     email: "ayu.pramesti99@gmail.com"   },
  { name: "Mira Handayani",   email: "mira.hdyn@gmail.com"        },
  { name: "Laila Sari",       email: "laila.sari.lmr@gmail.com"   },
  { name: "Nadia Permata",    email: "nadia.permata@gmail.com"    },
  { name: "Yuni Astuti",      email: "yuni.astuti88@gmail.com"    },
  { name: "Hani Safitri",     email: "hani.safitri@gmail.com"     },
  { name: "Putri Maharani",   email: "putri.mhrn@gmail.com"       },
  { name: "Rini Wulandari",   email: "rini.wulandari@yahoo.com"   },
  { name: "Citra Lestari",    email: "citra.lestari@gmail.com"    },
  { name: "Mega Pratiwi",     email: "mega.pratiwi@gmail.com"     },
];

// ── Bank komentar per rating ───────────────────────────────────────────────
const COMMENTS: Record<number, string[]> = {
  5: [
    "Mashaa Allah bahannya lembut banget, adem dipake seharian. Sudah order ketiga kalinya!",
    "Kualitas premium, jahitannya rapi, warnanya persis seperti foto. Recommended banget!",
    "Pengiriman cepat, packing rapi. Bajunya cantik dan nyaman dipakai kerja maupun kondangan.",
    "Bahan syari yang beneran adem, tidak gerah. Ukurannya juga pas sesuai size chart.",
    "Suka banget sama modelnya, elegan tapi tetap simpel. Dapat banyak pujian pas dipakai!",
    "Sudah coba beberapa brand, ini yang paling worth it. Bahan premium harga terjangkau.",
    "Respon seller cepat, gambar sesuai aslinya. Langsung order lagi warna lain.",
    "Kualitas jahitan bagus banget, tidak ada benang yang keluar. Sangat puas!",
    "Cocok banget buat harian dan acara formal. Bahan tidak transparan, syari maksimal.",
    "Paket datang aman, ada bubble wrap. Bajunya sesuai deskripsi, sangat memuaskan!",
    "Model cantik, bahan premium terasa mahal. Teman-teman banyak yang tanya belinya di mana.",
    "Sudah pake ke kantor dan kondangan, dapat banyak compliment. Love banget!",
  ],
  4: [
    "Bahannya bagus dan adem, hanya warnanya sedikit lebih gelap dari foto. Overall oke!",
    "Kualitas sesuai harga, jahitan rapi. Ukuran agak besar, next order size down.",
    "Pengiriman sesuai estimasi, baju cantik. Minus sedikit di zipper kurang lancar.",
    "Lumayan bagus, bahan tidak panas. Mungkin bisa diperbaiki di bagian lengannya.",
    "Suka sama modelnya, cukup adem. Warna asli sedikit berbeda tapi masih oke.",
    "Baju cantik dan nyaman. Packaging sangat rapi. Recommended untuk yang mau tampil elegan.",
    "Kualitas bagus untuk harganya. Sudah pake beberapa kali, tetap rapi dan tidak luntur.",
    "Model sesuai foto, bahan cukup bagus. Pengiriman agak lama tapi worth it.",
  ],
  3: [
    "Bahannya oke, tapi jahitan di bagian bawah kurang rapi. Masih bisa dipakai sih.",
    "Warna agak beda dari foto, tapi model dan bahannya masih lumayan. Cukup puas.",
    "Ukurannya tidak sesuai size chart, terlalu panjang. Mungkin perlu disesuaikan lagi.",
  ],
};

// ── Helper: tanggal acak dalam N bulan terakhir ───────────────────────────
function randomDate(monthsBack = 4): Date {
  const now = Date.now();
  const earliest = now - monthsBack * 30 * 24 * 60 * 60 * 1000;
  return new Date(earliest + Math.random() * (now - earliest));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedRating(): number {
  const r = Math.random();
  if (r < 0.55) return 5;
  if (r < 0.85) return 4;
  if (r < 0.95) return 3;
  return 4;
}

// ── Recalc rating produk ───────────────────────────────────────────────────
async function recalcRating(productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { id: true },
  });
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count.id,
    },
  });
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("🌱 Mulai seed ulasan...\n");

  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  if (!products.length) {
    console.log("⚠️  Tidak ada produk ditemukan. Tambah produk dulu.");
    return;
  }
  console.log(`📦 ${products.length} produk ditemukan.\n`);

  // Buat user fiktif (upsert — aman dijalankan berkali-kali)
  const dbUsers = await Promise.all(
    FAKE_USERS.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          id: randomUUID(),
          email: u.email,
          name: u.name,
          role: "USER",
        },
      })
    )
  );
  console.log(`👥 ${dbUsers.length} user siap.\n`);

  let totalAdded = 0;

  for (const product of products) {
    // Tiap produk dapat 3–8 ulasan dari user acak
    const reviewCount = Math.floor(Math.random() * 6) + 3;
    const shuffledUsers = [...dbUsers].sort(() => Math.random() - 0.5).slice(0, reviewCount);

    for (const user of shuffledUsers) {
      // Cek duplikat (1 user max 1 ulasan per produk)
      const existing = await prisma.review.findFirst({
        where: { userId: user.id, productId: product.id },
      });
      if (existing) continue;

      const rating = weightedRating();
      const comment = pick(COMMENTS[rating]);

      await prisma.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          rating,
          comment,
          images: JSON.stringify([]),
          createdAt: randomDate(4),
        },
      });
      totalAdded++;
    }

    await recalcRating(product.id);
    console.log(`  ✓ ${product.name.slice(0, 40)}...`);
  }

  console.log(`\n✅ Selesai! ${totalAdded} ulasan ditambahkan.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
