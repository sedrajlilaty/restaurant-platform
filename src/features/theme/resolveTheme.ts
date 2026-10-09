import type { FeatureKey } from "@/features/tenant"
import { DEFAULT_THEME, PRESETS } from "./presets"
import type { Theme } from "./theme.types"

export function resolveTheme(theme: Theme, features: FeatureKey[]): Theme {
  const has = (feature: FeatureKey) => features.includes(feature)
  const presetColors = PRESETS.find((p) => p.key === theme.preset)?.colors ?? DEFAULT_THEME.colors

  return {
    ...theme,
    colors: has("theme_custom_colors") ? theme.colors : presetColors,
    mode: has("theme_dark_mode") ? theme.mode : DEFAULT_THEME.mode,
    radius: has("theme_radius") ? theme.radius : DEFAULT_THEME.radius,
    fontAr: has("theme_fonts") ? theme.fontAr : DEFAULT_THEME.fontAr,
    fontEn: has("theme_fonts") ? theme.fontEn : DEFAULT_THEME.fontEn,
    coverUrl: has("theme_cover") ? theme.coverUrl : null,
  }
}