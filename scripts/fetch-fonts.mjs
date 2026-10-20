import fs from "node:fs"
import path from "node:path"

/**
 * Downloads the exact font files the site uses into public/fonts and prints
 * the matching @font-face rules.
 *
 * Self-hosting removes the build-time dependency on Google entirely, which
 * also fixes the intermittent "Failed to download" on this network.
 *
 * Usage: node scripts/fetch-fonts.mjs
 */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"

const FAMILIES = [
  {
    query: "Geist:wght@100..900",
    family: "Geist",
    file: "geist",
    subsets: ["latin", "latin-ext"],
    weight: "100 900",
    style: "normal",
  },
  {
    query: "Instrument+Serif:ital@0",
    family: "Instrument Serif",
    file: "instrument-serif",
    subsets: ["latin", "latin-ext"],
    weight: "400",
    style: "normal",
  },
  {
    // Arabic coverage only — Latin in Arabic pages falls back to Geist.
    query: "IBM+Plex+Sans+Arabic:wght@400;600",
    family: "IBM Plex Sans Arabic",
    file: "plex-arabic",
    subsets: ["arabic"],
    style: "normal",
  },
]

const outDir = "public/fonts"
fs.mkdirSync(outDir, { recursive: true })

const faces = []

for (const fam of FAMILIES) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${fam.query}&display=swap`,
    { headers: { "User-Agent": UA } },
  ).then((r) => r.text())

  // Each @font-face is preceded by a /* subset */ comment.
  const blocks = css.split("/*").slice(1)

  for (const block of blocks) {
    const subset = block.slice(0, block.indexOf("*/")).trim()
    if (!fam.subsets.includes(subset)) continue

    const url = block.match(/url\((https:[^)]+\.woff2)\)/)?.[1]
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim()
    const weight = fam.weight ?? block.match(/font-weight:\s*([^;]+);/)?.[1]?.trim()
    if (!url) continue

    const name = `${fam.file}-${subset}${fam.weight ? "" : `-${weight}`}.woff2`
    const dest = path.join(outDir, name)

    const buf = Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer())
    fs.writeFileSync(dest, buf)
    console.log(`${name}  ${(buf.length / 1024).toFixed(1)}KB  (${subset})`)

    faces.push(
      `@font-face {\n` +
        `  font-family: "${fam.family}";\n` +
        `  font-style: ${fam.style};\n` +
        `  font-weight: ${weight};\n` +
        `  font-display: swap;\n` +
        `  src: url("/fonts/${name}") format("woff2");\n` +
        (range ? `  unicode-range: ${range};\n` : "") +
        `}`,
    )
  }
}

fs.writeFileSync("public/fonts/_faces.css", faces.join("\n\n") + "\n", "utf8")
console.log(`\n${faces.length} @font-face rules written to public/fonts/_faces.css`)
