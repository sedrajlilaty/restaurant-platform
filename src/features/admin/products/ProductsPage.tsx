import { useMemo, useState } from "react"
import { Package, Pencil, Plus, Search, Tags, Trash2, UtensilsCrossed } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
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

type RowProps = { product: AdminProduct; categoryName: string; onEdit: () => void; onDelete: () => void }

function ProductRow({ product, categoryName, onEdit, onDelete }: RowProps) {
  const { t } = useTranslation()
  const lang = useLang()
  const update = useUpdateProduct()

  const primary = product.name[lang] || product.name.ar
  const secondary = lang === "ar" ? product.name.en : product.name.ar

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-3xl border bg-card p-3 shadow-sm",
        !product.isAvailable && "opacity-70",
      )}
    >
      <div className="size-14 shrink-0 overflow-hidden rounded-2xl bg-muted">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="grid size-full place-items-center text-muted-foreground">
            <UtensilsCrossed className="size-5" />
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="truncate font-semibold">{primary}</p>
        <p className="truncate text-xs text-muted-foreground">
          {secondary} · {categoryName}
        </p>
        <p className="flex flex-wrap items-center gap-x-2 text-sm">
          <span className="font-medium text-primary">{formatPrice(product.price.usd, "USD", lang)}</span>
          <span className="text-muted-foreground">{formatPrice(product.price.syp, "SYP", lang)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice.usd, "USD", lang)}
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
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
        <span className="hidden w-20 text-xs text-muted-foreground sm:inline">
          {product.isAvailable ? t("products.available") : t("products.unavailable")}
        </span>
      </div>

      <div className="flex">
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label={t("common.edit")}>
          <Pencil className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label={t("common.delete")} className="text-destructive">
          <Trash2 className="size-4" />
        </Button>
      </div>
    </li>
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
    <div className="mx-auto max-w-3xl space-y-5">
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
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[88px] animate-pulse rounded-3xl bg-muted" />
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
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("products.search")}
              aria-label={t("products.search")}
              className="ps-9"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                aria-pressed={categoryId === chip.id}
                onClick={() => setCategoryId(chip.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors",
                  categoryId === chip.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70",
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
            <ul className="space-y-2">
              {items.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  categoryName={categoryName(product.categoryId)}
                  onEdit={() => setDialog({ product })}
                  onDelete={() => setToDelete(product)}
                />
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