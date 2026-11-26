import { useMemo, useState } from "react"
import { Package, Pencil, Plus, Search, Tags, Trash2, UtensilsCrossed } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Reveal } from "@/components/shared/Reveal"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useLang } from "@/hooks/useLang"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useAdminCategories } from "../categories/categories.api"
import { ProductForm } from "./ProductForm"
import { useAdminProducts, useDeleteProduct, useUpdateProduct } from "./products.api"
import type { AdminProduct } from "./products.types"

const GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3"

type CardProps = { product: AdminProduct; categoryName: string; onEdit: () => void; onDelete: () => void }

function ProductCard({ product, categoryName, onEdit, onDelete }: CardProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const update = useUpdateProduct()

  const primary = product.name[lang] || product.name.ar
  const secondary = lang === "ar" ? product.name.en : product.name.ar

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        !product.isAvailable && "opacity-80",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span className="grid size-full place-items-center text-muted-foreground">
            <UtensilsCrossed className="size-8" />
          </span>
        )}

        <span className="absolute start-3 top-3 max-w-[70%] truncate rounded-full bg-card/90 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
          {categoryName}
        </span>

        <div className="absolute end-3 top-3 flex gap-1.5">
          <Button
            variant="secondary"
            size="icon"
            onClick={onEdit}
            aria-label={t("common.edit")}
            className="rounded-full bg-card/90 shadow-sm backdrop-blur hover:bg-card"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onDelete}
            aria-label={t("common.delete")}
            className="rounded-full bg-card/90 text-destructive shadow-sm backdrop-blur hover:bg-destructive hover:text-white"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0 space-y-0.5">
          <h3 className="truncate font-semibold">{primary}</h3>
          <p className="truncate text-xs text-muted-foreground">{secondary}</p>
        </div>

        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <span className="text-lg font-bold text-primary">{formatPrice(product.price.usd, "USD", lang)}</span>
          <span className="text-sm text-muted-foreground">{formatPrice(product.price.syp, "SYP", lang)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice.usd, "USD", lang)}
            </span>
          )}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <span
            className={cn(
              "flex items-center gap-2 text-sm",
              product.isAvailable ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", product.isAvailable ? "bg-primary" : "bg-muted-foreground/40")}
            />
            {product.isAvailable ? t("products.available") : t("products.unavailable")}
          </span>
          <Switch
            aria-label={t("products.form.available")}
            checked={product.isAvailable}
            disabled={update.isPending}
            onCheckedChange={(checked) =>
              update.mutate(
                { id: product.id, isAvailable: checked },
                { onError: () => toast.error(t("products.errors.generic")) },
              )
            }
          />
        </div>
      </div>
    </article>
  )
}

type DeleteProps = { product: AdminProduct; pending: boolean; onCancel: () => void; onConfirm: () => void }

function DeleteProductDialog({ product, pending, onCancel, onConfirm }: DeleteProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const name = product.name[lang] || product.name.ar

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("products.delete.title")}</DialogTitle>
          <DialogDescription>{t("products.delete.desc", { name })}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button type="button" variant="destructive" disabled={pending} onClick={onConfirm}>
            {t("products.delete.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ProductsPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const productsQuery = useAdminProducts()
  const categoriesQuery = useAdminCategories()
  const remove = useDeleteProduct()
  const [dialog, setDialog] = useState<{ product?: AdminProduct } | null>(null)
  const [toDelete, setToDelete] = useState<AdminProduct | null>(null)
  const [categoryId, setCategoryId] = useState("all")
  const [search, setSearch] = useState("")

  const categories = useMemo(
    () => [...(categoriesQuery.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [categoriesQuery.data],
  )
  const query = search.trim().toLowerCase()
  const items = useMemo(
    () =>
      (productsQuery.data ?? []).filter(
        (product) =>
          (categoryId === "all" || product.categoryId === categoryId) &&
          (!query || `${product.name.ar} ${product.name.en}`.toLowerCase().includes(query)),
      ),
    [productsQuery.data, categoryId, query],
  )

  const categoryName = (id: string) => {
    const category = categories.find((c) => c.id === id)
    return category ? category.name[lang] || category.name.ar : t("products.noCategory")
  }

  const pending = productsQuery.isPending || categoriesQuery.isPending
  const failed = productsQuery.isError || categoriesQuery.isError
  const total = productsQuery.data?.length ?? 0
  const chips = [
    { id: "all", label: t("products.all") },
    ...categories.map((category) => ({ id: category.id, label: category.name[lang] || category.name.ar })),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("products.title")}
        description={t("products.subtitle")}
        actions={
          <Button className="gap-2" disabled={categories.length === 0} onClick={() => setDialog({})}>
            <Plus className="size-4" />
            {t("products.add")}
          </Button>
        }
      />

      {pending ? (
        <div className={GRID}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : failed ? (
        <EmptyState title={t("products.errors.generic")} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Tags}
          title={t("products.noCategories")}
          action={<p className="text-sm text-muted-foreground">{t("products.noCategoriesHint")}</p>}
        />
      ) : (
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("products.search")}
              aria-label={t("products.search")}
              className="h-11 rounded-full bg-card ps-11 shadow-sm"
            />
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none]">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                aria-pressed={categoryId === chip.id}
                onClick={() => setCategoryId(chip.id)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 motion-reduce:transition-none",
                  categoryId === chip.id
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md motion-reduce:hover:translate-y-0",
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={Package}
              title={total === 0 ? t("products.empty") : t("products.noResults")}
              action={
                <p className="text-sm text-muted-foreground">
                  {total === 0 ? t("products.emptyHint") : t("products.noResultsHint")}
                </p>
              }
            />
          ) : (
            <ul key={`${categoryId}|${query}`} className={GRID}>
              {items.map((product, i) => (
                <li key={product.id}>
                  <Reveal index={Math.min(i, 8)} step={60} className="h-full">
                    <ProductCard
                      product={product}
                      categoryName={categoryName(product.categoryId)}
                      onEdit={() => setDialog({ product })}
                      onDelete={() => setToDelete(product)}
                    />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {dialog && (
        <ProductForm
          key={dialog.product?.id ?? "new"}
          product={dialog.product}
          categories={categories}
          defaultCategoryId={categoryId !== "all" ? categoryId : undefined}
          onClose={() => setDialog(null)}
        />
      )}

      {toDelete && (
        <DeleteProductDialog
          product={toDelete}
          pending={remove.isPending}
          onCancel={() => setToDelete(null)}
          onConfirm={() =>
            remove.mutate(toDelete.id, {
              onSuccess: () => {
                toast.success(t("products.toast.deleted"))
                setToDelete(null)
              },
              onError: () => toast.error(t("products.errors.generic")),
            })
          }
        />
      )}
    </div>
  )
}