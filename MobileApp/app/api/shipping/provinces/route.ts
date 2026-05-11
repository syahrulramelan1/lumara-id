import { NextResponse } from "next/server";
import { cacheGet, cacheSet, TTL } from "@/lib/shipping/cache";
import { getStaticProvinces } from "@/lib/shipping/static";

const KOMERCE_URL = "https://rajaongkir.komerce.id/api/v1";

interface KomerceProvinceRow { id: number | string; name: string }
interface ProvinceItem { province_id: string; province: string }

const CACHE_KEY = "komerce:provinces:v1";

export async function GET() {
  // 1) Cek cache live data dulu — hemat quota Komerce
  const cached = cacheGet<ProvinceItem[]>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ success: true, data: cached, cached: true, fallback: false });
  }

  const API_KEY = process.env.RAJAONGKIR_API_KEY?.trim();
  if (!API_KEY) {
    // Tanpa API key → langsung fallback static
    return NextResponse.json({
      success: true,
      data: getStaticProvinces(),
      fallback: true,
      reason: "no-api-key",
    });
  }

  try {
    const res = await fetch(`${KOMERCE_URL}/destination/province`, {
      headers: { key: API_KEY },
      cache: "no-store",
    });

    const rawText = await res.text();
    let json: { meta?: { code?: number; message?: string }; data?: KomerceProvinceRow[] } | null = null;
    try { json = JSON.parse(rawText); } catch { /* keep null */ }

    console.log("[shipping/provinces]", {
      httpStatus: res.status,
      metaCode: json?.meta?.code,
      metaMessage: json?.meta?.message,
      dataCount: Array.isArray(json?.data) ? json.data.length : 0,
    });

    // Komerce fail (429 daily limit, 5xx, dll) → fallback ke static, bukan error
    if (!res.ok || json?.meta?.code !== 200) {
      return NextResponse.json({
        success: true,
        data: getStaticProvinces(),
        fallback: true,
        reason: json?.meta?.code === 429 ? "quota-exceeded" : "komerce-error",
      });
    }

    const provinces: ProvinceItem[] = (json.data ?? []).map((p) => ({
      province_id: String(p.id),
      province: p.name,
    }));

    // Cache hanya kalau success
    if (provinces.length > 0) {
      cacheSet(CACHE_KEY, provinces, TTL.ONE_WEEK);
    }

    return NextResponse.json({ success: true, data: provinces, fallback: false });
  } catch (err) {
    console.error("[shipping/provinces] exception:", err);
    // Network error → tetep fallback ke static
    return NextResponse.json({
      success: true,
      data: getStaticProvinces(),
      fallback: true,
      reason: "network-error",
    });
  }
}
