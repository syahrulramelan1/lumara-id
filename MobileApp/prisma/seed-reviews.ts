/**
 * Seed ulasan gaya Shopee/Tokped asli
 * Jalankan: npx tsx prisma/seed-reviews.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

try {
  const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
} catch { /* lanjut */ }

const prisma = new PrismaClient();

// ── Variabel dinamis ───────────────────────────────────────────────────────
const SIZES    = ["S","M","L","XL","XXL"];
const HEIGHTS  = [148,150,152,154,155,156,157,158,160,161,162,163,165,167,168,170];
const WEIGHTS  = [42,44,45,47,48,50,52,53,55,57,58,60,62,63,65,68];
const CITIES   = ["Jakarta","Surabaya","Bandung","Medan","Bekasi","Tangerang","Depok","Semarang","Makassar","Palembang","Yogyakarta","Bali","Bogor","Malang","Pekanbaru","Batam","Balikpapan","Samarinda","Banjarmasin","Padang"];
const OCCASIONS = ["kondangan","kerja","pengajian","wisuda","arisan","lebaran","nikahan sepupu","acara keluarga","hangout","ngampus","kajian","reuni"];
const COURIERS  = ["JNE","J&T","Sicepat","Anteraja","Ninja Express","Pos Indonesia","Tiki"];

const pick = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
const coin = (p = 0.5) => Math.random() < p;

function vars() {
  return {
    sz: pick(SIZES),
    h: pick(HEIGHTS),
    w: pick(WEIGHTS),
    city: pick(CITIES),
    acara: pick(OCCASIONS),
    kurir: pick(COURIERS),
  };
}

// ── Template komentar ──────────────────────────────────────────────────────
// Format: fungsi yang return string dengan variabel dinamis

type V = ReturnType<typeof vars>;

// BINTANG 5 ─────────────────────────────────────────────────────────────────
const FIVE_SHORT: ((v: V) => string)[] = [
  v => `Bagus banget! Sesuai foto, bahan adem. Recommended 👍`,
  v => `Mantap! Packing rapi, nyampe ${pick(["cepet","aman","baik"])}. Suka banget`,
  v => `Alhamdulillah sesuai ekspektasi. Makasih kak ${coin() ? "💜" : "🌸"}`,
  v => `Oke bgt, langsung suka pas dicoba. Size ${v.sz} pas di aku`,
  v => `Bagus, jahitan rapi, warna sama kyk foto. Puas! ⭐⭐⭐⭐⭐`,
  v => `Recommended banget! Udah order ${pick(["kedua","ketiga","keempat"])} kalinya`,
  v => `Bahannya enak dipake, adem, ga gerah. 10/10 👌`,
  v => `Suka banget sm modelnya, elegan tp tetep syari. Makasih Lumara!`,
  v => `Keren! Bahan premium, harga worth it. Gas order lagi ${coin() ? "😍" : "🔥"}`,
  v => `Pas bgt buat ${v.acara} kemarin, dapet banyak pujian! Makasih kak`,
  v => `Sesuai deskripsi, ga ada kecewa sama sekali. Top seller! 💯`,
  v => `Baju cantik, bahan lembut, pengiriman lewat ${v.kurir} cepet. Bintang 5!`,
  v => `Warnanya cantik bgt, persis di foto. Langsung pake ke ${v.acara} 😊`,
  v => `Mantap kualitasnya. Aku ${v.h}cm ${v.w}kg size ${v.sz} pas. Recommended!`,
  v => `Ga nyesel beli di sini. Repeat order pasti! ${coin() ? "💕" : "✨"}`,
  v => `Kualitas oke, pengiriman cepet, packing rapi. 5 bintang layak!`,
  v => `Suka!! Bahannya ga panas, cocok buat harian. Order lagi ah`,
  v => `Top markotop! Sesuai ekspektasi bahkan lebih. Seller responsif juga`,
  v => `Cantik bgt waktu dipake, berasa elegant gitu. Makasih Lumara.id 🙏`,
  v => `Niat banget packingnya, ada wangi-wangi dikit. Bajunya oke bgt!`,
  v => `Sudah sampe ${v.city}, kondisi sempurna. Langsung coba langsung suka!`,
  v => `Temen2 pada nanya beli dimana pas aku pake. Bangga deh ${coin() ? "😄" : "🥰"}`,
  v => `Size chart akurat! ${v.h}cm ${v.w}kg pake ${v.sz} pas bgt`,
  v => `Jahitannya rapi bgt, ga ada benang nyeret. Bahan premium. 👍`,
  v => `Akhirnya nemu busana muslimah yg beneran syari tp tetep kece!`,
];

