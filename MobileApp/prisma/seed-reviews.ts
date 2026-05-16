/**
 * Seed ulasan realistis gaya Shopee/Tokopedia/TikTok Shop
 * Setiap komentar dibuat unik dari kombinasi fragmen kalimat + variabel personal
 * Jalankan: npx tsx prisma/seed-reviews.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";

try {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} catch { /* lanjut */ }

const prisma = new PrismaClient();

// ── Variabel personal ──────────────────────────────────────────────────────
const SIZES    = ["S","M","L","XL","XXL"];
const HEIGHTS  = [148,150,152,154,155,156,158,159,160,161,162,163,164,165,166,167,168,170,172];
const WEIGHTS  = [42,43,44,45,46,47,48,49,50,51,52,53,55,56,57,58,60,62,63,65];
const CITIES   = ["Jakarta","Surabaya","Bandung","Medan","Bekasi","Tangerang","Depok","Semarang","Makassar","Palembang","Yogyakarta","Balikpapan","Bogor","Malang","Pekanbaru","Batam","Banjarmasin","Padang","Pontianak","Lampung","Cirebon","Tasikmalaya","Kediri","Jember","Samarinda"];
const OCCASIONS = ["kondangan","kerja","pengajian","wisuda","arisan","lebaran","acara keluarga","hangout","kajian","reuni SMA","lamaran","pernikahan adik","silaturahmi","rapat kantor","perpisahan sekolah"];
const COURIERS  = ["JNE","J&T","SiCepat","Anteraja","Ninja Express","Pos Indonesia","TIKI","Lion Parcel"];
const COLORS_REF = ["navy","hitam","abu-abu","dusty pink","cream","mocca","olive green","burgundy","putih","coklat muda","biru dongker","tosca","mustard","sage green","lilac"];

const rnd = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const coin = (p = 0.5) => Math.random() < p;
const num = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

type Vars = { sz: string; h: number; w: number; city: string; acara: string; kurir: string; warna: string };
const mkVars = (): Vars => ({ sz: rnd(SIZES), h: rnd(HEIGHTS), w: rnd(WEIGHTS), city: rnd(CITIES), acara: rnd(OCCASIONS), kurir: rnd(COURIERS), warna: rnd(COLORS_REF) });

// ── Pool kalimat per aspek ─────────────────────────────────────────────────

const PENERIMAAN = [
  "Barang sudah sampai dengan kondisi baik.",
  "Pesanan diterima dalam keadaan aman.",
  "Paket tiba hari ini, kondisi mulus.",
  "Alhamdulillah barang sampai sesuai estimasi.",
  "Baru aja unboxing, kondisi paket oke.",
  "Barang nyampe, langsung dicoba.",
  "Pesanan udah di tangan, packingnya rapi.",
  "Barang tiba lebih cepat dari perkiraan.",
  "Paket sampai dengan selamat.",
  "Baru buka paket, seneng banget hasilnya.",
  "Barang sampai dalam kondisi terlipat rapi.",
  "Packing bubble wrap, jadi aman sampai tujuan.",
  "Terima kasih, barang cepat sampai.",
  "Udah nyampe ke tangan aku.",
  "Paket received, kondisi prima.",
];

const BAHAN_POSITIF = [
  "Bahannya adem dan lembut di kulit.",
  "Kainnya tidak panas sama sekali walau dipakai seharian.",
  "Bahan terasa ringan, cocok untuk iklim tropis.",
  "Kualitas kain di luar ekspektasi, halus banget.",
  "Bahannya jatuh dengan baik di badan, tidak kaku.",
  "Material terasa premium meskipun harganya terjangkau.",
  "Kain tidak transparan walau tipis, ini yang dicari.",
  "Bahannya menyerap keringat, nyaman dipakai aktivitas.",
  "Tekstur kain halus, tidak bikin gatal.",
  "Bahan adem banget, cocok buat kerja seharian.",
  "Kainnya lembut dan tidak mudah kusut.",
  "Material quality-nya oke untuk harga segini.",
  "Bahannya tidak luntur setelah dicuci.",
  "Kain tebal tapi tetap ringan, tidak pengap.",
  "Bahan stretch-nya pas, tidak ketat dan tidak melorot.",
];

