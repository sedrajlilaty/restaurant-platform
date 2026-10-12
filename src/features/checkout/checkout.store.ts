import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import type { PlacedOrder } from "./checkout.types"

type TableContext = { token: string; number: string }

type CheckoutState = {
  table: TableContext | null
  lastOrder: PlacedOrder | null
  setTable: (table: TableContext) => void
  setLastOrder: (order: PlacedOrder) => void
}

export const useCheckout = create<CheckoutState>()(
  persist(
    (set) => ({
      table: null,
      lastOrder: null,
      setTable: (table) => set({ table }),
      setLastOrder: (lastOrder) => set({ lastOrder }),
    }),
    { name: "checkout", storage: createJSONStorage(() => sessionStorage) },
  ),
)