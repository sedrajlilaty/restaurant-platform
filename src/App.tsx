import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useTenant } from "@/features/tenant/useTenant"
import { setLanguage } from "@/lib/i18n"

export default function App() {
  const { i18n } = useTranslation()
  const tenant = useTenant()
  const lang = i18n.language === "en" ? "en" : "ar"

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <h1 className="mb-4 text-2xl font-bold">
        {tenant.kind === "restaurant" ? tenant.name[lang] : "Platform"}
      </h1>
      <div className="flex gap-3">
        <Button>Primary</Button>
        <Button variant="outline" onClick={() => void setLanguage(lang === "ar" ? "en" : "ar")}>
          AR / EN
        </Button>
        <span className="rounded-md bg-brand-accent px-3 py-2 text-brand-accent-foreground">
          Offer
        </span>
      </div>
    </div>
  )
}