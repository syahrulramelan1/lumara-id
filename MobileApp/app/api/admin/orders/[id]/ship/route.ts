import { NextRequest, NextResponse } from "next/server";
import { orderModel } from "@/lib/models/OrderModel";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const body = await req.json() as {
      courier:          string;
      courierService:   string;
      trackingNumber:   string;
      estimatedArrival: string; // ISO date string
      note?:            string;
    };

    if (!body.courier?.trim())        return NextResponse.json({ success: false, error: "Kurir wajib dipilih" }, { status: 400 });
    if (!body.courierService?.trim()) return NextResponse.json({ success: false, error: "Layanan kurir wajib diisi" }, { status: 400 });
    if (!body.trackingNumber?.trim()) return NextResponse.json({ success: false, error: "Nomor resi wajib diisi" }, { status: 400 });
    if (!body.estimatedArrival)       return NextResponse.json({ success: false, error: "Estimasi tiba wajib diisi" }, { status: 400 });

    const order = await orderModel.shipOrder(id, {
      courier:          body.courier.trim(),
      courierService:   body.courierService.trim(),
      trackingNumber:   body.trackingNumber.trim(),
      estimatedArrival: new Date(body.estimatedArrival),
      note:             body.note,
    });

    const updated = await orderModel.findById(id);
    return NextResponse.json({ success: true, data: updated ?? order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal mengirim pesanan" }, { status: 500 });
  }
}
