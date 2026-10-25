"use client"

import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { Lottie } from "lottie-react"
import { recolour } from "@/lib/lottie-palette"
import { heroSceneFrame } from "./hero-scene-frame"

/**
 * The hero figure: a looping scene of a studio at work, standing for the whole
 * practice rather than one campaign.
 *
 * The animation JSON is fetched rather than bundled (226KB), and recoloured
 * into the site palette on the client so it follows the active theme.
 */
export function HeroScene({ label }: { label: string }) {
  const { resolvedTheme } = useTheme()
  const [source, setSource] = useState<unknown>(null)
  const [reduced, setReduced] = useState(false)

  // The scene is hidden below md, so the 226KB payload is never fetched
  // there rather than merely being hidden with CSS.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)")
    let cancelled = false

    const load = () => {
      if (!wide.matches) return
      fetch("/animations/digital-agency.json")
        .then((r) => r.json())
        .then((json) => {
          if (!cancelled) setSource(json)
        })
        .catch(() => {})
    }

    load()
    wide.addEventListener("change", load)
    return () => {
      cancelled = true
      wide.removeEventListener("change", load)
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const theme = resolvedTheme === "light" ? "light" : "dark"

  // Recolour only when the source or the theme actually changes.
  const data = useMemo(
    () => (source ? recolour(source, theme) : null),
    [source, theme],
  )

  return (
    <div
      className={heroSceneFrame}
      role="img"
      aria-label={label}
    >
      {/* Reserves the square so nothing shifts while the JSON loads. */}
      <div className="aspect-square w-full">
        {data ? (
          <Lottie
            // Remount on theme change so the player picks up new colours.
            key={theme}
            src={data}
            autoplay={!reduced}
            loop={!reduced}
            className="h-full w-full"
          />
        ) : null}
      </div>
    </div>
  )
}
