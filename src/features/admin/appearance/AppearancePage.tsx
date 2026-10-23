import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/PageHeader"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { ThemeCard } from "@/components/shared/ThemeCard"
import { ThemePreview } from "@/components/shared/ThemePreview"
import { Button } from "@/components/ui/button"
import { useFeature } from "@/hooks/useFeature"
import { useLang } from "@/hooks/useLang"
import { useRestaurant } from "@/features/tenant"
import { resolveTheme } from "@/features/theme"
import { useAdminThemes, useSaveAppearance } from "./appearance.api"
import type { AdminThemes } from "./appearance.types"

function AppearanceForm({ data }: { data: AdminThemes }) {
  const { t } = useTranslation()
  const lang = useLang()
  const restaurant = useRestaurant()
  const canUseCustom = useFeature("custom_theme")
  const save = useSaveAppearance()

  const effective = resolveTheme(restaurant.theme, restaurant.features)
  const [selectedId, setSelectedId] = useState(effective.id)

  const all = data.custom ? [...data.presets, data.custom] : data.presets
  const selected = all.find((theme) => theme.id === selectedId) ?? effective
  const dirty = selectedId !== effective.id

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    save.mutate(
      { themeId: selectedId },
      {
        onSuccess: () => toast.success(t("appearance.saved")),
        onError: () => toast.error(t("appearance.saveError")),
      },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form onSubmit={onSubmit} noValidate>
        <SectionCard title={t("appearance.presets.title")} description={t("appearance.presets.desc")}>
          <div role="radiogroup" aria-label={t("appearance.presets.title")} className="grid gap-3 sm:grid-cols-2">
            {data.presets.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                selected={selectedId === theme.id}
                current={effective.id === theme.id}
                onSelect={() => setSelectedId(theme.id)}
              />
            ))}
          </div>

          {data.custom && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">{t("appearance.custom.title")}</h3>
              <div role="radiogroup" aria-label={t("appearance.custom.title")} className="grid gap-3 sm:grid-cols-2">
                <ThemeCard
                  theme={data.custom}
                  selected={selectedId === data.custom.id}
                  current={effective.id === data.custom.id}
                  locked={!canUseCustom}
                  onSelect={() => setSelectedId(data.custom!.id)}
                />
              </div>
              {!canUseCustom && <p className="text-xs text-muted-foreground">{t("appearance.custom.locked")}</p>}
            </div>
          )}

          <SectionFooter pending={save.isPending} disabled={!dirty} />
        </SectionCard>
      </form>

      <aside className="order-first space-y-2 lg:order-none lg:sticky lg:top-6 lg:self-start">
        <h2 className="text-sm font-medium">{t("appearance.preview.title")}</h2>
        <ThemePreview theme={selected} name={restaurant.name[lang]} logoUrl={restaurant.logoUrl} />
      </aside>
    </div>
  )
}

export function AppearancePage() {
  const { t } = useTranslation()
  const { data, isPending, isError, refetch } = useAdminThemes()

  return (
    <div className="space-y-6">
      <PageHeader title={t("appearance.title")} description={t("appearance.desc")} />

      {isPending && <p className="text-muted-foreground">{t("common.loading")}</p>}

      {isError && (
        <div className="flex flex-col items-start gap-3">
          <p>{t("appearance.loadError")}</p>
          <Button variant="outline" onClick={() => void refetch()}>
            {t("common.retry")}
          </Button>
        </div>
      )}

      {data && <AppearanceForm data={data} />}
    </div>
  )
}