const FIVE_MED: ((v: V) => string)[] = [
  v => `Baju udah nyampe dan langsung aku coba. Hasilnya?? Suka banget!! Bahan ${pick(["lembut","adem","halus"])} bgt, ga panas sama sekali walaupun dipake seharian. Warnanya juga persis kyk di foto, ga ada beda. Aku ${v.h}cm ${v.w}kg ambil size ${v.sz} pas bgt. Recommended buat yg mau tampil syari tp tetep stylish! ${coin() ? "💜" : "🌸"}`,
  v => `Mau jujur nih, ini baju terbaik yg pernah aku beli online! Kualitas bahannya beneran premium, jahitan rapi, dan modelnya cantik bgt. Aku pake ke ${v.acara} dan dapet banyak compliment. Pengirimannya juga cepet lewat ${v.kurir}, paket nyampe dalam kondisi oke. Seller juga ramah bgt waktu aku tanya-tanya sebelum order. Pasti repeat order lagi! 😍`,
  v => `Alhamdulillah paket udah nyampe ${v.city}. Langsung dicoba dan masyaAllah cantik banget! Bahannya ringan dan adem, cocok bgt buat iklim Indonesia yg panas. Size ${v.sz} di aku ${v.h}cm pas, ga terlalu ketat ga terlalu longgar. Warnanya sama persis kyk foto. Overall sangat puas, worth every rupiah! ⭐`,
  v => `Review jujur dari aku ya. Udah lama pengen beli di sini dan akhirnya kesampaian. Ternyata ga kecewa! Bahan bagus, jahitan rapi, ukuran sesuai size chart. Aku ${v.h}cm ${v.w}kg pake ${v.sz}. Pengiriman via ${v.kurir} cepet banget, 2 hari udah nyampe. Langsung aku pake ke ${v.acara} kemarin dan dapet banyak pujian. Recommended! 🙏`,
  v => `Wah ini literally melebihi ekspektasiku! Awalnya agak ragu beli online tapi ternyata barangnya oke banget. Bahan premium ga nerawang, jahitan halus, warna vivid. Size ${v.sz} buat ${v.h}cm pas. Packing juga rapi banget ada bubble wrapnya. Seller fast respon. Gas order lagi warna lain bulan depan! ${coin() ? "💕" : "✨"}`,
  v => `Ini pembelian ke${pick(["dua","tiga","empat"])}ku di Lumara.id dan konsisten bagus! Kali ini beli buat ${v.acara} dan hasilnya memuaskan. Bahan tetep premium, jahitan rapi, dan modelnya timeless. Aku ${v.h}cm ${v.w}kg size ${v.sz} pas. Kalau kalian masih ragu, JANGAN RAGU lagi. Worth it poll! 👌`,
  v => `Paket udah sampe dengan selamat via ${v.kurir}. Packingnya bagus bgt, dobel bubble wrap. Pas dibuka langsung excited karena warnanya cantik banget. Langsung dicoba, bahannya lembut dan adem. Size ${v.sz} di badan aku ${v.h}cm pas bgt. Mau beli lagi ah warna yang lain~ 😊`,
  v => `Quality check: ✅ Bahan premium dan adem. ✅ Jahitan rapi. ✅ Warna sesuai foto. ✅ Ukuran akurat. ✅ Packing aman. ✅ Pengiriman cepat. Overall bintang 5 emang layak! Ga rugi beli di Lumara.id 💯`,
  v => `Beli ini buat ${v.acara} minggu depan dan udah ga sabar mau pake! Kualitas diluar ekspektasi, bahannya beneran enak dipake, tidak gerah, tidak nerawang. Size chart akurat, ${v.h}cm ${v.w}kg pake ${v.sz} pas. Dikirim via ${v.kurir} dan nyampe cepet. Recommended banget! 🌟`,
  v => `Jujur nih ini baju paling worth it yg pernah aku beli di tahun ini. Bahannya premium tapi harganya masih masuk akal. Jahitan rapi ga ada cacat. Warna cantik sesuai foto. Aku ${v.h}cm ${v.w}kg size ${v.sz} pas banget. Langsung order 2 warna sekaligus karena takut kehabisan. Highly recommended! ${coin() ? "🔥" : "💜"}`,
];

