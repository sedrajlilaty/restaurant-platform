import type { LocalizedText, OrderType, PaymentMethodKey } from "@/types"

export type OrderPayloadItem = {
  productId: string
  classifyId?: string
  quantity: number
  note?: string
  addons: { addonId: string; quantity: number }[]
}

export type OrderPayload = {
  orderType: OrderType
  tableToken?: string
  customerName: string
  customerPhone: string
  deliveryAddress?: string
  paymentMethod: PaymentMethodKey
  note?: string
  items: OrderPayloadItem[]
}

export type PlacedOrderItem = {
  productName: LocalizedText
  classifyName: LocalizedText | null
  quantity: number
  unitPrice: number
  lineTotal: number
  note: string | null
  addons: { name: LocalizedText; quantity: number; unitPrice: number }[]
}

export type PlacedOrder = {
  id: string
  orderNumber: string
  orderType: OrderType
  customerName: string
  customerPhone: string
  deliveryAddress: string | null
  tableNumber: string | null
  paymentMethod: PaymentMethodKey
  note: string | null
  currency: string
  subtotal: number
  discountAmount: number
  deliveryFee: number
  total: number
  items: PlacedOrderItem[]
  createdAt: string
}