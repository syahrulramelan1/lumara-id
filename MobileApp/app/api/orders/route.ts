import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/OrderService";
import { prisma } from "@/lib/prisma";
import { createServerComponent } from "@/lib/supabase";
import type { CartItem, ShippingAddress } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServerComponent();
    const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !authUser?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: authUser.email },
      select: { id: true },
    });
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });
    }

    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const result = await orderService.getUserOrders(dbUser.id, page);
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil pesanan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod,
      shippingCost = 0,
      courier,
      courierService,
      weightGrams = 1000,
    } = body as {
      userId?: string;
      items?: CartItem[];
      shippingAddress?: ShippingAddress;
      paymentMethod?: string;
      shippingCost?: number;
      courier?: string;
      courierService?: string;
      weightGrams?: number;
    };

    if (!userId || !items?.length || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ success: false, error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ success: false, error: "Sesi tidak valid, silakan login ulang" }, { status: 401 });
    }

    const supabase = await createServerComponent();
    const { data: { user: authUser }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !authUser?.email) {
      return NextResponse.json({ success: false, error: "Sesi tidak valid, silakan login ulang" }, { status: 401 });
    }

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

    const costNum = Number(shippingCost);
    if (!Number.isFinite(costNum) || costNum < 0) {
      return NextResponse.json({ success: false, error: "Ongkir tidak valid" }, { status: 400 });
    }

    const w = Number(weightGrams);
    if (!Number.isFinite(w) || w < 100) {
      return NextResponse.json({ success: false, error: "Berat paket tidak valid" }, { status: 400 });
    }

    const order = await orderService.createOrder(
      userId,
      items,
      shippingAddress,
      paymentMethod,
      Math.round(costNum),
      courier,
      courierService,
      Math.round(w)
    );
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal membuat pesanan";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
