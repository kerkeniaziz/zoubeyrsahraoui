import { chromium } from "@playwright/test"

/**
 * Responsive + theme + RTL audit.
 * Checks every page at every breakpoint for horizontal overflow, console
 * errors, touch-target size, and text contrast against the page background.
 *
 * Usage: node scripts/audit.mjs   (dev server must be running)
 */
const BASE = "http://localhost:3000"
const WIDTHS = [320, 390, 768, 1024, 1440, 1920]
const PATHS = ["", "/work", "/skills", "/education", "/contact", "/work/sazo", "/work/vip-events"]
const CASES = [
  { locale: "en", theme: "dark" },
  { locale: "en", theme: "light" },
  { locale: "ar", theme: "dark" },
]

const srgb = (c) => {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)

const browser = await chromium.launch()
const failures = []
let checked = 0

for (const { locale, theme } of CASES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript((t) => {
    try {
      window.localStorage.setItem("theme", t)
    } catch {}
  }, theme)
  const page = await ctx.newPage()

  const errors = []
  page.on("pageerror", (e) => errors.push(String(e)))
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()))

  for (const path of PATHS) {
    const url = `${BASE}/${locale}${path}`
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 })
      errors.length = 0
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 })
      await page.waitForTimeout(220)
      checked++

      const report = await page.evaluate(
        ({ parseRgb }) => {
          const d = document.documentElement
          const out = { overflow: null, smallTargets: [], lowContrast: [] }

          // 1. Horizontal overflow
          if (d.scrollWidth > d.clientWidth + 1) {
            const culprits = []
            for (const el of document.querySelectorAll("body *")) {
              const r = el.getBoundingClientRect()
              if (r.width === 0 || r.height === 0) continue
              if (r.right > d.clientWidth + 1 || r.left < -1) {
                culprits.push(
                  `<${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 70)}"> right=${Math.round(r.right)}`,
                )
              }
            }
            out.overflow = { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, culprits: culprits.slice(0, 4) }
          }

          // 2. Touch targets below 24px (WCAG 2.2 AA minimum)
          for (const el of document.querySelectorAll("a, button, [role='button']")) {
            const r = el.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) continue
            const style = getComputedStyle(el)
            if (style.position === "fixed" && r.top < 0) continue
            // sr-only links are 1x1 until focused — not a real touch target.
            if (el.classList.contains("sr-only")) continue
            if (r.width <= 1 && r.height <= 1) continue
            if (r.height < 24 || r.width < 24) {
              out.smallTargets.push(
                `${el.tagName.toLowerCase()} "${(el.textContent || "").trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
              )
            }
          }

          // 3. Text contrast against nearest opaque ancestor background
          const bgOf = (el) => {
            let node = el
            while (node && node !== document.documentElement) {
              const bg = getComputedStyle(node).backgroundColor
              const m = bg.match(/rgba?\(([^)]+)\)/)
              if (m) {
                const p = m[1].split(",").map((n) => parseFloat(n))
                if (p.length < 4 || p[3] > 0.95) return [p[0], p[1], p[2]]
              }
              node = node.parentElement
            }
            const b = getComputedStyle(document.body).backgroundColor.match(/rgba?\(([^)]+)\)/)
            return b ? b[1].split(",").map((n) => parseFloat(n)).slice(0, 3) : [0, 0, 0]
          }

          const seen = new Set()
          for (const el of document.querySelectorAll("p, li, h1, h2, h3, span, a, dt, dd, button")) {
            const text = (el.textContent || "").trim()
            if (!text || el.children.length > 0) continue
            const style = getComputedStyle(el)
            if (style.visibility === "hidden" || style.display === "none" || style.opacity === "0") continue
            const r = el.getBoundingClientRect()
            if (r.width === 0 || r.height === 0) continue
            const key = text.slice(0, 30) + style.color
            if (seen.has(key)) continue
            seen.add(key)
            const fm = style.color.match(/rgba?\(([^)]+)\)/)
            if (!fm) continue
            const fg = fm[1].split(",").map((n) => parseFloat(n)).slice(0, 3)
            const size = parseFloat(style.fontSize)
            const weight = parseInt(style.fontWeight, 10) || 400
            const large = size >= 24 || (size >= 18.66 && weight >= 700)
            out.lowContrast.push({
              text: text.slice(0, 34),
              fg,
              bg: bgOf(el),
              min: large ? 3 : 4.5,
              size: Math.round(size),
            })
          }
          return out
        },
        { parseRgb: true },
      )

      const label = `${locale} ${theme} ${width}px ${path || "/"}`

      if (report.overflow) {
        failures.push({ type: "overflow", label, detail: report.overflow })
      }
      if (errors.length) {
        failures.push({ type: "console", label, detail: errors.slice(0, 2) })
      }
      if (report.smallTargets.length) {
        failures.push({ type: "touch-target", label, detail: [...new Set(report.smallTargets)].slice(0, 4) })
      }

      // Contrast is viewport-independent; only evaluate once per case/path.
      if (width === 1440) {
        for (const c of report.lowContrast) {
          const ratio = (Math.max(lum(c.fg), lum(c.bg)) + 0.05) / (Math.min(lum(c.fg), lum(c.bg)) + 0.05)
          if (ratio < c.min) {
            failures.push({
              type: "contrast",
              label: `${locale} ${theme} ${path || "/"}`,
              detail: `"${c.text}" ${ratio.toFixed(2)}:1 (needs ${c.min}) ${c.size}px`,
            })
          }
        }
      }
    }
  }
  await ctx.close()
}

await browser.close()

console.log(`\nChecked ${checked} page/viewport combinations.\n`)
if (!failures.length) {
  console.log("No issues found.")
} else {
  const byType = {}
  for (const f of failures) (byType[f.type] ??= []).push(f)
  for (const [type, list] of Object.entries(byType)) {
    console.log(`\n### ${type.toUpperCase()} (${list.length})`)
    for (const f of list.slice(0, 14)) {
      console.log(`  ${f.label}`)
      console.log(`    ${JSON.stringify(f.detail)}`)
    }
    if (list.length > 14) console.log(`  ...and ${list.length - 14} more`)
  }
}
