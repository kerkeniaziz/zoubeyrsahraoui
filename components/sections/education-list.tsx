import Image from "next/image"
import { GraduationCap } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import type { EducationEntry } from "@/content/site"

/**
 * One row per qualification.
 *
 * Institution logos are wide wordmarks in their own brand colours, often dark
 * ink on transparency, so each sits on a light plate rather than inheriting
 * the page ground — otherwise they disappear in dark mode.
 */
export async function EducationList({
  entries,
}: {
  entries: readonly EducationEntry[]
}) {
  const t = await getTranslations("education")

  return (
    <Stagger as="ul" className="flex flex-col gap-4">
      {entries.map((entry) => {
        const degree = t(`entries.${entry.id}.degree`)
        const field = t(`entries.${entry.id}.field`)

        return (
          <StaggerItem as="li" key={entry.id} className="min-w-0">
            <article className="glass glass-lit flex flex-col items-center gap-6 rounded-lg p-6 text-center sm:flex-row sm:items-center sm:text-start">
              {entry.logo ? (
                <div className="flex h-20 w-full shrink-0 items-center justify-center rounded-lg bg-white px-4 sm:w-48">
                  <Image
                    src={entry.logo}
                    alt=""
                    width={3040}
                    height={615}
                    sizes="(max-width: 640px) 80vw, 192px"
                    className="h-auto max-h-14 w-auto object-contain"
                  />
                </div>
              ) : (
                <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-brand/30 bg-brand/5">
                  <GraduationCap
                    aria-hidden="true"
                    strokeWidth={1.4}
                    className="h-8 w-8 text-brand"
                  />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <h2 className="font-display text-display-xs leading-tight text-ink">
                  {entry.school}
                </h2>
                <p className="mt-2 text-base text-ink-muted">
                  {degree}
                  {field ? ` — ${field}` : ""}
                </p>
                {entry.note ? (
                  <p className="measure mt-3 text-small leading-relaxed text-ink-muted">
                    {entry.note}
                  </p>
                ) : null}
              </div>

              <div className="shrink-0 sm:text-end">
                <p className="num text-small tabular-nums text-brand">
                  {entry.start} — {entry.end ?? t("present")}
                </p>
                {entry.location ? (
                  <p className="mt-1 text-micro text-ink-faint">
                    {entry.location}
                  </p>
                ) : null}
              </div>
            </article>
          </StaggerItem>
        )
      })}
    </Stagger>
  )
}
