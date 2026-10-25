import type { MetadataRoute } from "next"
import { locales } from "@/i18n/routing"
import { projects } from "@/content/site"
import { routes, urlFor } from "@/lib/seo"
import { localeMeta, type Locale } from "@/i18n/routing"

// Metadata route handlers must be pinned static for output: "export".
export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths: string[] = [
    ...routes,
    ...projects.map((project) => `/work/${project.slug}`),
  ]

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: urlFor(locale, path),
      lastModified: new Date(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path.startsWith("/work") ? 0.8 : 0.6,
      // Every language of this page, declared to crawlers in one place.
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [localeMeta[l as Locale].hreflang, urlFor(l, path)]),
        ),
      },
    })),
  )
}
