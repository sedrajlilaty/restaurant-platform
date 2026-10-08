import { Link, NavLink, Outlet } from "react-router"
import { House, Info, Search, ShoppingBag } from "lucide-react"
import { useTranslation } from "react-i18next"
import { BottomNav, type BottomNavItem } from "@/components/shared/BottomNav"
import { CountBadge } from "@/components/shared/CountBadge"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { RestaurantLogo } from "@/components/shared/RestaurantLogo"
import { SubscriptionGate } from "@/app/guards/SubscriptionGate"
import { selectCartCount, useCart } from "@/features/cart/cart.store"
import { useRestaurant } from "@/features/tenant/useTenant"
import { useDirection } from "@/hooks/useDirection"
import { cn } from "@/lib/utils"

const LINKS = [
  { to: "/", label: "nav.home", end: true },
  { to: "/search", label: "nav.search", end: false },
  { to: "/about", label: "nav.about", end: false },
]

export function CustomerLayout() {
  const { t } = useTranslation()
  const restaurant = useRestaurant()
  const { lang } = useDirection()
  const count = useCart(selectCartCount)
  const name = restaurant.name[lang]

  const bottomItems: BottomNavItem[] = [
    { key: "home", to: "/", end: true, icon: House, label: t("nav.home") },
    { key: "search", to: "/search", icon: Search, label: t("nav.search") },
    { key: "cart", to: "/cart", icon: ShoppingBag, label: t("nav.cart"), raised: true, badge: count },
    { key: "about", to: "/about", icon: Info, label: t("nav.about") },
  ]

  return (
    <SubscriptionGate>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-30 px-3 pt-3">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-3xl border bg-card/95 px-4 py-2.5 shadow-sm backdrop-blur">
            <Link to="/" className="flex min-w-0 items-center gap-3">
              <RestaurantLogo name={name} logoUrl={restaurant.theme.logoUrl} />
              <span className="truncate text-lg font-bold">{name}</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  {t(link.label)}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <Link
                to="/cart"
                aria-label={t("nav.cart")}
                className="relative hidden size-10 place-items-center rounded-full bg-primary text-primary-foreground md:grid"
              >
                <ShoppingBag className="size-5" />
                <CountBadge count={count} />
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-32 pt-5 md:pb-12">
          <Outlet />
        </main>
      </div>
      <BottomNav items={bottomItems} />
    </SubscriptionGate>
  )
}