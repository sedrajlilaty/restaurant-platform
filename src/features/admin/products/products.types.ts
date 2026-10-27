import type { LocalizedText, Money } from "@/types"

export type AdminProduct = {
  id: string
  categoryId: string
  name: LocalizedText
  description: LocalizedText
  price: Money
  oldPrice: Money | null
  imageUrl: string | null
  isAvailable: boolean
}

export type ProductInput = Omit<AdminProduct, "id">