import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic layer */
        ground: {
          DEFAULT: "hsl(var(--ground) / <alpha-value>)",
          deep: "hsl(var(--ground-deep) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "hsl(var(--surface) / <alpha-value>)",
          raised: "hsl(var(--surface-raised) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          muted: "hsl(var(--ink-muted) / <alpha-value>)",
          faint: "hsl(var(--ink-faint) / <alpha-value>)",
        },
        brand: {
          DEFAULT: "hsl(var(--brand) / <alpha-value>)",
          bright: "hsl(var(--brand-bright) / <alpha-value>)",
          on: "hsl(var(--brand-on) / <alpha-value>)",
          wash: "hsl(var(--brand-wash) / <alpha-value>)",
        },
        line: {
          DEFAULT: "hsl(var(--line) / <alpha-value>)",
          strong: "hsl(var(--line-strong) / <alpha-value>)",
        },

        /* shadcn/ui compatibility */
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
      },

      fontFamily: {
        display: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Geist"', "ui-sans-serif", "system-ui", "sans-serif"],
        arabic: ['"IBM Plex Sans Arabic"', "ui-sans-serif", "sans-serif"],
      },

      /* Fluid scale. Display sizes lead; text sizes stay conservative. */
      fontSize: {
        micro: ["0.75rem", { lineHeight: "1.1rem", letterSpacing: "0.01em" }],
        small: ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["1rem", { lineHeight: "1.6rem" }],
        lead: ["clamp(1.0625rem, 0.4vw + 0.95rem, 1.25rem)", { lineHeight: "1.65" }],
        "display-xs": ["clamp(1.5rem, 1.4vw + 1.1rem, 2rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.875rem, 2.4vw + 1.2rem, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.25rem, 4vw + 1.1rem, 4rem)", { lineHeight: "1.06", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(2.75rem, 6.2vw + 0.9rem, 5.75rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-xl": ["clamp(3.25rem, 9vw + 0.5rem, 8rem)", { lineHeight: "0.96", letterSpacing: "-0.035em" }],
        /* Campaign figures: tabular, tight, never italic. */
        metric: ["clamp(1.875rem, 2.6vw + 1.1rem, 2.75rem)", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.25rem)",
        sm: "calc(var(--radius) - 0.45rem)",
      },

      boxShadow: {
        panel: "0 1px 2px hsl(var(--shade) / 0.06), 0 12px 32px -12px hsl(var(--shade) / 0.3)",
        lift: "0 2px 4px hsl(var(--shade) / 0.08), 0 28px 60px -22px hsl(var(--shade) / 0.45)",
        "brand-glow": "0 0 0 1px hsl(var(--brand) / 0.35), 0 18px 48px -18px hsl(var(--brand) / 0.4)",
      },

      maxWidth: {
        shell: "88rem",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        /* The single orchestrated page-load reveal. */
        rise: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        'marquee-vertical': {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "shimmer-slide": {
          to: { transform: "translate(calc(100cqw - 100%), 0)" },
        },
        "spin-around": {
          "0%": { transform: "translateZ(0) rotate(0)" },
          "15%, 35%": { transform: "translateZ(0) rotate(90deg)" },
          "65%, 85%": { transform: "translateZ(0) rotate(270deg)" },
          "100%": { transform: "translateZ(0) rotate(360deg)" },
        },
        orbit: {
          '0%': { transform: 'rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))' },
          '100%': { transform: 'rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        rise: "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee var(--duration, 40s) linear infinite",
        'marquee-vertical': "marquee-vertical var(--duration, 40s) linear infinite",
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
      },

      transitionTimingFunction: {
        entrance: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
