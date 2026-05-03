import { NextResponse } from "next/server";

/**
 * Legacy endpoint — redirect ke API logo yang baru.
 * Dipertahankan untuk backward compatibility (dulu dipakai untuk favicon).
 */
export async function GET(req: Request) {
  const url = new URL("/api/logo/icon", req.url);
  return NextResponse.redirect(url, { status: 308 });
}
