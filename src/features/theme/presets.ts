import type { Theme } from "./theme.types"

export type ThemePreset = {
  key: string
  label: { ar: string; en: string }
  colors: Theme["colors"]
}

export const PRESETS: ThemePreset[] = [
  { key: "terracotta", label: { ar: "قرميدي", en: "Terracotta" }, colors: { primary: "#BF4E2C", accent: "#E9A04F" } },
  { key: "cafe", label: { ar: "كافيه", en: "Café" }, colors: { primary: "#6B4226", accent: "#C98B5B" } },
  { key: "fastfood", label: { ar: "وجبات سريعة", en: "Fast Food" }, colors: { primary: "#D62828", accent: "#FFB400" } },
]

export const DEFAULT_THEME: Theme = {
  preset: "terracotta",
  mode: "light",
  colors: PRESETS[0].colors,
  radius: "lg",
  fontAr: "ibm-plex-sans-arabic",
  fontEn: "inter",
  logoUrl: null,
  coverUrl: null,
}