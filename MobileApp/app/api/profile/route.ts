import { NextRequest, NextResponse } from "next/server";
import { createServerComponent } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const supabase = await createServerComponent();

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json() as { name?: string; phone?: string };
    const updated = await prisma.user.update({
      where: { email: user.email },
      data: {
        ...(body.name  !== undefined && { name: body.name }),
        ...(body.phone !== undefined && { phone: body.phone }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id, email: updated.email,
        name: updated.name, avatar: updated.avatar,
        phone: updated.phone, role: updated.role,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal update profil" }, { status: 500 });
  }
}
