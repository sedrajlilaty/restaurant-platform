import { api } from "@/lib/api"
import type { AuthUser } from "./auth.store"

export type LoginPayload = { email: string; password: string }
export type LoginResponse = { token: string; user: AuthUser }

export async function login(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>("/auth/login", payload)
  return data
}