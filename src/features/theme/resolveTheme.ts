import type { FeatureKey } from "@/features/tenant"
import { DEFAULT_THEME } from "./presets"
import type { Theme } from "./theme.types"

// قالب أنشأه المطعم بنفسو بيحتاج ميزة custom_theme بالباقة.
// إذا نزّل لباقة أقل بنرجع للثيم الافتراضي (والقالب المخزّن ما بينحذف)
export function resolveTheme(theme: Theme, features: FeatureKey[]): Theme {
  if (theme.isCustom && !features.includes("custom_theme")) return DEFAULT_THEME
  return theme
}