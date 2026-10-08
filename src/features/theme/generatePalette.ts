import { colord, extend } from "colord"
import a11yPlugin from "colord/plugins/a11y"
import type { Theme, ThemeRadius } from "./theme.types"

extend([a11yPlugin])
const RADIUS: Record<ThemeRadius, string> = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
}

function readableOn(bg: string) {
  const c = colord(bg)
  return c.contrast("#ffffff") >= c.contrast("#111111") ? "#ffffff" : "#111111"
}

function ensureContrast(color: string, against: string, min: number, dir: "lighten" | "darken") {
  let c = colord(color)
  for (let i = 0; i < 25 && c.contrast(against) < min; i++) {
    c = dir === "lighten" ? c.lighten(0.04) : c.darken(0.04)
  }
  return c.toHex()
}

export function generatePalette(theme: Theme) {
  const dark = theme.mode === "dark"
  const { h } = colord(theme.colors.primary).toHsl()
  const tone = (s: number, l: number) => colord({ h, s, l }).toHex()
const bg = dark ? tone(20, 8) : tone(45, 93)
const card = dark ? tone(18, 12) : tone(55, 97)
const fg = dark ? tone(20, 94) : tone(30, 15)
const mutedBg = dark ? tone(15, 16) : tone(40, 89)
const mutedFg = dark ? tone(10, 66) : tone(12, 38)
const border = dark ? tone(15, 22) : tone(35, 84)
const softAccent = dark ? tone(25, 18) : tone(40, 89)

const primary = ensureContrast(theme.colors.primary, bg, 3.5, dark ? "lighten" : "darken")
  const adjusted = primary.toLowerCase() !== colord(theme.colors.primary).toHex().toLowerCase()
  const brandAccent = colord(theme.colors.accent).toHex()

  const vars: Record<string, string> = {
    "--background": bg,
    "--foreground": fg,
    "--card": card,
    "--card-foreground": fg,
    "--popover": card,
    "--popover-foreground": fg,
    "--primary": primary,
    "--primary-foreground": readableOn(primary),
    "--secondary": mutedBg,
    "--secondary-foreground": fg,
    "--muted": mutedBg,
    "--muted-foreground": mutedFg,
    "--accent": softAccent,
    "--accent-foreground": fg,
    "--destructive": dark ? "#ef4444" : "#dc2626",
    "--border": border,
    "--input": border,
    "--ring": primary,
    "--radius": RADIUS[theme.radius],

    "--brand-accent": brandAccent,
    "--brand-accent-foreground": readableOn(brandAccent),

    "--chart-1": primary,
    "--chart-2": brandAccent,
    "--chart-3": colord(primary).rotate(40).toHex(),
    "--chart-4": colord(primary).rotate(-40).toHex(),
    "--chart-5": tone(10, 55),
    "--sidebar": card,
    "--sidebar-foreground": fg,
    "--sidebar-primary": primary,
    "--sidebar-primary-foreground": readableOn(primary),
    "--sidebar-accent": mutedBg,
    "--sidebar-accent-foreground": fg,
    "--sidebar-border": border,
    "--sidebar-ring": primary,
  }

  return { vars, adjusted }
}