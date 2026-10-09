import { FONT_FAMILIES, loadFont } from "./fonts"
import { generatePalette } from "./generatePalette"
import type { Theme } from "./theme.types"

export function applyTheme(theme: Theme, lang: "ar" | "en") {
  const root = document.documentElement
  const { vars } = generatePalette(theme)

  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value)
  }

  root.classList.toggle("dark", theme.mode === "dark")
  root.style.colorScheme = theme.mode

  loadFont(theme.fontAr)
  loadFont(theme.fontEn)

  const main = lang === "ar" ? FONT_FAMILIES[theme.fontAr] : FONT_FAMILIES[theme.fontEn]
  const second = lang === "ar" ? FONT_FAMILIES[theme.fontEn] : FONT_FAMILIES[theme.fontAr]
  root.style.setProperty("--app-font", `${main}, ${second}, system-ui, sans-serif`)
}