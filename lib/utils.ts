import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge only knows Tailwind's stock scales. Our type scale renames
 * every size (text-lead, text-display-lg, …), so without this it classifies
 * them as text *colours* and lets a later text-ink silently delete the size.
 * Same for the custom colour names.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "micro",
            "small",
            "base",
            "lead",
            "metric",
            "display-xs",
            "display-sm",
            "display-md",
            "display-lg",
            "display-xl",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "ink",
            "ink-muted",
            "ink-faint",
            "brand",
            "brand-bright",
            "brand-on",
            "brand-wash",
          ],
        },
      ],
      "font-family": [{ font: ["display", "sans", "mono", "arabic"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
