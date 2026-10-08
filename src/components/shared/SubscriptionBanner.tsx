import { useTranslation } from "react-i18next"

export function SubscriptionBanner({ daysLeft }: { daysLeft: number }) {
  const { t } = useTranslation()

  return (
<div role="status" className="mx-3 rounded-2xl bg-brand-accent px-4 py-2 text-center text-sm text-brand-accent-foreground md:mx-0">      {daysLeft <= 0 ? t("subscription.endsToday") : t("subscription.endingSoon", { count: daysLeft })}
    </div>
  )
}