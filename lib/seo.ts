import { locales, localeMeta, type Locale } from "@/i18n/routing"
import { site } from "@/content/site"

/** Routes that exist in every locale, used by the sitemap and hreflang. */
export const routes = [
  "",
  "/work",
  "/skills",
  "/education",
  "/contact",
] as const

export function urlFor(locale: string, path = "") {
  return `${site.url}/${locale}${path}`
}

/**
 * Canonical + hreflang alternates for one page.
 * Every locale is prefixed, so the set stays symmetrical; x-default points at
 * English, which is what an unknown-locale crawler should land on.
 */
export function alternatesFor(locale: string, path = "") {
  const languages: Record<string, string> = {}

  for (const l of locales) {
    languages[localeMeta[l as Locale].hreflang] = urlFor(l, path)
  }
  languages["x-default"] = urlFor("en", path)

  return {
    canonical: urlFor(locale, path),
    languages,
  }
}

/** Open Graph locale codes, e.g. ar_TN for Tunisia. */
const ogLocale: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_TN",
  de: "de_DE",
  es: "es_ES",
}

export function openGraphFor({
  locale,
  path = "",
  title,
  description,
}: {
  locale: string
  path?: string
  title: string
  description: string
}) {
  return {
    type: "website" as const,
    url: urlFor(locale, path),
    siteName: site.name,
    title,
    description,
    locale: ogLocale[locale as Locale] ?? "en_US",
    alternateLocale: locales
      .filter((l) => l !== locale)
      .map((l) => ogLocale[l as Locale]),
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.jobTitle}`,
      },
    ],
  }
}
