/**
 * Raja Ongkir Starter — zona & ongkir (server-only).
 * Titik asal penjual: RAJAONGKIR_ORIGIN_CITY_ID (env), tidak ditampilkan di UI.
 */

const RAJAONGKIR_URL = "https://api.rajaongkir.com/starter";

const COURIERS = ["jne", "tiki", "pos"] as const;

const COURIER_NAMES: Record<string, string> = {
  jne: "JNE",
  tiki: "TIKI",
  pos: "POS Indonesia",
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
  return process.env.RAJAONGKIR_ORIGIN_CITY_ID?.trim() || "152";
}

function requireApiKey(): string {
  const key = process.env.RAJAONGKIR_API_KEY?.trim();
  if (!key) throw new Error("Konfigurasi Raja Ongkir belum diset (RAJAONGKIR_API_KEY).");
  return key;
}

/** Ambil semua opsi ongkir (Starter) untuk tujuan kota + berat (gram). */
export async function fetchShippingOptions(
  destinationCityId: string,
  weightGrams: number
): Promise<RajaOngkirShippingOption[]> {
  type RoCostRow = {
    costs?: Array<{
      service: string;
      description: string;
      cost: Array<{ value: number; etd: string }>;
    }>;
  };

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
      const res = await fetch(`${RAJAONGKIR_URL}/cost`, {
        method: "POST",
        headers: { key: API_KEY, "content-type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const json: unknown = await res.json();
      const ro = json as { rajaongkir?: { status?: boolean; results?: unknown[]; message?: string } };
      if (ro?.rajaongkir?.status === false) {
        throw new Error(ro.rajaongkir.message ?? "Gagal hitung ongkir (Raja Ongkir).");
      }
      const resultsArr = ro?.rajaongkir?.results ?? [];
      return { courier, data: resultsArr };
    })
  );

  const options: RajaOngkirShippingOption[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const { courier, data } = result.value;
    for (const item of data as RoCostRow[]) {
      for (const svc of item.costs ?? []) {
        const cost = svc.cost?.[0]?.value ?? 0;
        const etd = svc.cost?.[0]?.etd ?? "-";
        options.push({
          courier,
          courierName: COURIER_NAMES[courier] ?? courier.toUpperCase(),
          service: svc.service,
          description: svc.description,
          cost,
          etd,
        });
      }
    }
  }

  options.sort((a, b) => a.cost - b.cost);
  return options;
}

/** Cocokkan pilihan buyer dengan hasil resmi RO (hindari manipulasi ongkir). */
export function findMatchingShippingOption(
  options: RajaOngkirShippingOption[],
  courier: string,
  service: string,
  cost: number
): RajaOngkirShippingOption | undefined {
  return options.find(
    (o) =>
      o.courier === courier &&
      o.service === service &&
      o.cost === cost
  );
}
