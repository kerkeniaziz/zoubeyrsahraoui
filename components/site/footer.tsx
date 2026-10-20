import {
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Twitter,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { contactMethods, site, socials } from "@/content/site"
import { navItems } from "./nav-items"

const icons = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  whatsapp: MessageCircle,
  email: Mail,
  phone: Phone,
} as const

export async function Footer() {
  const t = await getTranslations("nav")
  const tf = await getTranslations("footer")
  const tc = await getTranslations("contact")

  // Socials and direct channels share one icon row under the wordmark.
  // Entries without an href (Instagram, Twitter) stay in the data but are not
  // rendered until handles exist.
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
        label: tc(m.key),
        external: m.external,
      })),
  ]

  return (
    <footer className="border-t border-line bg-ground-deep">
      <div className="mx-auto max-w-shell px-5 py-10 sm:px-8 sm:py-11">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <p className="font-display text-display-xs text-ink">{site.name}</p>
            <p className="mt-3 text-small leading-relaxed text-ink-muted">
              {tf("built")}
            </p>

            <ul className="mt-6 flex flex-wrap gap-3" aria-label={tf("social")}>
              {reach.map((item) => {
                const Icon = icons[item.key as keyof typeof icons]
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      aria-label={item.label}
                      title={item.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-muted transition-colors duration-300 hover:border-brand/50 hover:text-brand"
                    >
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.5}
                        className="h-[1.1rem] w-[1.1rem]"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <nav aria-labelledby="footer-pages">
            <h2
              id="footer-pages"
              className="font-sans text-micro uppercase tracking-[0.14em] text-ink-faint"
            >
              {tf("pages")}
            </h2>
            {/* Split in two so the list does not run as one tall column. */}
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-6 items-center text-small text-ink-muted transition-colors duration-300 hover:text-brand"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-micro text-ink-faint">
            © {new Date().getFullYear()} {site.name}. {tf("rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
