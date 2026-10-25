"use client"

import { useEffect, useMemo, useRef, type ComponentPropsWithoutRef } from "react"
import { useInView, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : startValue)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  const format = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }),
    [decimalPlaces],
  )

  // The widest string the counter will ever hold — "0" is one character, the
  // settled value can be six. Rendered invisibly below so the box is sized for
  // the end state from the first paint and the suffix beside it never slides.
  const widest = format.format(direction === "down" ? startValue : value)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null

    if (isInView) {
      timer = setTimeout(() => {
        motionValue.set(direction === "down" ? startValue : value)
      }, delay * 1000)
    }

    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [motionValue, isInView, delay, value, direction, startValue])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = format.format(
            Number(latest.toFixed(decimalPlaces)),
          )
        }
      }),
    [springValue, decimalPlaces, format]
  )

  return (
    <span
      className={cn("relative inline-block tabular-nums", className)}
      {...props}
    >
      {/* In flow: reserves the final width and sets the baseline. */}
      <span aria-hidden="true" className="invisible">
        {widest}
      </span>
      {/* Out of flow: the value that actually ticks, laid over the reservation. */}
      <span
        ref={ref}
        className="absolute inset-0 whitespace-nowrap text-start"
      >
        {format.format(startValue)}
      </span>
    </span>
  )
}
