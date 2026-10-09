import type { Theme } from "@/features/theme/theme.types"

// أسماء مؤقتة، منثبتها مع الباك إند لما نحدد الباقات
export type FeatureKey =
  | "analytics"
  | "coupons"
  | "banners"
  | "tables_qr"
  | "delivery_zones"
  | "import_export"
  | "snapshots"
  | "custom_domain"

export type Subscription = {
  status: "active" | "expired"
  endsAt: string // ISO date
}

export type RestaurantTenant = {
  kind: "restaurant"
  id: string
  name: { ar: string; en: string }
  defaultLang: "ar" | "en"
  currency: string
  theme: Theme
  features: FeatureKey[]
  subscription: Subscription
}

// دومين المنصة نفسها (لوحة السوبر أدمن)
export type PlatformTenant = { kind: "platform" }

export type TenantConfig = RestaurantTenant | PlatformTenant