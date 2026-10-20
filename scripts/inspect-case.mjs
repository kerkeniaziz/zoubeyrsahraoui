import { chromium } from "@playwright/test"

/**
 * Measures the case-study component itself rather than the page around it:
 * column balance, how much of the campaign visual is being cropped, how small
 * the smallest text actually renders, and whether the evidence strip is
 * legible at the size it ends up.
 *
 * Usage: node scripts/inspect-case.mjs
 */
const WIDTHS = [390, 768, 1024, 1440, 1920]
const ROUTE = "/en/work/vip-events"

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
await ctx.addInitScript(() => {
  try {
    localStorage.setItem("theme", "dark")
  } catch {}
})
const page = await ctx.newPage()

for (const width of WIDTHS) {
  await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 })
  await page.goto(`http://localhost:3000${ROUTE}`, { waitUntil: "networkidle" })
  await page.waitForTimeout(400)

  const data = await page.evaluate(() => {
    const article = document.querySelector("article")
    const r = (el) => {
      if (!el) return null
      const b = el.getBoundingClientRect()
      return { w: Math.round(b.width), h: Math.round(b.height) }
    }

    const heroImg = article.querySelector("article > div > figure img")
    const proofImg = article.querySelector("article > figure img")
    const narrative = article.querySelector("article > div > div:first-child")
    const visual = article.querySelector("article > div > figure")
    const results = article.querySelector("article > div > div:last-child")

    // How much of the campaign visual is lost to object-cover.
    let cropped = null
    if (heroImg) {
      const box = heroImg.getBoundingClientRect()
      const natural = heroImg.naturalWidth / heroImg.naturalHeight
      const shown = box.width / box.height
      const fit = getComputedStyle(heroImg).objectFit
      const lost =
        shown > natural
          ? 1 - natural / shown // cropping top/bottom
          : 1 - shown / natural // cropping left/right
      cropped = {
        fit,
        // contain letterboxes rather than crops, so nothing is lost.
        axis: fit === "contain" ? "none" : shown > natural ? "vertical" : "horizontal",
        percent: fit === "contain" ? 0 : Math.round(lost * 100),
        letterbox: fit === "contain" ? Math.round(Math.abs(box.height - box.width / natural)) : 0,
        naturalAspect: natural.toFixed(2),
        shownAspect: shown.toFixed(2),
      }
    }

    // Smallest rendered text inside the component.
    const sizes = []
    for (const el of article.querySelectorAll("*")) {
      const text = (el.textContent || "").trim()
      if (!text || el.children.length) continue
      const cs = getComputedStyle(el)
      sizes.push({
        px: parseFloat(cs.fontSize),
        text: text.slice(0, 26),
      })
    }
    sizes.sort((a, b) => a.px - b.px)

    // Evidence strip: how far below its native width is it rendered?
    let proof = null
    if (proofImg) {
      const box = proofImg.getBoundingClientRect()
      proof = {
        renderedWidth: Math.round(box.width),
        naturalWidth: proofImg.naturalWidth,
        scale: (box.width / proofImg.naturalWidth).toFixed(2),
      }
    }

    const widest = Math.max(0, ...[...article.querySelectorAll("p, li")].map(e=>e.getBoundingClientRect().width));
    return {
      widestText: Math.round(widest),
      article: r(article),
      narrative: r(narrative),
      visual: r(visual),
      results: r(results),
      cropped,
      proof,
      smallest: sizes.slice(0, 4),
    }
  })

  console.log(`\n=== ${width}px ===`)
  console.log(
    `  columns  narrative ${data.narrative?.w}x${data.narrative?.h}  visual ${data.visual?.w}x${data.visual?.h}  results ${data.results?.w}x${data.results?.h}`,
  )
  if (data.cropped) {
    console.log(
      `  visual   fit=${data.cropped.fit} cropped=${data.cropped.percent}% letterbox=${data.cropped.letterbox}px (natural ${data.cropped.naturalAspect} vs box ${data.cropped.shownAspect})`,
    )
  }
  if (data.proof) {
    console.log(
      `  evidence rendered ${data.proof.renderedWidth}px of ${data.proof.naturalWidth}px native = ${data.proof.scale}x`,
    )
  }
  console.log(`  measure  widest text block ${data.widestText}px`)
  console.log(
    `  smallest ${data.smallest.map((s) => `${s.px}px "${s.text}"`).join(" | ")}`,
  )
}

await browser.close()
