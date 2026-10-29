import { SlidersHorizontal } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Label } from "@/components/ui/label"
import { useLang } from "@/hooks/useLang"
import { useAdminProducts } from "../products/products.api"
import { OptionsEditor } from "./OptionsEditor"
import { useProductOptions } from "./options.api"

const SELECT =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

export function OptionsPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const [params, setParams] = useSearchParams()
  const productsQuery = useAdminProducts()

  const products = productsQuery.data ?? []
  const requested = params.get("product") ?? ""
  const productId = products.some((product) => product.id === requested) ? requested : ""
  const optionsQuery = useProductOptions(productId)

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
          <div className="space-y-1.5">
            <Label htmlFor="optionsProduct">{t("options.product")}</Label>
            <select
              id="optionsProduct"
              className={SELECT}
              value={productId}
              onChange={(e) => setParams(e.target.value ? { product: e.target.value } : {}, { replace: true })}
            >
              <option value="">{t("options.chooseProduct")}</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name[lang] || product.name.ar}
                </option>
              ))}
            </select>
          </div>

          {productId === "" ? (
            <EmptyState icon={SlidersHorizontal} title={t("options.pick")} />
          ) : optionsQuery.isPending ? (
            <div className="h-48 animate-pulse rounded-3xl bg-muted" />
          ) : optionsQuery.isError ? (
            <EmptyState title={t("options.loadError")} />
          ) : (
            <OptionsEditor key={productId} productId={productId} initial={optionsQuery.data} />
          )}
        </>
      )}
    </div>
  )
}