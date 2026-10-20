import { getTranslations } from "next-intl/server"

export async function About() {
  const t = await getTranslations("home.about")
  const th = await getTranslations("home.hero")

  return (
    <section
      aria-labelledby="about-heading"
      className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-18"
    >
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2
            id="about-heading"
            className="font-display text-display-sm text-ink lg:sticky lg:top-28"
          >
            {t("title")}
          </h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <div className="measure space-y-6 text-lead leading-relaxed text-ink-muted">
            <p className="text-ink">{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
            <p className="text-ink">{th("tagline")}</p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2.5">
            {th("pills")
              .split("|")
              .map((pill) => (
                <li
                  key={pill}
                  className="rounded-full border border-line-strong px-4 py-2 text-small text-ink-muted"
                >
                  {pill}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
