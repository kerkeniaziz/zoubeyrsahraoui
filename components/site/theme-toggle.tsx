"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const t = useTranslations("common")
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const next = isDark ? "light" : "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      // Before mount the resolved theme is unknown; label generically so the
      // server and client markup agree.
      aria-label={mounted ? (isDark ? t("themeLight") : t("themeDark")) : t("theme")}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors duration-300 hover:border-brand/50 hover:text-brand ${className}`}
    >
      {mounted && isDark ? (
        <Sun className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
      ) : (
        <Moon className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.5} />
      )}
    </button>
  )
}
