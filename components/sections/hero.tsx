import { getTranslations } from "next-intl/server"
import { TextAnimate } from "@/components/magicui/text-animate"
import { HeroSceneLoader } from "@/components/sections/hero-scene-loader"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { ArrowLink } from "@/components/site/action-link"
import { CvButton } from "@/components/site/cv-button"

export async function Hero() {
  const t = await getTranslations("home.hero")
  const tc = await getTranslations("common")

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="glow-field" aria-hidden="true" />

      <div className="mx-auto grid max-w-shell items-center gap-10 px-5 py-8 sm:px-8 sm:py-9 md:grid-cols-12 md:gap-8 lg:gap-10 lg:py-6">
        <div className="md:col-span-6 lg:pe-4">
          <p className="glass animate-rise inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 font-sans text-[0.7rem] text-ink-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
            {t("location")}
          </p>

          <h1 className="mt-6">
            <TextAnimate
              as="span"
              by="word"
              animation="blurInUp"
              once
              duration={0.5}
              className="block font-display text-display-lg text-ink"
            >
              {tc("name")}
            </TextAnimate>
            <span className="animate-rise mt-3 block text-lead text-brand [animation-delay:260ms]">
              {t("role")}
            </span>
          </h1>

          <p className="animate-rise measure mt-6 text-lead leading-relaxed text-ink-muted [animation-delay:320ms]">
            {t("hook")}
          </p>

          <div className="animate-rise mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:380ms]">
            <ShimmerButton href="/work" className="text-small">
              {t("primaryCta")}
            </ShimmerButton>
            <ArrowLink href="/contact">{t("secondaryCta")}</ArrowLink>
            <CvButton />
          </div>
        </div>

        <div className="animate-rise hidden md:col-span-6 md:col-start-7 md:block [animation-delay:440ms]">
          <HeroSceneLoader label={t("sceneAlt")} />
        </div>
      </div>
    </section>
  )
}