const BAHAN_NEGATIF = [
  "Bahannya sedikit kaku, perlu beberapa kali pakai biar terasa lebih nyaman.",
  "Material kurang sesuai yang dideskripsikan, tapi masih oke lah.",
  "Bahan agak tipis, harus pakai inner.",
  "Kain sedikit berbeda dari yang difoto, tapi masih acceptable.",
  "Bahannya kurang adem untuk cuaca panas, tapi jahitannya rapi.",
];

const UKURAN = [
  (v: Vars) => `Size ${v.sz} pas banget di aku, tinggi ${v.h}cm berat ${v.w}kg.`,
  (v: Vars) => `Untuk referensi ukuran: aku ${v.h}cm ${v.w}kg, ambil size ${v.sz} dan hasilnya pas.`,
  (v: Vars) => `Size chart-nya akurat, ${v.sz} sesuai di aku yang ${v.h}/${v.w}kg.`,
  (v: Vars) => `Aku biasanya size ${v.sz} dan ternyata tepat sekali.`,
  (v: Vars) => `Untuk yang postur seperti aku (${v.h}cm, ${v.w}kg), size ${v.sz} recommended.`,
  (v: Vars) => `Size ${v.sz} sedikit longgar di aku ${v.h}cm ${v.w}kg, tapi masih enak.`,
  (v: Vars) => `Kalau mau yang agak longgar kayak aku, size ${v.sz} oke. Tinggi ${v.h}cm berat ${v.w}kg.`,
  (_v: Vars) => `Size-nya sesuai chart yang disediakan penjual.`,
  (v: Vars) => `Panjangnya pas untuk tinggi ${v.h}cm.`,
  (_v: Vars) => `Ukurannya true to size, tidak perlu ragu.`,
];

const WARNA = [
  (v: Vars) => `Warna ${v.warna}-nya persis seperti di foto.`,
  (_v: Vars) => "Warna sesuai yang ditampilkan di foto produk.",
  (_v: Vars) => "Warnanya tidak meleset dari foto, senang sekali.",
  (v: Vars) => `Pilih warna ${v.warna} dan ternyata bagus di kulit sawo matang.`,
  (_v: Vars) => "Warnanya lebih cantik waktu dilihat langsung.",
  (v: Vars) => `Warna ${v.warna} cocok buat harian, tidak terlalu mencolok.`,
  (_v: Vars) => "Warnanya agak sedikit berbeda dari foto, tapi tidak masalah.",
  (_v: Vars) => "Warna aslinya sedikit lebih terang dari foto, masih oke.",
  (_v: Vars) => "Pigmen warna oke, tidak pudar setelah dicuci.",
  (_v: Vars) => "Warna konsisten dan tidak belang.",
];

const JAHITAN = [
  "Jahitannya rapi, tidak ada benang yang menyeret.",
  "Detail jahitan halus, kualitas handmade terasa.",
  "Tidak ada cacat jahitan sama sekali.",
  "Finishing rapi, sesuai standar busana muslim yang baik.",
  "Jahitan kuat, tidak ada yang longgar.",
  "Detailnya diperhatikan, jahitan pinggiran rapi.",
  "Ornamennya terpasang kuat, tidak mudah lepas.",
  "Kerapian jahitan di atas rata-rata untuk harga ini.",
];

