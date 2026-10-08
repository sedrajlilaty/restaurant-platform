import { Link } from "react-router"
import { useTranslation } from "react-i18next"

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
      <h1 className="text-2xl font-bold">{t("notFound.title")}</h1>
      <Link to="/" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
        {t("notFound.back")}
      </Link>
    </div>
  )
}