const FIVE_LONG: ((v: V) => string)[] = [
  v => `Halo kak mau review baju yg baru aja aku terima nih! Pertama dari segi packing, rapih banget ada bubble wrap dan plastik, jadi baju ga kusut sama sekali pas nyampe. Seller juga nulis catatan kecil yg manis, bikin makin happy.\n\nDari segi bahan, MasyaAllah bagus banget! Kainnya terasa premium di kulit, lembut, dan adem. Aku pake seharian buat ${v.acara} dan ga gerah sama sekali. Warnanya juga PERSIS sama kyk foto, bahkan kayaknya lebih cantik waktu dilihat langsung.\n\nUkuran: aku ${v.h}cm ${v.w}kg ambil size ${v.sz} dan hasilnya pas banget. Panjangnya syari dan potongannya bagus. Jahitannya rapi, ga ada benang nyeret atau cacat. Ini udah orderan ke${pick(["dua","tiga"])}ku dan selalu puas! Pasti repeat order terus~ 💜💜`,
  v => `Review lengkap setelah 2 minggu pake ya!\n\nKualitas bahan: 10/10. Ini beneran premium, bukan ecek-ecek. Adem banget, ga nerawang, dan setelah dicuci berkali-kali warnanya ga luntur sama sekali.\n\nUkuran: Aku ${v.h}cm ${v.w}kg pake ${v.sz}, pas banget! Size chart-nya akurat, membantu banget dalam milih ukuran.\n\nPengiriman: Pesen hari ${pick(["Senin","Selasa","Rabu","Kamis"])} via ${v.kurir}, ${pick(["2","3","4"])} hari kemudian udah nyampe ${v.city}. Kondisi paket aman, packing dobel bubble wrap.\n\nOverall: SANGAT PUAS. Udah rekomenin ke ibu, kakak, dan temen kantor. Ini wajib jadi koleksi! 🌟🌟🌟🌟🌟`,
  v => `Gaskeun review panjang nih karena baju ini emang layak dapet review terbaik!\n\nPertama kali liat di feed langsung tertarik sama modelnya yg elegant. Lama banget aku save-save dulu sambil baca review orang. Akhirnya berani order dan TIDAK KECEWA SAMA SEKALI!\n\nBahan: soft, adem, tidak panas walau dipake seharian. Tidak nerawang jadi langsung syari. Warna persis di foto, bahkan lebih hidup aslinya.\n\nFit: Aku ${v.h}cm berat ${v.w}kg. Ambil size ${v.sz} dan pas banget, tidak terlalu longgar tidak terlalu ketat. Panjangnya oke, menutup sampai di bawah lutut.\n\nPengiriman: Cepat banget via ${v.kurir}. Packing super rapi. Seller responsif waktu aku tanya warna stok.\n\nPakai pertama kali ke ${v.acara} dan langsung banjir pujian dari keluarga. Proud banget! Makasih Lumara.id, pasti balik lagi! 🙏✨`,
];

// BINTANG 4 ─────────────────────────────────────────────────────────────────
const FOUR_SHORT: ((v: V) => string)[] = [
  v => `Bagus, hanya warnanya agak beda dikit dari foto. Tapi overall oke!`,
  v => `Kualitas oke, jahitan rapi. Size ${v.sz} agak longgar tp masih nyaman`,
  v => `Lumayan bagus, bahan adem. Pengiriman via ${v.kurir} sesuai estimasi`,
  v => `Cukup puas! Ada sedikit benang lebih tp ga masalah besar. Recommended`,
  v => `Bagus kok, hanya pengirimannya agak lama. Barang aman nyampe ${v.city}`,
  v => `Overall oke lah, sesuai harganya. Bahan lumayan adem dan nyaman dipake`,
  v => `4 bintang karena warnanya agak beda, tapi kualitas bahan bagus banget!`,
  v => `Suka tp size ${v.sz} agak besar, next order size down. Bahannya bagus`,
  v => `Bagus, packing aman. Cuma seller agak lama respon chat. Barangnya oke`,
  v => `Kualitas sesuai harga, cukup worth it. Akan pertimbangkan beli lagi`,
];

