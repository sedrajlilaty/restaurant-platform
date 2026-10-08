import type { ReactNode } from "react"
import { FeatureLocked } from "@/components/shared/FeatureLocked"
import { useFeature } from "@/hooks/useFeature"
import type { FeatureKey } from "@/features/tenant/tenant.types"

export function RequireFeature({ feature, children }: { feature: FeatureKey; children: ReactNode }) {
  const enabled = useFeature(feature)
  return enabled ? <>{children}</> : <FeatureLocked />
}