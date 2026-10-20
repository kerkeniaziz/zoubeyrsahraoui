import { getTranslations } from "next-intl/server"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { CvButton } from "@/components/site/cv-button"

export async function Cta() {
  const t = await getTranslations("cta")

  return (
    <section
      aria-labelledby="cta-heading"
      className="border-t border-line bg-ground-deep"
    >
      <div className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-18">
        <div className="glass glass-lit relative overflow-hidden rounded-lg px-6 py-10 sm:px-12 sm:py-10">
          <div className="glow-field" aria-hidden="true" />
          <h2
            id="cta-heading"
            className="max-w-[14ch] text-balance font-display text-display-md text-ink"
          >
            {t("title")}
          </h2>
          <p className="measure mt-6 text-lead text-ink-muted">{t("body")}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ShimmerButton href="/contact" className="text-small">
              {t("button")}
            </ShimmerButton>
            <CvButton />
          </div>
        </div>
      </div>
    </section>
  )
}
