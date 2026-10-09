import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import axios from "axios"
import { ArrowRight, Check, Star, UtensilsCrossed } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { QuantityStepper } from "@/components/shared/QuantityStepper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { buildLineId, useCart } from "@/features/cart"
import { useLocalized } from "@/hooks/useLocalized"
import { usePrice } from "@/hooks/usePrice"
import { OptionGroupField } from "../components/OptionGroupField"
import { useProduct } from "../menu.api"
import type { ProductDetail } from "../menu.types"
import {
  defaultSelection,
  selectedOptions,
  toggleChoice,
  validateSelection,
  type Selection,
  type SelectionErrors,
} from "../selection"

const NOTES_MAX = 200

function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-4 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
      <div className="aspect-[4/3] rounded-3xl bg-muted" />
      <div className="space-y-3">
        <div className="h-7 w-2/3 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-24 w-full rounded-2xl bg-muted" />
      </div>
    </div>
  )
}

function ProductView({ product }: { product: ProductDetail }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const price = usePrice()
  const navigate = useNavigate()
  const location = useLocation()
  const add = useCart((s) => s.add)

  const [selection, setSelection] = useState<Selection>(() => defaultSelection(product.optionGroups))
  const [errors, setErrors] = useState<SelectionErrors>({})
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState("")
  const [added, setAdded] = useState(false)

  const options = selectedOptions(product.optionGroups, selection)
  const unitPrice = product.price + options.reduce((sum, o) => sum + o.price, 0)
  const total = unitPrice * qty

  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/"))

  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => {
      if (location.key !== "default") navigate(-1)
      else navigate("/")
    }, 900)
    return () => window.clearTimeout(timer)
  }, [added, location.key, navigate])

  function handleToggle(groupId: string, choiceId: string) {
    const group = product.optionGroups.find((g) => g.id === groupId)
    if (!group) return
    setSelection((s) => ({ ...s, [groupId]: toggleChoice(group, s[groupId] ?? [], choiceId) }))
    setErrors((e) => {
      const next = { ...e }
      delete next[groupId]
      return next
    })
  }

  function handleAdd() {
    const found = validateSelection(product.optionGroups, selection)
    setErrors(found)
    const firstId = Object.keys(found)[0]
    if (firstId) {
      document.getElementById(`group-${firstId}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    const trimmed = notes.trim()
    add(
      {
        id: buildLineId(product.id, options.map((o) => o.choiceId), trimmed),
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        unitPrice,
        options,
        notes: trimmed || undefined,
      },
      qty,
    )
    setAdded(true)
  }

  return (
<div className="mx-auto max-w-5xl space-y-5 pb-28 md:pb-0">      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm shadow-sm"
      >
        <ArrowRight className="size-4 ltr:rotate-180" />
        {t("product.back")}
      </button>

      <div className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-muted md:sticky md:top-24 md:self-start">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="grid size-full place-items-center text-muted-foreground">
              <UtensilsCrossed className="size-12" />
            </span>
          )}
          {product.badge && (
            <span className="absolute start-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              {t(`menu.badges.${product.badge}`)}
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{l(product.name)}</h1>
            {product.rating && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-4 fill-brand-accent text-brand-accent" />
                <span className="font-medium text-foreground">{product.rating.value.toFixed(1)}</span>
                <span>({product.rating.count})</span>
              </p>
            )}
            <p className="text-muted-foreground">{l(product.description)}</p>
            <p className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">{price(product.price)}</span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">{price(product.oldPrice)}</span>
              )}
            </p>
          </div>

          {!product.available && (
            <p className="rounded-2xl bg-muted p-3 text-sm">{t("product.unavailable")}</p>
          )}

          {product.optionGroups.map((group) => (
            <OptionGroupField
              key={group.id}
              group={group}
              selected={selection[group.id] ?? []}
              error={errors[group.id]}
              onToggle={(choiceId) => handleToggle(group.id, choiceId)}
            />
          ))}

          <div className="space-y-2">
            <label htmlFor="notes" className="font-semibold">
              {t("product.notes")}
            </label>
            <Textarea
              id="notes"
              value={notes}
              maxLength={NOTES_MAX}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("product.notesPlaceholder")}
              className="rounded-2xl bg-card"
            />
            <p className="text-end text-xs text-muted-foreground" dir="ltr">
              {notes.length}/{NOTES_MAX}
            </p>
          </div>

          <div
            className="fixed inset-x-3 z-40 md:static md:inset-auto"
            style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <div className="mx-auto flex max-w-md items-center gap-3 rounded-3xl border bg-card p-3 shadow-lg md:max-w-none md:shadow-sm">
              <QuantityStepper value={qty} onChange={setQty} />
              <Button
                type="button"
                onClick={handleAdd}
                disabled={!product.available || added}
                className="h-12 flex-1 rounded-full text-base"
              >
                {added ? (
                  <>
                    <Check className="size-4" />
                    {t("product.added")}
                  </>
                ) : (
                  <>
                    {t("product.addToCart")} · {price(total)}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductPage() {
  const { id = "" } = useParams()
  const { t } = useTranslation()
  const query = useProduct(id)

  if (query.isPending) return <ProductSkeleton />

  if (query.isError) {
    const notFound = axios.isAxiosError(query.error) && query.error.response?.status === 404
    return <EmptyState title={notFound ? t("product.notFound") : t("menu.loadError")} />
  }

  return <ProductView key={query.data.id} product={query.data} />
}