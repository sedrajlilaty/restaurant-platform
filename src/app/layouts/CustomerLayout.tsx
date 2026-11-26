import { Link, NavLink, Outlet, useLocation } from "react-router"
import { House, Info, Search, ShoppingBag } from "lucide-react"
import { useTranslation } from "react-i18next"
import { BottomNav, type BottomNavItem } from "@/components/shared/BottomNav"
import { CountBadge } from "@/components/shared/CountBadge"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { RestaurantLogo } from "@/components/shared/RestaurantLogo"
import { SubscriptionGate } from "@/app/guards/SubscriptionGate"
import { selectCartCount, selectCartSubtotal, useCart } from "@/features/cart/cart.store"
import { useRestaurant } from "@/features/tenant/useTenant"
import { useDirection } from "@/hooks/useDirection"
import { usePrice } from "@/hooks/usePrice"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/features/tenant"
import { PAGE_CONTAINER } from "@/lib/layout"

const LINKS = [
  { to: "/", label: "nav.home", end: true },
  { to: "/search", label: "nav.search", end: false },
  { to: "/about", label: "nav.about", end: false },
]

export function CustomerLayout() {
  const { t } = useTranslation()
  const restaurant = useRestaurant()
  const { lang } = useDirection()
  const price = usePrice()
  const count = useCart(selectCartCount)
  const subtotal = useCart(selectCartSubtotal)
  const name = restaurant.name[lang]
  const { pathname } = useLocation()
  const hideNav = pathname.startsWith("/product/")
  const bottomItems: BottomNavItem[] = [
    { key: "home", to: "/", end: true, icon: House, label: t("nav.home") },
    { key: "search", to: "/search", icon: Search, label: t("nav.search") },
    { key: "cart", to: "/cart", icon: ShoppingBag, label: t("nav.cart"), raised: true, badge: count },
    { key: "about", to: "/about", icon: Info, label: t("nav.about") },
  ]

  return (
    <SubscriptionGate>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-30 pt-3">
          <div className={PAGE_CONTAINER}>
            <div className="flex items-center justify-between gap-3 rounded-3xl border bg-card/95 px-4 py-2.5 shadow-sm backdrop-blur">
              <Link to="/" className="flex min-w-0 items-center gap-3">
                <RestaurantLogo name={name} logoUrl={restaurant.logoUrl} />
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

              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ModeToggle />
                <Link
                  to="/cart"
                  aria-label={t("nav.cart")}
                  className="group hidden h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 active:scale-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:flex"
                >
                  <span className="relative">
                    <ShoppingBag className="size-5 transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none" />
                    <CountBadge count={count} />
                  </span>
                  <span>{t("nav.cart")}</span>
                  {count > 0 && (
                    <span className="hidden border-s border-primary-foreground/30 ps-2 font-bold lg:inline">
                      {price(subtotal)}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className={cn(PAGE_CONTAINER, "pb-32 pt-5 md:pb-12")}>
          <Outlet />
        </main>
      </div>
      {!hideNav && <BottomNav items={bottomItems} />}
    </SubscriptionGate>
  )
}