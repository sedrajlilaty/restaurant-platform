import { Link, useNavigate, useParams } from "react-router"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { useLocalized } from "@/hooks/useLocalized"
import { CategoryTabs } from "../components/CategoryTabs"
import { InfiniteProductGrid } from "../components/InfiniteProductGrid"
import { useCategories } from "../menu.api"

export function CategoryPage() {
  const { id = "" } = useParams()
  const { t } = useTranslation()
  const l = useLocalized()
  const navigate = useNavigate()
  const categories = useCategories()

  const category = categories.data?.find((c) => c.id === id)

  if (categories.isError) return <EmptyState title={t("menu.loadError")} />

  if (categories.data && !category) {
    return (
      <EmptyState
        title={t("category.notFound")}
        action={
          <Button asChild className="rounded-full">
            <Link to="/">{t("category.backHome")}</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-5">
      {categories.data && (
        <CategoryTabs
          categories={categories.data}
          selectedId={id}
          onSelect={(next) => navigate(next ? `/category/${next}` : "/")}
        />
      )}

      {category ? (
        <h1 className="text-xl font-bold">{l(category.name)}</h1>
      ) : (
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
      )}

      <InfiniteProductGrid key={id} params={{ categoryId: id }} />
    </div>
  )
}