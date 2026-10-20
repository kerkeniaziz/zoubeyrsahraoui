import sharp from "sharp"
import fs from "node:fs"
import path from "node:path"

const BASE =
  "C:/Users/kerke/Desktop/images portfolio -20261019T124829Z-1-001/images portfolio"

/**
 * Proof shots render at ~176px tall (352px at 2x), so anything beyond a
 * ~1000px long edge is wasted bytes. Logos and hero creatives keep their
 * native size.
 */
const PROOF_MAX = 1000

const jobs = [
  // --- VIP Events & Pub ---
  { from: "vip events/vip.jfif", to: "public/images/vip-logo.jpg", kind: "logo" },
  { from: "vip events/vip finale.jpg", to: "public/images/work/vip-events-hero.jpg", kind: "hero" },
  { from: "vip events/Gemini_Generated_Image_bhju8qbhju8qbhju.jfif", to: "public/images/work/vip-events-proof-1.jpg", kind: "proof" },
  { from: "vip events/ruby.jpg", to: "public/images/work/vip-events-proof-2.jpg", kind: "proof" },
  { from: "vip events/theatre vip.jpg", to: "public/images/work/vip-events-proof-3.jpg", kind: "proof" },
  { from: "vip events/Gemini_Generated_Image_5g5l5i5g5l5i5g5l.jfif", to: "public/images/work/vip-events-proof-4.jpg", kind: "proof" },
  { from: "vip events/Gemini_Generated_Image_9o1v8c9o1v8c9o1v.jfif", to: "public/images/work/vip-events-proof-5.jpg", kind: "proof" },

  // --- Al-Sojood ---
  { from: "sojood/sojood.jfif", to: "public/images/sojood-logo.jpg", kind: "logo" },
  { from: "sojood/sojood baniere.png", to: "public/images/work/al-sojood-hero.jpg", kind: "hero" },
  { from: "sojood/sojood.jpg", to: "public/images/work/al-sojood-proof-1.jpg", kind: "proof" },
  { from: "sojood/sojood2.jpg", to: "public/images/work/al-sojood-proof-2.jpg", kind: "proof" },
  { from: "sojood/ad sojood finale.jpg", to: "public/images/work/al-sojood-proof-4.jpg", kind: "proof" },
  { from: "sojood/Gemini_Generated_Image_8xsu9u8xsu9u8xsu.jfif", to: "public/images/work/al-sojood-proof-3.jpg", kind: "proof" },
]

let savedBytes = 0

for (const job of jobs) {
  const src = path.join(BASE, job.from)
  if (!fs.existsSync(src)) {
    console.log("MISSING:", job.from)
    continue
  }

  let pipeline = sharp(src)
  if (job.kind === "proof") {
    pipeline = pipeline.resize({
      width: PROOF_MAX,
      height: PROOF_MAX,
      fit: "inside",
      withoutEnlargement: true,
    })
  }

  const buf = await pipeline
    .jpeg({ quality: job.kind === "proof" ? 86 : 92, mozjpeg: true })
    .toBuffer()

  fs.mkdirSync(path.dirname(job.to), { recursive: true })
  fs.writeFileSync(job.to, buf)

  const before = fs.statSync(src).size
  savedBytes += before - buf.length
  const m = await sharp(buf).metadata()
  console.log(
    `${path.basename(job.to).padEnd(28)}${String(m.width + "x" + m.height).padEnd(12)}` +
      `${(before / 1024).toFixed(0)}KB -> ${(buf.length / 1024).toFixed(0)}KB`,
  )
}

console.log(`\nTotal saved: ${(savedBytes / 1024 / 1024).toFixed(2)}MB`)
