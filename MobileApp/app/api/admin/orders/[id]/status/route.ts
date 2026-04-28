import { NextRequest, NextResponse } from "next/server";
import { orderModel } from "@/lib/models/OrderModel";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";

const VALID_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: "Status tidak valid" }, { status: 400 });
    }
    const order = await orderModel.updateStatus(id, status);
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal update status";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
