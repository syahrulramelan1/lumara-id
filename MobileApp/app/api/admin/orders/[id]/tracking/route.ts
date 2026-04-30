import { NextRequest, NextResponse } from "next/server";
import { orderModel } from "@/lib/models/OrderModel";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const body = await req.json() as {
      status:      string;
      description: string;
      location?:   string;
    };

    if (!body.status?.trim())      return NextResponse.json({ success: false, error: "Status wajib diisi" }, { status: 400 });
    if (!body.description?.trim()) return NextResponse.json({ success: false, error: "Deskripsi wajib diisi" }, { status: 400 });

    const tracking = await orderModel.addTracking(
      id,
      body.status.trim(),
      body.description.trim(),
      body.location?.trim() || undefined
    );

    return NextResponse.json({ success: true, data: tracking });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal menambah update" }, { status: 500 });
  }
}
