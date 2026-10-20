import createNextIntlPlugin from "next-intl/plugin"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // All imagery is self-hosted under /public/images — no remote fetch, so the
    // optimizer never depends on the network at request time.
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90, 95],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
