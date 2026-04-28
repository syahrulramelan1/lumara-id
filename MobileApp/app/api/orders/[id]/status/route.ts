import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/OrderService";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!status) return NextResponse.json({ success: false, error: "Status diperlukan" }, { status: 400 });
    const order = await orderService.updateStatus(id, status);
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal update status";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
