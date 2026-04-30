import { NextRequest, NextResponse } from "next/server";
import { checkAdminSecret, adminUnauthorized } from "@/lib/admin";
import { appSettingModel } from "@/lib/models/AppSettingModel";

export async function GET(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const maintenance = await appSettingModel.isMaintenanceMode();
    return NextResponse.json({ success: true, data: { maintenance } });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal membaca settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAdminSecret(req)) return adminUnauthorized();
  try {
    const body = await req.json() as { maintenance?: boolean };
    if (typeof body.maintenance !== "boolean") {
      return NextResponse.json({ success: false, error: "Field 'maintenance' harus boolean" }, { status: 400 });
    }
    await appSettingModel.setMaintenanceMode(body.maintenance);
    return NextResponse.json({ success: true, data: { maintenance: body.maintenance } });
  } catch {
    return NextResponse.json({ success: false, error: "Gagal update settings" }, { status: 500 });
  }
}
