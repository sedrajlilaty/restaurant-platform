import { Link } from "react-router"
import { ShoppingBag } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { usePrice } from "@/hooks/usePrice"
import { selectCartSubtotal, useCart } from "./cart.store"
import { CartItemRow } from "./components/CartItemRow"

export function CartPage() {
  const { t } = useTranslation()
  const price = usePrice()
  const items = useCart((s) => s.items)
  const subtotal = useCart(selectCartSubtotal)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={t("cart.empty")}
        action={
          <Button asChild className="rounded-full">
            <Link to="/">{t("cart.browse")}</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">{t("cart.title")}</h1>

      <div className="space-y-5 md:grid md:grid-cols-[1fr_22rem] md:items-start md:gap-6 md:space-y-0">
        <ul className="space-y-3">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onQty={(qty) => setQty(item.id, qty)}
              onRemove={() => remove(item.id)}
            />
          ))}
        </ul>

        <aside className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm md:sticky md:top-24">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("cart.subtotal")}</span>
            <span className="text-lg font-bold">{price(subtotal)}</span>
          </div>
          <p className="text-xs text-muted-foreground">{t("cart.feesNote")}</p>
          <Button asChild className="h-12 w-full rounded-full text-base">
            <Link to="/checkout">{t("cart.checkout")}</Link>
          </Button>
        </aside>
      </div>
    </div>
  )
}