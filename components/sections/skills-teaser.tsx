import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

const groups = ["strategy", "paid", "content", "partnerships"] as const

/** Compact pointer to the full /skills page — the detail lives there. */
export async function SkillsTeaser() {
  const t = await getTranslations("home.skills")
  const tt = await getTranslations("home.teaser")

  return (
    <section
      aria-labelledby="teaser-heading"
      className="mx-auto max-w-shell px-5 py-14 sm:px-8 sm:py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2
            id="teaser-heading"
            className="font-display text-display-sm text-ink"
          >
            {tt("title")}
          </h2>
          <p className="measure mt-4 text-base text-ink-muted">{t("lead")}</p>
        </div>
        <Link
          href="/skills"
          className="inline-flex min-h-6 items-center text-small text-brand transition-opacity duration-300 hover:opacity-70"
        >
          {tt("viewAll")}
        </Link>
      </div>

      <ul className="mt-9 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((group) => (
          <li key={group} className="glass p-6">
            <h3 className="font-display text-display-xs text-ink">
              {t(group)}
            </h3>
            <p className="mt-3 text-small leading-relaxed text-ink-muted">
              {t(`${group}Items`).split("|").slice(0, 2).join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
