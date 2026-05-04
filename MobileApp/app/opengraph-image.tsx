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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #faf5ff 0%, #f5f3ff 40%, #ede9fe 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Blob dekorasi kiri atas */}
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(167,139,250,0.25)",
            filter: "blur(60px)",
          }}
        />
        {/* Blob dekorasi kanan bawah */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(232,121,249,0.18)",
            filter: "blur(60px)",
          }}
        />

        {/* Card putih tengah */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.92)",
            borderRadius: 32,
            padding: "56px 80px",
            boxShadow: "0 20px 60px -16px rgba(124,58,237,0.25)",
            border: "1px solid rgba(124,58,237,0.12)",
            gap: 0,
          }}
        >
          {/* Logo image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lumara-id.onrender.com/logo-dark.jpeg"
            alt="Lumara.id"
            width={280}
            height={68}
            style={{ objectFit: "contain", marginBottom: 20 }}
          />

          {/* Tagline pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(90deg, #7C3AED, #9333EA)",
              borderRadius: 9999,
              padding: "8px 20px",
              marginBottom: 24,
            }}
          >
            <span style={{ color: "white", fontSize: 16, fontWeight: 600, letterSpacing: 1 }}>
              ✦ Modest Fashion Premium
            </span>
          </div>

          {/* Description */}
          <p
            style={{
              color: "#52525b",
              fontSize: 22,
              textAlign: "center",
              margin: 0,
              maxWidth: 560,
              lineHeight: 1.5,
            }}
          >
            Tampil Anggun, Tetap Syar&apos;i
          </p>

          {/* Domain */}
          <p
            style={{
              color: "#a78bfa",
              fontSize: 18,
              fontWeight: 600,
              margin: "16px 0 0",
              letterSpacing: 0.5,
            }}
          >
            lumara-id.onrender.com
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
