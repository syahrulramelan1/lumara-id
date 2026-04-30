import { NextResponse } from "next/server";
import { appSettingModel } from "@/lib/models/AppSettingModel";

export const dynamic = "force-dynamic";

export async function GET() {
  const maintenance = await appSettingModel.isMaintenanceMode();
  return NextResponse.json({ maintenance });
}
