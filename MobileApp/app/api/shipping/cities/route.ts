import { NextRequest, NextResponse } from "next/server";

const RAJAONGKIR_URL = "https://api.rajaongkir.com/starter";

export async function GET(req: NextRequest) {
  try {
    const API_KEY = process.env.RAJAONGKIR_API_KEY?.trim();
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: "Raja Ongkir belum dikonfigurasi (RAJAONGKIR_API_KEY)." },
        { status: 503 }
      );
    }
    const provinceId = req.nextUrl.searchParams.get("province_id");
    if (!provinceId) {
      return NextResponse.json({ success: false, error: "province_id wajib diisi" }, { status: 400 });
    }

    const res = await fetch(`${RAJAONGKIR_URL}/city?province=${provinceId}`, {
      headers: { key: API_KEY },
      next: { revalidate: 86400 },
    });

    const rawText = await res.text();
    let json: unknown = null;
    try { json = JSON.parse(rawText); } catch { /* keep null */ }

    const ro = (json as { rajaongkir?: { status?: { code?: number; description?: string }; results?: unknown[] } } | null)?.rajaongkir;

    console.log("[shipping/cities]", {
      provinceId,
      httpStatus: res.status,
      roStatusCode: ro?.status?.code,
      roStatusDesc: ro?.status?.description,
      resultsCount: Array.isArray(ro?.results) ? ro.results.length : 0,
      bodyPreview: rawText.slice(0, 400),
    });

    if (!res.ok || ro?.status?.code !== 200) {
      return NextResponse.json(
        {
          success: false,
          error: ro?.status?.description ?? `RajaOngkir HTTP ${res.status}`,
          details: {
            httpStatus: res.status,
            roStatusCode: ro?.status?.code,
            roStatusDesc: ro?.status?.description,
            bodyPreview: rawText.slice(0, 400),
          },
        },
        { status: 502 }
      );
    }

    const cities = ro?.results ?? [];
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
