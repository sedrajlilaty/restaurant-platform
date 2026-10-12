import { api } from "@/lib/api"
import { getTenantHost } from "@/lib/tenantHost"
import type { TenantConfig } from "./tenant.types"

export async function fetchTenant(): Promise<TenantConfig> {
  const { data } = await api.get<TenantConfig>("/public/restaurant", {
    params: { host: getTenantHost() },
  })
  return data
}