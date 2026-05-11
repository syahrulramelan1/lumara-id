import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet, TTL } from "@/lib/shipping/cache";

const KOMERCE_URL = "https://rajaongkir.komerce.id/api/v1";

interface KomerceCityRow { id: number | string; name: string }

interface CityItem {
  city_id: string;
  province_id: string;
  type: string;
  city_name: string;
  postal_code: string;
}

export async function GET(req: NextRequest) {
  const provinceId = req.nextUrl.searchParams.get("province_id");
  if (!provinceId) {
    return NextResponse.json({ success: false, error: "province_id wajib diisi" }, { status: 400 });
  }

  const cacheKey = `komerce:cities:v1:${provinceId}`;
  const cached = cacheGet<CityItem[]>(cacheKey);
  if (cached) {
    return NextResponse.json({ success: true, data: cached, cached: true, fallback: false });
  }

  const API_KEY = process.env.RAJAONGKIR_API_KEY?.trim();
  if (!API_KEY) {
    // No API key → fallback mode (frontend tau city pakai text input)
    return NextResponse.json({ success: true, data: [], fallback: true, reason: "no-api-key" });
  }

  try {
    const res = await fetch(`${KOMERCE_URL}/destination/city/${encodeURIComponent(provinceId)}`, {
      headers: { key: API_KEY },
      cache: "no-store",
    });

    const rawText = await res.text();
    let json: { meta?: { code?: number; message?: string }; data?: KomerceCityRow[] } | null = null;
    try { json = JSON.parse(rawText); } catch { /* keep null */ }

    console.log("[shipping/cities]", {
      provinceId,
      httpStatus: res.status,
      metaCode: json?.meta?.code,
      metaMessage: json?.meta?.message,
      dataCount: Array.isArray(json?.data) ? json.data.length : 0,
    });

    if (!res.ok || json?.meta?.code !== 200) {
      // Fallback: return empty cities + fallback flag
      return NextResponse.json({
        success: true,
        data: [],
        fallback: true,
        reason: json?.meta?.code === 429 ? "quota-exceeded" : "komerce-error",
      });
    }

    const cities: CityItem[] = (json.data ?? []).map((c) => ({
      city_id: String(c.id),
      province_id: provinceId,
      type: "",
      city_name: c.name,
      postal_code: "",
    }));

    if (cities.length > 0) {
      cacheSet(cacheKey, cities, TTL.ONE_WEEK);
    }

    return NextResponse.json({ success: true, data: cities, fallback: false });
  } catch (err) {
    console.error("[shipping/cities] exception:", err);
    return NextResponse.json({ success: true, data: [], fallback: true, reason: "network-error" });
  }
}
