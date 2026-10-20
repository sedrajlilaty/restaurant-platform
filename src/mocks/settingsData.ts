import type { AdminSettings } from "@/features/admin"
import { persistentValue } from "./db"

export const settingsDb = persistentValue<AdminSettings>("settings", () => ({
  info: {
    description: { ar: "مطعم تجريبي", en: "A demo restaurant" },
    address: { ar: "دمشق", en: "Damascus" },
    phoneNumber: "0911111111",
    whatsappNumber: "0911111111",
    defaultLang: "ar",
    logoUrl: null,
    coverUrl: null,
  },
  orderTypes: [
    { type: "dine_in", enabled: true },
    { type: "takeaway", enabled: true },
    { type: "delivery", enabled: true },
  ],
  paymentMethods: [
    { method: "cash", enabled: true, paymentLink: null },
    { method: "shamcash", enabled: true, paymentLink: "https://example.com/pay" },
  ],
  workingHours: [
    ...[0, 1, 2, 3, 4, 6].map((dayOfWeek) => ({ dayOfWeek, openTime: "10:00", closeTime: "23:00" })),
    { dayOfWeek: 5, openTime: "14:00", closeTime: "02:00" },
  ],
  socialLinks: [
    { platform: "instagram", url: "https://instagram.com/demo" },
    { platform: "facebook", url: "https://facebook.com/demo" },
  ],
}))