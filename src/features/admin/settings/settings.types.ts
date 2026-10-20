import type { LocalizedText, OrderType, PaymentMethodKey } from "@/types"

export type SettingsInfo = {
  description: LocalizedText
  address: LocalizedText
  phoneNumber: string
  whatsappNumber: string
  defaultLang: "ar" | "en"
  logoUrl: string | null
  coverUrl: string | null
}

export type OrderTypeSetting = { type: OrderType; enabled: boolean }
export type PaymentMethodSetting = { method: PaymentMethodKey; enabled: boolean; paymentLink: string | null }
export type WorkingHourSlot = { dayOfWeek: number; openTime: string; closeTime: string }

export type SocialPlatform = "facebook" | "instagram" | "tiktok" | "telegram" | "whatsapp_channel"
export type SocialLinkSetting = { platform: SocialPlatform; url: string }

export type AdminSettings = {
  info: SettingsInfo
  orderTypes: OrderTypeSetting[]
  paymentMethods: PaymentMethodSetting[]
  workingHours: WorkingHourSlot[]
  socialLinks: SocialLinkSetting[]
}

export type SettingsSection = "info" | "order-types" | "payment-methods" | "working-hours" | "social-links"