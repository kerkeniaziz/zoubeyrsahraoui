"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

/**
 * Reveals a list one child at a time as it scrolls into view.
 * Children keep their own markup — this only wraps each in a motion element.
 */
export function Stagger({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "ul" | "ol" | "dl"
  className?: string
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  const Tag = motion[as]

  return (
    <Tag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </Tag>
  )
}

/** One child of a Stagger. Keeps the element type the list expects. */
export function StaggerItem({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "li"
  className?: string
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  const Tag = motion[as]

  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  )
}
