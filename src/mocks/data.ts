import type { FeatureKey, TenantConfig } from "@/features/tenant"
import { SAMPLE_THEMES, type Theme } from "@/features/theme"
import type { StoreSettings } from "@/features/tenant"
import { settingsDb } from "./settingsData"
const features: FeatureKey[] = [
  "analytics",
  "coupons",
  "banners",
  "tables_qr",
  "delivery_zones",
  "custom_theme",
]
const endsAt = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
const subscription = { status: "active", endsAt } as const

// قالب أنشأه المطعم بنفسو
const customTheme: Theme = {
  id: "custom-r3",
  name: { ar: "ثيم المطعم", en: "Restaurant theme" },
  mode: "light",
  colors: { primary: "#1E3A5F", accent: "#C8482A" },
  fontAr: "cairo",
  fontEn: "poppins",
  previewImageUrl: null,
  isCustom: true,
}

export const tenants: Record<string, TenantConfig> = {
  // مطعم بالقالب الافتراضي وأغلب الميزات
  localhost: {
    kind: "restaurant",
    id: "r1",
    name: { ar: "مطعم تجريبي", en: "Demo Restaurant" },
    defaultLang: "ar",
    currency: "USD",
    logoUrl: null,
    coverUrl: null,
    theme: SAMPLE_THEMES[0],
    features,
    subscription,
  },
  // باقة صغيرة، قالب كافيه، لغة إنكليزية
  "cafe.localhost": {
    kind: "restaurant",
    id: "r2",
    name: { ar: "كافيه الصباح", en: "Morning Café" },
    defaultLang: "en",
    currency: "USD",
    logoUrl: null,
    coverUrl: null,
    theme: SAMPLE_THEMES[1],
    features: ["coupons", "banners"],
    subscription,
  },
  // باقتو فيها قالب خاص ومستخدمو
  "custom.localhost": {
    kind: "restaurant",
    id: "r3",
    name: { ar: "البيت الأزرق", en: "Blue House" },
    defaultLang: "ar",
    currency: "USD",
    logoUrl: null,
    coverUrl: null,
    theme: customTheme,
    features: ["custom_theme"],
    subscription,
  },
  // نفس القالب الخاص بس الباقة نزلت: لازم يرجع للثيم الافتراضي
  "downgraded.localhost": {
    kind: "restaurant",
    id: "r4",
    name: { ar: "مطعم نزلت باقتو", en: "Downgraded Plan" },
    defaultLang: "ar",
    currency: "USD",
    logoUrl: null,
    coverUrl: null,
    theme: customTheme,
    features: [],
    subscription,
  },
  "platform.localhost": { kind: "platform" },
}

export const storeSettings: StoreSettings = {
  description: { ar: "مطعم تجريبي", en: "A demo restaurant" },
  phoneNumber: "0911111111",
  whatsappNumber: "0911111111",
  address: { ar: "دمشق", en: "Damascus" },
    workingHours: [
    ...[0, 1, 2, 3, 4, 6].map((dayOfWeek) => ({ dayOfWeek, openTime: "10:00", closeTime: "23:00" })),
    { dayOfWeek: 5, openTime: "14:00", closeTime: "02:00" }, // الجمعة: بيسكّر بعد منتصف الليل
  ],
  socialLinks: [
    { platform: "instagram", url: "https://instagram.com/demo" },
    { platform: "facebook", url: "https://facebook.com/demo" },
  ],
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