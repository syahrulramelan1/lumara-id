import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/OrderService";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);

    if (userId) {
      const result = await orderService.getUserOrders(userId, page);
      return NextResponse.json({ success: true, ...result });
    }

    const result = await orderService.getAllOrders(page);
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil pesanan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, items, shippingAddress, paymentMethod } = await req.json();
    if (!userId || !items?.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ success: false, error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    // ── 1) Verify Bearer token — cegah forge userId orang lain ──
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, error: "Sesi tidak valid, silakan login ulang" }, { status: 401 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );
    const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !authUser?.email) {
      return NextResponse.json({ success: false, error: "Sesi tidak valid, silakan login ulang" }, { status: 401 });
    }

    // ── 2) Validate userId masih exist + email match ──
    //     Cegah session lama dari akun yang sudah dihapus admin.
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "Akun Anda tidak ditemukan atau telah dihapus. Silakan hubungi admin." },
        { status: 403 }
      );
    }
    if (dbUser.email.toLowerCase() !== authUser.email.toLowerCase()) {
      return NextResponse.json({ success: false, error: "Sesi tidak cocok dengan akun" }, { status: 403 });
    }

    const order = await orderService.createOrder(userId, items, shippingAddress, paymentMethod);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal membuat pesanan";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
