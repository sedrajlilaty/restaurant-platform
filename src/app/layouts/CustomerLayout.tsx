import { Link, Outlet } from "react-router"
import { ShoppingCart } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher"
import { SubscriptionGate } from "@/app/guards/SubscriptionGate"
import { useRestaurant } from "@/features/tenant/useTenant"

export function CustomerLayout() {
  const { t, i18n } = useTranslation()
  const restaurant = useRestaurant()
  const lang = i18n.language === "en" ? "en" : "ar"

  return (
    <SubscriptionGate>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
            <Link to="/" className="flex min-w-0 items-center gap-2 font-bold">
              {restaurant.theme.logoUrl && (
                <img src={restaurant.theme.logoUrl} alt="" className="size-8 rounded-md object-cover" />
              )}
              <span className="truncate">{restaurant.name[lang]}</span>
            </Link>
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <Button asChild variant="outline" size="icon">
                <Link to="/cart" aria-label={t("nav.cart")}>
                  <ShoppingCart className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </SubscriptionGate>
  )
}