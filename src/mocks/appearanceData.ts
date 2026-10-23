import { SAMPLE_THEMES, type Theme } from "@/features/theme"
import type { TenantConfig } from "@/features/tenant"
import { tenants } from "./data"
import { persistentValue } from "./db"

export const presetThemes: Theme[] = SAMPLE_THEMES

// اختيار كل مطعم: host -> themeId (بيضل بعد تحديث الصفحة)
const choices = persistentValue<Record<string, string>>("theme-choice", () => ({}))

// القالب الخاص بكل مطعم، منحفظو قبل ما يختار قالب جاهز حتى يقدر يرجع إلو
export const customThemes: Record<string, Theme> = {}
for (const [host, tenant] of Object.entries(tenants)) {
  if (tenant.kind === "restaurant" && tenant.theme.isCustom) customThemes[host] = tenant.theme
}

function findTheme(host: string, themeId: string): Theme | undefined {
  const own = customThemes[host]
  return presetThemes.find((theme) => theme.id === themeId) ?? (own?.id === themeId ? own : undefined)
}

export function chooseTheme(host: string, themeId: string): "ok" | "not_found" | "forbidden" {
  const tenant = tenants[host] as TenantConfig | undefined
  const theme = findTheme(host, themeId)
  if (tenant?.kind !== "restaurant" || !theme) return "not_found"
  if (theme.isCustom && !tenant.features.includes("custom_theme")) return "forbidden"

  tenant.theme = theme
  choices.value = { ...choices.value, [host]: theme.id }
  return "ok"
}

// عند تشغيل السيرفر الوهمي: رجّعي اختيارات المطاعم المحفوظة
for (const [host, themeId] of Object.entries(choices.value)) {
  const tenant = tenants[host] as TenantConfig | undefined
  const theme = findTheme(host, themeId)
  if (tenant?.kind === "restaurant" && theme) tenant.theme = theme
}