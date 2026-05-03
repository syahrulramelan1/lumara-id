import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import sharp from "sharp";

/**
 * Serve logo via API route + optimasi sharp (resize + WebP).
 *
 * Endpoint:
 *   GET /api/logo/dark   → logo-dark.jpeg   → WebP 600px
 *   GET /api/logo/white  → logo-white.jpeg  → WebP 600px
 *   GET /api/logo/icon   → mawar-icon.jpeg  → WebP 200px
 *
 * Original JPEG ~1.6-2 MB. Setelah resize+WebP: ~20-50 KB (40x lebih kecil).
 *
 * Cache strategy:
 *   - `force-static`: Next.js render & cache hasilnya saat build → zero
 *     runtime cost setelah build
 *   - In-memory Map: fallback runtime cache kalau dynamic
 *   - Browser Cache-Control: 1 tahun + immutable
 */

const VARIANTS: Record<string, { file: string; maxWidth: number }> = {
  dark:  { file: "logo-dark.jpeg",  maxWidth: 600 },
  white: { file: "logo-white.jpeg", maxWidth: 600 },
  icon:  { file: "mawar-icon.jpeg", maxWidth: 200 },
};

const CACHE = new Map<string, Buffer>();

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

  // Cache hit → langsung return
  const cached = CACHE.get(variant);
  if (cached) {
    return new NextResponse(new Uint8Array(cached), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Logo-Cache": "hit",
      },
    });
  }

  const candidatePaths = [
    join(process.cwd(), "public", config.file),
    join(process.cwd(), "MobileApp", "public", config.file),
    join(process.cwd(), "..", "public", config.file),
  ];

  for (const path of candidatePaths) {
    if (!existsSync(path)) continue;
    try {
      const raw = readFileSync(path);
      const optimized = await sharp(raw)
        .resize({ width: config.maxWidth, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();

      CACHE.set(variant, optimized);

      return new NextResponse(new Uint8Array(optimized), {
        headers: {
          "Content-Type": "image/webp",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Logo-Cache": "miss",
          "X-Logo-Source": path,
          "X-Logo-Size": String(optimized.length),
        },
      });
    } catch (err) {
      console.error(`[/api/logo/${variant}] sharp gagal di ${path}:`, err);
      // Fallback: serve raw JPEG kalau sharp gagal
      try {
        const raw = readFileSync(path);
        return new NextResponse(new Uint8Array(raw), {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
            "X-Logo-Cache": "raw-fallback",
          },
        });
      } catch {
        // lanjut path berikutnya
      }
    }
  }

  console.error(
    `[/api/logo/${variant}] File '${config.file}' tidak ditemukan di:`,
    candidatePaths
  );

  // Ultimate fallback: 1x1 transparent PNG
  const fallback = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64"
  );
  return new NextResponse(new Uint8Array(fallback), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-cache",
      "X-Logo-Status": "fallback-placeholder",
    },
  });
}
