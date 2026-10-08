import { useState } from "react"
import { NavLink, Outlet } from "react-router"
import { useTranslation } from "react-i18next"
import { differenceInCalendarDays } from "date-fns"
import {
  BarChart3,
  FileSpreadsheet,
  History,
  House,
  Image as ImageIcon,
  Lock,
  LogOut,
  MapPin,
  Menu,
  Package,
  Palette,
  QrCode,
  Settings,
  SlidersHorizontal,
  Tags,
  Ticket,
  User,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { SubscriptionBanner } from "@/components/shared/SubscriptionBanner"
import { SubscriptionGate } from "@/app/guards/SubscriptionGate"
import { useAuth } from "@/features/auth/auth.store"
import type { FeatureKey } from "@/features/tenant/tenant.types"
import { useRestaurant } from "@/features/tenant/useTenant"
import { useDirection } from "@/hooks/useDirection"
import { cn } from "@/lib/utils"

type NavItem = { to: string; label: string; icon: LucideIcon; feature?: FeatureKey; end?: boolean }

const NAV: NavItem[] = [
  { to: "/admin", label: "nav.home", icon: House, end: true },
  { to: "/admin/categories", label: "nav.categories", icon: Tags },
  { to: "/admin/products", label: "nav.products", icon: Package },
  { to: "/admin/options", label: "nav.options", icon: SlidersHorizontal },
  { to: "/admin/coupons", label: "nav.coupons", icon: Ticket, feature: "coupons" },
  { to: "/admin/banners", label: "nav.banners", icon: ImageIcon, feature: "banners" },
  { to: "/admin/tables", label: "nav.tables", icon: QrCode, feature: "tables_qr" },
  { to: "/admin/delivery-zones", label: "nav.deliveryZones", icon: MapPin, feature: "delivery_zones" },
  { to: "/admin/analytics", label: "nav.analytics", icon: BarChart3, feature: "analytics" },
  { to: "/admin/appearance", label: "nav.appearance", icon: Palette },
  { to: "/admin/settings", label: "nav.settings", icon: Settings },
  { to: "/admin/import-export", label: "nav.importExport", icon: FileSpreadsheet, feature: "import_export" },
  { to: "/admin/snapshots", label: "nav.snapshots", icon: History, feature: "snapshots" },
  { to: "/admin/account", label: "nav.account", icon: User },
]

function SidebarContent({
  name,
  features,
  onNavigate,
}: {
  name: string
  features: FeatureKey[]
  onNavigate?: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-5 text-lg font-bold">{name}</div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {NAV.map((item) => {
          const locked = item.feature !== undefined && !features.includes(item.feature)
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                    : "text-[var(--sidebar-foreground)]/80 hover:bg-[var(--sidebar-accent)]/60",
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{t(item.label)}</span>
              {locked && <Lock className="size-3.5 opacity-60" />}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

export function AdminLayout() {
  const { t } = useTranslation()
  const restaurant = useRestaurant()
  const { lang, dir } = useDirection()
  const logout = useAuth((s) => s.logout)
  const [open, setOpen] = useState(false)

  const name = restaurant.name[lang]
  const daysLeft = differenceInCalendarDays(new Date(restaurant.subscription.endsAt), new Date())

  return (
    <SubscriptionGate>
      <div className="min-h-screen bg-background text-foreground md:flex">
        <aside className="hidden w-64 shrink-0 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] md:sticky md:top-0 md:block md:h-screen">
          <SidebarContent name={name} features={restaurant.features} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b bg-card px-4 py-3">
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="menu">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={dir === "rtl" ? "right" : "left"}
                  className="w-64 bg-[var(--sidebar)] p-0 text-[var(--sidebar-foreground)]"
                >
                  <SheetTitle className="sr-only">{name}</SheetTitle>
                  <SidebarContent name={name} features={restaurant.features} onNavigate={() => setOpen(false)} />
                </SheetContent>
              </Sheet>
              <span className="font-semibold md:hidden">{name}</span>
            </div>
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <Button variant="ghost" size="sm" className="gap-1" onClick={logout}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">{t("common.logout")}</span>
              </Button>
            </div>
          </header>

          {daysLeft <= 7 && <SubscriptionBanner daysLeft={daysLeft} />}

          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SubscriptionGate>
  )
}