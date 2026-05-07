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
      next: { revalidate: 86400 }, // cache 24 jam
    });
    const json = await res.json();
    const cities = json?.rajaongkir?.results ?? [];
    return NextResponse.json({ success: true, data: cities });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil data kota" }, { status: 500 });
  }
}
