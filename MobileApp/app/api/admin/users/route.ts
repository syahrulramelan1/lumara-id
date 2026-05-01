import { NextRequest, NextResponse } from "next/server";
import { userModel } from "@/lib/models/UserModel";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";

export async function GET(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
    const result = await userModel.findAll(page, 20);
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal mengambil pengguna" }, { status: 500 });
  }
}
