import { NextRequest, NextResponse } from "next/server";
import { reviewModel } from "@/lib/models/ReviewModel";

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get("productId");
    if (!productId) return NextResponse.json({ success: false, error: "productId diperlukan" }, { status: 400 });
    const data = await reviewModel.findByProduct(productId);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil ulasan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, productId, rating, comment, images } = await req.json();
    if (!userId || !productId || !rating || !comment) {
      return NextResponse.json({ success: false, error: "Data ulasan tidak lengkap" }, { status: 400 });
    }
    const review = await reviewModel.create({
      userId, productId, rating, comment,
      images: images ? JSON.stringify(images) : "[]",
    });
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal membuat ulasan" }, { status: 500 });
  }
}