const FOUR_MED: ((v: V) => string)[] = [
  v => `Overall puas dengan pembelian ini meskipun ada beberapa hal yang bisa diperbaiki. Bahannya bagus dan adem, jahitan rapi. Warnanya sedikit lebih pudar dari foto tapi masih cantik. Ukuran ${v.sz} agak besar di aku ${v.h}cm ${v.w}kg, mungkin next order size down. Pengiriman via ${v.kurir} sesuai estimasi, packing aman. Recommended tp perhatiin size chart ya!`,
  v => `Baju oke, bahan lumayan premium dan adem. Cuma waktu pertama dicuci ada sedikit luntur warna, sekarang udah stabil sih. Aku ${v.h}cm ${v.w}kg size ${v.sz} agak longgar dikit tapi masih nyaman. Pengiriman cepet dan packing rapi. Seller juga ramah. 4 bintang karena warna luntur sedikit tapi ga signifikan.`,
  v => `Cukup memuaskan! Kualitas bahan oke untuk harganya, jahitan lumayan rapi. Yang bikin 4 bintang bukan 5 adalah warnanya agak beda dari foto dan ukuran ${v.sz} agak oversized di aku. Tapi secara keseluruhan masih worth it dan nyaman dipake. Mungkin akan beli lagi kalau ada model baru yang cocok. Recommended!`,
];

// BINTANG 3 ─────────────────────────────────────────────────────────────────
const THREE: ((v: V) => string)[] = [
  v => `Biasa aja sih, bahan lumayan tp ga se-premium yg aku bayangin. Jahitan bagian ${pick(["bawah","lengan","leher"])} kurang rapi. Warna agak beda dari foto. Masih bisa dipake`,
  v => `Ekspektasiku agak lebih tinggi dari kenyataannya. Bahannya oke tp agak gerah. Size ${v.sz} kegedean buat ${v.h}cm ${v.w}kg aku. Ga kecewa banget sih, tp juga ga terlalu impressed`,
  v => `Standar aja. Bahan lumayan, jahitan ada yg kurang rapi dikit. Warnanya agak beda dr foto tapi masih bisa diterima. Pengiriman oke. 3 bintang karena ada beberapa hal yg harusnya bisa lebih baik`,
  v => `Hmm gimana ya, aku agak mixed feeling. Modelnya cantik tp bahannya ga se-adem yg diiklankan. Masih bisa dipake sih tapi pengennya lebih. Warna juga agak beda dr foto`,
  v => `Lumayan lah buat harganya. Ga jelek ga bagus2 amat. Bahan standard, jahitan ada yg longgar dikit. Pengiriman oke via ${v.kurir}. Mungkin tidak akan repeat order`,
];

// BINTANG 2 ─────────────────────────────────────────────────────────────────
const TWO: ((v: V) => string)[] = [
  v => `Kecewa. Bahan jauh dari ekspektasi, agak kaku dan gerah. Warna beda banget dari foto. Jahitan ada yg ga rapi. Sayang banget udah nunggu lama`,
  v => `Tidak sesuai deskripsi. Bahannya tipis dan agak nerawang, padahal di foto keliatannya tebal. Ukuran ${v.sz} juga tidak sesuai size chart di aku. Kurang puas`,
  v => `Agak menyesal beli. Warna sangat jauh dari foto, bahan kurang bagus. Jahitan di beberapa titik kurang rapi. Semoga bisa diperbaiki ke depannya`,
  v => `2 bintang karena bahan tidak sesuai yang dijanjikan dan warna jauh beda. Seller kurang responsif juga waktu aku mau komplain. Pengiriman oke sih`,
];

