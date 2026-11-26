import { useLayoutEffect, useRef, useState } from "react"
import { Tabs } from "radix-ui"
import { Clock, Share2, Store, Truck, Wallet, type LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Reveal } from "@/components/shared/Reveal"
import { useDirection } from "@/hooks/useDirection"
import { HoursSection } from "./sections/HoursSection"
import { InfoSection } from "./sections/InfoSection"
import { OrderTypesSection } from "./sections/OrderTypesSection"
import { PaymentSection } from "./sections/PaymentSection"
import { SocialSection } from "./sections/SocialSection"
import { useAdminSettings } from "./settings.api"

type TabKey = "info" | "orderTypes" | "payment" | "hours" | "social"

const TABS: { key: TabKey; icon: LucideIcon }[] = [
  { key: "info", icon: Store },
  { key: "orderTypes", icon: Truck },
  { key: "payment", icon: Wallet },
  { key: "hours", icon: Clock },
  { key: "social", icon: Share2 },
]

type SettingsData = NonNullable<ReturnType<typeof useAdminSettings>["data"]>

const CONTENT =
  "outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-3 data-[state=active]:duration-300 motion-reduce:animate-none"

function SettingsTabs({ data, version }: { data: SettingsData; version: number }) {
  const { t } = useTranslation()
  const { dir } = useDirection()
  const [tab, setTab] = useState<TabKey>("info")

  const listRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const placed = useRef(false)

  useLayoutEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    if (!list || !indicator) return

    let cancelled = false

    const place = () => {
      const active = list.querySelector<HTMLElement>('[data-state="active"]')
      if (!active) return

      const first = !placed.current
      if (first) indicator.style.transition = "none"

      indicator.style.width = `${active.offsetWidth}px`
      indicator.style.height = `${active.offsetHeight}px`
      indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`
      indicator.style.opacity = "1"

      if (first) {
        void indicator.offsetWidth
        indicator.style.transition = ""
        placed.current = true
      }
    }

    place()

    const observer = new ResizeObserver(place)
    observer.observe(list)
    void document.fonts?.ready.then(() => {
      if (!cancelled) place()
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [tab])

  return (
    <Tabs.Root value={tab} onValueChange={(value) => setTab(value as TabKey)} dir={dir} className="flex flex-col gap-5">
      <Reveal index={1}>
        <Tabs.List
          ref={listRef}
          className="relative flex gap-1 overflow-x-auto rounded-full border bg-card p-1.5 shadow-sm [scrollbar-width:none]"
        >
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-primary opacity-0 shadow-sm transition-[transform,width,height] duration-300 ease-out motion-reduce:transition-none"
          />
          {TABS.map(({ key, icon: Icon }) => (
            <Tabs.Trigger
              key={key}
              value={key}
              className="group relative z-10 flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-[state=active]:bg-transparent data-[state=active]:text-primary-foreground"
            >
              <Icon className="size-4 shrink-0 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none" />
              {t(`settings.tabs.${key}`)}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Reveal>

      {/* الـ key بيعيد تهيئة النموذج بعد كل حفظ ناجح */}
      <Tabs.Content value="info" className={CONTENT}>
        <InfoSection key={version} initial={data.info} />
      </Tabs.Content>
      <Tabs.Content value="orderTypes" className={CONTENT}>
        <OrderTypesSection key={version} initial={data.orderTypes} />
      </Tabs.Content>
      <Tabs.Content value="payment" className={CONTENT}>
        <PaymentSection key={version} initial={data.paymentMethods} />
      </Tabs.Content>
      <Tabs.Content value="hours" className={CONTENT}>
        <HoursSection key={version} initial={data.workingHours} />
      </Tabs.Content>
      <Tabs.Content value="social" className={CONTENT}>
        <SocialSection key={version} initial={data.socialLinks} />
      </Tabs.Content>
    </Tabs.Root>
  )
}

export function SettingsPage() {
  const { t } = useTranslation()
  const query = useAdminSettings()

  return (
    <div className="space-y-6">
      <Reveal>
        <PageHeader title={t("settings.title")} description={t("settings.subtitle")} />
      </Reveal>

      {query.isPending ? (
        <div className="space-y-4">
          <div className="h-14 animate-pulse rounded-full bg-muted" />
          <div className="h-64 animate-pulse rounded-3xl bg-muted" />
        </div>
      ) : query.isError ? (
        <EmptyState title={t("settings.saveError")} />
      ) : (
        <SettingsTabs data={query.data} version={query.dataUpdatedAt} />
      )}
    </div>
  )
}