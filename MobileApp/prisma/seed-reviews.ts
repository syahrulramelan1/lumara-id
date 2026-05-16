/**
 * Seed ulasan realistis skala besar — gaya Shopee/Tokped/TikTok Shop
 * Jalankan: npx tsx prisma/seed-reviews.ts
 *
 * - 3.000 akun pembeli unik (nama Indonesia, tidak bisa login)
 * - Setiap produk mendapat ~3.000 ulasan
 * - Komentar panjang ~1.000 karakter, gaya reviewer asli e-commerce
 * - Rating: 70% ⭐⭐⭐⭐⭐ · 20% ⭐⭐⭐⭐ · 7% ⭐⭐⭐ · 2% ⭐⭐ · 1% ⭐
 * - Tanggal tersebar acak 6 bulan ke belakang
 * - Batch insert untuk performa — aman diulang (skipDuplicates)
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

// Load .env.local agar DATABASE_URL terbaca
try {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} catch { /* lanjut */ }

const prisma = new PrismaClient();

// ── Generator nama Indonesia ───────────────────────────────────────────────
const FIRST_NAMES = [
  "Siti","Dewi","Nurul","Fatimah","Rina","Ayu","Mira","Laila","Nadia","Yuni",
  "Hani","Putri","Rini","Citra","Mega","Indah","Fitri","Suci","Dian","Maya",
  "Ani","Evi","Lina","Wati","Sri","Tuti","Ida","Lia","Novi","Ika",
  "Ratna","Yanti","Hesti","Wulan","Sari","Asri","Endah","Retno","Wahyu","Yuli",
  "Rosy","Esti","Rara","Nia","Vina","Bella","Risa","Dini","Tika","Eka",
  "Nisa","Umi","Zahra","Salma","Amira","Fira","Kiki","Lulu","Mona","Neni",
];
const LAST_NAMES = [
  "Rahayu","Anggraeni","Hidayah","Azzahra","Kusumawati","Pramesti","Handayani",
  "Safitri","Permata","Astuti","Lestari","Maharani","Wulandari","Pratiwi",
  "Kurniawati","Setiawati","Puspita","Hartati","Susanti","Andriani","Wahyuni",
  "Fitriani","Oktaviani","Nuraini","Komalasari","Rachmawati","Trisnawati",
  "Hasanah","Marlina","Kartika","Aprilia","Agustina","Septiani","Rohmah",
  "Khoiriyah","Alfiyah","Maulida","Zahro","Badriyah","Fauziyah","Islamiyah",
  "Nurhaliza","Ramadhani","Febrianti","Damayanti","Pangesti","Suryani","Melani",
  "Yunita","Novita",
];
const EMAIL_DOMAINS = ["gmail.com","yahoo.com","outlook.com","hotmail.com","icloud.com"];

