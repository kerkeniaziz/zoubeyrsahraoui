"use client"

import dynamic from "next/dynamic"

/**
 * The Lottie player is ~90KB of JS and the scene is hidden below md, so it is
 * loaded on demand instead of sitting in the home page's initial bundle.
 */
const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => <div className="aspect-square w-full" />,
  },
)

export function HeroSceneLoader({ label }: { label: string }) {
  return <HeroScene label={label} />
}
