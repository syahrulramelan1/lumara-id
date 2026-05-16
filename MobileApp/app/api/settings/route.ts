import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { appSettingModel } from "@/lib/models/AppSettingModel";

const getCachedSiteSettings = unstable_cache(
  () => appSettingModel.getSiteSettings(),
  ["site-settings"],
  { revalidate: 60, tags: ["site-settings"] }
);

export async function GET() {
  try {
    const settings = await getCachedSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal membaca settings" }, { status: 500 });
  }
}
