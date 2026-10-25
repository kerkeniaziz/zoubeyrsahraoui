"use client"

import dynamic from "next/dynamic"
import { heroSceneFrame } from "./hero-scene-frame"

/**
 * The Lottie player is ~90KB of JS and the scene is hidden below md, so it is
 * loaded on demand instead of sitting in the home page's initial bundle.
 */
const HeroScene = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    // Same frame as the loaded scene, so the hero keeps its height and the
    // headline beside it never moves.
    loading: () => (
      <div className={heroSceneFrame} aria-hidden="true">
        <div className="aspect-square w-full" />
      </div>
    ),
  },
)

export function HeroSceneLoader({ label }: { label: string }) {
  return <HeroScene label={label} />
}
