import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { userModel } from "@/lib/models/UserModel";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";
import { getSupabaseAdmin, findAuthUserIdByEmail } from "@/lib/supabase-admin";

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

    // Ambil email user dulu — diperlukan untuk hapus dari Supabase Auth
    const dbUser = await prisma.user.findUnique({
      where: { id },
      select: { email: true, role: true },
    });
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "Pengguna tidak ditemukan" }, { status: 404 });
    }

    // Cegah admin menghapus admin lain (opsional, tapi defensive)
    if (dbUser.role === "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Tidak bisa menghapus akun ADMIN dari sini" },
        { status: 403 }
      );
    }

    // 1) Hapus dari Supabase Auth dulu — supaya akun TIDAK bisa login ulang
    //    Kalau ini gagal, abort (jangan hapus DB) supaya state tetap konsisten.
    const authId = await findAuthUserIdByEmail(dbUser.email);
    if (authId) {
      const sb = getSupabaseAdmin();
      const { error: delAuthErr } = await sb.auth.admin.deleteUser(authId);
      if (delAuthErr) {
        return NextResponse.json(
          { success: false, error: `Gagal hapus dari Supabase Auth: ${delAuthErr.message}` },
          { status: 500 }
        );
      }
    }

    // 2) Baru hapus dari Prisma DB (cascade hapus wishlist & reviews)
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus pengguna";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
