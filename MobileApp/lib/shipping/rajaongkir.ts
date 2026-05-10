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

export interface CourierDiagnostic {
  courier: string;
  status: "ok" | "empty" | "error";
  rawCount: number;
  httpStatus?: number;
  metaCode?: number;
  message?: string;
}

export interface ShippingFetchResult {
  options: RajaOngkirShippingOption[];
  diagnostics: CourierDiagnostic[];
  rawCount: number;        // total option dari Komerce sebelum filter
  filteredCount: number;   // berapa yang kena filter (trucking/cargo/ETA>14)
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

/** Ambil semua opsi ongkir + diagnostic per kurir. */
export async function fetchShippingOptions(
  destinationCityId: string,
  weightGrams: number
): Promise<ShippingFetchResult> {
  const API_KEY = requireApiKey();
  const origin = getOriginCityId();

  if (!destinationCityId?.trim()) throw new Error("Kota tujuan wajib dipilih.");
  if (!Number.isFinite(weightGrams) || weightGrams < 100) {
    throw new Error("Berat paket minimal 100 gram.");
  }

  const settled = await Promise.allSettled(
    COURIERS.map(async (courier): Promise<{ courier: string; rows: KomerceCostRow[]; httpStatus: number; metaCode?: number; message?: string }> => {
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
      const json = (await res.json().catch(() => null)) as KomerceEnvelope<KomerceCostRow[]> | null;
      const metaCode = json?.meta?.code;
      const message = json?.meta?.message;

      if (metaCode !== 200) {
        // Throw dengan info — diagnostic ditangkap di catch
        const err = new Error(message ?? `Komerce HTTP ${res.status} (${courier})`) as Error & {
          httpStatus: number;
          metaCode?: number;
          courierCode: string;
        };
        err.httpStatus = res.status;
        err.metaCode = metaCode;
        err.courierCode = courier;
        throw err;
      }
      return { courier, rows: json?.data ?? [], httpStatus: res.status, metaCode, message };
    })
  );

  const options: RajaOngkirShippingOption[] = [];
  const diagnostics: CourierDiagnostic[] = [];

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    const courier = COURIERS[i];

    if (result.status === "rejected") {
      const reason = result.reason as Error & { httpStatus?: number; metaCode?: number };
      console.error(`[komerce/cost] ${courier} failed:`, reason.message);
      diagnostics.push({
        courier,
        status: "error",
        rawCount: 0,
        httpStatus: reason.httpStatus,
        metaCode: reason.metaCode,
        message: reason.message,
      });
      continue;
    }

    const { rows, httpStatus, metaCode, message } = result.value;
    diagnostics.push({
      courier,
      status: rows.length > 0 ? "ok" : "empty",
      rawCount: rows.length,
      httpStatus,
      metaCode,
      message: rows.length === 0 ? (message ?? "Komerce balas kosong") : undefined,
    });

    for (const row of rows) {
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

  const rawCount = options.length;
  const filtered = options.filter(isFashionFriendly);
  filtered.sort((a, b) => a.cost - b.cost);

  return {
    options: filtered,
    diagnostics,
    rawCount,
    filteredCount: rawCount - filtered.length,
  };
}

/**
 * Filter layanan yang masuk akal buat fashion store:
 * - Drop layanan kontainer/truk (JNE Trucking, dll) — buat barang berat
 * - Drop ETA > 14 hari — biar Indonesia Timur (Papua/Maluku/NTT) tetap bisa
 *   pakai layanan reguler yang ETD 7-14 hari, tapi trucking 15-30 hari out.
 * - Keep layanan tanpa ETD (mis. J&T return etd kosong)
 */
function isFashionFriendly(o: RajaOngkirShippingOption): boolean {
  const haystack = `${o.description} ${o.service} ${o.courier}`.toLowerCase();
  const blocked = ["trucking", "cargo", "truk", "kargo", "container", "freight", "city courier"];
  if (blocked.some((kw) => haystack.includes(kw))) return false;

  const maxDays = parseMaxEtdDays(o.etd);
  if (maxDays !== null && maxDays > 14) return false;

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
