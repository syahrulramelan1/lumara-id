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
      ratedProducts,
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
      prisma.product.findMany({
        where:  { reviewCount: { gt: 0 } },
        select: { id: true, name: true, rating: true, reviewCount: true },
        orderBy: { reviewCount: "desc" },
      }),
    ]);

    // Rating toko = rata-rata weighted (bobot jumlah ulasan per produk)
    let totalWeighted = 0, totalReviewCount = 0;
    for (const p of ratedProducts) {
      totalWeighted    += p.rating * p.reviewCount;
      totalReviewCount += p.reviewCount;
    }
    const storeRating = totalReviewCount > 0
      ? Math.round((totalWeighted / totalReviewCount) * 10) / 10
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalOrders,
        totalRevenue: revenueAgg._sum.total ?? 0,
        pendingOrders,
        totalUsers,
        storeRating,
        totalReviews: totalReviewCount,
        productRatings: ratedProducts.map(p => ({
          id: p.id, name: p.name, rating: p.rating, reviewCount: p.reviewCount,
        })),
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil statistik" }, { status: 500 });
  }
}
