"use client"

import { Instagram, Linkedin, Mail, Menu, MessageCircle, Phone, Twitter, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { Link, usePathname } from "@/i18n/navigation"
import { contactMethods, socials } from "@/content/site"
import { LanguageSwitcher } from "./language-switcher"
import { navItems } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"

const icons = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  whatsapp: MessageCircle,
  email: Mail,
  phone: Phone,
} as const

export function Header() {
  const t = useTranslations("nav")
  const tc = useTranslations("common")
  const tcontact = useTranslations("contact")
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the overlay on navigation.
  useEffect(() => setOpen(false), [pathname])

  // Lock scroll only while the overlay is up.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // "/" is only active on itself; every other route is a prefix of it.
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`)

  const reach = [
    ...socials
      .filter((s): s is (typeof socials)[number] & { href: string } =>
        Boolean(s.href),
      )
      .map((s) => ({ key: s.key, href: s.href, label: s.label, external: true })),
    ...contactMethods
      .filter((m) => ["whatsapp", "email", "phone"].includes(m.key))
      .map((m) => ({
        key: m.key,
        href: m.href,
        label: tcontact(m.key),
        external: m.external,
      })),
  ]

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ground/70 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-[4.25rem] max-w-shell items-center justify-between gap-6 px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex min-h-6 min-w-6 items-center whitespace-nowrap font-display text-[1rem] leading-none tracking-[-0.01em] text-ink transition-colors duration-300 hover:text-brand sm:text-[1.15rem]"
          >
            {tc("name")}
          </Link>

          <nav aria-label={t("menu")} className="hidden md:block">
            <ul className="flex items-center gap-7 lg:gap-9">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative py-2 text-small transition-colors duration-300 hover:text-ink ${
                        active ? "text-ink" : "text-ink-muted"
                      }`}
                    >
                      {t(item.key)}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-px h-px origin-center bg-brand transition-transform duration-300 ${
                          active ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("closeMenu") : t("openMenu")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-brand/50 hover:text-brand md:hidden"
            >
              {open ? (
                <X className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
              ) : (
                <Menu className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Sibling of <header>, not a child: the header's backdrop-filter forms
          a containing block for fixed descendants, which collapsed this
          overlay to 1px tall. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.25rem] z-40 overflow-y-auto border-t border-line bg-ground/95 backdrop-blur-2xl md:hidden"
      >
        <nav
          aria-label={t("menu")}
          className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-6 sm:gap-9 sm:py-8"
        >
          {/* No rules between items: the sheet reads as one centred stack. */}
          <ul className="flex w-full flex-col items-center gap-2">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block px-3 py-1.5 text-lead transition-colors duration-300 sm:py-2 ${
                    isActive(item.href) ? "text-brand" : "text-ink"
                  }`}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center gap-3">
            <LanguageSwitcher className="h-11 gap-2.5 px-4 text-small" />
            <ThemeToggle className="h-11 w-11" />
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-3">
            {reach.map((item) => {
              const Icon = icons[item.key as keyof typeof icons]
              return (
                <li key={item.key}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    aria-label={item.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-muted transition-colors duration-300 hover:border-brand/50 hover:text-brand"
                  >
                    <Icon aria-hidden="true" strokeWidth={1.5} className="h-[1.15rem] w-[1.15rem]" />
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
