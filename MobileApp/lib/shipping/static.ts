/**
 * Static shipping system — flat rate per zona × kurir (JNE/TIKI/J&T).
 * Tidak butuh API eksternal, tidak ada quota, predictable.
 *
 * 34 provinsi dipetakan ke 8 zona pengiriman. Setiap zona punya base rate
 * per kg. Setiap kurir punya offset (JNE referensi, TIKI sedikit mahal,
 * J&T paling murah — pola pasar UMKM Indonesia).
 */

export interface RajaOngkirShippingOption {
  courier: string;
  courierName: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

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
  jawa:        { ratePerKg: 20000, etd: "2-4", label: "Pulau Jawa" },
  "bali-ntb":  { ratePerKg: 30000, etd: "3-5", label: "Bali & NTB" },
  sumatra:     { ratePerKg: 35000, etd: "3-6", label: "Sumatra" },
  kalimantan:  { ratePerKg: 40000, etd: "4-7", label: "Kalimantan" },
  sulawesi:    { ratePerKg: 45000, etd: "4-7", label: "Sulawesi" },
  "maluku-ntt":{ ratePerKg: 70000, etd: "7-14", label: "Maluku & NTT" },
  papua:       { ratePerKg: 80000, etd: "7-14", label: "Papua" },
};

interface CourierConfig {
  courier: string;
  courierName: string;
  service: string;
  description: string;
  /** Selisih rupiah dari zone base rate. Diaplikasikan SEBELUM dikali berat. */
  costOffset: number;
}

// Realistic pricing pattern Indonesian fashion UMKM:
// - JNE: tarif referensi (paling kompetitif & familiar)
// - TIKI: sedikit lebih mahal (~Rp 2k/kg)
// - J&T: paling murah (~Rp 1k/kg lebih rendah dari JNE)
const COURIER_CONFIGS: CourierConfig[] = [
  { courier: "jne",  courierName: "JNE",           service: "REG", description: "Layanan Reguler", costOffset: 0 },
  { courier: "tiki", courierName: "TIKI",          service: "REG", description: "Reguler",         costOffset: 2000 },
  { courier: "pos",  courierName: "POS Indonesia", service: "REG", description: "Pos Reguler",     costOffset: -3000 },
  { courier: "jnt",  courierName: "J&T Express",   service: "EZ",  description: "Reguler",         costOffset: -1000 },
];

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

export function getStaticProvinces() {
  return STATIC_PROVINCES.map((p) => ({ province_id: p.province_id, province: p.province }));
}

function getZoneFromProvinceId(provinceId: string): ZoneKey | null {
  return STATIC_PROVINCES.find((p) => p.province_id === provinceId)?.zone ?? null;
}

/**
 * Hitung opsi pengiriman flat rate untuk 3 kurir (JNE/TIKI/J&T).
 * Sort ascending by cost.
 */
export function getStaticShippingOptions(
  provinceId: string,
  weightGrams: number
): RajaOngkirShippingOption[] {
  const zone = getZoneFromProvinceId(provinceId);
  if (!zone) return [];

  const info = ZONE_INFO[zone];
  const weightKg = Math.max(1, Math.ceil(weightGrams / 1000));

  const options = COURIER_CONFIGS.map((c) => ({
    courier: c.courier,
    courierName: c.courierName,
    service: c.service,
    description: c.description,
    cost: Math.max(0, (info.ratePerKg + c.costOffset) * weightKg),
    etd: `${info.etd} day`,
  }));

  options.sort((a, b) => a.cost - b.cost);
  return options;
}

/** Anti-tamper: cocokin pilihan buyer dengan opsi yang valid. */
export function findMatchingStaticOption(
  options: RajaOngkirShippingOption[],
  courier: string,
  service: string,
  cost: number
): RajaOngkirShippingOption | undefined {
  return options.find(
    (o) => o.courier === courier && o.service === service && o.cost === cost
  );
}
