import { createContext, useContext } from "react"
import type { RestaurantTenant, TenantConfig } from "./tenant.types"

export const TenantContext = createContext<TenantConfig | null>(null)

export function useTenant(): TenantConfig {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error("useTenant must be used inside TenantProvider")
  return ctx
}

export function useRestaurant(): RestaurantTenant {
  const tenant = useTenant()
  if (tenant.kind !== "restaurant") throw new Error("This page needs a restaurant domain")
  return tenant
}