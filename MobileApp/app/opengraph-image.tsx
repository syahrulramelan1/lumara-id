import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "lumara.id — Modest Fashion Premium Indonesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #faf5ff 0%, #ede9fe 60%, #ddd6fe 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blob kiri atas */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(167,139,250,0.3)",
          }}
        />
        {/* Blob kanan bawah */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "rgba(232,121,249,0.2)",
          }}
        />

        {/* Card putih */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.93)",
            borderRadius: 36,
            padding: "60px 96px",
            boxShadow: "0 24px 80px -16px rgba(124,58,237,0.3)",
            border: "1.5px solid rgba(124,58,237,0.15)",
            gap: 0,
            position: "relative",
          }}
        >
          {/* Brand name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: -2,
              background: "linear-gradient(90deg, #7C3AED, #9333EA, #7C3AED)",
              backgroundClip: "text",
              color: "transparent",
              marginBottom: 8,
              lineHeight: 1,
            }}
          >
            lumara.id
          </div>

          {/* Garis pemisah */}
          <div
            style={{
              width: 60,
              height: 3,
              background: "linear-gradient(90deg, #7C3AED, #9333EA)",
              borderRadius: 9999,
              marginBottom: 20,
              marginTop: 12,
            }}
          />

          {/* Tagline pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "linear-gradient(90deg, #7C3AED, #9333EA)",
              borderRadius: 9999,
              padding: "10px 28px",
              marginBottom: 24,
            }}
          >
            <span style={{ color: "white", fontSize: 22, fontWeight: 600, letterSpacing: 0.5 }}>
              ✦ Modest Fashion Premium
            </span>
          </div>

          {/* Deskripsi */}
          <div
            style={{
              color: "#52525b",
              fontSize: 24,
              textAlign: "center",
              maxWidth: 560,
              lineHeight: 1.5,
              marginBottom: 20,
            }}
          >
            Tampil Anggun, Tetap Syar&apos;i
          </div>

          {/* Domain */}
          <div
            style={{
              color: "#a78bfa",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            lumara-id.onrender.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
