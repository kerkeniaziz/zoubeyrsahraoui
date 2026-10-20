import Image from "next/image"
import {
  BarChart3,
  CalendarDays,
  Coins,
  Handshake,
  Lightbulb,
  Megaphone,
  Compass,
  ShoppingBag,
  Target,
  TrendingUp,
  PenLine,
  Users,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Stagger, StaggerItem } from "@/components/motion/stagger"
import type { Project } from "@/content/site"

/**
 * Case study, rebuilt from the three original banner composites.
 *
 * The banners share one five-band structure, reproduced here as real,
 * responsive, translatable HTML:
 *
 *   1  masthead   logo · brand · case type · role · period
 *   2  visual     the campaign creative
 *   3  narrative  icon + label + body, one block per section
 *   4  results    "Results" + a 2x2 grid of metric cards
 *   5  evidence   dashboards / posters, then a keyword strip
 *
 * Layout notes:
 *  - Bands 2–4 sit side by side at `lg` exactly as in the source artwork,
 *    and stack below that.
 *  - The creative keeps its natural aspect and is capped in width, so it is
 *    never stretched or cropped to match the height of a neighbouring column.
 */

const blockIcons = {
  context: Target,
  insight: Lightbulb,
  mission: Compass,
  solution: Compass,
  contribution: PenLine,
} as const

const metricIcons: Record<string, typeof Megaphone> = {
  adSpend: Megaphone,
  purchases: ShoppingBag,
  cpa: Coins,
  roas: TrendingUp,
  community: Users,
  eventsPromoted: Megaphone,
  sponsorships: Handshake,
  eventsCovered: CalendarDays,
}

/** Blocks whose body is a pipe-separated list rather than a paragraph. */
const listBlocks = new Set(["contribution"])

function SectionIcon({ icon: Icon }: { icon: typeof Target }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand/5">
      <Icon aria-hidden="true" strokeWidth={1.5} className="h-4 w-4 text-brand" />
    </span>
  )
}

