import { Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useColorMode } from "./useColorMode"

export function ModeToggle() {
  const { t } = useTranslation()
  const { mode, canSwitch, toggle } = useColorMode()
  if (!canSwitch) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={mode === "dark" ? t("common.lightMode") : t("common.darkMode")}
    >
      {mode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}