import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Role = "owner" | "staff" | "superadmin"
export type AuthUser = { id: string; name: string; role: Role }

type AuthState = {
  token: string | null
  user: AuthUser | null
  setSession: (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "auth" },
  ),
)