const PENGIRIMAN = [
  (v: Vars) => `Pengiriman via ${v.kurir} cepat, sampai dalam 2 hari.`,
  (v: Vars) => `Kurir ${v.kurir} sigap, barang sampai lebih awal.`,
  (_v: Vars) => "Pengiriman sesuai estimasi, tidak ada masalah.",
  (_v: Vars) => "Proses pengiriman cepat dan tracking-nya jelas.",
  (v: Vars) => `Dari ${v.city} langsung terlacak, cepat sampai.`,
  (_v: Vars) => "Tidak ada keterlambatan pengiriman.",
  (_v: Vars) => "Pengiriman agak lama, tapi barang sampai dalam kondisi baik.",
  (_v: Vars) => "Seller cepat proses pesanan, jadi pengiriman tidak molor.",
];

const PEMAKAIAN = [
  (v: Vars) => `Langsung dipakai ke ${v.acara} dan banyak yang compliment.`,
  (v: Vars) => `Sudah dicoba untuk acara ${v.acara}, tampil memuaskan.`,
  (v: Vars) => `Cocok banget untuk ${v.acara}, penampilannya elegan.`,
  (v: Vars) => `Beli khusus untuk ${v.acara}, hasilnya tidak mengecewakan.`,
  (_v: Vars) => "Nyaman untuk aktivitas harian maupun formal.",
  (_v: Vars) => "Bisa dipadupadankan dengan banyak outfit.",
  (_v: Vars) => "Tetap terlihat syari dan elegant, cocok untuk berbagai acara.",
  (_v: Vars) => "Sudah dipakai beberapa kali, kualitas tetap terjaga.",
];

const SELLER = [
  "Penjual responsif ketika ada pertanyaan.",
  "Admin ramah dan fast respon.",
  "Penjual membantu waktu konsultasi ukuran.",
  "Toko terpercaya, akan kembali order.",
  "Komunikasi dengan seller lancar.",
  "Seller helpful dan informative.",
];

const KESIMPULAN_POSITIF = [
  "Puas dengan pembelian ini.",
  "Highly recommended untuk yang cari busana muslimah berkualitas.",
  "Worth every rupiah yang dikeluarkan.",
  "Akan repeat order untuk warna lain.",
  "Recommended, tidak akan kecewa.",
  "5 bintang layak untuk produk ini.",
  "Beli lagi pasti kalau ada colorway baru.",
  "Toko ini masuk list langganan.",
  "Sudah share ke teman-teman yang cari baju muslimah.",
  "Produk yang tidak bikin menyesal.",
  "Memenuhi semua ekspektasi.",
  "Sangat rekomendasikan untuk yang cari busana syari berkualitas.",
  "Tidak ada yang perlu dikomplain.",
  "Overall sempurna, tidak ada minus.",
  "Good quality, fast delivery. Puas.",
];

const KESIMPULAN_NETRAL = [
  "Secara keseluruhan cukup memuaskan untuk harganya.",
  "Lumayan bagus, ada sedikit kekurangan tapi masih acceptable.",
  "Boleh dicoba untuk yang penasaran.",
  "Tidak terlalu istimewa tapi juga tidak mengecewakan.",
  "Sesuai harga yang dibayar.",
  "Mungkin akan repeat order kalau ada diskon.",
  "Masih perlu perbaikan tapi potential.",
];

const KESIMPULAN_NEGATIF = [
  "Kurang sesuai ekspektasi, perlu perbaikan kualitas.",
  "Harga tidak sebanding kualitas yang didapat.",
  "Kecewa dengan hasilnya, tidak sesuai foto.",
  "Tidak recommended untuk yang mau beli.",
  "Beli sekali cukup, tidak akan repeat order.",
];

