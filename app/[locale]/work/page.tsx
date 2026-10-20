import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { BreadcrumbSchema } from "@/components/site/structured-data"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Cta } from "@/components/sections/cta"
import { PageHeader } from "@/components/sections/page-header"
import { CaseStudy } from "@/components/work/case-study"
import { projects } from "@/content/site"
import { alternatesFor, openGraphFor } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "meta.work" })
  const title = t("title")
  const description = t("description")
  return {
    title,
    description,
    alternates: alternatesFor(locale, "/work"),
    openGraph: openGraphFor({ locale, path: "/work", title, description }),
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("work")
  const tn = await getTranslations("nav")

  return (
    <main>
      <PageHeader title={t("title")} lead={t("lead")} />

      <div className="mx-auto max-w-shell px-5 py-10 sm:px-8 sm:py-10">
        <div className="space-y-10 sm:space-y-14">
          {projects.map((project, index) => (
            <BlurFade key={project.slug} inView inViewMargin="-80px" duration={0.5}>
              <CaseStudy project={project} priority={index === 0} />
            </BlurFade>
          ))}
        </div>
      </div>

      <Cta />
      <BreadcrumbSchema locale={locale} trail={[{ name: tn("home"), path: "" }, { name: t("title"), path: "/work" }]} />
    </main>
  )
}
