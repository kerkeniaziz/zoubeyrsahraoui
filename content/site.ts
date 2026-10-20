/**
 * Factual, language-independent site data.
 * Translatable prose lives in messages/*.json — numbers, links and assets live here.
 */

export const site = {
  name: "Zoubeyr Sahraoui",
  shortName: "Zoubeyr Sahraoui",
  initials: "ZS",
  jobTitle: "Creative Strategist & Direct-Response Copywriter",
  location: { city: "Tunis", country: "Tunisia", countryCode: "TN" },
  /** Set this to the production origin before deploying — used by sitemap, canonicals and JSON-LD. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zoubeyrsahraoui.com",
  cvPath: "/cv/zoubeyr-sahraoui-cv.pdf",
} as const

export const contactMethods = [
  {
    key: "whatsapp",
    value: "+216 90 605 282",
    href: "https://wa.me/21690605282",
    external: true,
  },
  {
    key: "email",
    value: "zoubeyrsahraoui57@gmail.com",
    href: "mailto:zoubeyrsahraoui57@gmail.com",
    external: false,
  },
  {
    key: "linkedin",
    value: "linkedin.com/in/zoubeyrsahraoui",
    href: "https://www.linkedin.com/in/zoubeyrsahraoui",
    external: true,
  },
  {
    key: "phone",
    value: "+216 95 827 099",
    href: "tel:+21695827099",
    external: false,
  },
] as const

/**
 * Aggregate proof shown on the home page, summed from the case studies below.
 * Split into prefix/number/suffix so the figure itself can count up.
 */
export const headlineMetrics = [
  { key: "spend", prefix: "$", value: 20, suffix: "K+" },
  { key: "purchases", prefix: "", value: 12000, suffix: "+" },
  { key: "roas", prefix: "", value: 3, suffix: ":1" },
  { key: "community", prefix: "", value: 400, suffix: "K+" },
] as const

export type ProjectMetric = {
  key: string
  value: string
}

export type Project = {
  slug: string
  /** Brand name is not translated. */
  brand: string
  year: string | null
  logo: string
  banner: string
  /** Narrative blocks present for this project; order is meaningful. */
  blocks: readonly ("context" | "insight" | "mission" | "solution" | "contribution")[]
  metrics: readonly ProjectMetric[]
  /** The single figure worth leading with in listings. */
  headlineMetric: string
  /** Campaign line as it appears on the brand's own creative. */
  tagline: string
  /** Centre campaign visual. */
  heroImage: string
  /** Evidence shots: dashboards, posters, screenshots. Rendered in a row. */
  proofImages: readonly string[]
}

export const projects: readonly Project[] = [
  {
    slug: "sazo",
    brand: "SaZo",
    year: "2024",
    logo: "/images/sazo-logo.jpg",
    banner: "/images/sazo-banner.png",
    blocks: ["context", "insight", "solution", "contribution"],
    headlineMetric: "roas",
    tagline: "Made to match",
    heroImage: "/images/work/sazo-hero.jpg",
    proofImages: [
      "/images/work/sazo-proof-1.png",
      "/images/work/sazo-proof-2.png",
    ],
    metrics: [
      { key: "adSpend", value: "+10K$" },
      { key: "purchases", value: "+5K" },
      { key: "cpa", value: "1.5$" },
      { key: "roas", value: "3:1" },
    ],
  },
  {
    slug: "vip-events",
    brand: "VIP Events & Pub",
    year: "2019",
    logo: "/images/vip-logo.jpg",
    banner: "/images/vip-banner.jpg",
    blocks: ["context", "mission", "contribution"],
    headlineMetric: "community",
    tagline: "Create emotions and make it happen",
    heroImage: "/images/work/vip-events-hero.jpg",
    proofImages: [
      "/images/work/vip-events-proof-1.jpg",
      "/images/work/vip-events-proof-2.jpg",
      "/images/work/vip-events-proof-3.jpg",
      "/images/work/vip-events-proof-4.jpg",
      "/images/work/vip-events-proof-5.jpg",
    ],
    metrics: [
      { key: "community", value: "+400K" },
      { key: "eventsPromoted", value: "+100" },
      { key: "sponsorships", value: "+50" },
      { key: "eventsCovered", value: "+200" },
    ],
  },
  {
    slug: "al-sojood",
    brand: "Al-Sojood",
    year: null,
    logo: "/images/sojood-logo.jpg",
    banner: "/images/sojood-banner.png",
    blocks: ["context", "insight", "solution", "contribution"],
    headlineMetric: "roas",
    tagline: "More comfort in every prayer",
    heroImage: "/images/work/al-sojood-hero.jpg",
    proofImages: [
      "/images/work/al-sojood-proof-1.jpg",
      "/images/work/al-sojood-proof-2.jpg",
      "/images/work/al-sojood-proof-3.jpg",
      "/images/work/al-sojood-proof-4.jpg",
    ],
    metrics: [
      { key: "adSpend", value: "+10K$" },
      { key: "purchases", value: "+7K" },
      { key: "cpa", value: "1.7$" },
      { key: "roas", value: "2:1" },
    ],
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

/**
 * Social profiles. The original footer linked Instagram and Twitter at "#",
 * so their handles are kept here as placeholders — fill in the href and they
 * render automatically. Only entries with an href are shown.
 */
export const socials = [
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/zoubeyrsahraoui" },
  { key: "instagram", label: "Instagram", href: null },
  { key: "twitter", label: "Twitter", href: null },
] as const

/**
 * Education. Add entries and the page renders them automatically; while the
 * list is empty the page shows its empty state instead.
 *
 * `logo` is a path under /public/images/education — add the file and it shows.
 * Leave it undefined and the entry falls back to a monogram.
 */
export type EducationEntry = {
  id: string
  school: string
  degree: string
  field?: string
  start: string
  end: string | null
  location?: string
  logo?: string
  note?: string
}

export const education: readonly EducationEntry[] = [
  {
    id: "essths",
    school:
      "ESSTHS — École Supérieure des Sciences et de la Technologie de Hammam Sousse",
    degree: "",
    start: "2018",
    end: "2021",
    location: "Hammam Sousse, Tunisia",
    logo: "/images/education/essths.png",
  },
]
