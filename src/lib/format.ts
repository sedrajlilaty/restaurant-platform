import type { Lang } from "@/lib/i18n"

export function formatPrice(value: number, currency: string, lang: Lang) {
  const locale = lang === "ar" ? "ar-u-nu-latn" : "en"
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "SYP" ? 0 : 2,
    }).format(value)
  } catch {
    return `${value} ${currency}`
  }
}