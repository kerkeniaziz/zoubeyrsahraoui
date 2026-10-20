import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { ArrowLink } from "@/components/site/action-link"
import { Link } from "@/i18n/navigation"
import { projects } from "@/content/site"

/**
 * Three cards rather than three wide rows: the row version left the brand
 * stranded at one end and its figure at the other, and collapsed badly on
 * narrow screens. Cards centre on mobile and align left from sm up.
 */
export async function SelectedWork() {
  const t = await getTranslations("home.selected")
  const tm = await getTranslations("metrics")
  const tp = await getTranslations("projects")

  return (
    <section
      aria-labelledby="selected-heading"
      className="mx-auto max-w-shell px-5 py-14 sm:px-8 sm:py-16"
    >
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:justify-between sm:text-start">
        <div>
          <h2
            id="selected-heading"
            className="font-display text-display-sm text-ink"
          >
            {t("title")}
          </h2>
          <p className="measure mt-3 text-base text-ink-muted">{t("lead")}</p>
        </div>
        <ArrowLink href="/work">{t("viewAll")}</ArrowLink>
      </div>

      <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const headline =
            project.metrics.find((m) => m.key === project.headlineMetric) ??
            project.metrics[0]

          return (
            <StaggerItem as="li" key={project.slug} className="min-w-0">
              <Link
                href={`/work/${project.slug}`}
                className="glass glass-lit group flex h-full min-w-0 flex-col items-center gap-5 rounded-lg p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 sm:items-start sm:text-start"
              >
                {/* Logo and title share a line, so the card opens with one
                    identifiable block rather than two stacked ones. */}
                <div className="flex w-full min-w-0 items-center justify-center gap-4 text-start sm:justify-start">
                  <Image
                    src={project.logo}
                    alt=""
                    width={447}
                    height={447}
                    sizes="96px"
                    className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-display-xs leading-tight text-ink transition-colors duration-300 group-hover:text-brand">
                      {project.brand}
                    </p>
                    <p className="mt-1 text-small text-ink-muted">
                      {tp(`${project.slug}.role`)}
                    </p>
                    {project.year ? (
                      <p className="num mt-0.5 text-micro text-ink-faint">
                        {project.year}
                      </p>
                    ) : null}
                  </div>
                </div>

                <p className="text-small leading-relaxed text-ink-muted">
                  {tp(`${project.slug}.description`)}
                </p>

                {/* Pinned to the bottom so the figures line up across cards. */}
                <div className="mt-auto flex w-full items-baseline justify-center gap-2.5 border-t border-line pt-4 sm:justify-start">
                  <span className="num font-sans text-display-xs tabular-nums text-brand">
                    {headline.value}
                  </span>
                  <span className="text-micro text-ink-faint">
                    {tm(headline.key)}
                  </span>
                </div>
              </Link>
            </StaggerItem>
          )
        })}
      </Stagger>
    </section>
  )
}
