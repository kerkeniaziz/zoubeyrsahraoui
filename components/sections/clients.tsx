import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Marquee } from "@/components/magicui/marquee"
import { projects } from "@/content/site"

/** Restored from the original "Proud to Have Worked With" gallery. */
export async function Clients() {
  const t = await getTranslations("home.clients")
  const tp = await getTranslations("projects")

  return (
    <section
      aria-labelledby="clients-heading"
      className="overflow-hidden py-9 sm:py-11"
    >
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <h2 id="clients-heading" className="font-display text-display-sm text-ink">
          {t("title")}
        </h2>
        <p className="measure mt-4 text-base text-ink-muted">{t("lead")}</p>
      </div>

      {/* Marquee is decorative repetition; the real list follows for
          assistive tech and for crawlers. */}
      <div
        aria-hidden="true"
        className="relative mt-9 [--duration:34s] [--gap:1.5rem]"
      >
        <Marquee pauseOnHover className="py-2">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="glass glass-lit flex w-[21rem] shrink-0 items-center gap-5 rounded-lg p-6 sm:w-[24rem]"
            >
              <Image
                src={project.logo}
                alt=""
                width={447}
                height={447}
                sizes="112px"
                className="h-24 w-24 shrink-0 rounded-lg object-cover"
              />
              <div className="flex min-w-0 flex-col justify-center">
                <p className="truncate font-display text-display-xs leading-tight text-ink">
                  {project.brand}
                </p>
                <p className="mt-1.5 truncate text-base text-ink-muted">
                  {tp(`${project.slug}.role`)}
                </p>
              </div>
            </article>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 start-0 w-16 bg-gradient-to-r from-ground to-transparent rtl:bg-gradient-to-l" />
        <div className="pointer-events-none absolute inset-y-0 end-0 w-16 bg-gradient-to-l from-ground to-transparent rtl:bg-gradient-to-r" />
      </div>

      <ul className="sr-only">
        {projects.map((project) => (
          <li key={project.slug}>
            {project.brand} — {tp(`${project.slug}.role`)}
          </li>
        ))}
      </ul>
    </section>
  )
}
