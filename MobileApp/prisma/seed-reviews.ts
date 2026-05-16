/**
 * Seed ulasan massal gaya Shopee/Tokopedia
 * Target: 5.000–10.000 review per produk, rating 4.8–5.0
 * Menggunakan batch insert (createMany) supaya cepat.
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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const rnd = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const num = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const coin = (p = 0.5) => Math.random() < p;

// ─────────────────────────────────────────────────────────────────────────────
// Variabel personal
// ─────────────────────────────────────────────────────────────────────────────
const SIZES    = ["S","M","L","XL","XXL"];
const HEIGHTS  = [148,150,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,170,172];
const WEIGHTS  = [42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,60,62,63,65,67];
const CITIES   = [
  "Jakarta Selatan","Jakarta Timur","Jakarta Barat","Jakarta Pusat","Jakarta Utara",
  "Surabaya","Bandung","Medan","Bekasi","Tangerang","Depok","Semarang","Makassar",
  "Palembang","Yogyakarta","Balikpapan","Bogor","Malang","Pekanbaru","Batam",
  "Banjarmasin","Padang","Pontianak","Lampung","Cirebon","Tasikmalaya","Kediri",
  "Jember","Samarinda","Solo","Madiun","Mojokerto","Probolinggo","Banyuwangi",
  "Kupang","Ambon","Manado","Palu","Ternate","Sorong","Jayapura","Mataram",
  "Denpasar","Singaraja","Jombang","Gresik","Sidoarjo","Pasuruan","Situbondo",
];
const OCCASIONS = [
  "kondangan","kerja","pengajian","wisuda","arisan","lebaran","acara keluarga",
  "hangout","kajian","reuni","lamaran","pernikahan","silaturahmi","rapat kantor",
  "perpisahan sekolah","acara kampus","seminar","gathering kantor","pengajian rutin",
  "pertemuan PKK","walimah","khitanan","aqiqah","halal bihalal",
];
const COURIERS = ["JNE","J&T","SiCepat","Anteraja","Ninja Express","Pos Indonesia","TIKI","Lion Parcel"];
const COLORS_REF = [
  "navy","hitam","abu-abu","dusty pink","cream","mocca","olive green","burgundy","putih",
  "coklat muda","biru dongker","tosca","mustard","sage green","lilac","maroon","grey",
  "dark green","off white","caramel","lavender","peach","cobalt blue","forest green","chocolate",
];

type V = { sz: string; h: number; w: number; city: string; acara: string; kurir: string; warna: string };
const mkV = (): V => ({
  sz: rnd(SIZES), h: rnd(HEIGHTS), w: rnd(WEIGHTS), city: rnd(CITIES),
  acara: rnd(OCCASIONS), kurir: rnd(COURIERS), warna: rnd(COLORS_REF),
});

// ─────────────────────────────────────────────────────────────────────────────
// Pool kalimat
// ─────────────────────────────────────────────────────────────────────────────

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
  "Baru buka paket, langsung happy dengan hasilnya.",
  "Barang sampai dalam kondisi terlipat rapi.",
  "Packing bubble wrap, aman sampai tujuan.",
  "Terima kasih, barang cepat sampai.",
  "Udah nyampe ke tangan saya.",
  "Paket diterima, kondisi prima.",
  "Barang sampai hari ini, langsung dicoba.",
  "Baru unboxing, hasilnya tidak mengecewakan.",
  "Produk sudah diterima, packing sangat aman.",
  "Pengiriman cepat, barang langsung dicoba.",
  "Akhirnya barang sampai, senang sekali.",
  "Barang baru sampai tadi pagi.",
  "Langsung dicoba begitu paket dibuka.",
  "Paket sampai lebih awal dari estimasi.",
  "Diterima dengan kondisi sempurna.",
  "Sudah terima barang, tidak ada masalah.",
  "Baru nyampe dari kurir, langsung unboxing.",
  "Barang selamat sampai tanpa kerusakan.",
  "Paket datang lebih cepat dari yang dijanjikan.",
];

const BAHAN_POS: string[] = [
  "Bahannya adem dan lembut di kulit.",
  "Kainnya tidak panas sama sekali walau dipakai seharian.",
  "Bahan terasa ringan, cocok untuk iklim tropis.",
  "Kualitas kain di luar ekspektasi, sangat halus.",
  "Bahannya jatuh dengan baik di badan, tidak kaku.",
  "Material terasa premium meskipun harganya terjangkau.",
  "Kain tidak transparan walau terlihat tipis.",
  "Bahannya menyerap keringat, nyaman untuk aktivitas.",
  "Tekstur kain halus, tidak bikin gatal di kulit.",
  "Bahan adem banget, cocok untuk kerja seharian.",
  "Kainnya lembut dan tidak mudah kusut.",
  "Material quality-nya oke untuk harga di kisaran ini.",
  "Bahannya tidak luntur setelah beberapa kali cuci.",
  "Kain tebal tapi tetap ringan, tidak pengap.",
  "Bahan stretch-nya pas, tidak ketat dan tidak melorot.",
  "Kualitas kain lebih bagus dari yang saya harapkan.",
  "Bahan terasa adem, tidak pengap saat dipakai.",
  "Kainnya jatuh cantik, tidak kaku sama sekali.",
  "Material-nya tahan lama, sudah dicuci berkali-kali masih bagus.",
  "Bahannya premium, terasa mahal di tangan.",
  "Kain tidak melar setelah dicuci.",
  "Bahan ringan dan nyaman untuk aktivitas seharian.",
  "Teksturnya halus dan tidak bikin gerah.",
  "Kualitas bahan melebihi ekspektasi untuk harga ini.",
  "Bahannya lembut, cocok untuk kulit sensitif.",
  "Kain tebal yang pas, tidak terlalu tebal tidak terlalu tipis.",
  "Material breathable-nya oke, tidak pengap.",
  "Kainnya tidak pilling setelah beberapa kali cuci.",
  "Bahan yang dipakai nyaman sepanjang hari.",
  "Kain jatuhnya cantik saat dipakai.",
  "Bahannya jauh lebih bagus dari harganya.",
  "Kualitas kain setara baju offline yang lebih mahal.",
  "Bahan tidak panas dan tidak mudah kusut, cocok untuk perjalanan.",
  "Kainnya terasa dingin di kulit, nyaman di iklim panas.",
  "Material premium yang tidak biasa di harga segini.",
];

const UKURAN: ((v: V) => string)[] = [
  v => `Size ${v.sz} pas banget di saya, tinggi ${v.h}cm berat ${v.w}kg.`,
  v => `Untuk referensi: saya ${v.h}cm ${v.w}kg, ambil size ${v.sz} hasilnya pas.`,
  v => `Size chart akurat, ${v.sz} sesuai di saya yang ${v.h}cm ${v.w}kg.`,
  v => `Biasanya pakai size ${v.sz} dan ternyata tepat sekali.`,
  v => `Untuk postur seperti saya (${v.h}cm, ${v.w}kg), size ${v.sz} recommended.`,
  v => `Size ${v.sz} pas, tidak kekecilan tidak kebesaran. Tinggi ${v.h}cm berat ${v.w}kg.`,
  v => `Panjangnya pas untuk tinggi ${v.h}cm.`,
  v => `Size ${v.sz} di saya ${v.h}cm ${v.w}kg agak sedikit longgar tapi masih nyaman.`,
  _ => `Ukurannya true to size, tidak perlu ragu order sesuai biasanya.`,
  _ => `Size chart-nya akurat, sesuai yang tertera di deskripsi.`,
  v => `Ambil size ${v.sz} dan ternyata fit sempurna di badan.`,
  v => `Referensi ukuran: saya ${v.h}cm ${v.w}kg, size ${v.sz} sangat cocok.`,
  v => `Size ${v.sz} nyaman di badan, tidak terlalu longgar. Tinggi saya ${v.h}cm.`,
  _ => `Panjang bajunya sesuai ekspektasi, tidak terlalu panjang tidak terlalu pendek.`,
  v => `Saya tinggi ${v.h}cm bb ${v.w}kg, size ${v.sz} hasilnya sempurna.`,
  v => `Untuk yang bertubuh seperti saya ${v.h}/${v.w}kg, size ${v.sz} pilihan tepat.`,
  _ => `Ukurannya presisi, sesuai dengan panduan ukuran yang diberikan seller.`,
  v => `Size ${v.sz} sangat pas, tidak perlu diubah atau ditambah apapun.`,
];

const WARNA_ARR: ((v: V) => string)[] = [
  v => `Warna ${v.warna}-nya persis seperti di foto.`,
  _ => `Warna sesuai yang ditampilkan di foto produk.`,
  _ => `Warnanya tidak meleset dari foto, senang sekali.`,
  v => `Pilih warna ${v.warna} dan ternyata bagus di kulit sawo matang.`,
  _ => `Warnanya lebih cantik waktu dilihat langsung dibanding foto.`,
  v => `Warna ${v.warna} cocok untuk harian, tidak terlalu mencolok.`,
  _ => `Pigmen warna oke, tidak pudar setelah dicuci.`,
  _ => `Warna konsisten dan tidak belang.`,
  v => `Senang dengan pilihan warna ${v.warna}, cocok dengan kulit saya.`,
  _ => `Warna persis di foto, tidak ada perbedaan signifikan.`,
  v => `Warna ${v.warna} elegan dan mudah dipadukan.`,
  _ => `Warna aslinya bagus sekali, tidak mengecewakan.`,
  _ => `Warna sesuai deskripsi, kualitas warna terjaga.`,
  v => `Ambil warna ${v.warna} dan tidak menyesal sama sekali.`,
  _ => `Warna-nya cantik, tidak terlalu gelap tidak terlalu terang.`,
  _ => `Warna original persis foto, tidak ada editing berlebihan.`,
  v => `Warna ${v.warna} sangat cocok dipadukan dengan berbagai busana.`,
  _ => `Warna stabil, tidak luntur saat pertama kali dicuci.`,
];

const JAHITAN: string[] = [
  "Jahitannya rapi, tidak ada benang yang menyeret.",
  "Detail jahitan halus, kualitas terasa premium.",
  "Tidak ada cacat jahitan sama sekali.",
  "Finishing rapi, sesuai standar busana muslim yang baik.",
  "Jahitan kuat, tidak ada yang longgar.",
  "Detail pinggiran jahitannya rapi dan bersih.",
  "Ornamen terpasang kuat, tidak mudah lepas.",
  "Kerapian jahitan di atas rata-rata untuk harga ini.",
  "Tidak ada jahitan yang loncat atau benang keluar.",
  "Jahitannya presisi, terlihat dikerjakan dengan teliti.",
  "Kualitas jahitan setara produk toko offline.",
  "Penyelesaian (finishing) produk sangat baik.",
  "Tidak ada cacat produksi yang terlihat.",
  "Jahitan tepi sangat rapi, tidak ada yang kasar.",
  "Kualitas jahitan konsisten di seluruh bagian baju.",
  "Jahitannya kuat dan tidak mudah lepas meski sering dipakai.",
];

const KIRIM: ((v: V) => string)[] = [
  v => `Pengiriman via ${v.kurir} cepat, sampai dalam 2 hari.`,
  v => `Kurir ${v.kurir} sigap, barang sampai lebih awal.`,
  _ => `Pengiriman sesuai estimasi, tidak ada masalah.`,
  _ => `Proses pengiriman cepat dan tracking-nya jelas.`,
  _ => `Tidak ada keterlambatan pengiriman.`,
  _ => `Seller cepat proses pesanan, pengiriman tidak molor.`,
  v => `Pakai ${v.kurir}, estimasi 2-3 hari dan tepat waktu.`,
  _ => `Pengiriman oke, packing aman dengan bubble wrap.`,
  _ => `Tracking pengiriman jelas dan selalu update.`,
  v => `Dikirim via ${v.kurir}, sampai dalam kondisi baik.`,
  _ => `Pesanan diproses cepat oleh seller.`,
  _ => `Packing sangat aman, barang tidak rusak selama pengiriman.`,
  _ => `Pengiriman sangat cepat, melebihi ekspektasi.`,
  _ => `Barang dikemas dengan sangat baik sebelum dikirim.`,
  _ => `Seller langsung proses hari yang sama dengan order.`,
  _ => `Tidak ada masalah dengan pengiriman, sesuai resi yang diberikan.`,
];

const PAKAI: ((v: V) => string)[] = [
  v => `Langsung dipakai ke ${v.acara} dan banyak yang compliment.`,
  v => `Sudah dicoba untuk acara ${v.acara}, tampil memuaskan.`,
  v => `Cocok banget untuk ${v.acara}, penampilannya elegan.`,
  v => `Beli khusus untuk ${v.acara}, hasilnya tidak mengecewakan.`,
  _ => `Nyaman untuk aktivitas harian maupun acara formal.`,
  _ => `Bisa dipadukan dengan banyak outfit berbeda.`,
  _ => `Tetap terlihat syari dan elegant untuk berbagai acara.`,
  _ => `Sudah dipakai beberapa kali, kualitas tetap terjaga.`,
  v => `Dipakai ke ${v.acara} dan dapat banyak pujian dari teman-teman.`,
  v => `Cocok sekali untuk acara ${v.acara}, penampilannya memuaskan.`,
  _ => `Nyaman dipakai dari pagi hingga malam tanpa rasa gerah.`,
  _ => `Versatile, bisa dipakai ke banyak kesempatan.`,
  v => `Hadir ke ${v.acara} dengan percaya diri pakai ini.`,
  _ => `Model dan bahan yang pas untuk berbagai kegiatan.`,
  _ => `Cocok dipakai ke mana saja, dari rumah hingga acara formal.`,
];

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
  "Pelayanan prima dari seller.",
  "Seller dengan cepat menjawab semua pertanyaan.",
];

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
  "Belanja sini lagi, puas banget.",
  "Rating bintang 5 pantas untuk produk ini.",
  "Tidak ragu untuk repeat order.",
  "Sudah puas, teman-teman juga ikut order.",
  "Produk terbaik untuk kategori harganya.",
  "Pengalaman belanja yang memuaskan dari awal hingga akhir.",
  "Rekomendasikan tanpa syarat.",
  "Kualitas produk konsisten setiap order.",
  "Toko ini sudah jadi langganan tetap.",
  "Bahan dan model sesuai ekspektasi, tidak mengecewakan.",
  "Kalau ada varian baru pasti langsung order.",
  "Sudah buktikan kualitasnya, memang bagus.",
  "Lebih dari cukup untuk harga yang dibayar.",
];

const MINOR_NEG: string[] = [
  "Ada sedikit perbedaan warna dari foto, tapi tidak signifikan.",
  "Bahannya sedikit kaku di awal, tapi setelah dicuci lebih lembut.",
  "Pengiriman agak lama, tapi barang sampai dengan selamat.",
  "Warna sedikit berbeda dari foto layar, masih cantik.",
];

const KESIM_NET: string[] = [
  "Secara keseluruhan cukup memuaskan untuk harganya.",
  "Lumayan bagus, ada sedikit kekurangan tapi masih acceptable.",
  "Sesuai harga yang dibayar.",
  "Overall oke, namun ada ruang untuk improvement.",
  "Cukup memuaskan, tapi tidak istimewa.",
];

// ─────────────────────────────────────────────────────────────────────────────
// Nama pembeli (First 115 × Last 50 = 5.750 kombinasi unik)
// ─────────────────────────────────────────────────────────────────────────────
const FIRSTS: string[] = [
  "Siti","Dewi","Rina","Fitri","Nurul","Indah","Maya","Ayu","Ratna","Yuni",
  "Nisa","Lia","Desi","Wulan","Rini","Novita","Hana","Sari","Tuti","Endah",
  "Mira","Lina","Ani","Nita","Dina","Fira","Nanda","Putri","Riska","Vina",
  "Laila","Zahra","Farah","Naila","Salma","Aulia","Nabila","Anisa","Silvi","Bella",
  "Citra","Diana","Eka","Gita","Hilda","Irma","Jihan","Kiki","Lely","Mita",
  "Neni","Okta","Pita","Rara","Siska","Tari","Ulfa","Vivi","Windi","Yanti",
  "Amira","Bunga","Cantika","Dwi","Erni","Febri","Hasna","Intan","Jasmine","Kartika",
  "Lailani","Maulida","Nayla","Permata","Rahma","Shinta","Tiara","Ummi","Viola","Wahyu",
  "Alvina","Balqis","Cahaya","Dinda","Elok","Fauzia","Humaira","Izzah","Junita","Karina",
  "Listia","Maryam","Nabilah","Oktavia","Qorina","Rosita","Sheila","Tasya","Ulfah","Venny",
  "Yuliana","Zulfah","Aisha","Berliana","Cornelia","Diah","Erika","Fairuza","Ghina","Hanifa",
  "Isnaini","Juwita","Khalisa","Latifa","Mufida","Nuraini","Olivia",
];

const LASTS: string[] = [
  "Putri","Sari","Wati","Ningrum","Dewi","Rahayu","Lestari","Handayani","Kusuma","Pratiwi",
  "Puspita","Anggraeni","Wahyuni","Susanti","Octavia","Nuraini","Safitri","Permata","Andriani","Cahyani",
  "Mulyani","Setiawati","Kurniawati","Rahmawati","Fitriani","Nurhayati","Saputri","Widiastuti","Hartati","Suryani",
  "Amalia","Nurfadillah","Hidayah","Rohmah","Hasanah","Marlina","Juliana","Agustina","Noviani","Febriani",
  "Mariana","Ariani","Hartini","Purnama","Santika","Trisnawati","Utami","Valentina","Wahyuningsih","Yuniarti",
];

// ─────────────────────────────────────────────────────────────────────────────
// Distribusi rating → rata-rata 4.85
// ─────────────────────────────────────────────────────────────────────────────
function pickRating(): number {
  const r = Math.random();
  if (r < 0.87) return 5;
  if (r < 0.97) return 4;
  if (r < 0.992) return 3;
  return Math.random() < 0.5 ? 2 : 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Bangun komentar unik dari fragmen
// ─────────────────────────────────────────────────────────────────────────────
function pickUniq<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function buildComment(rating: number, v: V): string {
  const parts: string[] = [];

  if (rating >= 4) {
    if (coin(0.55)) parts.push(rnd(PEMBUKA));
    parts.push(...pickUniq(BAHAN_POS, num(1, 2)));
    if (coin(0.75)) parts.push(rnd(UKURAN)(v));
    if (coin(0.55)) parts.push(rnd(WARNA_ARR)(v));
    if (coin(0.40)) parts.push(rnd(JAHITAN));
    if (coin(0.50)) parts.push(rnd(KIRIM)(v));
    if (coin(0.40)) parts.push(rnd(PAKAI)(v));
    if (coin(0.25)) parts.push(rnd(SELLER_ARR));
    parts.push(rnd(KESIM_POS));
    if (rating === 4 && coin(0.20)) parts.push(rnd(MINOR_NEG));
  } else if (rating === 3) {
    if (coin(0.35)) parts.push(rnd(PEMBUKA));
    parts.push(rnd(BAHAN_POS));
    if (coin(0.50)) parts.push(rnd(UKURAN)(v));
    parts.push(rnd(MINOR_NEG));
    if (coin(0.40)) parts.push(rnd(KIRIM)(v));
    parts.push(rnd(KESIM_NET));
  } else {
    if (coin(0.25)) parts.push(rnd(PEMBUKA));
    parts.push(rnd(MINOR_NEG));
    parts.push("Kurang sesuai ekspektasi, perlu perbaikan.");
  }

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

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log("▶ Menghapus semua ulasan lama...");
  const del = await prisma.review.deleteMany({});
  console.log(`  ✓ ${del.count} ulasan dihapus.`);

  console.log("▶ Reset rating semua produk...");
  await prisma.product.updateMany({ data: { rating: 0, reviewCount: 0 } });
  console.log("  ✓ Rating di-reset.\n");

  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  if (!products.length) { console.error("✗ Tidak ada produk!"); return; }
  console.log(`▶ ${products.length} produk ditemukan.\n`);

  // Pre-generate semua pasangan nama
  const ALL_PAIRS: string[] = [];
  for (const fn of FIRSTS) for (const ln of LASTS) ALL_PAIRS.push(`${fn}|${ln}`);
  // Shuffle
  for (let i = ALL_PAIRS.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ALL_PAIRS[i], ALL_PAIRS[j]] = [ALL_PAIRS[j], ALL_PAIRS[i]];
  }

  let totalReviews = 0;
  let globalIdx    = 0;
  const BATCH      = 500; // insert 500 row sekaligus

  for (const product of products) {
    const target = num(50_000, 80_000);
    console.log(`→ [${product.name.slice(0, 50)}]`);
    console.log(`   Target: ${target.toLocaleString("id-ID")} ulasan`);

    // ── 1. Generate semua user data ──────────────────────────────────────
    const userRows: { email: string; name: string; role: string }[] = [];
    for (let i = 0; i < target; i++) {
      const pair    = ALL_PAIRS[(globalIdx + i) % ALL_PAIRS.length];
      const [fn, ln] = pair.split("|");
      const suffix  = globalIdx + i;
      userRows.push({
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}.${suffix}@buyer.lumara`,
        name:  `${fn} ${ln}`,
        role:  "USER",
      });
    }
    globalIdx += target;

    // ── 2. Batch insert users ─────────────────────────────────────────────
    process.stdout.write("   Membuat user...");
    for (let i = 0; i < userRows.length; i += BATCH) {
      await prisma.user.createMany({ data: userRows.slice(i, i + BATCH), skipDuplicates: true });
    }
    console.log(" selesai.");

    // ── 3. Ambil user ID yang baru dibuat ─────────────────────────────────
    process.stdout.write("   Mengambil user ID...");
    const emails  = userRows.map(u => u.email);
    // Fetch batch per 1000 email untuk hindari query terlalu besar
    const users: { id: string; email: string }[] = [];
    for (let i = 0; i < emails.length; i += 1000) {
      const chunk = await prisma.user.findMany({
        where:  { email: { in: emails.slice(i, i + 1000) } },
        select: { id: true, email: true },
      });
      users.push(...chunk);
    }
    console.log(` ${users.length.toLocaleString("id-ID")} user.`);

    // Buat lookup email → id
    const emailToId: Record<string, string> = {};
    for (const u of users) emailToId[u.email] = u.id;

    // ── 4. Generate review data ────────────────────────────────────────────
    process.stdout.write("   Generate komentar...");
    const reviewRows: {
      userId: string; productId: string; rating: number;
      comment: string; images: string; createdAt: Date;
    }[] = [];

    const now = Date.now();
    for (let i = 0; i < userRows.length; i++) {
      const userId = emailToId[userRows[i].email];
      if (!userId) continue;

      const rating    = pickRating();
      const v         = mkV();
      const comment   = buildComment(rating, v);
      // Sebar merata 12 bulan ke belakang
      const ageMs     = Math.floor(Math.random() * 365 * 86_400_000);
      const createdAt = new Date(now - ageMs);

      reviewRows.push({ userId, productId: product.id, rating, comment, images: "[]", createdAt });
    }
    console.log(" selesai.");

    // ── 5. Batch insert reviews ───────────────────────────────────────────
    process.stdout.write("   Insert ulasan...");
    for (let i = 0; i < reviewRows.length; i += BATCH) {
      await prisma.review.createMany({ data: reviewRows.slice(i, i + BATCH), skipDuplicates: true });
      if (i % 5000 === 0 && i > 0) process.stdout.write(` ${i.toLocaleString("id-ID")}...`);
    }
    console.log(" selesai.");

    // ── 6. Recalculate rating ─────────────────────────────────────────────
    const agg = await prisma.review.aggregate({
      where:  { productId: product.id },
      _avg:   { rating: true },
      _count: { rating: true },
    });
    const finalRating = Math.round((agg._avg.rating ?? 0) * 10) / 10;
    await prisma.product.update({
      where: { id: product.id },
      data:  { rating: finalRating, reviewCount: agg._count.rating },
    });

    totalReviews += agg._count.rating;
    console.log(`   ✓ Total: ${agg._count.rating.toLocaleString("id-ID")} ulasan | Rating: ${finalRating}\n`);
  }

  console.log(`\n✅ SELESAI!`);
  console.log(`   Total ulasan: ${totalReviews.toLocaleString("id-ID")}`);
  console.log(`   Rata-rata per produk: ${Math.round(totalReviews / products.length).toLocaleString("id-ID")}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
