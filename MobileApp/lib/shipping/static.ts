/**
 * Static fallback data — dipakai saat Komerce API gak available
 * (daily quota habis, network error, dll).
 *
 * 34 provinsi Komerce mapped ke 8 zona pengiriman flat rate.
 * Buyer dijamin bisa checkout walaupun Komerce down.
 */

import type { RajaOngkirShippingOption } from "@/lib/shipping/rajaongkir";

type ZoneKey =
  | "jabodetabek"
  | "jawa"
  | "bali-ntb"
  | "sumatra"
  | "kalimantan"
  | "sulawesi"
  | "maluku-ntt"
  | "papua";

interface StaticProvince {
  province_id: string;
  province: string;
  zone: ZoneKey;
}

const ZONE_INFO: Record<ZoneKey, { ratePerKg: number; etd: string; label: string }> = {
  jabodetabek: { ratePerKg: 12000, etd: "1-2", label: "Jabodetabek" },
  jawa: { ratePerKg: 20000, etd: "2-4", label: "Pulau Jawa" },
  "bali-ntb": { ratePerKg: 30000, etd: "3-5", label: "Bali & NTB" },
  sumatra: { ratePerKg: 35000, etd: "3-6", label: "Sumatra" },
  kalimantan: { ratePerKg: 40000, etd: "4-7", label: "Kalimantan" },
  sulawesi: { ratePerKg: 45000, etd: "4-7", label: "Sulawesi" },
  "maluku-ntt": { ratePerKg: 70000, etd: "7-14", label: "Maluku & NTT" },
  papua: { ratePerKg: 80000, etd: "7-14", label: "Papua" },
};

// Province IDs match Komerce IDs jadi consistent saat API live atau fallback.
export const STATIC_PROVINCES: StaticProvince[] = [
  { province_id: "10", province: "DKI JAKARTA", zone: "jabodetabek" },
  { province_id: "11", province: "BANTEN", zone: "jabodetabek" },
  { province_id: "5",  province: "JAWA BARAT", zone: "jabodetabek" },
  { province_id: "12", province: "JAWA TENGAH", zone: "jawa" },
  { province_id: "18", province: "JAWA TIMUR", zone: "jawa" },
  { province_id: "19", province: "DI YOGYAKARTA", zone: "jawa" },
  { province_id: "15", province: "BALI", zone: "bali-ntb" },
  { province_id: "1",  province: "NUSA TENGGARA BARAT (NTB)", zone: "bali-ntb" },
  { province_id: "9",  province: "NANGGROE ACEH DARUSSALAM (NAD)", zone: "sumatra" },
  { province_id: "16", province: "SUMATERA UTARA", zone: "sumatra" },
  { province_id: "23", province: "SUMATERA BARAT", zone: "sumatra" },
  { province_id: "25", province: "RIAU", zone: "sumatra" },
  { province_id: "8",  province: "KEPULAUAN RIAU", zone: "sumatra" },
  { province_id: "13", province: "JAMBI", zone: "sumatra" },
  { province_id: "26", province: "SUMATERA SELATAN", zone: "sumatra" },
  { province_id: "24", province: "BANGKA BELITUNG", zone: "sumatra" },
  { province_id: "6",  province: "BENGKULU", zone: "sumatra" },
  { province_id: "30", province: "LAMPUNG", zone: "sumatra" },
  { province_id: "28", province: "KALIMANTAN BARAT", zone: "kalimantan" },
  { province_id: "3",  province: "KALIMANTAN SELATAN", zone: "kalimantan" },
  { province_id: "4",  province: "KALIMANTAN TENGAH", zone: "kalimantan" },
  { province_id: "7",  province: "KALIMANTAN TIMUR", zone: "kalimantan" },
  { province_id: "31", province: "KALIMANTAN UTARA", zone: "kalimantan" },
  { province_id: "22", province: "SULAWESI UTARA", zone: "sulawesi" },
  { province_id: "33", province: "SULAWESI SELATAN", zone: "sulawesi" },
  { province_id: "27", province: "SULAWESI TENGAH", zone: "sulawesi" },
  { province_id: "20", province: "SULAWESI TENGGARA", zone: "sulawesi" },
  { province_id: "34", province: "SULAWESI BARAT", zone: "sulawesi" },
  { province_id: "17", province: "GORONTALO", zone: "sulawesi" },
  { province_id: "2",  province: "MALUKU", zone: "maluku-ntt" },
  { province_id: "32", province: "MALUKU UTARA", zone: "maluku-ntt" },
  { province_id: "21", province: "NUSA TENGGARA TIMUR (NTT)", zone: "maluku-ntt" },
  { province_id: "14", province: "PAPUA", zone: "papua" },
  { province_id: "29", province: "PAPUA BARAT", zone: "papua" },
];

/** Untuk API provinces fallback. */
export function getStaticProvinces() {
  return STATIC_PROVINCES.map((p) => ({ province_id: p.province_id, province: p.province }));
}

function getZoneFromProvinceId(provinceId: string): ZoneKey | null {
  return STATIC_PROVINCES.find((p) => p.province_id === provinceId)?.zone ?? null;
}

/**
 * Generate flat rate options dari province + berat.
 * Format kompatibel dengan RajaOngkirShippingOption supaya UI seragam.
 */
export function getStaticShippingOptions(
  provinceId: string,
  weightGrams: number
): RajaOngkirShippingOption[] {
  const zone = getZoneFromProvinceId(provinceId);
  if (!zone) return [];

  const info = ZONE_INFO[zone];
  const weightKg = Math.max(1, Math.ceil(weightGrams / 1000));
  const baseCost = info.ratePerKg * weightKg;

  // Kasih 2 opsi: Reguler (base) & Express (1.5x lebih cepat)
  return [
    {
      courier: "internal",
      courierName: "Reguler",
      service: "REG",
      description: `Pengiriman ke ${info.label}`,
      cost: baseCost,
      etd: `${info.etd} day`,
    },
    {
      courier: "internal",
      courierName: "Express",
      service: "EXP",
      description: `Pengiriman cepat ke ${info.label}`,
      cost: Math.round(baseCost * 1.5),
      etd: `${etdHalf(info.etd)} day`,
    },
  ];
}

function etdHalf(etd: string): string {
  // "3-5" → "1-2", "1-2" → "1", "7-14" → "3-7"
  const parts = etd.split("-").map((n) => Math.max(1, Math.ceil(Number(n) / 2)));
  return parts.join("-");
}
