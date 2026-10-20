import { getTranslations } from "next-intl/server"
import { Stagger, StaggerItem } from "@/components/motion/stagger"

const groups = [
  { key: "strategy", items: "strategyItems" },
  { key: "paid", items: "paidItems" },
  { key: "content", items: "contentItems" },
  { key: "partnerships", items: "partnershipsItems" },
] as const

/**
 * The four capability groups carried over from the original site, unchanged in
 * content. `heading` is off when the page already has its own title.
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
          className={`grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 ${
            heading ? "mt-10" : ""
          }`}
        >
          {groups.map((group) => (
            <StaggerItem
              key={group.key}
              className="group border-t border-line-strong pt-5 transition-colors duration-300 hover:border-brand"
            >
              <h3 className="text-base text-ink">{t(group.key)}</h3>
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
