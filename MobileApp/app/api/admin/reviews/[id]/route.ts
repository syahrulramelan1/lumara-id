import { NextRequest, NextResponse } from "next/server";
import { reviewModel } from "@/lib/models/ReviewModel";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    await reviewModel.delete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus ulasan";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
