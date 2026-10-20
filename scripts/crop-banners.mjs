import { chromium } from "@playwright/test"
import path from "node:path"
import fs from "node:fs"

/**
 * The three case-study banners are flat composites. This lifts two regions out
 * of each so the rebuilt component can use real HTML around real imagery:
 *   - hero:  the centre campaign visual (product shot + brand lockup + tagline)
 *   - proof: the bottom evidence strip (dashboards / event posters)
 *
 * Coordinates are in the source images' own pixel space (1366x768).
 */
const CROPS = [
  {
    slug: "sazo",
    file: "sazo-banner.png",
    hero: { x: 342, y: 56, width: 680, height: 406 },
    proof: { x: 0, y: 466, width: 1366, height: 248 },
  },
  {
    slug: "vip-events",
    file: "vip-banner.jpg",
    hero: { x: 342, y: 102, width: 680, height: 398 },
    proof: { x: 0, y: 504, width: 1366, height: 192 },
  },
  {
    slug: "al-sojood",
    file: "sojood-banner.png",
    hero: { x: 342, y: 56, width: 680, height: 404 },
    proof: { x: 0, y: 466, width: 1366, height: 248 },
  },
]

const imagesDir = path.resolve("public/images")
const outDir = path.resolve("public/images/work")
fs.mkdirSync(outDir, { recursive: true })

// The page must live beside the images so the relative src resolves — a
// file:// image will not load into a setContent/about:blank document.
const stagePath = path.join(imagesDir, "__crop_stage.html")

const browser = await chromium.launch()

for (const crop of CROPS) {
  for (const region of ["hero", "proof"]) {
    const box = crop[region]
    fs.writeFileSync(
      stagePath,
      `<body style="margin:0;overflow:hidden;background:#000">
         <img src="./${crop.file}" style="position:absolute;left:${-box.x}px;top:${-box.y}px;max-width:none">
       </body>`,
      "utf8",
    )

    const page = await browser.newPage({
      viewport: { width: box.width, height: box.height },
    })
    await page.goto("file:///" + stagePath.replace(/\\/g, "/"), {
      waitUntil: "networkidle",
    })
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          const img = document.querySelector("img")
          if (img.complete) resolve()
          else img.onload = resolve
        }),
    )

    const dims = await page.evaluate(() => {
      const img = document.querySelector("img")
      return { w: img.naturalWidth, h: img.naturalHeight }
    })
    if (!dims.w) throw new Error(`image failed to load: ${crop.file}`)

    const out = path.join(outDir, `${crop.slug}-${region}.jpg`)
    await page.screenshot({ path: out, type: "jpeg", quality: 92 })
    await page.close()
    console.log(
      `wrote ${path.relative(process.cwd(), out)} ${box.width}x${box.height} (source ${dims.w}x${dims.h})`,
    )
  }
}

fs.unlinkSync(stagePath)
await browser.close()
