import { chromium } from "@playwright/test"

// usage: node shot.mjs <path> <width> <theme> <outName> [full]
const [, , route = "/en", widthArg = "1440", theme = "dark", out = "shot", full = "1"] =
  process.argv
const width = Number(widthArg)
const height = width < 500 ? 844 : width < 900 ? 1024 : 900

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 2,
})
// next-themes reads this before paint, so the theme is correct on first frame.
await ctx.addInitScript((t) => {
  try { window.localStorage.setItem("theme", t) } catch {}
}, theme)

const page = await ctx.newPage()
const errors = []
page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
page.on("pageerror", (e) => errors.push(String(e)))

await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle", timeout: 60000 })
await page.waitForTimeout(500)

// Scroll-reveal sections only animate once they intersect a viewport, so a
// fullPage capture would otherwise photograph them at opacity 0.
if (full === "1") {
  const height = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < height; y += Math.round(height / 12)) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(160)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(500)
}

// Horizontal overflow is the responsive failure that matters most.
const overflow = await page.evaluate(() => {
  const d = document.documentElement
  const culprits = []
  if (d.scrollWidth > d.clientWidth + 1) {
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect()
      if (r.right > d.clientWidth + 1 || r.left < -1) {
        culprits.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().slice(0, 60)} right=${Math.round(r.right)}`)
      }
    }
  }
  return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, culprits: culprits.slice(0, 6) }
})

await page.screenshot({ path: `${process.env.SHOT_DIR}/${out}.png`, fullPage: full === "1" })
await browser.close()

console.log(JSON.stringify({ route, width, theme, overflow, errors: errors.slice(0, 5) }, null, 2))
