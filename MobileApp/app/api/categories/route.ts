import { NextRequest, NextResponse } from "next/server";
import { categoryModel } from "@/lib/models/CategoryModel";

export async function GET(req: NextRequest) {
  try {
    const withCount = req.nextUrl.searchParams.get("withCount") === "true";
    const data = withCount
      ? await categoryModel.findAllWithCount()
      : await categoryModel.findAll();
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil kategori" }, { status: 500 });
  }
}
