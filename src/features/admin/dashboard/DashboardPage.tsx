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
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { useAuth } from "@/features/auth"
import { useRestaurant } from "@/features/tenant"
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
}

function StatCard({ icon: Icon, label, value, to, locked }: StatProps) {
  const body = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-3xl border bg-card p-4 shadow-sm transition-colors",
        to && !locked && "group-hover:border-primary",
      )}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-muted text-primary">
        <Icon className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        {value === undefined ? (
          <div className="mt-1 h-7 w-12 animate-pulse rounded bg-muted" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
      {locked && <Lock className="size-4 text-muted-foreground" />}
    </div>
  )

  return to && !locked ? (
    <Link to={to} className="group block">
      {body}
    </Link>
  ) : (
    body
  )
}

function Card({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

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

  const actions = [
    { to: "/admin/categories", icon: Plus, label: t("dashboard.actions.addCategory"), locked: false },
    { to: "/admin/tables", icon: QrCode, label: t("dashboard.actions.tables"), locked: !tablesEnabled },
    { to: "/admin/tables/print", icon: Printer, label: t("dashboard.actions.printTables"), locked: !tablesEnabled },
    { to: "/admin/settings", icon: Settings, label: t("dashboard.actions.settings"), locked: false },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader
        title={t("dashboard.welcome", { name: userName ?? "" })}
        description={t("dashboard.subtitle", { restaurant: restaurant.name[lang] })}
      />

      <Card title={t("dashboard.subscription.title")}>
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
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon={Tags} label={t("dashboard.stats.categories")} value={data?.categories} to="/admin/categories" />
          <StatCard icon={Package} label={t("dashboard.stats.products")} value={data?.products} to="/admin/products" />
          <StatCard
            icon={QrCode}
            label={t("dashboard.stats.tables")}
            value={data?.tables}
            to="/admin/tables"
            locked={!tablesEnabled}
          />
          <StatCard icon={Receipt} label={t("dashboard.stats.ordersToday")} value={data?.ordersToday} />
        </div>
      )}

      {data && doneCount < steps.length && (
        <Card
          title={t("dashboard.setup.title")}
          aside={
            <span className="text-sm text-muted-foreground">
              {t("dashboard.setup.progress", { done: doneCount, total: steps.length })}
            </span>
          }
        >
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(doneCount / steps.length) * 100}%` }}
            />
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

      <Card title={t("dashboard.actions.title")}>
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
              <Link
                key={action.to}
                to={action.to}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <action.icon className="size-4" />
                {action.label}
              </Link>
            ),
          )}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ExternalLink className="size-4" />
            {t("dashboard.actions.viewSite")}
          </Link>
        </div>
      </Card>
    </div>
  )
}