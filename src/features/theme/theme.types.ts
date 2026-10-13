import type { LocalizedText } from "@/types"

export type ThemeMode = "light" | "dark"
export type FontAr = "ibm-plex-sans-arabic" | "cairo" | "tajawal"
export type FontEn = "inter" | "poppins"

// قالب واحد من جدول Theme
export type Theme = {
  id: string
  name: LocalizedText
  mode: ThemeMode
  colors: { primary: string; accent: string } // accent = secondary_color بالـ ERD
  fontAr: FontAr
  fontEn: FontEn
  previewImageUrl: string | null
  isCustom: boolean // أنشأه المطعم بنفسه (created_by_restaurant_id)
}