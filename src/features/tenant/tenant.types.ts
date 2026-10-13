import type { Theme } from "@/features/theme"
import type { LocalizedText, OrderType, PaymentMethodKey } from "@/types"

// أسماء مؤقتة لحد ما تنحسم الباقات مع الباك إند
export type FeatureKey =
  | "analytics"
  | "coupons"
  | "banners"
  | "tables_qr"
  | "delivery_zones"
  | "import_export"
  | "snapshots"
  | "custom_domain"
  | "custom_theme" // Plan_Subscription.allow_custom_theme

export type Subscription = {
  status: "active" | "expired"
  endsAt: string // ISO date
}

export type RestaurantTenant = {
  kind: "restaurant"
  id: string
  name: LocalizedText
  defaultLang: "ar" | "en"
  currency: string // ISO 4217، مثل "USD"
  logoUrl: string | null // Settings.logo_url
  coverUrl: string | null // Settings.cover_url
  theme: Theme
  features: FeatureKey[]
  subscription: Subscription
}

// دومين المنصة نفسها (لوحة السوبر أدمن)
export type PlatformTenant = { kind: "platform" }

export type TenantConfig = RestaurantTenant | PlatformTenant

// إعدادات المطعم العامة (معلومات التواصل، أنواع الطلب المفعّلة، طرق الدفع)
export type StoreSettings = {
  description: LocalizedText | null
  phoneNumber: string | null
  whatsappNumber: string | null
  address: LocalizedText | null
  workingHours: { dayOfWeek: number; openTime: string; closeTime: string }[]
  socialLinks: { platform: string; url: string }[]
  orderTypes: { type: OrderType; enabled: boolean }[]
  paymentMethods: { method: PaymentMethodKey; enabled: boolean; paymentLink: string | null }[]
}