import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";
import { appSettingModel, SiteSettings } from "@/lib/models/AppSettingModel";

export async function GET(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const [maintenance, site] = await Promise.all([
      appSettingModel.isMaintenanceMode(),
      appSettingModel.getSiteSettings(),
    ]);
    return NextResponse.json({ success: true, data: { maintenance, site } });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal membaca settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const body = await req.json() as { maintenance?: boolean; site?: Partial<SiteSettings> };

    if (body.maintenance !== undefined) {
      if (typeof body.maintenance !== "boolean") {
        return NextResponse.json({ success: false, error: "Field 'maintenance' harus boolean" }, { status: 400 });
      }
      await appSettingModel.setMaintenanceMode(body.maintenance);
      revalidateTag("maintenance");
    }

    if (body.site) {
      await appSettingModel.setSiteSettings(body.site);
      revalidateTag("site-settings");
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal update settings" }, { status: 500 });
  }
}
