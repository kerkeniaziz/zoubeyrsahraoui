import { getTranslations } from "next-intl/server"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { headlineMetrics } from "@/content/site"

export async function Proof() {
  const t = await getTranslations("home.proof")

  return (
    <section
      aria-labelledby="proof-heading"
      className="border-b border-line bg-ground-deep"
    >
      <div className="mx-auto max-w-shell px-5 py-10 sm:px-8 sm:py-11">
        <h2 id="proof-heading" className="sr-only">
          {t("title")}
        </h2>
        {/* One band split by hairlines, not a row of cards.
            border-s keeps the rules on the correct side in Arabic. */}
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {headlineMetrics.map((metric) => (
            <div
              key={metric.key}
              className="flex flex-col gap-2 border-s border-line ps-6 odd:border-s-0 odd:ps-0 lg:ps-10 lg:odd:border-s lg:odd:ps-10 lg:[&:nth-child(4n+1)]:border-s-0 lg:[&:nth-child(4n+1)]:ps-0"
            >
              <dd className="flex items-baseline font-sans text-metric num tabular-nums text-brand">
                {metric.prefix}
                <NumberTicker value={metric.value} className="text-brand" />
                {metric.suffix}
              </dd>
              <dt className="text-small text-ink-muted">{t(metric.key)}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
