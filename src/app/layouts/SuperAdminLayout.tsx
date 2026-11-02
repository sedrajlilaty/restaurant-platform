import { NavLink, Outlet, useLocation } from "react-router"
import { CreditCard, Layers, LogOut, ShieldCheck, Store, type LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { BottomNav, type BottomNavItem } from "@/components/shared/BottomNav"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/features/auth/auth.store"
import { ModeToggle } from "@/features/tenant"
import { REVEAL, stagger } from "@/lib/motion"
import { cn } from "@/lib/utils"

type NavItem = { to: string; label: string; icon: LucideIcon }
type NavGroup = { label: string; items: NavItem[] }

const GROUPS: NavGroup[] = [
  {
    label: "superNav.platform",
    items: [{ to: "/super/restaurants", label: "nav.restaurants", icon: Store }],
  },
  {
    label: "superNav.billing",
    items: [
      { to: "/super/plans", label: "nav.plans", icon: Layers },
      { to: "/super/subscriptions", label: "nav.subscriptions", icon: CreditCard },
    ],
  },
]

function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
        <ShieldCheck className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-bold leading-tight">{t("layout.superPanel")}</p>
        {!compact && <p className="truncate text-xs opacity-60">{t("superNav.tagline")}</p>}
      </div>
    </div>
  )
}

function SidebarContent() {
  const { t } = useTranslation()
  const user = useAuth((s) => s.user)
  const initial = user?.name.trim().charAt(0).toUpperCase() || "?"

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Brand />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {GROUPS.map((group, groupIndex) => {
          const offset = GROUPS.slice(0, groupIndex).reduce((sum, g) => sum + g.items.length, 0)
          return (
            <div key={group.label}>
              <p className="px-3 pb-1 pt-4 text-xs font-medium opacity-60">{t(group.label)}</p>
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    style={stagger(offset + itemIndex)}
                    className={({ isActive }) =>
                      cn(
                        REVEAL,
                        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-sm"
                          : "hover:bg-[var(--sidebar-accent)]",
                      )
                    }
                  >
                    <item.icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="flex-1">{t(item.label)}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="m-3 flex items-center gap-3 rounded-2xl bg-[var(--sidebar-accent)] p-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--sidebar-primary)] text-sm font-bold text-[var(--sidebar-primary-foreground)]">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="truncate text-xs opacity-60">{t("superNav.role")}</p>
        </div>
      </div>
    </div>
  )
}

export function SuperAdminLayout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const logout = useAuth((s) => s.logout)
  const name = useAuth((s) => s.user?.name)

  const bottomItems: BottomNavItem[] = GROUPS.flatMap((group) => group.items).map((item) => ({
    key: item.to,
    to: item.to,
    icon: item.icon,
    label: t(item.label),
  }))

  return (
    <>
      <div className="min-h-screen bg-background text-foreground md:flex md:gap-4 md:p-4">
        <aside className="hidden w-64 shrink-0 animate-in rounded-3xl border border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-sm duration-500 fade-in zoom-in-95 motion-reduce:animate-none md:sticky md:top-4 md:block md:h-[calc(100vh-2rem)]">
          <SidebarContent />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="sticky top-0 z-20 mx-3 mt-3 flex items-center justify-between gap-2 rounded-3xl border bg-card px-4 py-2.5 shadow-sm md:static md:mx-0 md:mt-0">
            <div className="min-w-0">
              <div className="md:hidden">
                <Brand compact />
              </div>
              <p className="hidden truncate font-medium md:block">{t("superNav.hello", { name: name ?? "" })}</p>
            </div>
            <div className="flex items-center gap-1">
              <ModeToggle />
              <LanguageSwitcher />
              <Button variant="ghost" size="sm" className="gap-1" onClick={logout}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">{t("common.logout")}</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 pb-32 md:px-0 md:pb-6">
            {/* key بيعيد تشغيل الدخول التدريجي لما تتبدّل الصفحة */}
            <div
              key={pathname}
              className="mx-auto w-full max-w-6xl animate-in duration-300 fade-in motion-reduce:animate-none"
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <BottomNav items={bottomItems} />
    </>
  )
}