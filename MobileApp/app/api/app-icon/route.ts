import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const iconPath = join(process.cwd(), "public", "mawar-icon.jpeg");
    const iconBuffer = readFileSync(iconPath);

    return new NextResponse(iconBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    // Fallback: redirect to the static file
    return NextResponse.redirect(new URL("/mawar-icon.jpeg", "http://localhost:3000"));
  }
}
