import { chromium } from "@playwright/test"

/**
 * Renders the Open Graph card inside the running app so it inherits the real
 * fonts and design tokens. Layout uses inline styles on purpose: Tailwind
 * purges utilities it cannot see at build time, so runtime-injected classes
 * would not exist in the compiled stylesheet.
 *
 * Usage: node scripts/make-og.mjs   (dev server must be running)
 */
const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
})
await ctx.addInitScript(() => {
  try {
    window.localStorage.setItem("theme", "dark")
  } catch {}
})

const page = await ctx.newPage()
await page.goto("http://localhost:3000/en", { waitUntil: "networkidle" })
await page.evaluate(() => document.fonts.ready)

await page.evaluate(() => {
  const metrics = [
    ["$20K+", "Ad spend managed"],
    ["12,000+", "Purchases driven"],
    ["3:1", "Best campaign ROAS"],
    ["400K+", "Community grown"],
  ]

  const stat = ([value, label]) => `
    <div>
      <div style="font-family:var(--font-text);font-size:34px;line-height:1;font-variant-numeric:tabular-nums;color:hsl(var(--brand))">${value}</div>
      <div style="font-family:var(--font-text);font-size:14px;margin-top:10px;color:hsl(var(--ink-faint))">${label}</div>
    </div>`

  document.documentElement.style.overflow = "hidden"
  document.body.style.cssText = "margin:0;overflow:hidden"
  document.body.innerHTML = `
    <div style="position:relative;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;width:1200px;height:630px;overflow:hidden;background:hsl(var(--ground));padding:72px 80px">
      <div class="glow-field"></div>
      <div>
        <div style="font-family:var(--font-text);font-size:19px;color:hsl(var(--ink-muted))">
          Creative strategist and direct-response copywriter
        </div>
        <div style="font-family:var(--font-display);font-size:96px;line-height:1.0;letter-spacing:-0.03em;margin-top:28px;max-width:16ch;color:hsl(var(--ink))">
          Zoubeyr&nbsp;Sahraoui
        </div>
      </div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:40px">
        <div style="display:flex;gap:56px">${metrics.map(stat).join("")}</div>
        <div style="font-family:var(--font-text);font-size:16px;color:hsl(var(--ink-muted));white-space:nowrap">Tunisia</div>
      </div>
    </div>`
})

await page.waitForTimeout(500)
await page.screenshot({ path: "public/og.png" })
await browser.close()
console.log("public/og.png written (1200x630)")
