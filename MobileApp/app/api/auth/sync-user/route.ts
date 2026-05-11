import { NextRequest, NextResponse } from "next/server";
import { createServerComponent } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, error: "Token diperlukan" }, { status: 401 });
    }

    const supabase = await createServerComponent();

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) {
      return NextResponse.json({ success: false, error: "Token tidak valid" }, { status: 401 });
    }

    // Idempotent: cek dulu, kalau sudah ada return langsung (cegah race
    // condition saat user buka 2 tab → 2 concurrent POST sync-user).
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    const dbUser = existing ?? (await prisma.user.create({
      data: {
        email: user.email,
        name: user.user_metadata?.name ?? null,
        avatar: user.user_metadata?.avatar_url ?? null,
        role: "USER",
      },
    }));

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        avatar: dbUser.avatar,
        phone: dbUser.phone,
        role: dbUser.role,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
