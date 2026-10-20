import { getTranslations } from "next-intl/server"
import { contactMethods, projects, site, socials } from "@/content/site"
import { locales } from "@/i18n/routing"
import { urlFor } from "@/lib/seo"

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is build-time constant; no user input reaches it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/**
 * Person + WebSite graph. This is the answer-engine surface: when someone asks
 * an assistant "who is Zoubeyr Sahraoui", these are the facts it can cite.
 */
export async function PersonSchema({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "meta.home" })
  const tc = await getTranslations({ locale, namespace: "common" })

  const email = contactMethods.find((m) => m.key === "email")
  const phone = contactMethods.find((m) => m.key === "phone")
  const sameAs = socials
    .map((s) => s.href)
    .filter((href): href is string => Boolean(href))

  const person = {
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    alternateName: tc("name"),
    jobTitle: site.jobTitle,
    description: t("description"),
    url: urlFor(locale),
    email: email ? `mailto:${email.value}` : undefined,
    telephone: phone?.value,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.city,
      addressCountry: site.location.countryCode,
    },
    sameAs,
    knowsLanguage: locales.map((l) => l),
    knowsAbout: [
      "Creative strategy",
      "Direct-response copywriting",
      "Meta Ads",
      "Performance marketing",
      "Brand positioning",
      "Community management",
      "E-commerce advertising",
    ],
    worksFor: projects.map((project) => ({
      "@type": "Organization",
      name: project.brand,
    })),
  }

  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: locale,
    publisher: { "@id": `${site.url}/#person` },
  }

  return (
    <JsonLd
      data={{ "@context": "https://schema.org", "@graph": [person, website] }}
    />
  )
}

/** One case study, described as a work with measurable outcomes. */
export async function ProjectSchema({
  locale,
  slug,
}: {
  locale: string
  slug: string
}) {
  const project = projects.find((p) => p.slug === slug)
  if (!project) return null

  const tp = await getTranslations({ locale, namespace: "projects" })
  const tm = await getTranslations({ locale, namespace: "metrics" })

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: `${project.brand} — ${tp(`${slug}.role`)}`,
        description: tp(`${slug}.description`),
        url: urlFor(locale, `/work/${slug}`),
        inLanguage: locale,
        image: `${site.url}${project.banner}`,
        dateCreated: project.year ?? undefined,
        creator: { "@id": `${site.url}/#person` },
        about: tp(`${slug}.disciplines`).split("|"),
        // Campaign outcomes, machine-readable.
        additionalProperty: project.metrics.map((metric) => ({
          "@type": "PropertyValue",
          name: tm(metric.key),
          value: metric.value,
        })),
      }}
    />
  )
}

/** Breadcrumbs so crawlers understand the page hierarchy. */
export function BreadcrumbSchema({
  locale,
  trail,
}: {
  locale: string
  trail: { name: string; path: string }[]
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: urlFor(locale, crumb.path),
        })),
      }}
    />
  )
}

/**
 * FAQPage. This is the format answer engines quote most directly, so the
 * questions mirror what someone would actually ask an assistant about him.
 */
export async function FaqSchema({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.faq" })
  const keys = ["1", "2", "3", "4", "5"]

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: keys.map((key) => ({
          "@type": "Question",
          name: t(`q${key}`),
          acceptedAnswer: {
            "@type": "Answer",
            text: t(`a${key}`),
          },
        })),
      }}
    />
  )
}
