export type ThemeMode = "light" | "dark"
export type ThemeRadius = "sm" | "md" | "lg" | "xl"
export type FontAr = "ibm-plex-sans-arabic" | "cairo" | "tajawal"
export type FontEn = "inter" | "poppins"

export type Theme = {
  preset: string | null
  mode: ThemeMode
  colors: { primary: string; accent: string }
  radius: ThemeRadius
  fontAr: FontAr
  fontEn: FontEn
  logoUrl: string | null
  coverUrl: string | null
}