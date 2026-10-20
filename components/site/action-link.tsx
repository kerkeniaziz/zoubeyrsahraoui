import { Link } from "@/i18n/navigation"

type Variant = "solid" | "outline"

const base =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-small transition-all duration-300 focus-visible:outline-none"

const variants: Record<Variant, string> = {
  solid:
    "bg-brand text-brand-on hover:bg-brand-bright hover:shadow-brand-glow",
  outline:
    "border border-line-strong text-ink hover:border-brand hover:text-brand",
}

export function ActionLink({
  href,
  variant = "solid",
  className = "",
  children,
}: {
  href: string
  variant?: Variant
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  )
}

export function ActionAnchor({
  href,
  variant = "solid",
  className = "",
  children,
  ...rest
}: {
  href: string
  variant?: Variant
  className?: string
  children: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}

/**
 * A quieter secondary action: reads as a link, not a button.
 * The arrow mirrors and reverses its hover travel under RTL.
 */
export function ArrowLink({
  href,
  className = "",
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-6 items-center gap-2 text-small text-ink transition-colors duration-300 hover:text-brand ${className}`}
    >
      <span className="border-b border-brand/40 pb-0.5 transition-colors duration-300 group-hover:border-brand">
        {children}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </Link>
  )
}
