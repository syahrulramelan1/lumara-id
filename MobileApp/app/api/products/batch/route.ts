import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json({ success: false, error: "ids wajib diisi" }, { status: 400 });

  const idList = ids.split(",").filter(Boolean).slice(0, 50);
  if (!idList.length) return NextResponse.json({ success: true, data: [] });

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: idList } },
      include: { category: true },
    });
    return NextResponse.json({ success: true, data: products });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil produk" }, { status: 500 });
  }
}
