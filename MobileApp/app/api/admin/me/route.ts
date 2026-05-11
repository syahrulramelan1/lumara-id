import { NextRequest, NextResponse } from "next/server";
import { createServerComponent } from "@/lib/supabase";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, error: "Token diperlukan" }, { status: 401 });
  }

  try {
    const supabase = await createServerComponent();

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return NextResponse.json({ success: false, error: "Token tidak valid" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan di database", role: null }, { status: 404 });
    }

    return NextResponse.json({ success: true, role: dbUser.role, email: dbUser.email });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
