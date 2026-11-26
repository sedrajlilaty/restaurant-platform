import { Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { useColorMode } from "./useColorMode"

export function ModeToggle() {
  const { t } = useTranslation()
  const { mode, canSwitch, toggle } = useColorMode()
  if (!canSwitch) return null

  const dark = mode === "dark"
  const Icon = dark ? Moon : Sun

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? t("common.lightMode") : t("common.darkMode")}
      onClick={toggle}
      dir="ltr"
      className={cn(
        "relative h-8 w-[58px] shrink-0 rounded-full outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring active:scale-95 motion-reduce:transition-none",
        dark ? "bg-primary" : "bg-muted hover:bg-muted/70",
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 grid size-6 place-items-center rounded-full bg-card text-primary shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none",
          dark && "translate-x-[26px]",
        )}
      >
        <Icon key={mode} className="size-3.5 animate-in fade-in zoom-in-50 duration-300 motion-reduce:animate-none" />
      </span>
    </button>
  )
}