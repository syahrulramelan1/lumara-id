import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database lokal lumara-id...");

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CATEGORIES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "gamis" },
      update: {},
      create: {
        name: "Gamis",
        slug: "gamis",
        description: "Gamis premium untuk berbagai kesempatan",
        image: "https://images.unsplash.com/photo-1614091050040-57e14d8f8aea?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "hijab" },
      update: {},
      create: {
        name: "Hijab",
        slug: "hijab",
        description: "Koleksi hijab voal, sifon, dan premium",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "abaya" },
      update: {},
      create: {
        name: "Abaya",
        slug: "abaya",
        description: "Abaya elegan dengan bahan berkualitas",
        image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "aksesoris" },
      update: {},
      create: {
        name: "Aksesoris",
        slug: "aksesoris",
        description: "Aksesoris pelengkap outfit modest fashion",
        image: "https://images.unsplash.com/photo-1603039882975-d8ab98ace8c0?w=400",
      },
    }),
    prisma.category.upsert({
      where: { slug: "bundle" },
      update: {},
      create: {
        name: "Bundle",
        slug: "bundle",
        description: "Paket hemat gamis + hijab + aksesoris",
        image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400",
      },
    }),
  ]);

  const [gamis, hijab, abaya] = categories;
  console.log(`✅ ${categories.length} kategori dibuat`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // USERS (admin + customer)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const admin = await prisma.user.upsert({
    where: { email: "admin@lumara.id" },
    update: {},
    create: {
      email: "admin@lumara.id",
      name: "Admin Lumara",
      role: "ADMIN",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "siti@gmail.com" },
    update: {},
    create: {
      email: "siti@gmail.com",
      name: "Siti Aisyah",
      role: "USER",
      phone: "081234567890",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=siti",
    },
  });

  console.log("✅ 2 user dibuat (admin + customer)");

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PRODUCTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const productData = [
    {
      name: "Gamis Ameena Premium",
      slug: "gamis-ameena-premium",
      description: "Gamis premium dengan bahan voal super halus dan tidak mudah kusut. Cocok untuk acara formal maupun casual. Tersedia dalam berbagai warna elegan.",
      price: 450000,
      originalPrice: 595000,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1614091050040-57e14d8f8aea?w=600",
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600",
      ]),
      stock: 45,
      categoryId: gamis.id,
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["Dusty Pink", "Sage Green", "Navy", "Cream"]),
      rating: 4.9,
      reviewCount: 186,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Gamis Sultana Silk",
      slug: "gamis-sultana-silk",
      description: "Gamis berbahan silk premium dengan detail bordir tangan yang indah. Tampil mewah dan anggun di setiap kesempatan.",
      price: 750000,
      originalPrice: 950000,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600",
      ]),
      stock: 20,
      categoryId: gamis.id,
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Maroon", "Black", "Olive"]),
      rating: 4.8,
      reviewCount: 94,
      isFeatured: true,
      isNew: true,
    },
    {
      name: "Gamis Fatimah Daily",
      slug: "gamis-fatimah-daily",
      description: "Gamis daily wear berbahan katun adem. Nyaman dipakai seharian, cocok untuk aktivitas sehari-hari.",
      price: 285000,
      originalPrice: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600",
      ]),
      stock: 80,
      categoryId: gamis.id,
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL", "XXXL"]),
      colors: JSON.stringify(["White", "Black", "Navy", "Cream"]),
      rating: 4.7,
      reviewCount: 312,
      isFeatured: false,
      isNew: false,
    },
    {
      name: "Hijab Voal Lasercut Safa",
      slug: "hijab-voal-lasercut-safa",
      description: "Hijab voal premium dengan lasercut anti-jahit. Bahan ringan, tidak transparan, dan jatuhnya cantik.",
      price: 89000,
      originalPrice: 125000,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1603039882975-d8ab98ace8c0?w=600",
      ]),
      stock: 150,
      categoryId: hijab.id,
      sizes: JSON.stringify(["Freesize"]),
      colors: JSON.stringify(["Dusty Pink", "Sage", "Navy", "Black", "White", "Maroon", "Cream", "Olive"]),
      rating: 4.8,
      reviewCount: 524,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Hijab Pashmina Cerutti",
      slug: "hijab-pashmina-cerutti",
      description: "Pashmina cerutti premium dengan bahan yang sangat halus dan jatuhnya elegan.",
      price: 115000,
      originalPrice: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600",
      ]),
      stock: 95,
      categoryId: hijab.id,
      sizes: JSON.stringify(["Freesize"]),
      colors: JSON.stringify(["Dusty Pink", "Sage", "Cream", "Maroon"]),
      rating: 4.6,
      reviewCount: 89,
      isFeatured: false,
      isNew: true,
    },
    {
      name: "Abaya Zara Premium",
      slug: "abaya-zara-premium",
      description: "Abaya premium berbahan crepe berkualitas tinggi. Desain minimalis namun tetap elegan dan syar'i.",
      price: 650000,
      originalPrice: 850000,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600",
      ]),
      stock: 30,
      categoryId: abaya.id,
      sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
      colors: JSON.stringify(["Black", "Navy", "Dark Brown"]),
      rating: 4.9,
      reviewCount: 67,
      isFeatured: true,
      isNew: false,
    },
    {
      name: "Abaya Butterfly Open",
      slug: "abaya-butterfly-open",
      description: "Abaya butterfly dengan potongan yang flowy dan elegant. Cocok untuk acara semi-formal.",
      price: 480000,
      originalPrice: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600",
      ]),
      stock: 25,
      categoryId: abaya.id,
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Black", "Dusty Pink"]),
      rating: 4.7,
      reviewCount: 43,
      isFeatured: false,
      isNew: true,
    },
    {
      name: "Gamis Khadijah Motif",
      slug: "gamis-khadijah-motif",
      description: "Gamis dengan motif etnik yang cantik dan elegan. Bahan berkualitas premium.",
      price: 520000,
      originalPrice: 680000,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1614091050040-57e14d8f8aea?w=600",
      ]),
      stock: 15,
      categoryId: gamis.id,
      sizes: JSON.stringify(["S", "M", "L", "XL"]),
      colors: JSON.stringify(["Maroon", "Navy", "Sage"]),
      rating: 4.8,
      reviewCount: 128,
      isFeatured: true,
      isNew: false,
    },
  ];

  for (const p of productData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log(`✅ ${productData.length} produk dibuat`);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // REVIEWS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const ameena = await prisma.product.findUnique({ where: { slug: "gamis-ameena-premium" } });
  if (ameena) {
    const existingReview = await prisma.review.findFirst({
      where: { userId: customer.id, productId: ameena.id },
    });
    if (!existingReview) {
      await prisma.review.create({
        data: {
          userId: customer.id,
          productId: ameena.id,
          rating: 5,
          comment: "Bahannya halus banget, warnanya cantik, dan jahitannya rapi. Sangat puas! Pasti beli lagi.",
          images: JSON.stringify([]),
        },
      });
    }
    console.log("✅ Review sample dibuat");
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WISHLIST SAMPLE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const sultana = await prisma.product.findUnique({ where: { slug: "gamis-sultana-silk" } });
  if (sultana) {
    await prisma.wishlist.upsert({
      where: { userId_productId: { userId: customer.id, productId: sultana.id } },
      update: {},
      create: { userId: customer.id, productId: sultana.id },
    });
    console.log("✅ Wishlist sample dibuat");
  }

  console.log("\n🎉 Seeding selesai! Database lokal siap digunakan.");
  console.log("   Admin: admin@lumara.id");
  console.log("   Customer: siti@gmail.com");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
