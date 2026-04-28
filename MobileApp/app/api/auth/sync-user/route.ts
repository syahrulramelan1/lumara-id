import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, error: "Token diperlukan" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user?.email) {
      return NextResponse.json({ success: false, error: "Token tidak valid" }, { status: 401 });
    }

    // Upsert user — kalau sudah ada tidak duplikat, role tetap USER
    const dbUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.user_metadata?.name ?? null,
        avatar: user.user_metadata?.avatar_url ?? null,
        role: "USER",
      },
    });

    return NextResponse.json({ success: true, role: dbUser.role });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
