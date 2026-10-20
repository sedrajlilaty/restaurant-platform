import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDirection } from "@/hooks/useDirection"
import { HoursSection } from "./sections/HoursSection"
import { InfoSection } from "./sections/InfoSection"
import { OrderTypesSection } from "./sections/OrderTypesSection"
import { PaymentSection } from "./sections/PaymentSection"
import { SocialSection } from "./sections/SocialSection"
import { useAdminSettings } from "./settings.api"

const TABS = ["info", "orderTypes", "payment", "hours", "social"] as const

export function SettingsPage() {
  const { t } = useTranslation()
  const { dir } = useDirection()
  const query = useAdminSettings()

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title={t("settings.title")} description={t("settings.subtitle")} />

      {query.isPending ? (
        <div className="space-y-3">
          <div className="h-12 animate-pulse rounded-3xl bg-muted" />
          <div className="h-64 animate-pulse rounded-3xl bg-muted" />
        </div>
      ) : query.isError ? (
        <EmptyState title={t("settings.saveError")} />
      ) : (
        <Tabs defaultValue="info" dir={dir} className="space-y-4">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-3xl p-1">
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="rounded-full px-4 py-2">
                {t(`settings.tabs.${tab}`)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* الـ key بيعيد تهيئة النموذج بعد كل حفظ ناجح */}
          <TabsContent value="info">
            <InfoSection key={query.dataUpdatedAt} initial={query.data.info} />
          </TabsContent>
          <TabsContent value="orderTypes">
            <OrderTypesSection key={query.dataUpdatedAt} initial={query.data.orderTypes} />
          </TabsContent>
          <TabsContent value="payment">
            <PaymentSection key={query.dataUpdatedAt} initial={query.data.paymentMethods} />
          </TabsContent>
          <TabsContent value="hours">
            <HoursSection key={query.dataUpdatedAt} initial={query.data.workingHours} />
          </TabsContent>
          <TabsContent value="social">
            <SocialSection key={query.dataUpdatedAt} initial={query.data.socialLinks} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}