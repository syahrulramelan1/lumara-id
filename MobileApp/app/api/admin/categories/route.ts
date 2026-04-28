import { NextRequest, NextResponse } from "next/server";
import { categoryModel } from "@/lib/models/CategoryModel";
import { checkAdminSecret, adminUnauthorized, uploadImage } from "@/lib/admin";

export async function GET(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const data = await categoryModel.findAllWithCount();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil kategori" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const fd = await req.formData();
    const name = fd.get("name") as string;
    const slug = fd.get("slug") as string;
    const description = (fd.get("description") as string) || undefined;

    let image: string | undefined;
    const imageFile = fd.get("image") as File | null;
    if (imageFile instanceof File && imageFile.size > 0) {
      image = await uploadImage(imageFile, "lumara");
    }

    const category = await categoryModel.create({ name, slug, description, image });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal membuat kategori";
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}
