import { api } from "@/lib/api"
import type { TenantConfig } from "./tenant.types"

export function getTenantHost() {
  return (import.meta.env.VITE_TENANT_HOST as string | undefined) || window.location.hostname
}

export async function fetchTenant(): Promise<TenantConfig> {
  const { data } = await api.get<TenantConfig>("/public/restaurant", {
    params: { host: getTenantHost() },
  })
  return data
}