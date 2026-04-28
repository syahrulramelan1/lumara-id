import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";

export async function GET(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      totalUsers,
      pendingOrders,
      revenueAgg,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ["DELIVERED", "SHIPPED", "PROCESSING"] } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue: revenueAgg._sum.total ?? 0,
        pendingOrders,
        totalUsers,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil statistik" }, { status: 500 });
  }
}
