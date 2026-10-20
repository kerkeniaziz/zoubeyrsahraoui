import { defineRouting } from "next-intl/routing"

export const locales = ["en", "fr", "ar", "de", "es"] as const
export type Locale = (typeof locales)[number]

/** Right-to-left locales. Used for <html dir> and logical-property layout. */
export const rtlLocales: readonly Locale[] = ["ar"]

export function isRtl(locale: string) {
  return rtlLocales.includes(locale as Locale)
}

/**
 * Display metadata for the language switcher.
 * `label` is deliberately Latin-script for every locale, Arabic included, so
 * the menu reads in one direction instead of flipping mid-list.
 */
export const localeMeta: Record<
  Locale,
  { label: string; english: string; hreflang: string }
> = {
  en: { label: "English", english: "English", hreflang: "en" },
  fr: { label: "Français", english: "French", hreflang: "fr" },
  ar: { label: "Arabic", english: "Arabic", hreflang: "ar" },
  de: { label: "Deutsch", english: "German", hreflang: "de" },
  es: { label: "Español", english: "Spanish", hreflang: "es" },
}

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // Every locale carries its prefix, including English, so hreflang and
  // canonicals stay symmetrical for crawlers and AI answer engines.
  localePrefix: "always",
})
