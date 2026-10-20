import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { BreadcrumbSchema } from "@/components/site/structured-data"
import { alternatesFor, openGraphFor } from "@/lib/seo"
import { EmptyState } from "@/components/sections/empty-state"
import { PageHeader } from "@/components/sections/page-header"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.certificates" })
  const title = t("title")
  const description = t("description")
  return {
    title,
    description,
    alternates: alternatesFor(locale, "/certificates"),
    openGraph: openGraphFor({ locale, path: "/certificates", title, description }),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("certificates")
  const tn = await getTranslations("nav")

  return (
    <main>
      <PageHeader title={t("title")} lead={t("lead")} />
      {/* Entries go here. The layout below is the shell they will slot into. */}
      <section className="mx-auto max-w-shell px-5 py-10 sm:px-8 sm:py-10">
        <EmptyState body={t("empty")} ctaLabel={t("emptyCta")} />
      </section>
      <BreadcrumbSchema locale={locale} trail={[{ name: tn("home"), path: "" }, { name: t("title"), path: "/certificates" }]} />
    </main>
  )
}
