import { resolveTheme, useModeStore, type ThemeMode } from "@/features/theme"
import { useTenant } from "./useTenant"

export function useColorMode() {
  const tenant = useTenant()
  const override = useModeStore((s) => s.override)
  const setOverride = useModeStore((s) => s.setOverride)

  const canSwitch = tenant.kind === "platform" || tenant.features.includes("theme_dark_mode")
  const base: ThemeMode = tenant.kind === "restaurant" ? resolveTheme(tenant.theme, tenant.features).mode : "light"
  const mode: ThemeMode = canSwitch && override ? override : base

  return { mode, canSwitch, toggle: () => setOverride(mode === "dark" ? "light" : "dark") }
}