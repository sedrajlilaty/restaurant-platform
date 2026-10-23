import type { Theme } from "@/features/theme"

export type AdminThemes = {
  presets: Theme[]
  custom: Theme | null
}

export type SaveAppearanceInput = { themeId: string }