import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { BlurFade } from "@/components/magicui/blur-fade"
import { About } from "@/components/sections/about"
import { Approach } from "@/components/sections/approach"
import { Clients } from "@/components/sections/clients"
import { Cta } from "@/components/sections/cta"
import { Faq } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero"
import { Proof } from "@/components/sections/proof"
import { SelectedWork } from "@/components/sections/selected-work"
import { SkillsTeaser } from "@/components/sections/skills-teaser"
import { FaqSchema } from "@/components/site/structured-data"
import { alternatesFor, openGraphFor } from "@/lib/seo"

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
    title,
    description,
    alternates: alternatesFor(locale),
    openGraph: openGraphFor({ locale, title, description }),
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  // Each section rises into place as it enters the viewport. The hero is
  // excluded: it is already visible on load and animates on its own.
  const sections = [
    <Proof key="proof" />,
    <About key="about" />,
    <Approach key="approach" />,
    <Clients key="clients" />,
    <SkillsTeaser key="teaser" />,
    <SelectedWork key="selected" />,
    <Faq key="faq" />,
    <Cta key="cta" />,
  ]

  return (
    <main>
      <Hero />
      {sections.map((section, index) => (
        <BlurFade
          key={section.key}
          inView
          inViewMargin="-80px"
          delay={0.04}
          duration={0.55}
        >
          {section}
        </BlurFade>
      ))}
      <FaqSchema locale={locale} />
    </main>
  )
}
