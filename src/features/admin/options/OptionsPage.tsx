import { useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { useLang } from "@/hooks/useLang"
import { useAdminCategories } from "../categories/categories.api"
import { useAdminProducts } from "../products/products.api"
import { OptionsEditor } from "./OptionsEditor"
import { ProductPicker, SelectedProduct } from "./ProductPicker"
import { useProductOptions } from "./options.api"

export function OptionsPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const [params, setParams] = useSearchParams()
  const [picking, setPicking] = useState(false)
  const productsQuery = useAdminProducts()
  const categoriesQuery = useAdminCategories()

  const products = productsQuery.data ?? []
  const selected = products.find((product) => product.id === params.get("product"))
  const productId = selected?.id ?? ""
  const optionsQuery = useProductOptions(productId)
  const showPicker = !selected || picking

  const categoryName = (id: string) => {
    if (!categoriesQuery.data) return ""
    const category = categoriesQuery.data.find((c) => c.id === id)
    return category ? category.name[lang] || category.name.ar : t("products.noCategory")
  }

  function choose(id: string) {
    setParams({ product: id }, { replace: true })
    setPicking(false)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader title={t("options.title")} description={t("options.subtitle")} />

      {productsQuery.isPending ? (
        <div className="h-24 animate-pulse rounded-3xl bg-muted" />
      ) : productsQuery.isError ? (
        <EmptyState title={t("options.loadError")} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={SlidersHorizontal}
          title={t("options.noProducts")}
          action={<p className="text-sm text-muted-foreground">{t("options.noProductsHint")}</p>}
        />
      ) : (
        <>
          {showPicker ? (
            <>
              {!selected && <p className="text-sm text-muted-foreground">{t("options.pick")}</p>}
              <ProductPicker
                products={products}
                selectedId={productId}
                categoryName={categoryName}
                onSelect={choose}
              />
            </>
          ) : (
            <SelectedProduct
              product={selected}
              categoryName={categoryName(selected.categoryId)}
              onChange={() => setPicking(true)}
            />
          )}

          {selected && !picking &&
            (optionsQuery.isPending ? (
              <div className="h-48 animate-pulse rounded-3xl bg-muted" />
            ) : optionsQuery.isError ? (
              <EmptyState title={t("options.loadError")} />
            ) : (
              <OptionsEditor key={productId} productId={productId} initial={optionsQuery.data} />
            ))}
        </>
      )}
    </div>
  )
}