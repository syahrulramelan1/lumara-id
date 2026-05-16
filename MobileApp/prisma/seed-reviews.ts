/**
 * Seed ulasan realistis gaya Shopee/Tokopedia/TikTok Shop
 * Total ~3000 review, rating agregat 4.8–5.0, komentar unik per review.
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
const HEIGHTS  = [148,150,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,170];
const WEIGHTS  = [42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,60,62,63,65];
const CITIES   = ["Jakarta","Surabaya","Bandung","Medan","Bekasi","Tangerang","Depok","Semarang","Makassar","Palembang","Yogyakarta","Balikpapan","Bogor","Malang","Pekanbaru","Batam","Banjarmasin","Padang","Pontianak","Lampung","Cirebon","Tasikmalaya","Kediri","Jember","Samarinda","Solo","Madiun","Mojokerto","Probolinggo","Banyuwangi","Kupang","Ambon","Jayapura","Manado","Ternate","Palu"];
const OCCASIONS = ["kondangan","kerja","pengajian","wisuda","arisan","lebaran","acara keluarga","hangout","kajian","reuni","lamaran","pernikahan","silaturahmi","rapat kantor","perpisahan sekolah","acara kampus","seminar","gathering kantor"];
const COURIERS  = ["JNE","J&T","SiCepat","Anteraja","Ninja Express","Pos Indonesia","TIKI","Lion Parcel","GoSend","GrabExpress"];
const COLORS_REF = ["navy","hitam","abu-abu","dusty pink","cream","mocca","olive green","burgundy","putih","coklat muda","biru dongker","tosca","mustard","sage green","lilac","maroon","grey","dark green","off white","caramel"];

const rnd = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const coin = (p = 0.5) => Math.random() < p;
const num  = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

type V = { sz: string; h: number; w: number; city: string; acara: string; kurir: string; warna: string };
const mkV = (): V => ({ sz: rnd(SIZES), h: rnd(HEIGHTS), w: rnd(WEIGHTS), city: rnd(CITIES), acara: rnd(OCCASIONS), kurir: rnd(COURIERS), warna: rnd(COLORS_REF) });

// ── Pool kalimat — semakin besar pool, semakin sedikit duplikat ─────────────

// Kalimat pembuka (opsional, 60% kemunculan)
const PEMBUKA: string[] = [
  "Barang sudah sampai dengan kondisi baik.",
  "Pesanan diterima dalam keadaan aman.",
  "Paket tiba hari ini, kondisi mulus.",
  "Alhamdulillah barang sampai sesuai estimasi.",
  "Baru saja unboxing, kondisi paket oke.",
  "Barang nyampe, langsung dicoba.",
  "Pesanan udah di tangan, packingnya rapi.",
  "Barang tiba lebih cepat dari perkiraan.",
  "Paket sampai dengan selamat.",
  "Baru buka paket, langsung happy.",
  "Barang sampai dalam kondisi terlipat rapi.",
  "Packing bubble wrap, jadi aman sampai tujuan.",
  "Terima kasih, barang cepat sampai.",
  "Udah nyampe ke tangan aku.",
  "Paket diterima, kondisi prima.",
  "Barang sampai hari ini, langsung dicoba.",
  "Baru unboxing, hasilnya tidak mengecewakan.",
  "Produk sudah diterima, packing aman.",
  "Pengiriman cepat, barang langsung dicoba.",
  "Akhirnya barang sampai, senang sekali.",
  "Barang baru sampai pagi ini.",
  "Langsung dicoba begitu paket dibuka.",
  "Paket sampai lebih awal dari estimasi.",
  "Diterima dengan kondisi sempurna.",
];

// Kualitas bahan — positif (dominan untuk produk rated 4.8+)
const BAHAN_POS: string[] = [
  "Bahannya adem dan lembut di kulit.",
  "Kainnya tidak panas sama sekali walau dipakai seharian.",
  "Bahan terasa ringan, cocok untuk iklim tropis.",
  "Kualitas kain di luar ekspektasi, halus banget.",
  "Bahannya jatuh dengan baik di badan, tidak kaku.",
  "Material terasa premium meskipun harganya terjangkau.",
  "Kain tidak transparan walau tipis.",
  "Bahannya menyerap keringat, nyaman dipakai aktivitas.",
  "Tekstur kain halus, tidak bikin gatal.",
  "Bahan adem, cocok untuk kerja seharian.",
  "Kainnya lembut dan tidak mudah kusut.",
  "Material quality-nya oke untuk harga segini.",
  "Bahannya tidak luntur setelah beberapa kali cuci.",
  "Kain tebal tapi tetap ringan, tidak pengap.",
  "Bahan stretch-nya pas, tidak ketat dan tidak melorot.",
  "Kualitas kain lebih bagus dari yang diharapkan.",
  "Bahan terasa adem, tidak pengap dipakai.",
  "Kainnya jatuh cantik, tidak kaku sama sekali.",
  "Material-nya tahan lama, sudah dicuci beberapa kali masih bagus.",
  "Bahannya premium, terasa mahal di tangan.",
  "Kain tidak melar setelah dicuci.",
  "Bahan ringan dan nyaman untuk aktivitas seharian.",
  "Teksturnya halus dan tidak bikin gerah.",
  "Kualitas bahan melebihi ekspektasi untuk harga ini.",
  "Bahannya lembut banget, cocok untuk kulit sensitif.",
  "Kain tebal yang pas, tidak terlalu tebal tidak terlalu tipis.",
  "Material breathable-nya oke, tidak pengap.",
  "Kainnya tidak pilling setelah beberapa kali cuci.",
  "Bahan yang dipakai terasa nyaman sepanjang hari.",
  "Kain jatuhnya cantik saat dipakai.",
];

// Ukuran — dengan variabel
const UKURAN: ((v: V) => string)[] = [
  v => `Size ${v.sz} pas banget di aku, tinggi ${v.h}cm berat ${v.w}kg.`,
  v => `Untuk referensi: aku ${v.h}cm ${v.w}kg, ambil size ${v.sz} hasilnya pas.`,
  v => `Size chart akurat, ${v.sz} sesuai di aku yang ${v.h}cm ${v.w}kg.`,
  v => `Aku biasanya size ${v.sz} dan ternyata tepat sekali.`,
  v => `Untuk postur seperti aku (${v.h}cm, ${v.w}kg), size ${v.sz} recommended.`,
  v => `Size ${v.sz} pas, tidak kekecilan tidak kebesaran. Tinggi ${v.h}cm berat ${v.w}kg.`,
  v => `Panjangnya pas untuk tinggi ${v.h}cm.`,
  v => `Size ${v.sz} di aku ${v.h}cm ${v.w}kg agak sedikit longgar tapi masih enak dipakai.`,
  _ => `Ukurannya true to size, tidak perlu ragu.`,
  _ => `Size chart-nya akurat, sesuai yang tertera di deskripsi.`,
  v => `Aku ambil size ${v.sz} dan ternyata fit sempurna.`,
  v => `Referensi ukuran aku ${v.h}cm ${v.w}kg, size ${v.sz} sangat cocok.`,
  v => `Size ${v.sz} nyaman di badan, tidak terlalu longgar. Tinggi aku ${v.h}cm.`,
  _ => `Panjang bajunya sesuai ekspektasi, tidak terlalu panjang tidak terlalu pendek.`,
  v => `Aku tinggi ${v.h}cm bb ${v.w}kg, size ${v.sz} hasilnya sempurna.`,
];

// Warna — dengan variabel
const WARNA_ARR: ((v: V) => string)[] = [
  v => `Warna ${v.warna}-nya persis seperti di foto.`,
  _ => `Warna sesuai yang ditampilkan di foto produk.`,
  _ => `Warnanya tidak meleset dari foto, senang sekali.`,
  v => `Pilih warna ${v.warna} dan ternyata bagus di kulit sawo matang.`,
  _ => `Warnanya lebih cantik waktu dilihat langsung.`,
  v => `Warna ${v.warna} cocok untuk harian, tidak terlalu mencolok.`,
  _ => `Pigmen warna oke, tidak pudar setelah dicuci.`,
  _ => `Warna konsisten dan tidak belang.`,
  v => `Senang dengan pilihan warna ${v.warna}, cocok dengan kulit aku.`,
  _ => `Warna persis di foto, tidak ada perbedaan signifikan.`,
  v => `Warna ${v.warna} elegan dan mudah dipadukan.`,
  _ => `Warna aslinya bagus sekali, tidak mengecewakan.`,
  _ => `Warna sesuai deskripsi, kualitas warna terjaga.`,
  v => `Ambil warna ${v.warna} dan tidak nyesel sama sekali.`,
  _ => `Warna-nya cantik, tidak terlalu gelap tidak terlalu terang.`,
];

// Jahitan
const JAHITAN: string[] = [
  "Jahitannya rapi, tidak ada benang yang menyeret.",
  "Detail jahitan halus, kualitas terasa premium.",
  "Tidak ada cacat jahitan sama sekali.",
  "Finishing rapi, sesuai standar busana muslim yang baik.",
  "Jahitan kuat, tidak ada yang longgar.",
  "Detail pinggiran jahitannya rapi.",
  "Ornamen terpasang kuat, tidak mudah lepas.",
  "Kerapian jahitan di atas rata-rata untuk harga ini.",
  "Tidak ada jahitan yang loncat atau benang keluar.",
  "Jahitannya presisi, terlihat dikerjakan dengan teliti.",
  "Kualitas jahitan setara produk toko offline.",
  "Penyelesaian (finishing) produk sangat baik.",
  "Tidak ada cacat produksi yang terlihat.",
  "Jahitan tepi sangat rapi, tidak ada yang kasar.",
];

// Pengiriman — dengan variabel
const KIRIM: ((v: V) => string)[] = [
  v => `Pengiriman via ${v.kurir} cepat, sampai dalam 2 hari.`,
  v => `Kurir ${v.kurir} sigap, barang sampai lebih awal.`,
  _ => `Pengiriman sesuai estimasi, tidak ada masalah.`,
  _ => `Proses pengiriman cepat dan tracking-nya jelas.`,
  _ => `Tidak ada keterlambatan pengiriman.`,
  _ => `Seller cepat proses pesanan, jadi pengiriman tidak molor.`,
  v => `Pengiriman pakai ${v.kurir}, estimasi 2-3 hari dan tepat waktu.`,
  _ => `Pengiriman oke, packing aman dengan bubble wrap.`,
  _ => `Tracking pengiriman jelas dan update.`,
  v => `Dikirim via ${v.kurir}, sampai dalam kondisi baik.`,
  _ => `Pesanan diproses cepat oleh seller.`,
  _ => `Packing sangat aman, barang tidak rusak selama pengiriman.`,
  _ => `Pengiriman sangat cepat, melebihi ekspektasi.`,
  _ => `Barang dikemas dengan baik sebelum dikirim.`,
];

// Pemakaian/Acara — dengan variabel
const PAKAI: ((v: V) => string)[] = [
  v => `Langsung dipakai ke ${v.acara} dan banyak yang compliment.`,
  v => `Sudah dicoba untuk acara ${v.acara}, tampil memuaskan.`,
  v => `Cocok banget untuk ${v.acara}, penampilannya elegan.`,
  v => `Beli khusus untuk ${v.acara}, hasilnya tidak mengecewakan.`,
  _ => `Nyaman untuk aktivitas harian maupun formal.`,
  _ => `Bisa dipadukan dengan banyak outfit.`,
  _ => `Tetap terlihat syari dan elegant untuk berbagai acara.`,
  _ => `Sudah dipakai beberapa kali, kualitas tetap terjaga.`,
  v => `Dipakai ke ${v.acara} dan dapat banyak pujian dari teman-teman.`,
  v => `Cocok sekali untuk acara ${v.acara}, penampilannya memuaskan.`,
  _ => `Nyaman dipakai dari pagi hingga malam.`,
  _ => `Versatile, bisa dipakai ke banyak kesempatan.`,
  v => `Hadir ke ${v.acara} dengan percaya diri pakai ini.`,
  _ => `Model dan bahan yang pas untuk berbagai kegiatan.",`,
];

// Seller
const SELLER_ARR: string[] = [
  "Penjual responsif ketika ada pertanyaan.",
  "Admin ramah dan fast respon.",
  "Penjual membantu waktu konsultasi ukuran.",
  "Toko terpercaya, akan kembali order.",
  "Komunikasi dengan seller lancar.",
  "Seller helpful dan informatif.",
  "Respon admin cepat saat tanya-tanya sebelum beli.",
  "Penjual kooperatif dan ramah.",
  "Seller profesional, pesanan diproses cepat.",
  "Toko sangat recommended, seller amanah.",
];

// Kesimpulan positif (wajib untuk rating 4-5)
const KESIM_POS: string[] = [
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
  "Barang sesuai foto dan deskripsi, sangat memuaskan.",
  "Produk berkualitas, harga terjangkau. Mantap.",
  "Pengalaman belanja yang menyenangkan.",
  "Langsung tambah ke wishlist untuk varian berikutnya.",
  "Kualitas terjamin, akan order lagi.",
  "Belanja sini lagi ah, puas banget.",
  "Rating bintang 5 pantas untuk produk ini.",
  "Tidak ragu untuk repeat order.",
  "Sudah puas, teman-teman juga ikut order.",
  "Produk terbaik untuk kategori harganya.",
  "Pengalaman belanja yang memuaskan dari awal hingga akhir.",
  "Rekomendasikan tanpa syarat.",
  "Ini sudah order ke sekian kali, selalu memuaskan.",
  "Qualitas produk konsisten setiap order.",
  "Toko ini sudah jadi langganan.",
];

// Kesimpulan netral (untuk rating 3)
const KESIM_NET: string[] = [
  "Secara keseluruhan cukup memuaskan untuk harganya.",
  "Lumayan bagus, ada sedikit kekurangan tapi masih acceptable.",
  "Boleh dicoba untuk yang penasaran.",
  "Sesuai harga yang dibayar.",
  "Masih perlu perbaikan di beberapa aspek.",
  "Overall oke, namun ada ruang untuk improvement.",
  "Cukup memuaskan, tapi tidak istimewa.",
];

// Minor negatif (hanya muncul di rating 4 — 20% kemunculan)
const MINOR_NEG: string[] = [
  "Ada sedikit perbedaan warna dari foto, tapi tidak signifikan.",
  "Bahannya sedikit kaku di awal, tapi setelah dicuci lebih lembut.",
  "Size sedikit berbeda dari ekspektasi, tapi masih oke.",
  "Pengiriman agak lama, tapi barang sampai dengan selamat.",
  "Warna sedikit berbeda dari foto layar, masih cantik.",
  "Jahitan di satu bagian kurang rapi, tapi tidak terlalu terlihat.",
];

// ── Nama pembeli ─────────────────────────────────────────────────────────────
const FIRST_NAMES: string[] = [
  "Siti","Dewi","Rina","Fitri","Nurul","Indah","Maya","Ayu","Ratna","Yuni",
  "Nisa","Lia","Desi","Wulan","Rini","Novita","Hana","Sari","Tuti","Endah",
  "Mira","Lina","Ani","Nita","Dina","Fira","Nanda","Putri","Riska","Vina",
  "Laila","Zahra","Farah","Naila","Salma","Aulia","Nabila","Anisa","Silvi","Bella",
  "Citra","Diana","Eka","Gita","Hilda","Irma","Jihan","Kiki","Lely","Mita",
  "Neni","Okta","Pita","Rara","Siska","Tari","Ulfa","Vivi","Windi","Yanti",
  "Amira","Bunga","Cantika","Dwi","Erni","Febri","Hasna","Intan","Jasmine","Kartika",
  "Lailani","Maulida","Nayla","Permata","Rahma","Shinta","Tiara","Ummi","Viola","Wahyu",
  "Alvina","Balqis","Cahaya","Dinda","Elok","Fauzia","Humaira","Izzah","Junita","Karina",
  "Listia","Maryam","Nabilah","Oktavia","Priscila","Qorina","Rosita","Sheila","Tasya","Ulfah",
  "Venny","Winda","Xenita","Yayang","Zulfah","Aisha","Berliana","Cornelia","Diah","Erika",
  "Fairuza","Ghina","Hanifa","Isnaini","Juwita","Khalisa","Latifa","Mufida","Nuraini","Olivia",
];

const LAST_NAMES: string[] = [
  "Putri","Sari","Wati","Ningrum","Dewi","Rahayu","Lestari","Handayani","Kusuma","Pratiwi",
  "Puspita","Anggraeni","Wahyuni","Susanti","Octavia","Nuraini","Safitri","Permata","Andriani","Cahyani",
  "Mulyani","Setiawati","Kurniawati","Rahmawati","Fitriani","Nurhayati","Saputri","Widiastuti","Hartati","Suryani",
  "Amalia","Nurfadillah","Hidayah","Rohmah","Hasanah","Marlina","Juliana","Agustina","Noviani","Febriani",
  "Mariana","Ariani","Hartini","Purnama","Santika","Trisnawati","Utami","Valentina","Wahyuningsih","Yuniarti",
];

// ── Distribusi rating → target rata-rata 4.85 ──────────────────────────────
// 88% bintang 5, 10% bintang 4, 1.5% bintang 3, 0.5% bintang 1-2
function pickRating(): number {
  const r = Math.random();
  if (r < 0.88) return 5;
  if (r < 0.98) return 4;
  if (r < 0.995) return 3;
  return Math.random() < 0.5 ? 2 : 1;
}

// ── Random date 10 bulan ke belakang ─────────────────────────────────────
function randomPastDate(maxDaysAgo = 300): Date {
  const ms = Math.floor(Math.random() * maxDaysAgo * 86400000);
  return new Date(Date.now() - ms);
}

// ── Fungsi acak tanpa pengembalian (hindari duplikat dalam satu review) ───
function pickUniq<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

// ── Bangun satu komentar unik ─────────────────────────────────────────────
function buildComment(rating: number, v: V): string {
  const parts: string[] = [];

  if (rating >= 4) {
    if (coin(0.55)) parts.push(rnd(PEMBUKA));
    parts.push(...pickUniq(BAHAN_POS, num(1, 2)));
    if (coin(0.75)) parts.push(rnd(UKURAN)(v));
    if (coin(0.55)) parts.push(rnd(WARNA_ARR)(v));
    if (coin(0.45)) parts.push(rnd(JAHITAN));
    if (coin(0.50)) parts.push(rnd(KIRIM)(v));
    if (coin(0.45)) parts.push(rnd(PAKAI)(v));
    if (coin(0.30)) parts.push(rnd(SELLER_ARR));
    parts.push(rnd(KESIM_POS));
    // Rating 4: tambahkan catatan minor dengan probabilitas rendah
    if (rating === 4 && coin(0.20)) parts.push(rnd(MINOR_NEG));
  } else if (rating === 3) {
    if (coin(0.40)) parts.push(rnd(PEMBUKA));
    parts.push(rnd(BAHAN_POS));
    if (coin(0.50)) parts.push(rnd(UKURAN)(v));
    parts.push(rnd(MINOR_NEG));
    if (coin(0.40)) parts.push(rnd(KIRIM)(v));
    parts.push(rnd(KESIM_NET));
  } else {
    // Rating 1-2
    if (coin(0.30)) parts.push(rnd(PEMBUKA));
    parts.push(rnd(MINOR_NEG));
    if (coin(0.40)) parts.push(rnd(UKURAN)(v));
    parts.push("Kurang sesuai ekspektasi.");
  }

  // Shuffle bagian tengah agar urutan bervariasi
  if (parts.length > 2) {
    const first = parts[0];
    const last  = parts[parts.length - 1];
    const mid   = parts.slice(1, -1);
    for (let i = mid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mid[i], mid[j]] = [mid[j], mid[i]];
    }
    return [first, ...mid, last].join(" ");
  }
  return parts.join(" ");
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("▶ Menghapus semua ulasan lama...");
  const deleted = await prisma.review.deleteMany({});
  console.log(`  ✓ ${deleted.count} ulasan dihapus.`);

  console.log("▶ Reset rating semua produk...");
  await prisma.product.updateMany({ data: { rating: 0, reviewCount: 0 } });
  console.log("  ✓ Rating di-reset.");

  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  if (!products.length) { console.log("  ✗ Tidak ada produk ditemukan."); return; }
  console.log(`▶ Ditemukan ${products.length} produk.\n`);

  // Pool nama (First × Last = ribuan kombinasi unik)
  const namePairs: string[] = [];
  for (const fn of FIRST_NAMES) {
    for (const ln of LAST_NAMES) {
      namePairs.push(`${fn}|${ln}`);
    }
  }
  // Shuffle pool
  for (let i = namePairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [namePairs[i], namePairs[j]] = [namePairs[j], namePairs[i]];
  }

  let totalCreated = 0;
  let nameIdx = 0;

  for (const product of products) {
    // Target 200–350 ulasan per produk → total ~3000 untuk ~10-15 produk
    const target = num(200, 350);
    console.log(`→ [${product.name}] target: ${target} ulasan`);

    const reviewsData: {
      userId: string; productId: string; rating: number;
      comment: string; images: string; createdAt: Date;
    }[] = [];

    for (let i = 0; i < target; i++) {
      const pair    = namePairs[nameIdx % namePairs.length];
      nameIdx++;
      const [fn, ln] = pair.split("|");
      const suffix   = num(10, 99999);
      const email    = `${fn.toLowerCase()}.${ln.toLowerCase()}${suffix}@buyer.lumara`;

      const user = await prisma.user.upsert({
        where:  { email },
        update: {},
        create: { email, name: `${fn} ${ln}`, role: "USER" },
        select: { id: true },
      });

      const rating    = pickRating();
      const v         = mkV();
      const comment   = buildComment(rating, v);
      // Sebar tanggal: setiap entry beda 1-48 jam
      const baseDate  = randomPastDate(300);
      const offsetMs  = i * num(3_600_000, 172_800_000);
      const createdAt = new Date(Math.max(baseDate.getTime() - offsetMs, Date.now() - 300 * 86400000));

      reviewsData.push({ userId: user.id, productId: product.id, rating, comment, images: "[]", createdAt });
    }

    // Insert batch 100
    const BATCH = 100;
    for (let i = 0; i < reviewsData.length; i += BATCH) {
      await prisma.review.createMany({ data: reviewsData.slice(i, i + BATCH), skipDuplicates: true });
    }
    totalCreated += reviewsData.length;

    // Recalculate rating agregat
    const agg = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg:  { rating: true },
      _count: { rating: true },
    });
    const finalRating = Math.round((agg._avg.rating ?? 0) * 10) / 10;
    await prisma.product.update({
      where: { id: product.id },
      data:  { rating: finalRating, reviewCount: agg._count.rating },
    });
    console.log(`   ✓ ${agg._count.rating} ulasan dibuat, rating: ${finalRating}\n`);
  }

  console.log(`\n✅ Selesai! Total ulasan: ${totalCreated}`);
  console.log(`   Rata-rata per produk: ${Math.round(totalCreated / products.length)}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
