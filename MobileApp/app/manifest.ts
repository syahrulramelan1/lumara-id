import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "lumara.id — Modest Fashion Premium Indonesia",
    short_name: "lumara.id",
    description: "Platform belanja modest fashion premium Indonesia",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#630ED4",
    orientation: "portrait",
    categories: ["shopping", "fashion"],
    icons: [
      {
        src: "/api/logo/icon",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/api/logo/icon",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  };
}
