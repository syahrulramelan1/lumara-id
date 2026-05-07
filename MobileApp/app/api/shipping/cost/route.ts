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
    console.log("[shipping/cost]", {
      destination: String(destination),
      weight: weightNum,
      optionsCount: data.length,
    });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[shipping/cost] exception:", err);
    const msg = err instanceof Error ? err.message : "Gagal menghitung ongkir";
    return NextResponse.json(
      { success: false, error: msg, details: { exception: String(err) } },
      { status: 500 }
    );
  }
}
