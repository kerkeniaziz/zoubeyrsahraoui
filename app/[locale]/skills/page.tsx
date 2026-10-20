import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { BreadcrumbSchema } from "@/components/site/structured-data"
import { Cta } from "@/components/sections/cta"
import { PageHeader } from "@/components/sections/page-header"
import { Skills } from "@/components/sections/skills"
import { alternatesFor, openGraphFor } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.skills" })
  const title = t("title")
  const description = t("description")
  return {
    title,
    description,
    alternates: alternatesFor(locale, "/skills"),
    openGraph: openGraphFor({ locale, path: "/skills", title, description }),
  }
}

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("skills")
  const tn = await getTranslations("nav")

  return (
    <main>
      <PageHeader title={t("title")} lead={t("lead")} />
      {/* Same four groups and sixteen items as the original site, restyled. */}
      <Skills heading={false} />
      <Cta />
      <BreadcrumbSchema locale={locale} trail={[{ name: tn("home"), path: "" }, { name: t("title"), path: "/skills" }]} />
    </main>
  )
}
