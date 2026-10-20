import fs from "node:fs"
import path from "node:path"
import { Download } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { site } from "@/content/site"
import { ActionAnchor } from "./action-link"

/**
 * Renders nothing until the CV actually exists on disk.
 * Drop the PDF at public/cv/zoubeyr-sahraoui-cv.pdf and the button appears.
 */
export async function CvButton({
  variant = "outline",
  className = "",
}: {
  variant?: "solid" | "outline"
  className?: string
}) {
  const filePath = path.join(process.cwd(), "public", site.cvPath)

  if (!fs.existsSync(filePath)) return null

  const t = await getTranslations("common")

  return (
    <ActionAnchor href={site.cvPath} variant={variant} className={`gap-2 ${className}`} download>
      <Download className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      {t("downloadCv")}
    </ActionAnchor>
  )
}
