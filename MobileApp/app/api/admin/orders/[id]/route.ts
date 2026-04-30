import { NextRequest, NextResponse } from "next/server";
import { orderModel } from "@/lib/models/OrderModel";
import { prisma } from "@/lib/prisma";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const order = await orderModel.findById(id);
    if (!order) return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil pesanan" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const body = await req.json() as { status?: string };
    if (!body.status) return NextResponse.json({ success: false, error: "Status wajib diisi" }, { status: 400 });
    if (body.status === "SHIPPED")
      return NextResponse.json({ success: false, error: "Gunakan endpoint /ship untuk status SHIPPED" }, { status: 400 });
    const order = await orderModel.updateStatus(id, body.status);
    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal update" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus pesanan";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
