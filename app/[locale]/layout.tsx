import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/site/footer"
import { Header } from "@/components/site/header"
import { ScrollProgress } from "@/components/magicui/scroll-progress"
import { PageBackground } from "@/components/site/page-background"
import { PersonSchema } from "@/components/site/structured-data"
import { site } from "@/content/site"
import { isRtl, locales, routing } from "@/i18n/routing"
import { alternatesFor, openGraphFor } from "@/lib/seo"
import "@/styles/globals.css"

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.home" })
  const title = t("title")
  const description = t("description")

  return {
    metadataBase: new URL(site.url),
    title: {
      default: title,
      // Inner pages render as "Contact — Zoubeyr Sahraoui".
      template: `%s — ${site.name}`,
    },
    description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    alternates: alternatesFor(locale),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      ],
      apple: { url: "/apple-icon.png", sizes: "180x180" },
    },
    manifest: "/manifest.webmanifest",
    openGraph: openGraphFor({ locale, title, description }),
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "nav" })
  const dir = isRtl(locale) ? "rtl" : "ltr"

  // Only the header is interactive, so only its namespaces cross to the client.
  // Everything else is rendered on the server and never shipped as messages.
  const messages = await getMessages({ locale })
  const clientMessages = {
    nav: messages.nav,
    common: messages.common,
    contact: messages.contact,
  }

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
    >
      <head>
        {/* Self-hosted; preloaded because both are used above the fold. */}
        <link rel="preload" href="/fonts/geist-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/instrument-serif-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-dvh">
        {/* Dark is the brand default, not the OS setting. The toggle still
            switches to light and that choice is remembered. */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={clientMessages}>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-5 focus:py-2 focus:text-small focus:text-brand-on"
            >
              {t("skipToContent")}
            </a>
            <PageBackground />
            <ScrollProgress className="top-[4.25rem] z-[55]" />
            <Header />
            <div id="main" className="pt-[4.25rem]">
              {children}
            </div>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
        <PersonSchema locale={locale} />
      </body>
    </html>
  )
}
