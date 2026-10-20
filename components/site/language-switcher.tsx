"use client"

import { Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useTransition } from "react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { localeMeta, locales, type Locale } from "@/i18n/routing"
import { Flag } from "./flags"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("common")
  const active = useLocale() as Locale
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function switchTo(locale: Locale) {
    startTransition(() => {
      // Keeps the current route and its dynamic segments, swapping only locale.
      router.replace(
        // @ts-expect-error pathname is a known route, params carry its segments
        { pathname, params },
        { locale },
      )
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("language")}
        disabled={isPending}
        className={`inline-flex h-9 items-center gap-2 rounded-full border border-line px-3 text-micro text-ink-muted transition-colors duration-300 hover:border-brand/50 hover:text-brand disabled:opacity-60 ${className}`}
      >
        <Flag locale={active} />
        <span className="uppercase">{active}</span>
      </DropdownMenuTrigger>
      {/* dir="ltr" keeps the list reading one way, including under Arabic. */}
      <DropdownMenuContent
        align="end"
        dir="ltr"
        className="min-w-[11rem] border-line bg-surface/95 backdrop-blur-xl"
      >
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onSelect={() => switchTo(locale)}
            className="flex cursor-pointer items-center gap-3 text-small text-ink focus:bg-brand-wash focus:text-ink"
          >
            <Flag locale={locale} />
            <span className="flex-1">{localeMeta[locale].label}</span>
            {locale === active ? (
              <Check className="h-4 w-4 text-brand" strokeWidth={2} />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
