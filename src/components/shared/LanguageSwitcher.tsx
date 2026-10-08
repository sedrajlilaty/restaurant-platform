import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { setLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation()
  const next = i18n.language === "ar" ? "en" : "ar"

  return (
    <Button variant="ghost" size="sm" className={cn("gap-1", className)} onClick={() => void setLanguage(next)}>
      <Languages className="size-4" />
      {next === "en" ? "EN" : "عربي"}
    </Button>
  )
}