import type { LocalizedText, Money } from "@/types"

export type AdminOptionChoice = {
  id: string
  name: LocalizedText
  price: Money // زيادة على سعر المنتج
  isDefault: boolean
}

export type AdminOptionGroup = {
  id: string
  name: LocalizedText
  type: "single" | "multiple"
  required: boolean
  min: number
  max: number | null
  choices: AdminOptionChoice[]
}

// الأحجام (Product_Classify) قائمة وحدة لكل منتج، والإضافات (Addon_Group) مجموعات
export type ProductOptions = {
  sizes: AdminOptionChoice[]
  groups: AdminOptionGroup[]
}