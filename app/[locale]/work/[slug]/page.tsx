import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Cta } from "@/components/sections/cta"
import { PageHeader } from "@/components/sections/page-header"
import { Link } from "@/i18n/navigation"
import { CaseStudy } from "@/components/work/case-study"
import { BreadcrumbSchema, ProjectSchema } from "@/components/site/structured-data"
import { getProject, projects } from "@/content/site"
import { locales } from "@/i18n/routing"
import { alternatesFor, openGraphFor } from "@/lib/seo"

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getProject(slug)
  if (!project) return {}

  const tp = await getTranslations({ locale, namespace: "projects" })
  const tm = await getTranslations({ locale, namespace: "meta" })
  // Kept short: the layout template appends " — Zoubeyr Sahraoui".
  const title = `${project.brand} ${tm("caseStudy")}`
  const description = tp(`${slug}.description`)

  return {
    title,
    description,
    alternates: alternatesFor(locale, `/work/${slug}`),
    openGraph: openGraphFor({
      locale,
      path: `/work/${slug}`,
      title,
      description,
    }),
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = getProject(slug)
  if (!project) notFound()

  const t = await getTranslations("work")
  const tp = await getTranslations("projects")
  const tn = await getTranslations("nav")

  return (
    <main>
      <PageHeader
        title={project.brand}
        lead={tp(`${slug}.description`)}
      />

      <div className="mx-auto max-w-shell px-5 py-9 sm:px-8 sm:py-9">
        <Link
          href="/work"
          className="inline-flex min-h-6 items-center text-small text-ink-muted transition-colors duration-300 hover:text-brand"
        >
          {t("title")}
        </Link>

        <div className="mt-8">
          <CaseStudy project={project} priority />
        </div>
      </div>

      <Cta />
      <ProjectSchema locale={locale} slug={slug} />
      <BreadcrumbSchema
        locale={locale}
        trail={[
          { name: tn("home"), path: "" },
          { name: t("title"), path: "/work" },
          { name: project.brand, path: `/work/${slug}` },
        ]}
      />
    </main>
  )
}
