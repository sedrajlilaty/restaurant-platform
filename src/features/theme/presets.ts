import type { Theme } from "./theme.types"

export type ThemePreset = {
  key: string
  label: { ar: string; en: string }
  colors: Theme["colors"]
}

export const PRESETS: ThemePreset[] = [
  { key: "berry", label: { ar: "عنابي وخوخي", en: "Berry & Peach" }, colors: { primary: "#8C2F4A", accent: "#F2A07B" } },
  { key: "navy", label: { ar: "نيلي وقرميدي", en: "Navy & Terracotta" }, colors: { primary: "#1E3A5F", accent: "#C8482A" } },
  { key: "ember", label: { ar: "فحمي وبرتقالي", en: "Charcoal & Orange" }, colors: { primary: "#C9481A", accent: "#2B2B2B" } },
]

export const DEFAULT_THEME: Theme = {
  preset: "berry",
  mode: "light",
  colors: PRESETS[0].colors,
  radius: "md",
  fontAr: "ibm-plex-sans-arabic",
  fontEn: "inter",
  logoUrl: null,
  coverUrl: null,
}