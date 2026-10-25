import { chromium } from "@playwright/test"

/**
 * SEO audit across every page and locale.
 * Checks the things that actually move ranking: unique titles and
 * descriptions at sane lengths, canonical + hreflang correctness, a single
 * H1, Open Graph completeness, structured data, and image alt coverage.
 *
 * Usage: node scripts/seo-audit.mjs
 */
const BASE = "http://localhost:3000"
const LOCALES = ["en", "fr", "ar", "de", "es"]
const PATHS = [
  "",
  "/work",
  "/work/sazo",
  "/work/vip-events",
  "/work/al-sojood",
  "/skills",
  "/education",
  "/contact",
]

const browser = await chromium.launch()
const page = await browser.newPage()
const issues = []
const titles = new Map()
const descriptions = new Map()

for (const locale of LOCALES) {
  for (const p of PATHS) {
    const url = `${BASE}/${locale}${p}`
    await page.goto(url, { waitUntil: "domcontentloaded" })

    const d = await page.evaluate(() => {
      const meta = (sel, attr = "content") =>
        document.querySelector(sel)?.getAttribute(attr) ?? null
      const all = (sel) => [...document.querySelectorAll(sel)]

      return {
        title: document.title || null,
        description: meta('meta[name="description"]'),
        keywords: meta('meta[name="keywords"]'),
        canonical: meta('link[rel="canonical"]', "href"),
        hreflang: all('link[rel="alternate"][hreflang]').map((l) => l.getAttribute("hreflang")),
        ogTitle: meta('meta[property="og:title"]'),
        ogDesc: meta('meta[property="og:description"]'),
        ogImage: meta('meta[property="og:image"]'),
        ogLocale: meta('meta[property="og:locale"]'),
        twitterCard: meta('meta[name="twitter:card"]'),
        robots: meta('meta[name="robots"]'),
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        h1: all("h1").map((h) => h.textContent.trim().slice(0, 60)),
        h2Count: all("h2").length,
        jsonLd: all('script[type="application/ld+json"]').map((s) => {
          try {
            const j = JSON.parse(s.textContent)
            return j["@type"] ?? (j["@graph"] || []).map((x) => x["@type"]).join("+")
          } catch {
            return "INVALID"
          }
        }),
        imgs: all("img").length,
        imgsNoAlt: all("img").filter((i) => i.getAttribute("alt") === null).length,
        internalLinks: all('a[href^="/"]').length,
      }
    })

    const key = `${locale}${p || "/"}`

    // Title
    if (!d.title) issues.push([key, "title", "missing"])
    else {
      if (d.title.length > 60) issues.push([key, "title", `${d.title.length} chars (>60, truncates in SERP)`])
      if (d.title.length < 15) issues.push([key, "title", `${d.title.length} chars (too short)`])
      const seen = titles.get(`${locale}:${d.title}`)
      if (seen) issues.push([key, "title", `duplicate of ${seen}`])
      else titles.set(`${locale}:${d.title}`, key)
    }

    // Description
    if (!d.description) issues.push([key, "description", "missing"])
    else {
      if (d.description.length > 160) issues.push([key, "description", `${d.description.length} chars (>160)`])
      if (d.description.length < 70) issues.push([key, "description", `${d.description.length} chars (<70, thin)`])
      const seen = descriptions.get(`${locale}:${d.description}`)
      if (seen) issues.push([key, "description", `duplicate of ${seen}`])
      else descriptions.set(`${locale}:${d.description}`, key)
    }

    if (!d.keywords) issues.push([key, "keywords", "absent"])
    if (!d.canonical) issues.push([key, "canonical", "missing"])
    else if (!d.canonical.endsWith(`/${locale}${p}`)) issues.push([key, "canonical", `points at ${d.canonical}`])

    const wanted = [...LOCALES, "x-default"]
    const missing = wanted.filter((l) => !d.hreflang.includes(l))
    if (missing.length) issues.push([key, "hreflang", `missing ${missing.join(",")}`])

    for (const [field, value] of [
      ["og:title", d.ogTitle],
      ["og:description", d.ogDesc],
      ["og:image", d.ogImage],
      ["og:locale", d.ogLocale],
      ["twitter:card", d.twitterCard],
    ]) {
      if (!value) issues.push([key, field, "missing"])
    }

    if (d.h1.length === 0) issues.push([key, "h1", "missing"])
    if (d.h1.length > 1) issues.push([key, "h1", `${d.h1.length} on page`])
    if (d.lang !== locale) issues.push([key, "lang", `is "${d.lang}"`])
    if (locale === "ar" && d.dir !== "rtl") issues.push([key, "dir", `is "${d.dir}"`])
    if (d.jsonLd.length === 0) issues.push([key, "json-ld", "none"])
    if (d.jsonLd.includes("INVALID")) issues.push([key, "json-ld", "invalid JSON"])
    if (d.imgsNoAlt > 0) issues.push([key, "img alt", `${d.imgsNoAlt} of ${d.imgs} missing`])
    if (!d.jsonLd.some((t) => String(t).includes("Breadcrumb")) && p !== "")
      issues.push([key, "breadcrumb", "no BreadcrumbList"])
  }
}

await browser.close()

console.log(`\nAudited ${LOCALES.length * PATHS.length} page/locale combinations.\n`)
if (!issues.length) {
  console.log("No SEO issues found.")
} else {
  const byField = {}
  for (const [pageKey, field, detail] of issues) (byField[field] ??= []).push([pageKey, detail])
  for (const [field, list] of Object.entries(byField).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`### ${field}  (${list.length})`)
    const sample = list.slice(0, 4)
    for (const [k, detail] of sample) console.log(`    ${k.padEnd(22)} ${detail}`)
    if (list.length > 4) console.log(`    ...and ${list.length - 4} more`)
    console.log()
  }
}
