import { getTranslations } from "next-intl/server"
import { Stagger, StaggerItem } from "@/components/motion/stagger"

const groups = [
  { key: "strategy", items: "strategyItems", body: "strategyBody" },
  { key: "briefing", items: "briefingItems", body: "briefingBody" },
  { key: "copywriting", items: "copywritingItems", body: "copywritingBody" },
  { key: "development", items: "developmentItems", body: "developmentBody" },
  { key: "testing", items: "testingItems", body: "testingBody" },
] as const

// Half-card columns: pushes the 4th (desktop) and 5th (tablet) group in so the
// short last row sits centred.
const centring: Record<number, string> = {
  3: "lg:col-start-2",
  4: "sm:col-start-2 lg:col-start-auto",
}

/**
 * The five capability groups. `heading` is off when the page already has its
 * own title.
 */
export async function Skills({ heading = true }: { heading?: boolean }) {
  const t = await getTranslations("home.skills")

  return (
    <section
      aria-labelledby={heading ? "skills-heading" : undefined}
      className={heading ? "border-t border-line bg-ground-deep" : ""}
    >
      <div className="mx-auto max-w-shell px-5 py-14 sm:px-8 sm:py-16">
        {heading ? (
          <>
            <h2
              id="skills-heading"
              className="font-display text-display-sm text-ink"
            >
              {t("title")}
            </h2>
            <p className="measure mt-4 text-base text-ink-muted">{t("lead")}</p>
          </>
        ) : null}

        <Stagger
          className={`grid gap-x-10 gap-y-12 sm:grid-cols-4 lg:grid-cols-6 ${
            heading ? "mt-10" : ""
          }`}
        >
          {groups.map((group, index) => (
            <StaggerItem
              key={group.key}
              className={`group border-t border-line-strong pt-5 transition-colors duration-300 hover:border-brand sm:col-span-2 ${centring[index] ?? ""}`}
            >
              <span className="font-sans text-small num tabular-nums text-brand">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-base text-ink">{t(group.key)}</h3>
              <p className="mt-2.5 text-small leading-relaxed text-ink-muted">
                {t(group.body)}
              </p>
              <ul className="mt-4 space-y-2.5">
                {t(group.items)
                  .split("|")
                  .map((item) => (
                    <li
                      key={item}
                      className="text-small text-ink-muted transition-colors duration-300 group-hover:text-ink"
                    >
                      {item}
                    </li>
                  ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
