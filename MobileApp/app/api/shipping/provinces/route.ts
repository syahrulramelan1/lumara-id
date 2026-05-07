import { NextResponse } from "next/server";

const RAJAONGKIR_URL = "https://api.rajaongkir.com/starter";

export async function GET() {
  try {
    const API_KEY = process.env.RAJAONGKIR_API_KEY?.trim();
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: "Raja Ongkir belum dikonfigurasi (RAJAONGKIR_API_KEY)." },
        { status: 503 }
      );
    }
    const res = await fetch(`${RAJAONGKIR_URL}/province`, {
      headers: { key: API_KEY },
      next: { revalidate: 86400 }, // cache 24 jam
    });
    const json = await res.json();
    const provinces = json?.rajaongkir?.results ?? [];
    return NextResponse.json({ success: true, data: provinces });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil data provinsi" }, { status: 500 });
  }
}
