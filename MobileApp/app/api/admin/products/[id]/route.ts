import { NextRequest, NextResponse } from "next/server";
import { productModel } from "@/lib/models/ProductModel";
import { checkAdminSecret, adminUnauthorized, uploadImage } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const product = await productModel.findById(id);
    if (!product) return NextResponse.json({ success: false, error: "Produk tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil produk" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const fd = await req.formData();

    const name = fd.get("name") as string | null;
    const slug = fd.get("slug") as string | null;
    const description = fd.get("description") as string | null;
    const categoryId = fd.get("categoryId") as string | null;
    const price = fd.get("price") ? Number(fd.get("price")) : undefined;
    const originalPrice = fd.get("originalPrice") ? Number(fd.get("originalPrice")) : null;
    const stock = fd.get("stock") ? Number(fd.get("stock")) : undefined;
    const sku = fd.get("sku") as string | null;
    const sizes = fd.get("sizes") as string | null;
    const colors = fd.get("colors") as string | null;
    const isFeatured = fd.has("isFeatured") ? fd.get("isFeatured") === "true" : undefined;
    const isNew = fd.has("isNew") ? fd.get("isNew") === "true" : undefined;

    let existingImages: string[] = [];
    const existingRaw = fd.get("existingImages") as string | null;
    if (existingRaw) {
      try { existingImages = JSON.parse(existingRaw); } catch { /* ignore */ }
    }

    const imageFiles = fd.getAll("images") as File[];
    const newUrls: string[] = [];
    for (const file of imageFiles) {
      if (file instanceof File && file.size > 0) {
        const url = await uploadImage(file);
        newUrls.push(url);
      }
    }

    const allImages = [...existingImages, ...newUrls];

    const product = await productModel.update(id, {
      ...(name ? { name } : {}),
      ...(slug ? { slug } : {}),
      ...(description !== null ? { description } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(originalPrice !== undefined ? { originalPrice } : {}),
      ...(stock !== undefined ? { stock } : {}),
      ...(sku !== null ? { sku } : {}),
      ...(sizes ? { sizes } : {}),
      ...(colors ? { colors } : {}),
      ...(isFeatured !== undefined ? { isFeatured } : {}),
      ...(isNew !== undefined ? { isNew } : {}),
      images: JSON.stringify(allImages),
    });

    return NextResponse.json({ success: true, data: product });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui produk";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    await productModel.delete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus produk";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
