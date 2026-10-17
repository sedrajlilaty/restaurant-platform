import type { LocalizedText } from "@/types"

export type AdminCategory = {
  id: string
  name: LocalizedText
  imageUrl: string | null
  isActive: boolean
  sortOrder: number
}

export type CategoryInput = {
  name: LocalizedText
  imageUrl: string | null
  isActive: boolean
}