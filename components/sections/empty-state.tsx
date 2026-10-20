import { ActionLink } from "@/components/site/action-link"
import { CvButton } from "@/components/site/cv-button"

/**
 * Placeholder for sections that are being filled in.
 * An empty screen is an invitation to act, so it always offers a next step.
 */
export function EmptyState({
  body,
  ctaLabel,
}: {
  body: string
  ctaLabel: string
}) {
  return (
    <div className="glass glass-lit rounded-lg px-6 py-10 text-center sm:px-12 sm:py-14">
      <p className="measure mx-auto text-lead text-ink-muted">{body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ActionLink href="/contact" variant="outline">
          {ctaLabel}
        </ActionLink>
        <CvButton variant="solid" />
      </div>
    </div>
  )
}
