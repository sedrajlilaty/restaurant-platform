import type { ReactNode } from "react"
import { Link } from "react-router"
import { differenceInCalendarDays } from "date-fns"
import {
  CalendarClock,
  Circle,
  CircleCheck,
  ExternalLink,
  Lock,
  Package,
  Plus,
  Printer,
  QrCode,
  Receipt,
  Settings,
  Tags,
  type LucideIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { AnimatedNumber } from "@/components/shared/AnimatedNumber"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Reveal } from "@/components/shared/Reveal"
import { useAuth } from "@/features/auth"
import { useRestaurant } from "@/features/tenant"
import { useCountUp } from "@/hooks/useCountUp"
import { useFeature } from "@/hooks/useFeature"
import { useLang } from "@/hooks/useLang"
import { cn } from "@/lib/utils"
import { useDashboard } from "./dashboard.api"

type StatProps = {
  icon: LucideIcon
  label: string
  value?: number
  to?: string
  locked?: boolean
  index: number
}

function StatCard({ icon: Icon, label, value, to, locked, index }: StatProps) {
  const interactive = Boolean(to) && !locked

  const body = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-3xl border bg-card p-4 shadow-sm transition-all duration-300 motion-reduce:transition-none",
        interactive &&
          "group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-lg motion-reduce:group-hover:translate-y-0",
      )}
    >
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-2xl bg-muted text-primary transition-transform duration-300 motion-reduce:transition-none",
          interactive && "group-hover:-rotate-6 group-hover:scale-110 motion-reduce:group-hover:transform-none",
        )}
      >
        <Icon className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        {value === undefined ? (
          <div className="mt-1 h-7 w-12 animate-pulse rounded bg-muted" />
        ) : (
          <p className="text-2xl font-bold">
            <AnimatedNumber value={value} />
          </p>
        )}
      </div>
      {locked && <Lock className="size-4 text-muted-foreground" />}
    </div>
  )

  return (
    <Reveal index={index}>
      {interactive ? (
        <Link to={to!} className="group block">
          {body}
        </Link>
      ) : (
        body
      )}
    </Reveal>
  )
}

function Card({
  title,
  aside,
  index,
  children,
}: {
  title: string
  aside?: ReactNode
  index: number
  children: ReactNode
}) {
  return (
    <Reveal index={index}>
      <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold">{title}</h2>
          {aside}
        </div>
        {children}
      </section>
    </Reveal>
  )
}

const ACTION =
  "inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-muted hover:shadow-sm active:scale-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0"

export function DashboardPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const restaurant = useRestaurant()
  const userName = useAuth((s) => s.user?.name)
  const tablesEnabled = useFeature("tables_qr")
  const query = useDashboard()

  const { endsAt, status } = restaurant.subscription
  const daysLeft = differenceInCalendarDays(new Date(endsAt), new Date())
  const expired = status === "expired" || daysLeft < 0
  const endDate = new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(new Date(endsAt))
  const data = query.data

  const steps = data
    ? [
        { key: "categories", done: data.categories > 0, to: "/admin/categories" },
        { key: "products", done: data.products > 0, to: "/admin/products" },
        ...(tablesEnabled ? [{ key: "tables", done: data.tables > 0, to: "/admin/tables" }] : []),
      ]
    : []
  const doneCount = steps.filter((step) => step.done).length
  const progress = useCountUp(steps.length > 0 ? (doneCount / steps.length) * 100 : 0, 1100)

  const actions = [
    { to: "/admin/categories", icon: Plus, label: t("dashboard.actions.addCategory"), locked: false },
    { to: "/admin/tables", icon: QrCode, label: t("dashboard.actions.tables"), locked: !tablesEnabled },
    { to: "/admin/tables/print", icon: Printer, label: t("dashboard.actions.printTables"), locked: !tablesEnabled },
    { to: "/admin/settings", icon: Settings, label: t("dashboard.actions.settings"), locked: false },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Reveal>
        <PageHeader
          title={t("dashboard.welcome", { name: userName ?? "" })}
          description={t("dashboard.subtitle", { restaurant: restaurant.name[lang] })}
        />
      </Reveal>

      <Card title={t("dashboard.subscription.title")} index={1}>
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-2xl",
              expired || daysLeft <= 7 ? "bg-destructive/10 text-destructive" : "bg-muted text-primary",
            )}
          >
            <CalendarClock className="size-6" />
          </span>
          <div>
            <p className={cn("font-semibold", (expired || daysLeft <= 7) && "text-destructive")}>
              {expired
                ? t("dashboard.subscription.expired")
                : daysLeft === 0
                  ? t("dashboard.subscription.endsToday")
                  : t("dashboard.subscription.daysLeft", { count: daysLeft })}
            </p>
            <p className="text-sm text-muted-foreground">{t("dashboard.subscription.until", { date: endDate })}</p>
            {(expired || daysLeft <= 7) && (
              <p className="text-sm text-muted-foreground">{t("dashboard.subscription.renewHint")}</p>
            )}
          </div>
        </div>
      </Card>

      {query.isError ? (
        <EmptyState title={t("dashboard.error")} />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            index={2}
            icon={Tags}
            label={t("dashboard.stats.categories")}
            value={data?.categories}
            to="/admin/categories"
          />
          <StatCard
            index={3}
            icon={Package}
            label={t("dashboard.stats.products")}
            value={data?.products}
            to="/admin/products"
          />
          <StatCard
            index={4}
            icon={QrCode}
            label={t("dashboard.stats.tables")}
            value={data?.tables}
            to="/admin/tables"
            locked={!tablesEnabled}
          />
          <StatCard index={5} icon={Receipt} label={t("dashboard.stats.ordersToday")} value={data?.ordersToday} />
        </div>
      )}

      {data && doneCount < steps.length && (
        <Card
          index={6}
          title={t("dashboard.setup.title")}
          aside={
            <span className="text-sm text-muted-foreground">
              {t("dashboard.setup.progress", { done: doneCount, total: steps.length })}
            </span>
          }
        >
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
          <ul className="space-y-1">
            {steps.map((step) => (
              <li key={step.key}>
                <Link
                  to={step.to}
                  className="flex items-center gap-3 rounded-2xl px-2 py-2 text-sm transition-colors hover:bg-muted"
                >
                  {step.done ? (
                    <CircleCheck className="size-5 text-primary" />
                  ) : (
                    <Circle className="size-5 text-muted-foreground" />
                  )}
                  <span className={cn(step.done && "text-muted-foreground line-through")}>
                    {t(`dashboard.setup.${step.key}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title={t("dashboard.actions.title")} index={7}>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) =>
            action.locked ? (
              <span
                key={action.to}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground opacity-60"
              >
                <Lock className="size-4" />
                {action.label}
              </span>
            ) : (
              <Link key={action.to} to={action.to} className={ACTION}>
                <action.icon className="size-4" />
                {action.label}
              </Link>
            ),
          )}
          <Link to="/" target="_blank" rel="noopener noreferrer" className={ACTION}>
            <ExternalLink className="size-4" />
            {t("dashboard.actions.viewSite")}
          </Link>
        </div>
      </Card>
    </div>
  )
}