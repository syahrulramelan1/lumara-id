import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

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
