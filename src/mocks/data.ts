import { DEFAULT_THEME, PRESETS } from "@/features/theme/presets"
import type { FeatureKey, TenantConfig } from "@/features/tenant/tenant.types"

const features: FeatureKey[] = ["analytics", "coupons", "banners", "tables_qr", "delivery_zones"]
const endsAt = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()

export const tenants: Record<string, TenantConfig> = {
  localhost: {
    kind: "restaurant",
    id: "r1",
    name: { ar: "مطعم تجريبي", en: "Demo Restaurant" },
    defaultLang: "ar",
    theme: DEFAULT_THEME,
    features,
    subscription: { status: "active", endsAt },
  },
  "cafe.localhost": {
    kind: "restaurant",
    id: "r2",
    name: { ar: "كافيه الصباح", en: "Morning Café" },
    defaultLang: "en",
    theme: {
      ...DEFAULT_THEME,
      preset: "cafe",
      colors: PRESETS.find((p) => p.key === "cafe")?.colors ?? DEFAULT_THEME.colors,
    },
    features: ["coupons", "banners"],
    subscription: { status: "active", endsAt },
  },
  "platform.localhost": { kind: "platform" },
}