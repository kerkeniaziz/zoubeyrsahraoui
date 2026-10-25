import createNextIntlPlugin from "next-intl/plugin"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export: the whole site ships as plain files to Apache shared
  // hosting, so there is no Node server at request time.
  output: "export",
  // Apache needs folder/index.html rather than folder.html to resolve
  // extensionless URLs like /en/work.
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // All imagery is self-hosted under /public/images — no remote fetch, so the
    // optimizer never depends on the network at request time. Static export has
    // no optimizer, so originals are served as-is.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
