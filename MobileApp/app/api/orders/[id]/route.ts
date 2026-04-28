import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/OrderService";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await orderService.getOrder(id);
    if (!order) return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil pesanan" }, { status: 500 });
  }
}
