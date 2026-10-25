import { getTranslations } from "next-intl/server"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import { ArrowLink } from "@/components/site/action-link"

const steps = ["s1", "s2", "s3", "s4"] as const

export async function Approach() {
  const t = await getTranslations("home.approach")

  return (
    <section
      aria-labelledby="approach-heading"
      className="border-t border-line bg-ground-deep"
    >
      <div className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-18">
        <h2
          id="approach-heading"
          className="font-display text-display-sm text-ink"
        >
          {t("title")}
        </h2>
        <p className="measure mt-4 text-base text-ink-muted">{t("lead")}</p>

        {/* An ordered list, because the order is the point. */}
        <Stagger as="ol" className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <StaggerItem as="li" key={step} className="border-t border-line-strong pt-5 transition-colors duration-300 hover:border-brand">
              <span className="font-sans text-small num tabular-nums text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base text-ink">{t(`${step}t`)}</h3>
              <p className="mt-2.5 text-small leading-relaxed text-ink-muted">
                {t(`${step}b`)}
              </p>
              <p className="mt-4 text-micro text-ink-faint">
                {t("deliverable")}: {t(`${step}d`)}
              </p>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-base text-ink-muted">{t("ctaLead")}</p>
          <ArrowLink href="/contact">{t("ctaLink")}</ArrowLink>
        </div>
      </div>
    </section>
  )
}
