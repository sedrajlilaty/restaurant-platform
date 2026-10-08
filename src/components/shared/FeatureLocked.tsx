import { Lock } from "lucide-react"
import { useTranslation } from "react-i18next"

export function FeatureLocked() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 py-16 text-center">
      <Lock className="size-10 text-muted-foreground" />
      <h1 className="text-lg font-bold">{t("featureLocked.title")}</h1>
      <p className="text-sm text-muted-foreground">{t("featureLocked.body")}</p>
    </div>
  )
}