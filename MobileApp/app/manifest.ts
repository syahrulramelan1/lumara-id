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
        src: "/api/app-icon",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/api/app-icon",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    screenshots: [],
  };
}
