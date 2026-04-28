import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userModel } from "@/lib/models/UserModel";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const user = await userModel.findById(id);
    if (!user) return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil pengguna" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const { role } = await req.json();
    if (!role) return NextResponse.json({ success: false, error: "Role diperlukan" }, { status: 400 });
    const user = await prisma.user.update({ where: { id }, data: { role } });
    return NextResponse.json({ success: true, data: user });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui pengguna";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus pengguna";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
