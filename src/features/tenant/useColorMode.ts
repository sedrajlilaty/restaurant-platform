import { resolveTheme, useModeStore, type ThemeMode } from "@/features/theme"
import { useTenant } from "./useTenant"

export function useColorMode() {
  const tenant = useTenant()
  const override = useModeStore((s) => s.override)
  const setOverride = useModeStore((s) => s.setOverride)

  // الافتراضي من القالب، واختيار الزائر (إن وجد) بيغلب عليه
  const base: ThemeMode = tenant.kind === "restaurant" ? resolveTheme(tenant.theme, tenant.features).mode : "light"
  const mode: ThemeMode = override ?? base

  return {
    mode,
    canSwitch: true, // لقفلو على باقة: بدّليها بشرط من tenant.features
    toggle: () => setOverride(mode === "dark" ? "light" : "dark"),
  }
}