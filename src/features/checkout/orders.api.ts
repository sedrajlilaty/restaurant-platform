import type { CartItem } from "@/features/cart"
import { api } from "@/lib/api"
import { CLASSIFY_GROUP_ID } from "@/lib/constants"
import type { CheckoutValues } from "./checkout.schema"
import type { OrderPayload, PlacedOrder } from "./checkout.types"

export function buildOrderPayload(values: CheckoutValues, items: CartItem[], tableToken?: string): OrderPayload {
  return {
    orderType: values.orderType,
    tableToken: values.orderType === "dine_in" ? tableToken : undefined,
    customerName: values.customerName,
    customerPhone: values.customerPhone,
    deliveryAddress: values.orderType === "delivery" ? values.deliveryAddress : undefined,
    paymentMethod: values.paymentMethod,
    note: values.note || undefined,
    items: items.map((item) => ({
      productId: item.productId,
      classifyId: item.options.find((o) => o.groupId === CLASSIFY_GROUP_ID)?.choiceId,
      quantity: item.qty,
      note: item.notes,
      addons: item.options
        .filter((o) => o.groupId !== CLASSIFY_GROUP_ID)
        .map((o) => ({ addonId: o.choiceId, quantity: 1 })),
    })),
  }
}

export async function createOrder(payload: OrderPayload) {
  const { data } = await api.post<PlacedOrder>("/public/orders", payload)
  return data
}

export async function fetchTable(token: string) {
  const { data } = await api.get<{ tableNumber: string }>(`/public/tables/${token}`)
  return data
}