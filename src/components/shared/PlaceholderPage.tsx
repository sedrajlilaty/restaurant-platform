import { useTranslation } from "react-i18next"

export function PlaceholderPage({ titleKey }: { titleKey: string }) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">{t(titleKey)}</h1>
      <p className="text-muted-foreground">{t("placeholder.soon")}</p>
    </div>
  )
}