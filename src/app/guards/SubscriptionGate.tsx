import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { useTenant } from "@/features/tenant/useTenant"

export function SubscriptionGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const tenant = useTenant()

  if (tenant.kind === "restaurant") {
    const { status, endsAt } = tenant.subscription
    const expired = status === "expired" || new Date(endsAt).getTime() < Date.now()

    if (expired) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-background p-6 text-center text-foreground">
          <h1 className="text-xl font-bold">{t("subscription.expiredTitle")}</h1>
          <p className="max-w-sm text-muted-foreground">{t("subscription.expiredBody")}</p>
        </div>
      )
    }
  }

  return <>{children}</>
}