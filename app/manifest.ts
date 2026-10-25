import type { MetadataRoute } from "next"
import { site } from "@/content/site"

// Metadata route handlers must be pinned static for output: "export".
export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.jobTitle}`,
    short_name: site.initials,
    description:
      "Creative strategy and direct-response ad copy for e-commerce brands.",
    start_url: "/en",
    display: "standalone",
    background_color: "#0C0A09",
    theme_color: "#0C0A09",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