// ── Nama pembeli ─────────────────────────────────────────────────────────────
const FIRST_NAMES_F = [
  "Siti","Dewi","Rina","Fitri","Nurul","Indah","Maya","Ayu","Ratna","Yuni","Nisa","Lia","Desi","Wulan","Rini",
  "Novita","Hana","Sari","Tuti","Endah","Mira","Lina","Ani","Nita","Dina","Fira","Nanda","Putri","Riska","Vina",
  "Laila","Zahra","Farah","Naila","Salma","Aulia","Nabila","Anisa","Silvi","Bella","Citra","Diana","Eka","Gita",
  "Hilda","Irma","Jihan","Kiki","Lely","Mita","Neni","Okta","Pita","Qori","Rara","Siska","Tari","Ulfa","Vivi",
  "Windi","Xena","Yanti","Zara","Amira","Bunga","Cantik","Dwi","Erni","Febri","Galih","Hasna","Intan","Jasmine",
  "Kartika","Lailani","Maulida","Nayla","Oriza","Permata","Qonita","Rahma","Shinta","Tiara","Ummi","Viola","Wahyu",
  "Yayang","Zulfah","Alvina","Balqis","Cahaya","Dinda","Elok","Fauzia","Gema","Humaira","Izzah","Junita",
];

const LAST_NAMES = [
  "Putri","Sari","Wati","Ningrum","Dewi","Rahayu","Lestari","Handayani","Kusuma","Pratiwi",
  "Puspita","Anggraeni","Wahyuni","Susanti","Octavia","Nuraini","Safitri","Permata","Andriani","Cahyani",
  "Mulyani","Setiawati","Kurniawati","Rahmawati","Fitriani","Nurhayati","Maulana","Saputri","Widiastuti","Hartati",
  "Suryani","Amalia","Nurfadillah","Hidayah","Rohmah","Hasanah","Marlina","Juliana","Agustina","Noviani",
  "Febriani","Mariana","Ariani","Hartini","Nurhayati","Purnama","Santika","Trisnawati","Utami","Valentina",
];

// ── Generator komentar ─────────────────────────────────────────────────────

function pickUnique<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function buildComment(rating: number, v: Vars): string {
  const parts: string[] = [];

  if (rating >= 4) {
    // Positif
    if (coin(0.6)) parts.push(rnd(PENERIMAAN));
    parts.push(...pickUnique(BAHAN_POSITIF, num(1, 2)));
    if (coin(0.7)) parts.push(rnd(UKURAN)(v));
    if (coin(0.5)) parts.push(rnd(WARNA)(v));
    if (coin(0.4)) parts.push(rnd(JAHITAN));
    if (coin(0.5)) parts.push(rnd(PENGIRIMAN)(v));
    if (coin(0.4)) parts.push(rnd(PEMAKAIAN)(v));
    if (coin(0.3)) parts.push(rnd(SELLER));
    parts.push(rnd(KESIMPULAN_POSITIF));
    if (rating === 4 && coin(0.3)) {
      parts.push(rnd(BAHAN_NEGATIF));
    }
  } else if (rating === 3) {
    // Netral
    if (coin(0.4)) parts.push(rnd(PENERIMAAN));
    parts.push(rnd(BAHAN_POSITIF));
    if (coin(0.5)) parts.push(rnd(UKURAN)(v));
    parts.push(rnd(BAHAN_NEGATIF));
    if (coin(0.4)) parts.push(rnd(PENGIRIMAN)(v));
    parts.push(rnd(KESIMPULAN_NETRAL));
  } else {
    // Negatif
    if (coin(0.3)) parts.push(rnd(PENERIMAAN));
    parts.push(rnd(BAHAN_NEGATIF));
    if (coin(0.4)) parts.push(rnd(UKURAN)(v));
    if (coin(0.3)) parts.push(rnd(PENGIRIMAN)(v));
    parts.push(rnd(KESIMPULAN_NEGATIF));
  }

  // Shuffle bagian tengah agar urutan tidak monoton (kecuali penerimaan di awal & kesimpulan di akhir)
  const first = parts[0];
  const last  = parts[parts.length - 1];
  const mid   = parts.slice(1, -1);
  for (let i = mid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mid[i], mid[j]] = [mid[j], mid[i]];
  }

  return [first, ...mid, last].join(" ");
}

