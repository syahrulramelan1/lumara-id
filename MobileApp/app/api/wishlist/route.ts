import { NextRequest, NextResponse } from "next/server";
import { wishlistService } from "@/lib/services/WishlistService";

// GET /api/wishlist?userId=xxx
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) return NextResponse.json({ success: false, error: "userId diperlukan" }, { status: 400 });
    const data = await wishlistService.getWishlist(userId);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil wishlist" }, { status: 500 });
  }
}

// POST /api/wishlist  { userId, productId }
export async function POST(req: NextRequest) {
  try {
    const { userId, productId } = await req.json();
    if (!userId || !productId) return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 });
    const result = await wishlistService.toggle(userId, productId);
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal toggle wishlist" }, { status: 500 });
  }
}
