import type { LocalizedText } from "@/types"

export type AdminBanner = {
  id: string
  title: LocalizedText
  subtitle: LocalizedText | null
  ctaLabel: LocalizedText | null
  ctaLink: string | null
  imageUrl: string | null
  isActive: boolean
  sortOrder: number
}

export type BannerInput = {
  title: LocalizedText
  subtitle: LocalizedText | null
  ctaLabel: LocalizedText | null
  ctaLink: string | null
  imageUrl: string | null
  isActive: boolean
}