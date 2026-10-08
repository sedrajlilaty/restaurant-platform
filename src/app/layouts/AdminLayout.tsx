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
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { BottomNav, type BottomNavItem } from "@/components/shared/BottomNav"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { RestaurantLogo } from "@/components/shared/RestaurantLogo"
import { SubscriptionBanner } from "@/components/shared/SubscriptionBanner"
import { SubscriptionGate } from "@/app/guards/SubscriptionGate"
import { useAuth } from "@/features/auth/auth.store"
import type { FeatureKey } from "@/features/tenant/tenant.types"
import { useRestaurant } from "@/features/tenant/useTenant"
import { useDirection } from "@/hooks/useDirection"
import { cn } from "@/lib/utils"

type NavItem = { to: string; label: string; icon: LucideIcon; feature?: FeatureKey; end?: boolean }
type NavGroup = { label?: string; items: NavItem[] }

const GROUPS: NavGroup[] = [
  { items: [{ to: "/admin", label: "nav.home", icon: House, end: true }] },
  {
    label: "navGroups.menu",
    items: [
      { to: "/admin/categories", label: "nav.categories", icon: Tags },
      { to: "/admin/products", label: "nav.products", icon: Package },
      { to: "/admin/options", label: "nav.options", icon: SlidersHorizontal },
    ],
  },
  {
    label: "navGroups.marketing",
    items: [
      { to: "/admin/coupons", label: "nav.coupons", icon: Ticket, feature: "coupons" },
      { to: "/admin/banners", label: "nav.banners", icon: ImageIcon, feature: "banners" },
    ],
  },
  {
    label: "navGroups.operations",
    items: [
      { to: "/admin/tables", label: "nav.tables", icon: QrCode, feature: "tables_qr" },
      { to: "/admin/delivery-zones", label: "nav.deliveryZones", icon: MapPin, feature: "delivery_zones" },
      { to: "/admin/analytics", label: "nav.analytics", icon: BarChart3, feature: "analytics" },
    ],
  },
  {
    label: "navGroups.store",
    items: [
      { to: "/admin/appearance", label: "nav.appearance", icon: Palette },
      { to: "/admin/settings", label: "nav.settings", icon: Settings },
      { to: "/admin/import-export", label: "nav.importExport", icon: FileSpreadsheet, feature: "import_export" },
      { to: "/admin/snapshots", label: "nav.snapshots", icon: History, feature: "snapshots" },
      { to: "/admin/account", label: "nav.account", icon: User },
    ],
  },
]

function SidebarContent({
  name,
  logoUrl,
  features,
  onNavigate,
}: {
  name: string
  logoUrl: string | null
  features: FeatureKey[]
  onNavigate?: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <RestaurantLogo name={name} logoUrl={logoUrl} />
        <span className="truncate text-lg font-bold">{name}</span>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {GROUPS.map((group, index) => (
          <div key={index}>
            {group.label && <p className="px-3 pb-1 pt-4 text-xs font-medium opacity-60">{t(group.label)}</p>}
            <div className="space-y-1">
              {group.items.map((item) => {
                const locked = item.feature !== undefined && !features.includes(item.feature)
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-sm"
                          : "hover:bg-[var(--sidebar-accent)]",
                      )
                    }
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className="flex-1">{t(item.label)}</span>
                    {locked && <Lock className="size-3.5 opacity-60" />}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
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
  const logoUrl = restaurant.theme.logoUrl
  const daysLeft = differenceInCalendarDays(new Date(restaurant.subscription.endsAt), new Date())

  const bottomItems: BottomNavItem[] = [
    { key: "home", to: "/admin", end: true, icon: House, label: t("nav.home") },
    { key: "categories", to: "/admin/categories", icon: Tags, label: t("nav.categories") },
    { key: "products", to: "/admin/products", icon: Package, label: t("nav.products") },
    { key: "more", icon: Menu, label: t("nav.more"), onClick: () => setOpen(true) },
  ]

  return (
    <SubscriptionGate>
      <div className="min-h-screen bg-background text-foreground md:flex md:gap-4 md:p-4">
        <aside className="hidden w-64 shrink-0 rounded-3xl border border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-sm md:sticky md:top-4 md:block md:h-[calc(100vh-2rem)]">
          <SidebarContent name={name} logoUrl={logoUrl} features={restaurant.features} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="sticky top-0 z-20 mx-3 mt-3 flex items-center justify-between gap-2 rounded-3xl border bg-card px-4 py-2.5 shadow-sm md:static md:mx-0 md:mt-0">
            <div className="flex min-w-0 items-center gap-3 md:invisible">
              <RestaurantLogo name={name} logoUrl={logoUrl} className="md:hidden" />
              <span className="truncate font-bold md:hidden">{name}</span>
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

          <main className="flex-1 px-4 pb-32 md:px-0 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      <BottomNav items={bottomItems} />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={dir === "rtl" ? "right" : "left"}
          className="w-72 bg-[var(--sidebar)] p-0 text-[var(--sidebar-foreground)]"
        >
          <SheetTitle className="sr-only">{name}</SheetTitle>
          <SidebarContent name={name} logoUrl={logoUrl} features={restaurant.features} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </SubscriptionGate>
  )
}