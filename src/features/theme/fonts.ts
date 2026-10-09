import type { FontAr, FontEn } from "./theme.types"

export type FontKey = FontAr | FontEn

export const FONT_FAMILIES: Record<FontKey, string> = {
  "ibm-plex-sans-arabic": '"IBM Plex Sans Arabic"',
  cairo: '"Cairo"',
  tajawal: '"Tajawal"',
  inter: '"Inter Variable"',
  poppins: '"Poppins"',
}

const LOADERS: Record<FontKey, () => Promise<unknown>> = {
  "ibm-plex-sans-arabic": () =>
    Promise.all([
      import("@fontsource/ibm-plex-sans-arabic/400.css"),
      import("@fontsource/ibm-plex-sans-arabic/500.css"),
      import("@fontsource/ibm-plex-sans-arabic/700.css"),
    ]),
  cairo: () =>
    Promise.all([
      import("@fontsource/cairo/400.css"),
      import("@fontsource/cairo/500.css"),
      import("@fontsource/cairo/700.css"),
    ]),
  tajawal: () =>
    Promise.all([
      import("@fontsource/tajawal/400.css"),
      import("@fontsource/tajawal/500.css"),
      import("@fontsource/tajawal/700.css"),
    ]),
  inter: () => import("@fontsource-variable/inter"),
  poppins: () =>
    Promise.all([
      import("@fontsource/poppins/400.css"),
      import("@fontsource/poppins/500.css"),
      import("@fontsource/poppins/700.css"),
    ]),
}

const loaded = new Set<FontKey>()

export function loadFont(key: FontKey) {
  if (loaded.has(key)) return
  loaded.add(key)
  void LOADERS[key]().catch(() => loaded.delete(key))
}