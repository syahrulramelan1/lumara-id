import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { checkAdminSecret, adminUnauthorized, uploadImage } from "@/lib/admin";
import { appSettingModel } from "@/lib/models/AppSettingModel";

export async function POST(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const variant = form.get("variant") as string | null;

    if (!file || !variant) {
      return NextResponse.json({ success: false, error: "Field 'file' dan 'variant' wajib ada" }, { status: 400 });
    }
    if (!["dark", "white"].includes(variant)) {
      return NextResponse.json({ success: false, error: "Variant harus 'dark' atau 'white'" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "File harus berupa gambar" }, { status: 400 });
    }

    const url = await uploadImage(file, "lumara-id");
    const key = variant === "dark" ? "logo_dark_url" : "logo_white_url";
    await appSettingModel.set(key, url);
    revalidateTag("site-settings");

    return NextResponse.json({ success: true, url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload gagal";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
