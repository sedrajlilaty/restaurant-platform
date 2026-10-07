import "@fontsource/ibm-plex-sans-arabic/400.css"
import "@fontsource/ibm-plex-sans-arabic/500.css"
import "@fontsource/ibm-plex-sans-arabic/700.css"
import "@fontsource/cairo/400.css"
import "@fontsource/cairo/500.css"
import "@fontsource/cairo/700.css"
import "@fontsource/tajawal/400.css"
import "@fontsource/tajawal/500.css"
import "@fontsource/tajawal/700.css"
import "@fontsource-variable/inter"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/700.css"
import type { FontAr, FontEn } from "./theme.types"

export const FONT_FAMILIES: Record<FontAr | FontEn, string> = {
  "ibm-plex-sans-arabic": '"IBM Plex Sans Arabic"',
  cairo: '"Cairo"',
  tajawal: '"Tajawal"',
  inter: '"Inter Variable"',
  poppins: '"Poppins"',
}