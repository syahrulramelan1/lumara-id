import { NextRequest, NextResponse } from "next/server";

const KOMERCE_URL = "https://rajaongkir.komerce.id/api/v1";

interface KomerceCityRow { id: number | string; name: string }

export async function GET(req: NextRequest) {
  try {
    const API_KEY = process.env.RAJAONGKIR_API_KEY?.trim();
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: "Sistem ongkir belum dikonfigurasi. Hubungi admin." },
        { status: 503 }
      );
    }
    const provinceId = req.nextUrl.searchParams.get("province_id");
    if (!provinceId) {
      return NextResponse.json({ success: false, error: "province_id wajib diisi" }, { status: 400 });
    }

    // Komerce: city_id pakai PATH param, bukan query
    const res = await fetch(`${KOMERCE_URL}/destination/city/${encodeURIComponent(provinceId)}`, {
      headers: { key: API_KEY },
      next: { revalidate: 86400 },
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

    // Map ke shape kompatibel dengan API lama. Komerce tidak return type/postal_code,
    // jadi default ke string kosong (frontend masih jalan, postal_code user input manual).
    const cities = (json.data ?? []).map((c) => ({
      city_id: String(c.id),
      province_id: provinceId,
      type: "",
      city_name: c.name,
      postal_code: "",
    }));

    return NextResponse.json({ success: true, data: cities });
  } catch (err) {
    console.error("[shipping/cities] exception:", err);
    const msg = err instanceof Error ? err.message : "Gagal mengambil data kota";
    return NextResponse.json(
      { success: false, error: msg, details: { exception: String(err) } },
      { status: 500 }
    );
  }
}
