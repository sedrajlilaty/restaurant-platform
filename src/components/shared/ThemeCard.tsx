import { Check, Lock } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { FontAr, FontEn, Theme } from "@/features/theme"
import { useLang } from "@/hooks/useLang"
import { cn } from "@/lib/utils"

const FONT_LABELS: Record<FontAr | FontEn, string> = {
  "ibm-plex-sans-arabic": "IBM Plex Sans Arabic",
  cairo: "Cairo",
  tajawal: "Tajawal",
  inter: "Inter",
  poppins: "Poppins",
}

type Props = {
  theme: Theme
  selected: boolean
  current: boolean
  locked?: boolean
  onSelect: () => void
}

export function ThemeCard({ theme, selected, current, locked = false, onSelect }: Props) {
  const { t } = useTranslation()
  const lang = useLang()

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={locked}
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col gap-3 rounded-3xl border bg-card p-4 text-start shadow-sm transition-colors",
        selected ? "border-primary bg-muted" : "hover:bg-muted/60",
        locked && "cursor-not-allowed opacity-60",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1.5">
          <span className="size-8 rounded-full border" style={{ backgroundColor: theme.colors.primary }} />
          <span className="size-8 rounded-full border" style={{ backgroundColor: theme.colors.accent }} />
        </div>
        {locked ? (
          <Lock className="size-4 text-muted-foreground" />
        ) : selected ? (
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-4" />
          </span>
        ) : null}
      </div>

      <div>
        <p className="font-medium">{theme.name[lang]}</p>
        <p className="text-xs text-muted-foreground">
          <bdi dir="ltr">
            {FONT_LABELS[theme.fontAr]} · {FONT_LABELS[theme.fontEn]}
          </bdi>
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        {current && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-primary-foreground">
            {t("appearance.current")}
          </span>
        )}
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">
          {t(`appearance.mode.${theme.mode}`)}
        </span>
        {locked && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">{t("appearance.locked")}</span>
        )}
      </div>
    </button>
  )
}