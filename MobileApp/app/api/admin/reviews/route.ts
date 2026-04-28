import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";

export async function GET(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const limit = 50;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.review.findMany({
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } },
          product: { select: { id: true, name: true, images: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count(),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil ulasan" }, { status: 500 });
  }
}
