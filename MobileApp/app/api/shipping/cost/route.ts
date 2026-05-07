import { NextRequest, NextResponse } from "next/server";
import { fetchShippingOptions } from "@/lib/shipping/rajaongkir";

export async function POST(req: NextRequest) {
  try {
    const { destination, weight } = await req.json();
    if (!destination || weight == null) {
      return NextResponse.json({ success: false, error: "destination dan weight wajib diisi" }, { status: 400 });
    }

    const weightNum = Number(weight);
    if (!Number.isFinite(weightNum) || weightNum < 100) {
      return NextResponse.json(
        { success: false, error: "Berat minimal 100 gram" },
        { status: 400 }
      );
    }

    const data = await fetchShippingOptions(String(destination), weightNum);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menghitung ongkir";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
