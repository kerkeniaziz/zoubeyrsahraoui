import fs from "node:fs"
import { chromium } from "@playwright/test"
import sharp from "sharp"
import path from "node:path"

/**
 * Generates the ZS monogram icon set.
 *
 * Rendered in a real browser so the mark uses the site's own self-hosted
 * Instrument Serif rather than a system serif, then downscaled with sharp.
 *
 * Usage: node scripts/make-favicon.mjs   (dev server must be running)
 */
const SIZE = 512
const GOLD = "#DFAD18"
const INK = "#0C0A09"

const markup = `
<div style="
  width:${SIZE}px;height:${SIZE}px;box-sizing:border-box;
  display:flex;align-items:center;justify-content:center;
  background:${INK};
  border-radius:${Math.round(SIZE * 0.22)}px;
  border:${Math.round(SIZE * 0.035)}px solid ${GOLD};
  overflow:hidden;
">
  <span style="
    font-family:'Instrument Serif',Georgia,serif;
    font-size:${Math.round(SIZE * 0.6)}px;
    line-height:1;
    letter-spacing:${Math.round(SIZE * -0.02)}px;
    color:${GOLD};
    transform:translateY(${Math.round(SIZE * -0.01)}px);
  ">ZS</span>
</div>`

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: SIZE, height: SIZE },
  deviceScaleFactor: 2,
})

// Served as a standalone page rather than injected into the app: React
// re-hydrates and wipes anything written into its DOM.
const stage = "public/_favicon-stage.html"
fs.writeFileSync(
  stage,
  `<!doctype html><meta charset="utf-8">
<style>
  @font-face {
    font-family: "Instrument Serif";
    src: url("/fonts/instrument-serif-latin.woff2") format("woff2");
    font-weight: 400;
    font-display: block;
  }
  html,body { margin:0; background:transparent }
</style>
${markup}`,
  "utf8",
)

await page.goto("http://localhost:3000/_favicon-stage.html", {
  waitUntil: "networkidle",
})
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)

const master = await page.screenshot({ omitBackground: true })
await browser.close()
fs.rmSync(stage, { force: true })

fs.mkdirSync("public", { recursive: true })

// Raster sizes. 16/32/48 go into the .ico, the rest are linked directly.
const sizes = [16, 32, 48, 180, 192, 512]
const pngs = new Map()

for (const size of sizes) {
  const buf = await sharp(master).resize(size, size, { fit: "cover" }).png({ compressionLevel: 9 }).toBuffer()
  pngs.set(size, buf)
}

fs.writeFileSync("public/icon-32.png", pngs.get(32))
fs.writeFileSync("public/icon-192.png", pngs.get(192))
fs.writeFileSync("public/icon-512.png", pngs.get(512))
fs.writeFileSync("public/apple-icon.png", pngs.get(180))

/**
 * Minimal ICO writer: 6-byte header, one 16-byte directory entry per image,
 * then the PNG payloads. PNG-in-ICO is supported everywhere that matters.
 */
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(entries.length, 4)

  let offset = 6 + entries.length * 16
  const dir = []
  for (const [size, buf] of entries) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0) // width
    e.writeUInt8(size >= 256 ? 0 : size, 1) // height
    e.writeUInt8(0, 2) // palette
    e.writeUInt8(0, 3) // reserved
    e.writeUInt16LE(1, 4) // colour planes
    e.writeUInt16LE(32, 6) // bits per pixel
    e.writeUInt32LE(buf.length, 8)
    e.writeUInt32LE(offset, 12)
    dir.push(e)
    offset += buf.length
  }

  return Buffer.concat([header, ...dir, ...entries.map(([, b]) => b)])
}

const ico = buildIco([
  [16, pngs.get(16)],
  [32, pngs.get(32)],
  [48, pngs.get(48)],
])
fs.writeFileSync("public/favicon.ico", ico)

for (const f of ["icon-32.png", "icon-192.png", "icon-512.png", "apple-icon.png", "favicon.ico"]) {
  console.log(f.padEnd(18), (fs.statSync(path.join("public", f)).size / 1024).toFixed(1) + "KB")
}
