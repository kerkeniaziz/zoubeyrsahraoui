"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { Particles } from "@/components/magicui/particles"

/**
 * Ambient background: drifting gold dust plus a soft glow that follows the
 * pointer.
 *
 * The glow is written straight to a CSS variable inside a rAF loop rather than
 * through React state — a state update per mousemove would re-render the tree
 * on every frame.
 */
export function PageBackground() {
  const { resolvedTheme } = useTheme()
  const [color, setColor] = useState("#DFAD18")
  const [reduced, setReduced] = useState(false)
  const [finePointer, setFinePointer] = useState(false)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setColor(resolvedTheme === "light" ? "#7D5E03" : "#E8C53A")
  }, [resolvedTheme])

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const pointer = window.matchMedia("(pointer: fine)")
    const sync = () => {
      setReduced(motion.matches)
      setFinePointer(pointer.matches)
    }
    sync()
    motion.addEventListener("change", sync)
    pointer.addEventListener("change", sync)
    return () => {
      motion.removeEventListener("change", sync)
      pointer.removeEventListener("change", sync)
    }
  }, [])

  // Pointer-following glow, eased towards the cursor.
  useEffect(() => {
    if (reduced || !finePointer) return
    const node = glowRef.current
    if (!node) return

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let x = targetX
    let y = targetY
    let frame = 0

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
    }

    const tick = () => {
      // Trailing rather than locked to the cursor.
      x += (targetX - x) * 0.08
      y += (targetY - y) * 0.08
      node.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) translate(-50%, -50%)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [reduced, finePointer])

  if (reduced) return null

  return (
    <>
      <Particles
        className="pointer-events-none fixed inset-0 -z-10"
        quantity={220}
        staticity={28}
        ease={38}
        size={0.7}
        vy={-0.06}
        vx={0.015}
        color={color}
        refresh={false}
      />

      {finePointer ? (
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 -z-10 h-[28rem] w-[28rem] rounded-full opacity-[0.16] blur-[90px] will-change-transform"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--brand)) 0%, transparent 68%)",
          }}
        />
      ) : null}
    </>
  )
}
