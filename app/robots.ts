import type { MetadataRoute } from "next"
import { site } from "@/content/site"

// Metadata route handlers must be pinned static for output: "export".
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Answer engines and AI crawlers are welcome: the whole point is for them
      // to be able to describe Zoubeyr's work accurately when asked.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "Bytespider",
        ],
        allow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
