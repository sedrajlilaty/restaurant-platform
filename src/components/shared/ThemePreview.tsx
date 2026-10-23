import { useMemo, type CSSProperties } from "react"
import { House, Info, Plus, Search, ShoppingBag } from "lucide-react"
import { useTranslation } from "react-i18next"
import { RestaurantLogo } from "@/components/shared/RestaurantLogo"
import { generatePalette, type Theme } from "@/features/theme"

type Props = {
  theme: Theme
  name: string
  logoUrl: string | null
}

export function ThemePreview({ theme, name, logoUrl }: Props) {
  const { t } = useTranslation()
  const { vars, adjusted } = useMemo(() => generatePalette(theme), [theme])

  return (
    <div className="space-y-2">
      {/* المتغيرات مكتوبة على هالـ div فقط، فالمعاينة ما بتأثر على باقي الصفحة */}
      <div
        style={vars as CSSProperties}
        className="space-y-4 overflow-hidden rounded-3xl border bg-background p-4 text-foreground shadow-sm"
      >
        <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm">
          <RestaurantLogo name={name} logoUrl={logoUrl} />
          <span className="truncate font-bold">{name}</span>
        </div>

        <div className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground">
          <Search className="size-4" />
          {t("appearance.preview.search")}
        </div>

        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">
            {t("appearance.preview.categories.all")}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            {t("appearance.preview.categories.main")}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            {t("appearance.preview.categories.drinks")}
          </span>
        </div>

        <div className="space-y-2 rounded-3xl border bg-card p-3 shadow-sm">
          <div className="relative aspect-[4/3] rounded-2xl bg-muted">
            <span className="absolute start-2 top-2 rounded-full bg-brand-accent px-2.5 py-0.5 text-xs text-brand-accent-foreground">
              {t("appearance.preview.badge")}
            </span>
          </div>
          <p className="font-medium">{t("appearance.preview.product")}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">{t("appearance.preview.productDesc")}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary">{t("appearance.preview.price")}</span>
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Plus className="size-4" />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-around rounded-full border bg-card p-2 shadow-sm">
          <House className="size-5 text-primary" />
          <Search className="size-5 text-muted-foreground" />
          <span className="flex size-10 items-center justify-center rounded-full bg-brand-accent text-brand-accent-foreground">
            <ShoppingBag className="size-5" />
          </span>
          <Info className="size-5 text-muted-foreground" />
        </div>
      </div>

      {adjusted && <p className="text-xs text-muted-foreground">{t("appearance.preview.adjusted")}</p>}
    </div>
  )
}