export async function CaseStudy({
  project,
  headingLevel = "h2",
  priority = false,
}: {
  project: Project
  headingLevel?: "h1" | "h2"
  priority?: boolean
}) {
  const tp = await getTranslations("projects")
  const tm = await getTranslations("metrics")
  const tl = await getTranslations("work.labels")

  const Heading = headingLevel
  const subtitle = tp(`${project.slug}.subtitle`)
  const caseType = tp(`${project.slug}.caseType`)
  const disciplines = tp(`${project.slug}.disciplines`).split("|")

  // VIP is the only project whose metric cards carry a description line.
  const noteFor = (key: string) => {
    const path = `${project.slug}.notes.${key}`
    return tp.has(path) ? tp(path) : ""
  }

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-ground-deep">
      {/* 1 — masthead */}
      <header className="flex flex-col gap-5 border-b border-line px-5 py-5 sm:px-7 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex items-center gap-4">
          <Image
            src={project.logo}
            alt=""
            width={447}
            height={447}
            sizes="64px"
            className="h-12 w-12 shrink-0 rounded-md object-cover sm:h-14 sm:w-14"
          />
          <div className="min-w-0">
            <Heading className="font-display text-display-xs leading-tight text-ink">
              {project.brand}
            </Heading>
            <p className="mt-1 text-small text-ink-muted">
              {subtitle ? `${subtitle} — ${caseType}` : caseType}
            </p>
          </div>
        </div>

        <dl className="flex shrink-0 flex-wrap items-start gap-x-10 gap-y-3">
          <div>
            <dt className="font-sans text-micro uppercase tracking-[0.14em] text-brand">
              {tl("role")}
            </dt>
            <dd className="mt-1.5 text-small text-ink">
              {tp(`${project.slug}.bannerRole`)}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-micro uppercase tracking-[0.14em] text-brand">
              {tl("time")}
            </dt>
            <dd className="num mt-1.5 text-small tabular-nums text-ink">
              {project.year ?? tl("period")}
            </dd>
          </div>
        </dl>
      </header>

      {/* Bands 2–4 sit side by side exactly as in the source artwork.
          Below lg they stack: creative, narrative, results. */}
      <div className="grid lg:grid-cols-12">
        {/* 3 — narrative */}
        <Stagger className="order-2 flex flex-col gap-7 border-t border-line px-5 py-7 sm:px-7 lg:order-1 lg:col-span-4 lg:border-e lg:border-t-0">
          {project.blocks.map((block) => {
            const Icon = blockIcons[block]
            const body = tp(`${project.slug}.${block}`)

            return (
              <StaggerItem key={block} className="flex gap-4">
                <SectionIcon icon={Icon} />
                <div className="min-w-0">
                  <h3 className="mt-1 font-sans text-micro uppercase tracking-[0.14em] text-brand">
                    {tl(block)}
                  </h3>
                  {listBlocks.has(block) ? (
                    <ul className="measure mt-3 space-y-2">
                      {body.split("|").map((entry) => (
                        <li
                          key={entry}
                          className="flex gap-2.5 text-small leading-relaxed text-ink-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.62em] h-1 w-1 shrink-0 rounded-full bg-brand/70"
                          />
                          {entry}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="measure mt-2.5 text-small leading-relaxed text-ink-muted">
                      {body}
                    </p>
                  )}
                </div>
              </StaggerItem>
            )
          })}
        </Stagger>

        {/* 2 — campaign creative. Centred at its natural aspect and capped, so
            it is never stretched or cropped to match the column height. */}
        <figure className="order-1 flex items-center justify-center border-line bg-ground lg:order-2 lg:col-span-5 lg:border-e">
          <Image
            src={project.heroImage}
            alt={tp(`${project.slug}.bannerAlt`)}
            width={680}
            height={406}
            sizes="(max-width: 1023px) 100vw, 42vw"
            quality={90}
            priority={priority}
            className="h-auto w-full"
          />
          {/* The tagline is set inside the artwork, so it is not repeated
              visually — only exposed to assistive tech. */}
          <figcaption className="sr-only">{project.tagline}</figcaption>
        </figure>

        {/* 4 — results */}
        <div className="order-3 border-t border-line px-5 py-7 sm:px-7 lg:col-span-3 lg:border-t-0">
          <div className="flex items-start gap-4">
            <SectionIcon icon={BarChart3} />
            <div>
              <h3 className="mt-1 font-sans text-micro uppercase tracking-[0.14em] text-brand">
                {tl("results")}
              </h3>
              <p className="mt-1.5 text-small text-ink-muted">
                {tp(`${project.slug}.resultsLead`)}
              </p>
            </div>
          </div>

          <Stagger
            as="dl"
            className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-1 xl:grid-cols-2"
          >
            {project.metrics.map((metric) => {
              const Icon = metricIcons[metric.key] ?? BarChart3
              const note = noteFor(metric.key)

              return (
                <StaggerItem
                  key={metric.key}
                  className="glass group rounded-md border-brand/25 p-4 transition-colors duration-300 hover:border-brand/60"
                >
                  <Icon
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className="h-[1.1rem] w-[1.1rem] text-brand/80 transition-colors duration-300 group-hover:text-brand"
                  />
                  <dd className="num mt-3 font-sans text-display-xs leading-none tabular-nums text-ink">
                    {metric.value}
                  </dd>
                  <dt className="mt-2 text-micro leading-snug text-ink-muted">
                    {tm(metric.key)}
                  </dt>
                  {note ? (
                    <p className="mt-2 text-micro leading-snug text-ink-faint">
                      {note}
                    </p>
                  ) : null}
                </StaggerItem>
              )
            })}
          </Stagger>
        </div>
      </div>

      {/* 5 — evidence. Each shot is pinned to a shared height and left to find
          its own width, so screenshots of any aspect sit on one baseline. */}
      <figure className="border-t border-line bg-ground px-5 py-6 sm:px-7">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-5">
          {project.proofImages.map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={1902}
              height={862}
              sizes="(max-width: 640px) 90vw, 560px"
              quality={90}
              className="h-auto w-full max-w-[28rem] rounded-md sm:h-36 sm:w-auto sm:max-w-none lg:h-44"
            />
          ))}
        </div>
      </figure>

      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-line px-5 py-4">
        {disciplines.map((discipline) => (
          <li
            key={discipline}
            className="font-sans text-micro uppercase tracking-[0.14em] text-ink-faint"
          >
            {discipline}
          </li>
        ))}
      </ul>
    </article>
  )
}
