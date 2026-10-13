import type { Theme } from "./theme.types"

// الثيم الاحتياطي (دومين المنصة، أو إذا فشل تحميل المطعم)
export const DEFAULT_THEME: Theme = {
  id: "terracotta",
  name: { ar: "قرميدي", en: "Terracotta" },
  mode: "light",
  colors: { primary: "#BF4E2C", accent: "#E9A04F" },
  fontAr: "ibm-plex-sans-arabic",
  fontEn: "inter",
  previewImageUrl: null,
  isCustom: false,
}

// قوالب تجريبية للتطوير فقط: بالإنتاج بتجي من الـ API (جدول Theme)
export const SAMPLE_THEMES: Theme[] = [
  DEFAULT_THEME,
  {
    ...DEFAULT_THEME,
    id: "cafe",
    name: { ar: "كافيه", en: "Café" },
    colors: { primary: "#6B4226", accent: "#C98B5B" },
  },
  {
    ...DEFAULT_THEME,
    id: "fastfood",
    name: { ar: "وجبات سريعة", en: "Fast Food" },
    colors: { primary: "#D62828", accent: "#FFB400" },
  },
]