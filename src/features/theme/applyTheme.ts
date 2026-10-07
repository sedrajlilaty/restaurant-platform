import type { Theme } from "./theme.types"
import { generatePalette } from "./generatePalette"
import { FONT_FAMILIES } from "./fonts"

export type Lang = "ar" | "en"

export function applyTheme(theme: Theme, lang: Lang) {
  const root = document.documentElement
  const { vars } = generatePalette(theme)

  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value)
  }

  root.classList.toggle("dark", theme.mode === "dark")
  root.style.colorScheme = theme.mode

  const main = lang === "ar" ? FONT_FAMILIES[theme.fontAr] : FONT_FAMILIES[theme.fontEn]
  const second = lang === "ar" ? FONT_FAMILIES[theme.fontEn] : FONT_FAMILIES[theme.fontAr]
  root.style.setProperty("--app-font", `${main}, ${second}, system-ui, sans-serif`)
}