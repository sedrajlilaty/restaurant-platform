import type { FeatureKey, TenantConfig } from "@/features/tenant"
import { DEFAULT_THEME, PRESETS } from "@/features/theme"
import type { StoreSettings } from "@/features/tenant/tenant.types"
const features: FeatureKey[] = [
  "analytics",
  "coupons",
  "banners",
  "tables_qr",
  "delivery_zones",
  "theme_custom_colors",
  "theme_radius",
  "theme_fonts",
  "theme_dark_mode",
  "theme_cover",
]
const endsAt = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()

export const tenants: Record<string, TenantConfig> = {
  localhost: {
    kind: "restaurant",
    id: "r1",
    name: { ar: "مطعم تجريبي", en: "Demo Restaurant" },
    defaultLang: "ar",
    currency: "USD",
    theme: DEFAULT_THEME,
    features,
    subscription: { status: "active", endsAt },
  },
  "cafe.localhost": {
    kind: "restaurant",
    id: "r2",
    name: { ar: "كافيه الصباح", en: "Morning Café" },
    defaultLang: "en",
    currency: "USD",
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
export const storeSettings: StoreSettings = {
  description: { ar: "مطعم تجريبي", en: "A demo restaurant" },
  phoneNumber: "0911111111",
  whatsappNumber: "0911111111",
  address: { ar: "دمشق", en: "Damascus" },
  workingHours: [],
  socialLinks: [],
  orderTypes: [
    { type: "dine_in", enabled: true },
    { type: "takeaway", enabled: true },
    { type: "delivery", enabled: true },
  ],
  paymentMethods: [
    { method: "cash", enabled: true, paymentLink: null },
    { method: "shamcash", enabled: true, paymentLink: "https://example.com/pay" },
  ],
}

// رموز طاولات تجريبية: /t/table-1 ... /t/table-5
export const tables: Record<string, string> = {
  "table-1": "1",
  "table-2": "2",
  "table-3": "3",
  "table-4": "4",
  "table-5": "5",
}