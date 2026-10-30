import { useMemo, useState } from "react"
import { Check, Search, UtensilsCrossed } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLang } from "@/hooks/useLang"
import { cn } from "@/lib/utils"
import type { AdminProduct } from "../products/products.types"

function Thumb({ product }: { product: AdminProduct }) {
  return (
    <span className="size-11 shrink-0 overflow-hidden rounded-xl bg-muted">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt="" className="size-full object-cover" />
      ) : (
        <span className="grid size-full place-items-center text-muted-foreground">
          <UtensilsCrossed className="size-4" />
        </span>
      )}
    </span>
  )
}

type PickerProps = {
  products: AdminProduct[]
  selectedId: string
  categoryName: (categoryId: string) => string
  onSelect: (productId: string) => void
}

export function ProductPicker({ products, selectedId, categoryName, onSelect }: PickerProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const [search, setSearch] = useState("")

  const query = search.trim().toLowerCase()
  const items = useMemo(
    () => products.filter((product) => !query || `${product.name.ar} ${product.name.en}`.toLowerCase().includes(query)),
    [products, query],
  )

  return (
    <div className="space-y-3 rounded-3xl border bg-card p-3 shadow-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("options.search")}
          aria-label={t("options.search")}
          className="ps-9"
        />
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">{t("options.noMatch")}</p>
      ) : (
        <ul role="radiogroup" aria-label={t("options.product")} className="max-h-80 space-y-2 overflow-y-auto pe-1">
          {items.map((product) => {
            const selected = product.id === selectedId
            return (
              <li key={product.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSelect(product.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border p-2 text-start transition-colors",
                    selected ? "border-primary bg-muted" : "hover:bg-muted/60",
                  )}
                >
                  <Thumb product={product} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{product.name[lang] || product.name.ar}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {categoryName(product.categoryId)}
                    </span>
                  </span>
                  {selected && (
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-4" />
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

type SelectedProps = { product: AdminProduct; categoryName: string; onChange: () => void }

export function SelectedProduct({ product, categoryName, onChange }: SelectedProps) {
  const { t } = useTranslation()
  const lang = useLang()

  return (
    <div className="flex items-center gap-3 rounded-3xl border bg-card p-3 shadow-sm">
      <Thumb product={product} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{product.name[lang] || product.name.ar}</p>
        <p className="truncate text-xs text-muted-foreground">{categoryName}</p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onChange}>
        {t("options.change")}
      </Button>
    </div>
  )
}