import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: string // معرّف السطر: المنتج + الخيارات المختارة
  productId: string
  name: { ar: string; en: string }
  unitPrice: number
  qty: number
  notes?: string
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
    { name: "cart" },
  ),
)

export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.qty, 0)