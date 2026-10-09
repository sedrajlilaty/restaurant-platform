import { NavLink, Outlet } from "react-router"
import { LogOut } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { useAuth } from "@/features/auth/auth.store"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/features/tenant"
const LINKS = [
  { to: "/super/restaurants", label: "nav.restaurants" },
  { to: "/super/plans", label: "nav.plans" },
  { to: "/super/subscriptions", label: "nav.subscriptions" },
]

export function SuperAdminLayout() {
  const { t } = useTranslation()
  const logout = useAuth((s) => s.logout)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <span className="font-bold">{t("layout.superPanel")}</span>
          <div className="flex items-center gap-1">
            <div className="flex justify-end gap-1">
  <ModeToggle />
              <LanguageSwitcher className="text-inherit hover:bg-white/10 hover:text-inherit" />

</div>
            <Button variant="ghost" size="sm" className="gap-1 text-inherit hover:bg-white/10 hover:text-inherit" onClick={logout}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{t("common.logout")}</span>
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-md px-3 py-1.5 text-sm",
                  isActive ? "bg-[var(--sidebar-accent)]" : "opacity-80 hover:bg-[var(--sidebar-accent)]/60",
                )
              }
            >
              {t(link.label)}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}