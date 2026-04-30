import { NextRequest, NextResponse } from "next/server";
import { orderModel } from "@/lib/models/OrderModel";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;

    // Verifikasi user yang login adalah pemilik order
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

    // Pastikan order milik user ini
    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
    if (!dbUser) return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });

    const order = await orderModel.findById(id);
    if (!order) return NextResponse.json({ success: false, error: "Pesanan tidak ditemukan" }, { status: 404 });
    if (order.userId !== dbUser.id) return NextResponse.json({ success: false, error: "Bukan pesanan kamu" }, { status: 403 });
    if (order.status !== "SHIPPED") return NextResponse.json({ success: false, error: "Pesanan belum dikirim" }, { status: 400 });

    await orderModel.confirmDelivery(id);
    const updated = await orderModel.findById(id);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Gagal konfirmasi" }, { status: 500 });
  }
}
