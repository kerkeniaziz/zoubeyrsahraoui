import { getTranslations } from "next-intl/server"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const faqKeys = ["1", "2", "3", "4", "5"] as const

export async function Faq() {
  const t = await getTranslations("home.faq")

  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-line bg-ground-deep"
    >
      <div className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2
              id="faq-heading"
              className="font-display text-display-sm text-ink lg:sticky lg:top-28"
            >
              {t("title")}
            </h2>
            <p className="measure mt-4 text-base text-ink-muted lg:sticky lg:top-44">
              {t("lead")}
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Accordion type="single" collapsible className="w-full">
              {faqKeys.map((key) => (
                <AccordionItem
                  key={key}
                  value={key}
                  className="border-line"
                >
                  <AccordionTrigger className="py-6 text-start text-base text-ink hover:no-underline data-[state=open]:text-brand">
                    {t(`q${key}`)}
                  </AccordionTrigger>
                  <AccordionContent className="measure pb-6 text-base leading-relaxed text-ink-muted">
                    {t(`a${key}`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
