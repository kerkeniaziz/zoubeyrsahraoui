/**
 * Recolours a Lottie animation into the site palette.
 *
 * The source artwork ships a flat-illustration palette (coral, mint, cyan,
 * purple) that fights the brand, so every colour is remapped per theme.
 * Replacements are drawn from the 24K Gold scale in styles/globals.css;
 * skin and hair stay plausible rather than turning gold.
 */

type Rgb = [number, number, number]

/** source hex -> replacement hex, per theme */
const DARK: Record<string, string> = {
  "#ffffff": "#F2EDE3", // white       -> parchment
  "#e3e6ed": "#DCD3C2", // light grey  -> warm light
  "#ffa18f": "#E8C89A", // skin        -> warm sand
  "#5d281d": "#3E3214", // hair/line   -> deep umber
  "#32cb98": "#DFAD18", // mint        -> gold-350
  "#00cdff": "#FFDC73", // cyan        -> gold-100
  "#4dc4ff": "#FFCF40", //             -> gold-200
  "#66ccff": "#FFD55C",
  "#4abaf2": "#DFAD18",
  "#4fb5e8": "#E0A800",
  "#75c0e6": "#FFCF40",
  "#399ed0": "#A67C00", //             -> gold-500
  "#b8cdff": "#FFEFC2", // pale blues  -> pale golds
  "#c2d4ff": "#FFE8AD",
  "#c7d8ff": "#FFE49E",
  "#486d7f": "#5A4A14", // slate       -> deep gold shadow
  "#41687c": "#4A3D10",
  "#4f1387": "#6B5200", // purple      -> deep gold
  "#815951": "#6B5533", // muted mauve -> warm brown
  "#a8c2ff": "#FFEFC2",
  "#2e5060": "#44380F",
}

const LIGHT: Record<string, string> = {
  "#ffffff": "#FFFFFF",
  "#e3e6ed": "#EFEAE0",
  "#ffa18f": "#D9B892",
  "#5d281d": "#3A2E12",
  "#32cb98": "#A67C00",
  "#00cdff": "#A67C00",
  "#4dc4ff": "#BF9B30",
  "#66ccff": "#C9A63A",
  "#4abaf2": "#A67C00",
  "#4fb5e8": "#8A6700",
  "#75c0e6": "#BF9B30",
  "#399ed0": "#7D5D00",
  "#b8cdff": "#FFE8AD",
  "#c2d4ff": "#FFE09A",
  "#c7d8ff": "#F5D98F",
  "#486d7f": "#5A4A14",
  "#41687c": "#4A3D10",
  "#4f1387": "#6B5200",
  "#815951": "#6B5533",
  "#a8c2ff": "#FFE8AD",
  "#2e5060": "#44380F",
}

const toHex = (k: number[]) =>
  "#" +
  k
    .slice(0, 3)
    .map((v) => Math.round(v * 255).toString(16).padStart(2, "0"))
    .join("")

const toRgb = (hex: string): Rgb => {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/**
 * Returns a recoloured deep copy. Lottie stores colours as `{ k: [r,g,b,a] }`
 * under `c` (fill/stroke) and `sc` (shape stroke), with values 0-1.
 */
export function recolour(animation: unknown, theme: "dark" | "light") {
  const map = theme === "light" ? LIGHT : DARK
  const copy = JSON.parse(JSON.stringify(animation))

  /** Replaces an [r,g,b,a] tuple in place, keeping its alpha. */
  const swap = (tuple: number[]) => {
    const replacement = map[toHex(tuple)]
    if (!replacement) return
    const [r, g, b] = toRgb(replacement)
    tuple[0] = r
    tuple[1] = g
    tuple[2] = b
  }

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if ((key === "c" || key === "sc") && value && typeof value === "object") {
        const slot = value as { k?: unknown }

        if (Array.isArray(slot.k)) {
          if (typeof slot.k[0] === "number") {
            // Static colour: k is [r, g, b, a].
            swap(slot.k as number[])
          } else {
            // Animated colour: k is a list of keyframes carrying `s` (and
            // sometimes `e`) tuples. Skipping these left stray source
            // colours on screen.
            for (const frame of slot.k as Array<Record<string, unknown>>) {
              if (!frame || typeof frame !== "object") continue
              for (const prop of ["s", "e"] as const) {
                const tuple = frame[prop]
                if (Array.isArray(tuple) && typeof tuple[0] === "number") {
                  swap(tuple as number[])
                }
              }
            }
          }
        }
      }
      walk(value)
    }
  }

  walk(copy)
  return copy
}
