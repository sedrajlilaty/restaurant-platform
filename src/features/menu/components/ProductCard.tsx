import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router"
import { Check, Plus, Star, UtensilsCrossed } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useCart } from "@/features/cart/cart.store"
import { useLocalized } from "@/hooks/useLocalized"
import { usePrice } from "@/hooks/usePrice"
import { cn } from "@/lib/utils"
import type { Product } from "../menu.types"

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const price = usePrice()
  const navigate = useNavigate()
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const id = window.setTimeout(() => setAdded(false), 1200)
    return () => window.clearTimeout(id)
  }, [added])

  function handleAdd() {
    if (product.hasOptions) {
      navigate(`/product/${product.id}`)
      return
    }
    add({ id: product.id, productId: product.id, name: product.name, unitPrice: product.price })
    setAdded(true)
  }

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border bg-card shadow-sm",
        !product.available && "opacity-70",
      )}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] bg-muted">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="" loading="lazy" className="size-full object-cover" />
          ) : (
            <span className="grid size-full place-items-center text-muted-foreground">
              <UtensilsCrossed className="size-8" />
            </span>
          )}
          {product.badge && (
            <span className="absolute start-2 top-2 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
              {t(`menu.badges.${product.badge}`)}
            </span>
          )}
          {!product.available && (
            <span className="absolute inset-x-0 bottom-0 bg-foreground/70 py-1 text-center text-xs font-medium text-background">
              {t("menu.unavailable")}
            </span>
          )}
        </div>
        <div className="space-y-1 px-3 pt-3">
          <h3 className="line-clamp-1 font-semibold">{l(product.name)}</h3>
          <p className="line-clamp-2 min-h-8 text-xs text-muted-foreground">{l(product.description)}</p>
          {product.rating && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-brand-accent text-brand-accent" />
              <span className="font-medium text-foreground">{product.rating.value.toFixed(1)}</span>
              <span>({product.rating.count})</span>
            </p>
          )}
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-2 px-3 pb-3 pt-2">
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-primary">{price(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{price(product.oldPrice)}</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.available}
          aria-label={t("menu.addToCart")}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-90 disabled:opacity-40"
        >
          {added ? <Check className="size-4" /> : <Plus className="size-4" />}
        </button>
      </div>
    </article>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border bg-card">
      <div className="aspect-[4/3] bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-8 w-1/2 rounded bg-muted" />
      </div>
    </div>
  )
}