import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/lib/services/OrderService";

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
    const order = await orderService.createOrder(userId, items, shippingAddress, paymentMethod);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal membuat pesanan";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
