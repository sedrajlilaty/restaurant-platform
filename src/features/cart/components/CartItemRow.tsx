import { Trash2, UtensilsCrossed } from "lucide-react"
import { useTranslation } from "react-i18next"
import { QuantityStepper } from "@/components/shared/QuantityStepper"
import { useLocalized } from "@/hooks/useLocalized"
import { usePrice } from "@/hooks/usePrice"
import type { CartItem } from "../cart.store"

type Props = { item: CartItem; onQty: (qty: number) => void; onRemove: () => void }

export function CartItemRow({ item, onQty, onRemove }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const price = usePrice()
  const optionsText = item.options.map((o) => l(o.name)).join(" · ")

  return (
    <li className="flex gap-3 rounded-3xl border bg-card p-3 shadow-sm">
      <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="grid size-full place-items-center text-muted-foreground">
            <UtensilsCrossed className="size-6" />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{l(item.name)}</h3>
          <button
            type="button"
            onClick={onRemove}
            aria-label={t("cart.remove")}
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        {optionsText && <p className="text-xs text-muted-foreground">{optionsText}</p>}
        {item.notes && (
          <p className="text-xs text-muted-foreground">
            {t("cart.note")}: {item.notes}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <QuantityStepper value={item.qty} onChange={onQty} />
          <span className="font-bold text-primary">{price(item.unitPrice * item.qty)}</span>
        </div>
      </div>
    </li>
  )
}