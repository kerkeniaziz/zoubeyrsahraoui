/**
 * Static export for Apache shared hosting (OVH).
 *
 * `next build` with `output: "export"` refuses to run while middleware.ts
 * exists, because middleware needs a server. The middleware only redirects the
 * bare `/` and sniffs Accept-Language, which .htaccess does on Apache — so it
 * is moved aside for the build and restored afterwards, keeping `pnpm dev`
 * untouched.
 */
import { execSync } from "node:child_process"
import { existsSync, renameSync, writeFileSync, rmSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const middleware = join(root, "middleware.ts")
const parked = join(root, "middleware.ts.export-disabled")

const LOCALES = ["en", "fr", "ar", "de", "es"]
const DEFAULT_LOCALE = "en"

/** Apache config: locale negotiation on `/`, plus long-cache for hashed assets. */
function htaccess() {
  const redirects = LOCALES.filter((l) => l !== DEFAULT_LOCALE)
    .map(
      (l) =>
        `RewriteCond %{HTTP:Accept-Language} ^${l} [NC]\nRewriteRule ^$ /${l}/ [R=302,L]`,
    )
    .join("\n")

  return `DirectoryIndex index.html
Options -Indexes

<IfModule mod_rewrite.c>
  RewriteEngine On

  # Match the browser's preferred language, the way next-intl middleware did.
${redirects}

  # Anything unmatched lands on the default locale.
  RewriteRule ^$ /${DEFAULT_LOCALE}/ [R=302,L]
</IfModule>

ErrorDocument 404 /404.html

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  # Content-hashed bundles and fonts never change under the same URL.
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/jpeg "access plus 6 months"
  ExpiresByType image/png "access plus 6 months"
  ExpiresByType image/svg+xml "access plus 6 months"
  # HTML must revalidate or deploys go unseen.
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

AddDefaultCharset UTF-8
AddType application/manifest+json .webmanifest
`
}

let moved = false
try {
  // Windows sometimes holds a handle on out/ briefly after a dev or preview
  // server exits, so the clean is retried rather than failing the build.
  for (let attempt = 1; ; attempt++) {
    try {
      rmSync(join(root, "out"), { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
      break
    } catch (err) {
      if (attempt >= 5) throw err
      execSync("node -e \"setTimeout(()=>{},600)\"")
    }
  }

  if (existsSync(middleware)) {
    renameSync(middleware, parked)
    moved = true
    console.log("• middleware.ts parked for export")
  }

  execSync("corepack pnpm exec next build", { stdio: "inherit" })

  writeFileSync(join(root, "out", ".htaccess"), htaccess(), "utf8")
  console.log("• out/.htaccess written")
} finally {
  if (moved) {
    renameSync(parked, middleware)
    console.log("• middleware.ts restored")
  }
}
