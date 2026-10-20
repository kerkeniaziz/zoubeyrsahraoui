export function PageHeader({
  title,
  lead,
}: {
  title: string
  lead?: string
}) {
  return (
    <header className="relative overflow-hidden border-b border-line">
      <div className="glow-field" aria-hidden="true" />
      <div className="mx-auto max-w-shell px-5 pb-11 pt-11 sm:px-8 sm:pb-14 sm:pt-16">
        <h1 className="animate-rise max-w-[16ch] text-balance font-display text-display-lg text-ink">
          {title}
        </h1>
        {lead ? (
          <p className="animate-rise measure mt-6 text-lead text-ink-muted [animation-delay:90ms]">
            {lead}
          </p>
        ) : null}
      </div>
    </header>
  )
}
