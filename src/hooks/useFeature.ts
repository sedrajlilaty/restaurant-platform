import { useTenant } from "@/features/tenant/useTenant"
import type { FeatureKey } from "@/features/tenant/tenant.types"

export function useFeature(name: FeatureKey): boolean {
  const tenant = useTenant()
  return tenant.kind === "restaurant" && tenant.features.includes(name)
}