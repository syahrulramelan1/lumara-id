import { NextRequest, NextResponse } from "next/server";
import { fetchShippingOptions } from "@/lib/shipping/rajaongkir";
import { getStaticShippingOptions } from "@/lib/shipping/static";

export async function POST(req: NextRequest) {
  try {
    const { destination, provinceId, weight } = await req.json();

    const weightNum = Number(weight);
    if (!Number.isFinite(weightNum) || weightNum < 100) {
      return NextResponse.json(
        { success: false, error: "Berat minimal 100 gram" },
        { status: 400 }
      );
    }

    // Helper: fallback ke static flat rate berdasarkan provinceId
    const fallbackResponse = (reason: string) => {
      if (!provinceId) {
        return NextResponse.json(
          {
            success: false,
            error: "Sistem ongkir tidak tersedia. Coba beberapa saat lagi.",
            details: { reason },
          },
          { status: 503 }
        );
      }
      const opts = getStaticShippingOptions(String(provinceId), weightNum);
      if (opts.length === 0) {
        return NextResponse.json(
          { success: false, error: "Tujuan pengiriman tidak dikenal", details: { reason, provinceId } },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        data: opts,
        fallback: true,
        reason,
        debug: { mode: "static-flat-rate" },
      });
    };

    // Kalau destination kosong → langsung fallback static (mode no city)
    if (!destination) {
      return fallbackResponse("no-destination");
    }

    try {
      const result = await fetchShippingOptions(String(destination), weightNum);
      console.log("[shipping/cost]", {
        destination: String(destination),
        weight: weightNum,
        filteredOptions: result.options.length,
        rawCount: result.rawCount,
      });

      // Kalau semua kurir kena 429 → fallback
      const allRateLimited = result.diagnostics.length > 0 && result.diagnostics.every((d) => d.metaCode === 429);
      if (allRateLimited) {
        return fallbackResponse("quota-exceeded");
      }

      // Kalau Komerce return 0 hasil → fallback supaya buyer tetep bisa checkout
      if (result.options.length === 0) {
        return fallbackResponse("no-coverage");
      }

      return NextResponse.json({
        success: true,
        data: result.options,
        fallback: false,
        debug: {
          rawCount: result.rawCount,
          filteredCount: result.filteredCount,
          perCourier: result.diagnostics,
        },
      });
    } catch (err) {
      console.error("[shipping/cost] Komerce exception:", err);
      return fallbackResponse("komerce-exception");
    }
  } catch (err) {
    console.error("[shipping/cost] exception:", err);
    const msg = err instanceof Error ? err.message : "Gagal menghitung ongkir";
    return NextResponse.json(
      { success: false, error: msg, details: { exception: String(err) } },
      { status: 500 }
    );
  }
}
