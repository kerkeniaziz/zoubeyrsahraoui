import type { Metadata } from "next"
import {
  ArrowUpRight,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { BreadcrumbSchema } from "@/components/site/structured-data"
import { PageHeader } from "@/components/sections/page-header"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { CvButton } from "@/components/site/cv-button"
import { contactMethods } from "@/content/site"
import { alternatesFor, openGraphFor } from "@/lib/seo"

const icons = {
  whatsapp: MessageCircle,
  email: Mail,
  linkedin: Linkedin,
  phone: Phone,
} as const

/** WhatsApp is the channel the page itself recommends, so it leads. */
const PREFERRED = "whatsapp"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.contact" })
  const title = t("title")
  const description = t("description")
  return {
    title,
    description,
    alternates: alternatesFor(locale, "/contact"),
    openGraph: openGraphFor({ locale, path: "/contact", title, description }),
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("contact")
  const tn = await getTranslations("nav")

  return (
    <main>
      <PageHeader title={t("title")} lead={t("lead")} />

      <section className="mx-auto max-w-shell px-5 py-10 sm:px-8 sm:py-10">
        {/* Cards rather than full-width rows: a phone number does not need
            1100px of line to sit on. */}
        <Stagger as="ul" className="grid gap-4 sm:grid-cols-2">
          {contactMethods.map((method) => {
            const Icon = icons[method.key as keyof typeof icons]
            const preferred = method.key === PREFERRED

            return (
              <StaggerItem as="li" key={method.key} className="min-w-0">
                <a
                  href={method.href}
                  target={method.external ? "_blank" : undefined}
                  rel={method.external ? "noreferrer" : undefined}
                  aria-label={`${t(method.key)}: ${method.value}${
                    method.external ? ` (${t("opensNewTab")})` : ""
                  }`}
                  className={`group flex h-full min-w-0 flex-col justify-between gap-6 rounded-lg border p-5 transition-all duration-300 hover:-translate-y-0.5 sm:p-7 ${
                    preferred
                      ? "border-brand/50 bg-brand-wash/30 hover:border-brand"
                      : "glass border-line hover:border-brand/50"
                  }`}
                >
                  {/* flex-wrap so the badge drops to its own line rather than
                      forcing the card wider than its grid track. */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/5">
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="h-5 w-5 text-brand"
                      />
                    </span>
                    <div className="flex items-center gap-3">
                      {preferred ? (
                        <span className="whitespace-nowrap rounded-full border border-brand/40 px-3 py-1 font-sans text-micro uppercase tracking-[0.1em] text-brand">
                          {t("preferred")}
                        </span>
                      ) : null}
                      <ArrowUpRight
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="h-4 w-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-brand rtl:-scale-x-100"
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="font-sans text-micro uppercase tracking-[0.14em] text-ink-muted">
                      {t(method.key)}
                    </p>
                    {/* break-all: the email and LinkedIn URL have no spaces to
                        break on, and would otherwise widen the track. */}
                    <p className="num mt-2 break-all font-sans text-display-xs text-ink transition-colors duration-300 group-hover:text-brand rtl:text-end">
                      {method.value}
                    </p>
                  </div>
                </a>
              </StaggerItem>
            )
          })}
        </Stagger>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
          <div className="flex items-start gap-3">
            <MapPin
              aria-hidden="true"
              strokeWidth={1.5}
              className="mt-0.5 h-5 w-5 shrink-0 text-brand"
            />
            <div>
              <p className="text-base text-ink">{t("availability")}</p>
              <p className="mt-1 text-small text-ink-muted">{t("respond")}</p>
            </div>
          </div>
          <CvButton />
        </div>
      </section>

      <BreadcrumbSchema locale={locale} trail={[{ name: tn("home"), path: "" }, { name: t("title"), path: "/contact" }]} />
    </main>
  )
}
