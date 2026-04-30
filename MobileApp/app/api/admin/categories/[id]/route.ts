import { NextRequest, NextResponse } from "next/server";
import { categoryModel } from "@/lib/models/CategoryModel";
import { checkAdminSecret, adminUnauthorized, uploadImage } from "@/lib/admin";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const category = await categoryModel.findById(id);
    if (!category) return NextResponse.json({ success: false, error: "Kategori tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: category });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil kategori" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    const ct = req.headers.get("content-type") ?? "";
    let name: string | null = null;
    let slug: string | null = null;
    let description: string | null = null;
    let image: string | undefined;

    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      name = fd.get("name") as string | null;
      slug = fd.get("slug") as string | null;
      description = fd.get("description") as string | null;
      const imageFile = fd.get("image") as File | null;
      if (imageFile instanceof File && imageFile.size > 0) {
        image = await uploadImage(imageFile, "lumara-id");
      }
    } else {
      const body = await req.json();
      name = body.name ?? null;
      slug = body.slug ?? null;
      description = body.description ?? null;
    }

    const category = await categoryModel.update(id, {
      ...(name ? { name } : {}),
      ...(slug ? { slug } : {}),
      ...(description !== null ? { description } : {}),
      ...(image ? { image } : {}),
    });
    return NextResponse.json({ success: true, data: category });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui kategori";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const { id } = await params;
    await categoryModel.delete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus kategori";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
