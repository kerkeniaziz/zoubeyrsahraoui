import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { BreadcrumbSchema } from "@/components/site/structured-data"
import { alternatesFor, openGraphFor } from "@/lib/seo"
import { EducationList } from "@/components/sections/education-list"
import { EmptyState } from "@/components/sections/empty-state"
import { PageHeader } from "@/components/sections/page-header"
import { education } from "@/content/site"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.education" })
  const title = t("title")
  const description = t("description")
  return {
    title,
    description,
    alternates: alternatesFor(locale, "/education"),
    openGraph: openGraphFor({ locale, path: "/education", title, description }),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("education")
  const tn = await getTranslations("nav")

  return (
    <main>
      <PageHeader title={t("title")} lead={t("lead")} />
      {/* Entries go here. The layout below is the shell they will slot into. */}
      <section className="mx-auto max-w-shell px-5 py-10 sm:px-8 sm:py-10">
        {education.length > 0 ? (
          <EducationList entries={education} />
        ) : (
          <EmptyState body={t("empty")} ctaLabel={t("emptyCta")} />
        )}
      </section>
      <BreadcrumbSchema locale={locale} trail={[{ name: tn("home"), path: "" }, { name: t("title"), path: "/education" }]} />
    </main>
  )
}
