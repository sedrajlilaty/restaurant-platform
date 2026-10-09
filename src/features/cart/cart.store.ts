import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { LocalizedText } from "@/types"

export type CartOption = {
  groupId: string
  choiceId: string
  groupName: LocalizedText
  name: LocalizedText
  price: number
}

export type CartItem = {
  id: string // المنتج + الخيارات + الملاحظة
  productId: string
  name: LocalizedText
  imageUrl: string | null
  unitPrice: number // السعر شامل الإضافات
  qty: number
  options: CartOption[]
  notes?: string
}

export function buildLineId(productId: string, choiceIds: string[], notes = "") {
  return [productId, [...choiceIds].sort().join(","), notes.trim().toLowerCase()].join("|")
}

type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, "qty">, qty?: number) => void
  setQty: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id)
          if (existing) {
            return { items: s.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)) }
          }
          return { items: [...s.items, { ...item, qty }] }
        }),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "cart",
      version: 2,
      partialize: (s) => ({ items: s.items }),
      migrate: () => ({ items: [] }),
    },
  ),
)

export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0)