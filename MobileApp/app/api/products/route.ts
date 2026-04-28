import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/services/ProductService";
import type { FilterParams } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const params: FilterParams = {
      category: searchParams.get("category") ?? undefined,
      search: searchParams.get("search") ?? undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      sortBy: (searchParams.get("sortBy") as FilterParams["sortBy"]) ?? "terbaru",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 12,
    };

    const featured = searchParams.get("featured");
    const isNew = searchParams.get("new");

    if (featured === "true") {
      const data = await productService.getFeaturedProducts(Number(params.limit) || 8);
      return NextResponse.json({ success: true, data });
    }

    if (isNew === "true") {
      const data = await productService.getNewProducts(Number(params.limit) || 8);
      return NextResponse.json({ success: true, data });
    }

    const result = await productService.getProducts(params);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengambil produk" }, { status: 500 });
  }
}
