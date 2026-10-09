import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ThemeMode } from "./theme.types"

type ModeState = {
  override: ThemeMode | null
  setOverride: (mode: ThemeMode | null) => void
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      override: null,
      setOverride: (override) => set({ override }),
    }),
    { name: "color-mode" },
  ),
)