import { NextResponse } from "next/server";
import { cacheGet, cacheSet, TTL } from "@/lib/shipping/cache";

const KOMERCE_URL = "https://rajaongkir.komerce.id/api/v1";

interface KomerceProvinceRow { id: number | string; name: string }

interface ProvinceItem { province_id: string; province: string }

const CACHE_KEY = "komerce:provinces:v1";

export async function GET() {
  try {
    // 1) Cek cache dulu — hemat quota Komerce
    const cached = cacheGet<ProvinceItem[]>(CACHE_KEY);
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true });
    }

    const API_KEY = process.env.RAJAONGKIR_API_KEY?.trim();
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: "Sistem ongkir belum dikonfigurasi. Hubungi admin." },
        { status: 503 }
      );
    }

    const res = await fetch(`${KOMERCE_URL}/destination/province`, {
      headers: { key: API_KEY },
      // Disable Next fetch cache — kita pakai in-memory cache custom
      // supaya 429 (daily limit) tidak ke-cache 24h.
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

    // Detect daily limit specifically — kasih error yang jelas
    if (json?.meta?.code === 429) {
      return NextResponse.json(
        {
          success: false,
          error: "Sistem ongkir sedang sibuk (kuota harian penuh). Silakan coba beberapa jam lagi.",
          details: { metaCode: 429, metaMessage: json.meta.message },
        },
        { status: 503 }
      );
    }

    if (!res.ok || json?.meta?.code !== 200) {
      return NextResponse.json(
        {
          success: false,
          error: json?.meta?.message ?? `Komerce HTTP ${res.status}`,
          details: { httpStatus: res.status, metaCode: json?.meta?.code, bodyPreview: rawText.slice(0, 300) },
        },
        { status: 502 }
      );
    }

    // Map ke shape kompat lama
    const provinces: ProvinceItem[] = (json.data ?? []).map((p) => ({
      province_id: String(p.id),
      province: p.name,
    }));

    // Cache HANYA kalau success
    if (provinces.length > 0) {
      cacheSet(CACHE_KEY, provinces, TTL.ONE_WEEK);
    }

    return NextResponse.json({ success: true, data: provinces });
  } catch (err) {
    console.error("[shipping/provinces] exception:", err);
    const msg = err instanceof Error ? err.message : "Gagal mengambil data provinsi";
    return NextResponse.json(
      { success: false, error: msg, details: { exception: String(err) } },
      { status: 500 }
    );
  }
}
