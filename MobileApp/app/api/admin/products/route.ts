import { NextRequest, NextResponse } from "next/server";
import { productModel } from "@/lib/models/ProductModel";
import { checkAdminSecret, adminUnauthorized, uploadImage } from "@/lib/admin";

export async function GET(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const sp = req.nextUrl.searchParams;
    const result = await productModel.findWithFilters({
      search: sp.get("search") ?? undefined,
      sortBy: (sp.get("sortBy") as "terbaru") ?? "terbaru",
      page: sp.get("page") ? Number(sp.get("page")) : 1,
      limit: sp.get("limit") ? Number(sp.get("limit")) : 50,
    });
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil produk" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const fd = await req.formData();
    const name = fd.get("name") as string;
    const slug = fd.get("slug") as string;
    const description = (fd.get("description") as string) ?? "";
    const categoryId = fd.get("categoryId") as string;
    const price = Number(fd.get("price"));
    const originalPrice = fd.get("originalPrice") ? Number(fd.get("originalPrice")) : undefined;
    const stock = Number(fd.get("stock"));
    const sku = (fd.get("sku") as string) ?? undefined;
    const sizes = (fd.get("sizes") as string) ?? "[]";
    const colors = (fd.get("colors") as string) ?? "[]";
    const isFeatured = fd.get("isFeatured") === "true";
    const isNew = fd.get("isNew") === "true";

    const imageFiles = fd.getAll("images") as File[];
    const imageUrls: string[] = [];
    for (const file of imageFiles) {
      if (file instanceof File && file.size > 0) {
        const url = await uploadImage(file);
        imageUrls.push(url);
      }
    }

    const product = await productModel.create({
      name, slug, description, categoryId,
      price, stock,
      ...(originalPrice !== undefined ? { originalPrice } : {}),
      ...(sku ? { sku } : {}),
      sizes, colors,
      isFeatured, isNew,
      images: JSON.stringify(imageUrls),
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal membuat produk";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