// BINTANG 1 ─────────────────────────────────────────────────────────────────
const ONE: ((v: V) => string)[] = [
  v => `Sangat kecewa. Tidak sesuai sama sekali dgn foto dan deskripsi`,
  v => `Bahan jelek, jahitan berantakan, warna jauh beda. Rugi beli ini`,
  v => `Tidak recommended. Kualitas tidak sesuai harga sama sekali`,
  v => `Kecewa bgt. Udah nunggu lama barangnya tidak sesuai ekspektasi`,
];

// ── Pilih template berdasarkan rating & panjang ───────────────────────────
function buildComment(rating: number): string {
  const v = vars();
  const r = Math.random();

  if (rating === 5) {
    if (r < 0.45) return pick(FIVE_SHORT)(v);
    if (r < 0.80) return pick(FIVE_MED)(v);
    return pick(FIVE_LONG)(v);
  }
  if (rating === 4) {
    if (r < 0.55) return pick(FOUR_SHORT)(v);
    return pick(FOUR_MED)(v);
  }
  if (rating === 3) return pick(THREE)(v);
  if (rating === 2) return pick(TWO)(v);
  return pick(ONE)(v);
}

function weightedRating(): number {
  const r = Math.random();
  if (r < 0.68) return 5;
  if (r < 0.88) return 4;
  if (r < 0.95) return 3;
  if (r < 0.98) return 2;
  return 1;
}

function randomDate(monthsBack = 6): Date {
  const now = Date.now();
  const earliest = now - monthsBack * 30 * 24 * 60 * 60 * 1000;
  return new Date(earliest + Math.random() * (now - earliest));
}

// ── Generator nama ─────────────────────────────────────────────────────────
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
  for (let i = 0; i < total; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const suffix = Math.floor(i / (FIRST_NAMES.length * LAST_NAMES.length));
    const domain = EMAIL_DOMAINS[i % EMAIL_DOMAINS.length];
    const sfx = suffix > 0 ? String(suffix) : (i > 0 ? String(i).slice(-2) : "");
    users.push({
      id: randomUUID(),
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${sfx}@${domain}`,
      role: "USER",
    });
  }
  return users;
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
const TOTAL_USERS = 3000;
const BATCH_SIZE  = 500;

async function main() {
  console.log("🌱 Seed ulasan gaya Shopee dimulai...\n");

  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  if (!products.length) { console.log("⚠️  Tidak ada produk."); return; }
  console.log(`📦 ${products.length} produk ditemukan.\n`);

  console.log(`👥 Membuat ${TOTAL_USERS} akun pembeli...`);
  const allUsers = genUsers(TOTAL_USERS);
  for (let i = 0; i < allUsers.length; i += BATCH_SIZE) {
    await prisma.user.createMany({ data: allUsers.slice(i, i + BATCH_SIZE), skipDuplicates: true });
    process.stdout.write(`\r   ${Math.min(i + BATCH_SIZE, allUsers.length)}/${TOTAL_USERS}`);
  }
  console.log("\n   ✓ User siap.\n");

  const dbUserIds = (await prisma.user.findMany({
    where: { email: { in: allUsers.map(u => u.email) } },
    select: { id: true },
  })).map(u => u.id);

  let grandTotal = 0;
  for (const product of products) {
    console.log(`📝 ${product.name.slice(0, 50)}...`);

    const existing = new Set((await prisma.review.findMany({
      where: { productId: product.id },
      select: { userId: true },
    })).map(r => r.userId));

    const targets = dbUserIds.filter(id => !existing.has(id));

    for (let i = 0; i < targets.length; i += BATCH_SIZE) {
      const batch = targets.slice(i, i + BATCH_SIZE).map(userId => {
        const rating = weightedRating();
        return {
          id: randomUUID(),
          userId,
          productId: product.id,
          rating,
          comment: buildComment(rating),
          images: JSON.stringify([]),
          createdAt: randomDate(6),
        };
      });
      await prisma.review.createMany({ data: batch, skipDuplicates: true });
      process.stdout.write(`\r   ${Math.min(i + BATCH_SIZE, targets.length)}/${targets.length}`);
    }

    await recalcRating(product.id);
    grandTotal += targets.length;
    console.log(`\n   ✓ ${targets.length} ulasan ditambahkan.\n`);
  }

  console.log(`\n✅ Selesai! ${grandTotal} ulasan berhasil diseed.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
