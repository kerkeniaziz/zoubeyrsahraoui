import type { Locale } from "@/i18n/routing"

/**
 * Inline SVG flags, simplified to read clearly at ~20px.
 *
 * Deliberately not emoji: Windows ships no regional-indicator glyphs, so
 * 🇺🇸 renders as the bare letters "US" in Chrome and Edge there.
 */

const base = {
  viewBox: "0 0 20 14",
  width: 20,
  height: 14,
  "aria-hidden": true as const,
  className: "shrink-0 rounded-[2px]",
}

function Us() {
  return (
    <svg {...base}>
      <rect width="20" height="14" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="20" height="1" fill="#B22234" />
      ))}
      <rect width="9" height="7" fill="#3C3B6E" />
    </svg>
  )
}

function Tn() {
  return (
    <svg {...base}>
      <rect width="20" height="14" fill="#E70013" />
      <circle cx="10" cy="7" r="4.2" fill="#fff" />
      <circle cx="10" cy="7" r="2.9" fill="#E70013" />
      <circle cx="11.1" cy="7" r="2.3" fill="#fff" />
      <path d="M11.3 5.6 11.75 6.6 12.8 6.7 12 7.4 12.25 8.45 11.3 7.9 10.35 8.45 10.6 7.4 9.8 6.7 10.85 6.6Z" fill="#E70013" />
    </svg>
  )
}

function Fr() {
  return (
    <svg {...base}>
      <rect width="20" height="14" fill="#fff" />
      <rect width="6.67" height="14" fill="#002395" />
      <rect x="13.33" width="6.67" height="14" fill="#ED2939" />
    </svg>
  )
}

function De() {
  return (
    <svg {...base}>
      <rect width="20" height="14" fill="#000" />
      <rect y="4.67" width="20" height="4.67" fill="#DD0000" />
      <rect y="9.33" width="20" height="4.67" fill="#FFCE00" />
    </svg>
  )
}

function Es() {
  return (
    <svg {...base}>
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </svg>
  )
}

export const flags: Record<Locale, () => JSX.Element> = {
  en: Us,
  ar: Tn,
  fr: Fr,
  de: De,
  es: Es,
}

export function Flag({ locale }: { locale: Locale }) {
  const Component = flags[locale]
  return <Component />
}
