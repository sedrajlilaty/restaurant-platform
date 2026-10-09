import type { LocalizedText } from "@/types"

export type Banner = {
  id: string
  title: LocalizedText
  subtitle: LocalizedText | null
  ctaLabel: LocalizedText | null
  ctaLink: string | null
  imageUrl: string | null
}

export type Category = {
  id: string
  name: LocalizedText
  imageUrl: string | null
}

export type ProductBadge = "bestseller" | "chefs_pick" | "popular" | "new" | "hot"

export type Product = {
  id: string
  categoryId: string
  name: LocalizedText
  description: LocalizedText
  price: number
  oldPrice: number | null
  imageUrl: string | null
  badge: ProductBadge | null
  rating: { value: number; count: number } | null
  available: boolean
  hasOptions: boolean // أحجام أو إضافات، يحتاج صفحة المنتج
}

export type ProductsQuery = {
  categoryId?: string
  featured?: boolean
  q?: string
  page?: number
  limit?: number
}
export type OptionChoice = {
  id: string
  name: LocalizedText
  price: number // الزيادة على سعر المنتج
  isDefault: boolean
}

export type OptionGroup = {
  id: string
  name: LocalizedText
  type: "single" | "multiple"
  required: boolean
  min: number
  max: number | null
  choices: OptionChoice[]
}

export type ProductDetail = Product & { optionGroups: OptionGroup[] }
export type ProductsPage = { items: Product[]; total: number }