// ── Distribusi rating ─────────────────────────────────────────────────────
function pickRating(): number {
  const r = Math.random();
  if (r < 0.65) return 5;
  if (r < 0.87) return 4;
  if (r < 0.94) return 3;
  if (r < 0.97) return 2;
  return 1;
}

// ── Random date 8 bulan ke belakang ─────────────────────────────────────
function randomPastDate(maxDaysAgo = 240): Date {
  const ms = Math.floor(Math.random() * maxDaysAgo * 86400000);
  return new Date(Date.now() - ms);
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("▶ Menghapus semua ulasan lama...");
  await prisma.review.deleteMany({});
  console.log("  ✓ Semua ulasan dihapus.");

  console.log("▶ Reset rating semua produk...");
  await prisma.product.updateMany({ data: { rating: 0, reviewCount: 0 } });
  console.log("  ✓ Rating di-reset.");

  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  if (!products.length) { console.log("Tidak ada produk ditemukan."); return; }
  console.log(`▶ Ditemukan ${products.length} produk.`);

  // Buat pool nama pembeli
  const NAMES: { first: string; last: string }[] = [];
  for (const fn of FIRST_NAMES_F) {
    for (const ln of LAST_NAMES) {
      NAMES.push({ first: fn, last: ln });
    }
  }
  // Shuffle nama
  for (let i = NAMES.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [NAMES[i], NAMES[j]] = [NAMES[j], NAMES[i]];
  }

  let totalCreated = 0;
  let nameIdx = 0;

  for (const product of products) {
    // Jumlah ulasan per produk: 40–150
    const reviewCount = num(40, 150);
    console.log(`  → ${product.name}: ${reviewCount} ulasan`);

    // Buat user dummy untuk produk ini
    const usersForProduct: { id: string }[] = [];
    for (let i = 0; i < reviewCount; i++) {
      const { first, last } = NAMES[nameIdx % NAMES.length];
      nameIdx++;
      const suffix = num(10, 9999);
      const email  = `${first.toLowerCase()}${last.toLowerCase()}${suffix}@lumara-buyer.id`;
      const name   = `${first} ${last}`;

      const user = await prisma.user.upsert({
        where:  { email },
        update: {},
        create: {
          email,
          name,
          role: "USER",
        },
        select: { id: true },
      });
      usersForProduct.push(user);
    }

    // Buat ulasan
    const reviewsData = usersForProduct.map((u, idx) => {
      const rating = pickRating();
      const v      = mkVars();
      const comment = buildComment(rating, v);
      const date    = randomPastDate(240);

      // Sebar tanggal agar tidak semua sama — setiap ulasan beda beberapa jam
      const offsetMs = idx * num(3600000, 86400000);
      const createdAt = new Date(date.getTime() - offsetMs);

      return {
        userId:    u.id,
        productId: product.id,
        rating,
        comment,
        images:    JSON.stringify([]),
        createdAt,
      };
    });

    // Insert batch (Prisma createMany tidak support return, jadi pakai loop per 50)
    const BATCH = 50;
    for (let i = 0; i < reviewsData.length; i += BATCH) {
      await prisma.review.createMany({
        data: reviewsData.slice(i, i + BATCH),
        skipDuplicates: true,
      });
    }
    totalCreated += reviewsData.length;

    // Recalculate rating agregat
    const agg = await prisma.review.aggregate({
      where:   { productId: product.id },
      _avg:    { rating: true },
      _count:  { rating: true },
    });
    await prisma.product.update({
      where: { id: product.id },
      data: {
        rating:      Math.round((agg._avg.rating ?? 0) * 10) / 10,
        reviewCount: agg._count.rating,
      },
    });
    console.log(`    rating=${(agg._avg.rating ?? 0).toFixed(1)}, total=${agg._count.rating}`);
  }

  console.log(`\n✅ Selesai. Total ulasan dibuat: ${totalCreated}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
