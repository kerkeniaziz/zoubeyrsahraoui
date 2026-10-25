import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"

const groups = [
  "strategy",
  "briefing",
  "copywriting",
  "development",
  "testing",
] as const

// Pushes the 4th card (desktop) and the 5th card (tablet) in by half a card.
const centring: Record<number, string> = {
  3: "lg:col-start-2",
  4: "sm:col-start-2 lg:col-start-auto",
}

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

      {/*
        Five equal cards: 2 + 2 + 1 on tablet, 3 + 2 on desktop. The grid uses
        half-card columns so the short last row sits centred.
      */}
      <ul className="mt-9 grid gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {groups.map((group, index) => (
          <li
            key={group}
            className={`glass rounded-lg border border-line p-6 sm:col-span-2 ${centring[index] ?? ""}`}
          >
            <span className="font-sans text-small num tabular-nums text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-2 font-display text-display-xs text-ink">
              {t(group)}
            </h3>
            <p className="mt-2 text-micro text-ink-faint">
              {t(`${group}Items`).split("|").join(" · ")}
            </p>
            <p className="mt-3 text-small leading-relaxed text-ink-muted">
              {t(`${group}Body`)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
