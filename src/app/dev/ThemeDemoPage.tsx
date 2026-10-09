// صفحة مؤقتة للتجربة فقط، تنحذف قبل الإطلاق
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { ColorField } from "../../components/shared/ColorField"
import { useRestaurant } from "../../features/tenant/useTenant"
import { applyTheme } from "../../features/theme/applyTheme"
import { generatePalette } from "../../features/theme/generatePalette"
import { PRESETS } from "../../features/theme/presets"
import type { Theme, ThemeRadius } from "../../features/theme/theme.types"
import { cn } from "../../lib/utils"

const RADII: ThemeRadius[] = ["sm", "md", "lg", "xl"]

export function ThemeDemoPage() {
  const { i18n } = useTranslation()
  const lang = i18n.language === "en" ? "en" : "ar"
  const tx = (ar: string, en: string) => (lang === "ar" ? ar : en)

  const restaurant = useRestaurant()
  const [draft, setDraft] = useState<Theme>(restaurant.theme)

  const { adjusted } = useMemo(() => generatePalette(draft), [draft])

  // معاينة حية: كل تغيير بينطبّق فوراً
  useEffect(() => {
    applyTheme(draft, lang)
  }, [draft, lang])

  // عند الخروج من الصفحة بنرجّع الثيم المحفوظ
  useEffect(() => {
    return () => applyTheme(restaurant.theme, lang)
  }, [restaurant.theme, lang])

  const setColors = (patch: Partial<Theme["colors"]>) =>
    setDraft((d) => ({ ...d, preset: null, colors: { ...d.colors, ...patch } }))

  const samples = [
    { badge: tx("الأكثر مبيعاً", "Bestseller"), name: tx("برغر لحم كلاسيك", "Classic Beef Burger"), price: "$8.50", old: null },
    { badge: tx("حار", "Hot"), name: tx("برغر دجاج مقرمش", "Crispy Chicken Burger"), price: "$7.25", old: "$9.00" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">{tx("تجربة اختيار الألوان", "Color picker demo")}</h1>

      <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => setDraft((d) => ({ ...d, preset: preset.key, colors: preset.colors }))}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm",
                draft.preset === preset.key && "border-primary bg-muted font-semibold",
              )}
            >
              <span className="size-4 rounded-full" style={{ backgroundColor: preset.colors.primary }} />
              {preset.label[lang]}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ColorField
            label={tx("اللون الأساسي", "Primary color")}
            value={draft.colors.primary}
            onChange={(hex) => setColors({ primary: hex })}
          />
          <ColorField
            label={tx("اللون الثانوي", "Accent color")}
            value={draft.colors.accent}
            onChange={(hex) => setColors({ accent: hex })}
          />
        </div>

        {adjusted && (
          <p className="rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
            {tx(
              "اللون فاتح قليلاً، عدّلناه تلقائياً ليبقى النص مقروءاً",
              "This color is a bit light, we adjusted it so text stays readable",
            )}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDraft((d) => ({ ...d, mode: d.mode === "light" ? "dark" : "light" }))}
          >
            {draft.mode === "light" ? tx("الوضع الداكن", "Dark mode") : tx("الوضع الفاتح", "Light mode")}
          </Button>
          {RADII.map((r) => (
            <Button
              key={r}
              type="button"
              size="sm"
              variant={draft.radius === r ? "default" : "outline"}
              onClick={() => setDraft((d) => ({ ...d, radius: r }))}
            >
              {r}
            </Button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm">
          <h2 className="text-2xl font-bold">{tx("طعم لا يُنسى", "A taste you won't forget")}</h2>
          <p className="mt-1 text-sm opacity-90">{tx("أطباق طازجة تُحضّر بحب", "Fresh dishes made with love")}</p>
          <span className="mt-3 inline-block rounded-full bg-card px-4 py-2 text-sm font-semibold text-foreground">
            {tx("اطلب الآن", "Order now")}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button>{tx("زر أساسي", "Primary")}</Button>
          <Button variant="outline">{tx("زر ثانوي", "Secondary")}</Button>
          <span className="rounded-full bg-brand-accent px-3 py-1.5 text-sm font-medium text-brand-accent-foreground">
            {tx("عرض خاص", "Special offer")}
          </span>
        </div>

        <div className="grid max-w-xl grid-cols-2 gap-3">
          {samples.map((item) => (
            <article key={item.name} className="overflow-hidden rounded-3xl border bg-card shadow-sm">
              <div className="relative aspect-[4/3] bg-muted">
                <span className="absolute start-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                  {item.badge}
                </span>
              </div>
              <div className="space-y-1 p-3">
                <h3 className="line-clamp-1 font-semibold">{item.name}</h3>
                <p className="text-xs text-muted-foreground">{tx("لحم بقري، جبنة، صلصة البيت", "Beef, cheese, house sauce")}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-primary">{item.price}</span>
                    {item.old && <span className="text-xs text-muted-foreground line-through">{item.old}</span>}
                  </div>
                  <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Plus className="size-4" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}