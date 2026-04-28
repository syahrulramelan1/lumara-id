import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/services/ProductService";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bySlug = id.includes("-");
    const product = bySlug
      ? await productService.getProductBySlug(id)
      : await productService.getProductById(id);

    if (!product) {
      return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil produk" }, { status: 500 });
  }
}
