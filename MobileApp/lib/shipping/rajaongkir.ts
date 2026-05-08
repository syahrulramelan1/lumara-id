/**
 * Raja Ongkir (Komerce) — endpoint baru sejak migrasi.
 * Lama: api.rajaongkir.com/starter (DEAD)
 * Baru: rajaongkir.komerce.id/api/v1/
 *
 * Titik asal penjual: RAJAONGKIR_ORIGIN_CITY_ID (env, ID Komerce, BUKAN ID Starter lama).
 *   Jakarta Pusat = 137, Jakarta Selatan = 136, Jakarta Timur = 139, dll.
 */

const KOMERCE_URL = "https://rajaongkir.komerce.id/api/v1";

const COURIERS = ["jne", "tiki", "pos", "jnt"] as const;

const COURIER_NAMES: Record<string, string> = {
  jne: "JNE",
  tiki: "TIKI",
  pos: "POS Indonesia",
  jnt: "J&T Express",
};

export interface RajaOngkirShippingOption {
  courier: string;
  courierName: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export function getOriginCityId(): string {
  return process.env.RAJAONGKIR_ORIGIN_CITY_ID?.trim() || "137";
}

function requireApiKey(): string {
  const key = process.env.RAJAONGKIR_API_KEY?.trim();
  if (!key) throw new Error("Sistem ongkir belum dikonfigurasi. Hubungi admin.");
  return key;
}

interface KomerceCostRow {
  name?: string;
  code?: string;
  service?: string;
  description?: string;
  cost?: number;
  etd?: string;
}

interface KomerceEnvelope<T> {
  meta?: { code?: number; status?: string; message?: string };
  data?: T;
}

/** Ambil semua opsi ongkir untuk tujuan kota + berat (gram). */
export async function fetchShippingOptions(
  destinationCityId: string,
  weightGrams: number
): Promise<RajaOngkirShippingOption[]> {
  const API_KEY = requireApiKey();
  const origin = getOriginCityId();

  if (!destinationCityId?.trim()) throw new Error("Kota tujuan wajib dipilih.");
  if (!Number.isFinite(weightGrams) || weightGrams < 100) {
    throw new Error("Berat paket minimal 100 gram.");
  }

  const results = await Promise.allSettled(
    COURIERS.map(async (courier) => {
      const body = new URLSearchParams({
        origin,
        destination: String(destinationCityId).trim(),
        weight: String(Math.round(weightGrams)),
        courier,
      });
      const res = await fetch(`${KOMERCE_URL}/calculate/domestic-cost`, {
        method: "POST",
        headers: { key: API_KEY, "content-type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const json = (await res.json()) as KomerceEnvelope<KomerceCostRow[]>;
      if (json?.meta?.code !== 200) {
        throw new Error(json?.meta?.message ?? `Komerce HTTP ${res.status} (${courier})`);
      }
      return { courier, data: json.data ?? [] };
    })
  );

  const options: RajaOngkirShippingOption[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") {
      console.error("[komerce/cost] courier failed:", result.reason);
      continue;
    }
    const { courier, data } = result.value;
    for (const row of data) {
      options.push({
        courier,
        courierName: COURIER_NAMES[courier] ?? courier.toUpperCase(),
        service: String(row.service ?? "-"),
        description: String(row.description ?? ""),
        cost: Number(row.cost ?? 0),
        etd: String(row.etd ?? "-"),
      });
    }
  }

  // Filter ala e-commerce fashion (Shopee/Tokopedia style):
  // drop trucking/cargo & ETA > 7 hari (irrelevant buat barang ringan).
  const filtered = options.filter(isFashionFriendly);

  filtered.sort((a, b) => a.cost - b.cost);
  return filtered;
}

/**
 * Filter layanan yang masuk akal buat fashion store:
 * - Drop layanan kontainer/truk (JNE Trucking, dll) — buat barang berat
 * - Drop ETA > 7 hari — buyer fashion gak nungguin sebulan
 * - Keep layanan tanpa ETD (mis. J&T return etd kosong)
 */
function isFashionFriendly(o: RajaOngkirShippingOption): boolean {
  const haystack = `${o.description} ${o.service} ${o.courier}`.toLowerCase();
  const blocked = ["trucking", "cargo", "truk", "kargo", "container", "freight", "city courier"];
  if (blocked.some((kw) => haystack.includes(kw))) return false;

  const maxDays = parseMaxEtdDays(o.etd);
  if (maxDays !== null && maxDays > 7) return false;

  return true;
}

/** "1-3 day" → 3, "2 day" → 2, "7-14 day" → 14, "" → null */
function parseMaxEtdDays(etd: string): number | null {
  if (!etd) return null;
  const matches = etd.match(/\d+/g);
  if (!matches || matches.length === 0) return null;
  return Math.max(...matches.map(Number));
}

/** Cocokkan pilihan buyer dengan hasil resmi RO (hindari manipulasi ongkir). */
export function findMatchingShippingOption(
  options: RajaOngkirShippingOption[],
  courier: string,
  service: string,
  cost: number
): RajaOngkirShippingOption | undefined {
  return options.find(
    (o) => o.courier === courier && o.service === service && o.cost === cost
  );
}
