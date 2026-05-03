import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Serve logo via API route — lebih reliabel daripada static file di public/
 * untuk Next.js standalone mode di Render.
 *
 * Endpoint:
 *   GET /api/logo/dark   → logo-dark.jpeg   (untuk light mode + footer light)
 *   GET /api/logo/white  → logo-white.jpeg  (untuk dark mode + footer dark)
 *   GET /api/logo/icon   → mawar-icon.jpeg  (favicon/icon kotak)
 *
 * Kenapa pakai API route, bukan langsung /logo-xxx.jpeg dari public/?
 *   - Di Render production (Next.js standalone), static serving dari public/
 *     kadang tidak konsisten setelah cp -r public .next/standalone/public.
 *   - readFileSync bisa baca file dari filesystem manapun yang accessible
 *     ke Node process — pattern ini sama dengan /api/app-icon yang sudah
 *     terbukti jalan.
 *   - Cache 1 tahun + immutable → browser cache aggresif, no perf penalty.
 */

const VARIANTS: Record<string, { file: string; mime: string }> = {
  dark:  { file: "logo-dark.jpeg",  mime: "image/jpeg" },
  white: { file: "logo-white.jpeg", mime: "image/jpeg" },
  icon:  { file: "mawar-icon.jpeg", mime: "image/jpeg" },
};

export const dynamic = "force-static";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ variant: string }> }
) {
  const { variant } = await params;
  const config = VARIANTS[variant];

  if (!config) {
    return NextResponse.json(
      { error: `Variant '${variant}' tidak valid. Pilih: dark, white, icon.` },
      { status: 400 }
    );
  }

  // Coba beberapa path — production standalone kadang punya cwd berbeda
  const candidatePaths = [
    join(process.cwd(), "public", config.file),               // standalone: .next/standalone/public/
    join(process.cwd(), "MobileApp", "public", config.file),  // monorepo dev
    join(process.cwd(), "..", "public", config.file),         // edge case
  ];

  for (const path of candidatePaths) {
    if (existsSync(path)) {
      try {
        const buffer = readFileSync(path);
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": config.mime,
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Logo-Source": path,
          },
        });
      } catch {
        // Lanjut ke kandidat berikutnya
      }
    }
  }

  // Semua path gagal — log untuk debug & return placeholder transparent 1x1 PNG
  console.error(
    `[/api/logo/${variant}] File '${config.file}' tidak ditemukan di:`,
    candidatePaths
  );

  // Fallback: 1x1 transparent PNG agar UI tidak broken
  const fallback = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64"
  );
  return new NextResponse(fallback, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-cache",
      "X-Logo-Status": "fallback-placeholder",
    },
  });
}
