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

    const result = await fetchShippingOptions(String(destination), weightNum);
    console.log("[shipping/cost]", {
      destination: String(destination),
      weight: weightNum,
      filteredOptions: result.options.length,
      rawCount: result.rawCount,
      filteredCount: result.filteredCount,
    });

    // Kalau SEMUA kurir kena 429 (daily limit), surface error yg jelas
    const allRateLimited = result.diagnostics.every((d) => d.metaCode === 429);
    if (result.options.length === 0 && allRateLimited && result.diagnostics.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Sistem ongkir sedang sibuk (kuota harian penuh). Silakan coba beberapa jam lagi.",
          debug: { perCourier: result.diagnostics, rawCount: 0 },
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.options,
      debug: {
        rawCount: result.rawCount,
        filteredCount: result.filteredCount,
        perCourier: result.diagnostics,
      },
    });
  } catch (err) {
    console.error("[shipping/cost] exception:", err);
    const msg = err instanceof Error ? err.message : "Gagal menghitung ongkir";
    return NextResponse.json(
      { success: false, error: msg, details: { exception: String(err) } },
      { status: 500 }
    );
  }
}
