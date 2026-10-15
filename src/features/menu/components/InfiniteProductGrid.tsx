import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { Button } from "@/components/ui/button"
import { useInfiniteProducts } from "../menu.api"
import type { ProductsQuery } from "../menu.types"
import { ProductCard, ProductCardSkeleton } from "./ProductCard"

type Props = {
  params: Omit<ProductsQuery, "page" | "limit">
  enabled?: boolean
  emptyTitle?: string
}

const GRID = "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"

export function InfiniteProductGrid({ params, enabled = true, emptyTitle }: Props) {
  const { t } = useTranslation()
  const query = useInfiniteProducts(params, enabled)
  const items = query.data?.pages.flatMap((page) => page.items) ?? []

  if (!enabled) return null

  if (query.isPending) {
    return (
      <div className={GRID}>
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (query.isError) return <EmptyState title={t("menu.loadError")} />
  if (items.length === 0) return <EmptyState title={emptyTitle ?? t("menu.empty")} />

  return (
    <div className="space-y-4">
      <div className={GRID}>
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {query.hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="rounded-full"
            disabled={query.isFetchingNextPage}
            onClick={() => void query.fetchNextPage()}
          >
            {query.isFetchingNextPage ? t("catalog.loadingMore") : t("catalog.loadMore")}
          </Button>
        </div>
      )}
    </div>
  )
}