function genUsers(total: number) {
  const users: { id: string; name: string; email: string; role: string }[] = [];
  let idx = 0;
  outer: for (const fn of FIRST_NAMES) {
    for (const ln of LAST_NAMES) {
      if (idx >= total) break outer;
      const suffix = idx > 0 ? String(Math.floor(idx / (FIRST_NAMES.length * LAST_NAMES.length / 10) + 1)).padStart(2, "0") : "";
      const domain = EMAIL_DOMAINS[idx % EMAIL_DOMAINS.length];
      users.push({
        id: randomUUID(),
        name: `${fn} ${ln}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}${suffix}@${domain}`,
        role: "USER",
      });
      idx++;
    }
  }
  // Kalau nama habis sebelum total, ulang dengan suffix angka
  while (users.length < total) {
    const fn = FIRST_NAMES[users.length % FIRST_NAMES.length];
    const ln = LAST_NAMES[users.length % LAST_NAMES.length];
    const n  = users.length;
    users.push({
      id: randomUUID(),
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}${n}.${ln.toLowerCase()}@gmail.com`,
      role: "USER",
    });
  }
  return users;
}

// ── Bank komentar panjang gaya Shopee/Tokped ──────────────────────────────
const OPENING = [
  "Haii kak! Mau share pengalaman belanja di Lumara.id nih, semoga bisa bantu teman-teman yang masih galau mau order atau tidak ya! 😊 ",
  "Assalamualaikum! Akhirnya jadi juga nulis review setelah beberapa minggu pake, biar makin lengkap deh. Semoga bermanfaat! 🌸 ",
  "Halo semuanya! Ini review jujur dari aku yang udah lama pengen beli busana di sini. Akhirnya kesampaian dan alhamdulillah tidak kecewa! ✨ ",
  "Wah akhirnya tiba juga paketnya! Langsung aku coba dan langsung mau review supaya teman-teman tahu kualitas aslinya. Yuk simak! 💜 ",
  "Setelah nunggu beberapa hari, paket akhirnya datang dalam kondisi sempurna. Langsung aku coba dan hasilnya di luar ekspektasi! 😍 ",
  "Buat teman-teman yang lagi cari busana syari premium, aku mau share pengalaman belanja nih. Ini sudah orderan keduaku loh! 🎀 ",
];

const QUALITY: Record<number, string[]> = {
  5: [
    "Dari segi kualitas bahan, jujur aku sampai takjub banget. Bahannya beneran premium, terasa lembut di kulit dan sama sekali tidak panas walau dipakai seharian penuh dari pagi sampai malam. Jahitannya sangat rapi dan presisi, tidak ada benang yang keluar apalagi jahitan yang miring atau lepas. Warnanya juga persis seperti yang ada di foto bahkan lebih cantik kalau dilihat langsung, tidak ada perbedaan warna sama sekali. Bahannya juga tidak transparan jadi beneran syari dan bisa langsung dipakai tanpa harus pakai manset tambahan. ",
    "Kualitas bajunya benar-benar melebihi ekspektasi aku. Bahan terasa adem dan breathable banget, cocok banget buat iklim tropis Indonesia yang panas. Potongannya juga elegan dan feminine tapi tetap syari. Jahitan di semua sudut sangat rapi dan kuat, tidak ada cacat sama sekali. Aku sudah banyak beli baju dari berbagai tempat, dan ini termasuk salah satu yang terbaik dari segi kualitas berbanding harga. Motifnya juga tidak luntur sama sekali walau sudah dicuci beberapa kali. ",
    "Masya Allah kualitasnya premium banget! Bahan yang digunakan benar-benar berkualitas, tidak gerah, tidak nerawang, dan draping-nya cantik banget pas dipakai. Jahitan halus dan rapi di setiap detail. Warna bajunya vivid dan persis sama dengan foto produk. Aku suka banget sama detail-detail kecilnya yang menunjukkan ketelitian pembuat. Ini beneran worth every penny! ",
  ],
  4: [
    "Kualitas bajunya bagus dan sesuai dengan harganya. Bahan adem dan nyaman dipakai. Jahitan rapi meskipun ada sedikit benang lebih di bagian dalam yang tidak terlalu bermasalah. Warna sedikit lebih muda dari foto tapi masih cantik. Overall aku suka dan puas dengan pembelian ini. ",
    "Bahan lumayan bagus dan adem. Jahitan secara keseluruhan rapi. Warnanya agak sedikit berbeda dari foto tapi tidak terlalu signifikan. Untuk kualitas di harga segini sudah cukup worth it sih. ",
  ],
  3: [
    "Bajunya lumayan, bahan cukup adem meskipun tidak se-premium yang aku bayangkan. Jahitan di beberapa bagian kurang rapi tapi masih oke untuk dipakai. Warna agak meleset dari foto. Masih dalam tahap bisa diterima sih. ",
  ],
  2: [
    "Bahan kurang sesuai ekspektasi, agak kaku dan sedikit gerah. Jahitan di bagian bawah kurang rapi. Warnanya cukup jauh dari foto. Tapi masih bisa dipakai, hanya tidak sesuai yang diharapkan. ",
  ],
  1: [
    "Sangat kecewa, bahan terasa tipis dan tidak nyaman dipakai. Jahitannya kurang rapi di beberapa titik. Warna jauh berbeda dari foto. Semoga ke depannya bisa diperbaiki kualitasnya. ",
  ],
};

const SIZE_FIT: Record<number, string[]> = {
  5: [
    "Untuk ukuran, aku ambil size M dan postur aku 158cm berat 53kg, hasilnya pas banget! Tidak terlalu longgar tapi juga tidak sempit. Panjangnya pun pas menutup sampai bawah lutut bahkan hampir ke mata kaki, beneran syari! Buat yang posturnya lebih tinggi atau badannya lebih besar bisa pertimbangkan naik satu size ya. Size chart-nya akurat banget, sangat membantu dalam pemilihan ukuran. ",
    "Size L yang aku ambil pas banget di badan aku yang tingginya 163cm dan berat 60kg. Potongannya A-line jadi nyaman dan tidak terlalu ngepas di bagian perut dan pinggul. Lengannya panjang dan menutupi dengan baik. Sangat sesuai dengan size guide yang disediakan. Sangat membantu buat yang biasa bingung pilih ukuran! ",
    "Ambil size M sesuai anjuran size chart, dan memang pas di badan aku. Potongannya lebar di bawah jadi memberi ruang gerak yang nyaman. Panjangnya ideal, tidak terlalu panjang sehingga tidak perlu dilipat. Jahitan di bagian pinggang dan bahu sempurna. ",
  ],
  4: [
    "Ukuran sesuai size chart, aku ambil M dan hasilnya agak sedikit besar tapi masih bisa dipakai dengan nyaman. Panjangnya oke, pas menutup lutut. Mungkin bagi yang badannya lebih kecil bisa pilih size S ya. ",
    "Size L pas di badan aku tapi sedikit longgar di bagian dada. Untuk yang punya badan lebih berisi mungkin pas banget. Panjangnya sudah cukup syari. ",
  ],
  3: [
    "Ukurannya agak kurang sesuai sama size chart, agak lebih panjang dari yang aku ekspektasikan. Tapi masih bisa dipakai kok. ",
  ],
  2: [
    "Ukurannya tidak sesuai size chart, terasa lebih kecil dari yang seharusnya. Agak tidak nyaman di bagian lengan. ",
  ],
  1: [
    "Size chart tidak akurat, baju jauh lebih kecil dari yang seharusnya untuk ukuran yang aku pilih. ",
  ],
};

const DELIVERY: Record<number, string[]> = {
  5: [
    "Pengiriman sangat cepat! Pesan kemarin sore, besok paginya sudah sampai dalam kondisi sempurna. Dikemas super rapi menggunakan bubble wrap tebal plus kardus yang kokoh sehingga baju tidak kusut sama sekali. Seller juga sangat responsif dan komunikatif ketika aku tanya tentang ketersediaan warna dan ukuran. Benar-benar seller bintang lima! ",
    "Paket datang lebih cepat dari estimasi! Kemasannya luar biasa rapi, baju dilipat dengan sempurna di dalam plastik ziplock lalu dibungkus bubble wrap, baru dimasukkan ke kardus. Kondisi barang 100% sempurna waktu dibuka. Seller juga cantumkan nota dan kartu ucapan kecil yang manis. Detail kecil seperti ini yang bikin customer loyal! ",
    "Pengiriman aman dan tepat waktu. Packing sangat profesional, ada wangi aromaterapi yang lembut saat buka paket. Seller sangat tanggap merespon pesan, ramah dan informatif. Pengalaman belanja yang sangat menyenangkan! ",
  ],
  4: [
    "Pengiriman sesuai estimasi, packing rapi dan aman. Seller cukup responsif meskipun kadang agak lama balasnya. Barang sampai dalam kondisi baik. ",
    "Packing bagus, ada bubble wrap. Pengiriman tidak terlalu cepat tapi aman. Seller ramah waktu ditanya-tanya. ",
  ],
  3: [
    "Pengiriman agak lama, melebihi estimasi yang dijanjikan. Packing standar tapi barang masih aman. ",
  ],
  2: [
    "Pengiriman cukup lama dan packing kurang rapi. Beruntung barang tidak rusak. ",
  ],
  1: [
    "Pengiriman sangat lama dan seller kurang responsif. Packing minimal. ",
  ],
};

const CLOSING: Record<number, string[]> = {
  5: [
    "Overall aku SANGAT PUAS banget sama pembelian ini! Ini sudah yang kedua kalinya aku beli di sini dan kualitasnya konsisten. Sudah rekomendasiin ke ibu, kakak, dan teman-teman kantor. Pasti bakal repeat order warna lain! Buat yang masih ragu, JANGAN RAGU lagi ya, worth it banget! Lumara.id is the best! ⭐⭐⭐⭐⭐ Highly recommended! 💜",
    "Pokoknya aku sangat happy dengan pembelian ini! Dapat banyak pujian waktu pakai ke kondangan kemarin, banyak yang tanya beli di mana. Langsung kasih tahu Lumara.id dong! 😄 Kalau kalian lagi cari busana muslimah yang kece dan berkualitas, langsung aja order di sini, tidak bakalan nyesel deh. Love love love! 💕",
    "Puas banget! Lima bintang tidak cukup untuk ngegambarin seberapa suka aku sama baju ini. Sudah aku pakai ke berbagai acara dan selalu dapat compliment. Quality control-nya bagus banget. Lumara.id sudah jadi toko langganan aku sekarang! Terima kasih banyak ya kak! 🙏✨",
  ],
  4: [
    "Overall cukup puas dengan pembelian ini. Ada beberapa hal kecil yang bisa diperbaiki tapi tidak mengurangi kesenangan berbelanja di sini. Mungkin akan repeat order lagi di lain waktu. Recommended! ⭐⭐⭐⭐",
    "Cukup satisfied! Untuk harganya, sudah sangat worth it. Mungkin beberapa detail kecil bisa ditingkatkan lagi ke depannya. Overall recommended kok! 👍",
  ],
  3: [
    "Biasa saja, tidak terlalu kecewa tapi juga tidak terlalu terkesan. Mungkin tidak akan repeat order dalam waktu dekat. Tapi masih bisa dipakai dan diterima. ⭐⭐⭐",
  ],
  2: [
    "Kurang puas dengan pembelian ini. Semoga ke depannya kualitas dan pelayanannya bisa lebih ditingkatkan. ⭐⭐",
  ],
  1: [
    "Sangat kecewa. Semoga ada perbaikan ke depannya. ⭐",
  ],
};

function buildComment(rating: number): string {
  const r = Math.min(5, Math.max(1, rating));
  const qArr = QUALITY[r]   ?? QUALITY[3];
  const sArr = SIZE_FIT[r]  ?? SIZE_FIT[3];
  const dArr = DELIVERY[r]  ?? DELIVERY[3];
  const cArr = CLOSING[r]   ?? CLOSING[3];
  const pick = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];
  return [pick(OPENING), pick(qArr), pick(sArr), pick(dArr), pick(cArr)].join("");
}

function weightedRating(): number {
  const r = Math.random();
  if (r < 0.70) return 5;
  if (r < 0.90) return 4;
  if (r < 0.97) return 3;
  if (r < 0.99) return 2;
  return 1;
}

function randomDate(monthsBack = 6): Date {
  const now = Date.now();
  const earliest = now - monthsBack * 30 * 24 * 60 * 60 * 1000;
  return new Date(earliest + Math.random() * (now - earliest));
}

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
const TOTAL_USERS   = 3000;
const BATCH_SIZE    = 500;

async function main() {
  console.log("🌱 Seed ulasan skala besar dimulai...\n");

  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  if (!products.length) { console.log("⚠️  Tidak ada produk."); return; }
  console.log(`📦 ${products.length} produk ditemukan.\n`);

  // ── 1. Generate & batch-create 3000 users ───────────────────────────────
  console.log(`👥 Membuat ${TOTAL_USERS} akun pembeli...`);
  const allUsers = genUsers(TOTAL_USERS);

  for (let i = 0; i < allUsers.length; i += BATCH_SIZE) {
    const batch = allUsers.slice(i, i + BATCH_SIZE);
    await prisma.user.createMany({ data: batch, skipDuplicates: true });
    process.stdout.write(`\r   ${Math.min(i + BATCH_SIZE, allUsers.length)}/${TOTAL_USERS} user...`);
  }
  console.log("\n   ✓ User siap.\n");

  // Ambil ID user dari DB (sudah skip duplicate, ambil yang beneran ada)
  const dbUserIds = (
    await prisma.user.findMany({
      where: { email: { in: allUsers.map(u => u.email) } },
      select: { id: true },
    })
  ).map(u => u.id);

  console.log(`   ${dbUserIds.length} user aktif di database.\n`);

  // ── 2. Buat review per produk ────────────────────────────────────────────
  let grandTotal = 0;

  for (const product of products) {
    console.log(`📝 Produk: ${product.name.slice(0, 50)}...`);

    // Cek review yang sudah ada agar tidak duplikat user per produk
    const existingUserIds = new Set(
      (await prisma.review.findMany({
        where: { productId: product.id },
        select: { userId: true },
      })).map(r => r.userId)
    );

    const newUsers = dbUserIds.filter(id => !existingUserIds.has(id));
    console.log(`   ${newUsers.length} user baru akan direview...`);

    let added = 0;
    for (let i = 0; i < newUsers.length; i += BATCH_SIZE) {
      const batch = newUsers.slice(i, i + BATCH_SIZE).map(userId => ({
        id: randomUUID(),
        userId,
        productId: product.id,
        rating: weightedRating(),
        comment: buildComment(weightedRating()),
        images: JSON.stringify([]),
        createdAt: randomDate(6),
      }));
      await prisma.review.createMany({ data: batch, skipDuplicates: true });
      added += batch.length;
      process.stdout.write(`\r   ${added}/${newUsers.length} ulasan...`);
    }

    await recalcRating(product.id);
    grandTotal += added;
    console.log(`\n   ✓ Selesai — ${added} ulasan ditambahkan.\n`);
  }

  console.log(`\n✅ Done! Total ${grandTotal} ulasan berhasil ditambahkan ke database.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
