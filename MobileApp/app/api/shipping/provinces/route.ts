import { NextResponse } from "next/server";

const KOMERCE_URL = "https://rajaongkir.komerce.id/api/v1";

interface KomerceProvinceRow { id: number | string; name: string }

export async function GET() {
  try {
    const API_KEY = process.env.RAJAONGKIR_API_KEY?.trim();
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: "Sistem ongkir belum dikonfigurasi. Hubungi admin." },
        { status: 503 }
      );
    }

    const res = await fetch(`${KOMERCE_URL}/destination/province`, {
      headers: { key: API_KEY },
      next: { revalidate: 86400 },
    });

    const rawText = await res.text();
    let json: { meta?: { code?: number; message?: string }; data?: KomerceProvinceRow[] } | null = null;
    try { json = JSON.parse(rawText); } catch { /* keep null */ }

    console.log("[shipping/provinces]", {
      httpStatus: res.status,
      metaCode: json?.meta?.code,
      metaMessage: json?.meta?.message,
      dataCount: Array.isArray(json?.data) ? json.data.length : 0,
      bodyPreview: rawText.slice(0, 400),
    });

    if (!res.ok || json?.meta?.code !== 200) {
      return NextResponse.json(
        {
          success: false,
          error: json?.meta?.message ?? `Komerce HTTP ${res.status}`,
          details: { httpStatus: res.status, metaCode: json?.meta?.code, bodyPreview: rawText.slice(0, 400) },
        },
        { status: 502 }
      );
    }

    // Map ke shape yang sama dengan API lama supaya frontend tidak perlu ubah
    const provinces = (json.data ?? []).map((p) => ({
      province_id: String(p.id),
      province: p.name,
    }));

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
