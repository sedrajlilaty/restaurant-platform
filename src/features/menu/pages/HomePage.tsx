import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { Input } from "@/components/ui/input"
import { useLocalized } from "@/hooks/useLocalized"
import { useBanners, useCategories, useProducts } from "../menu.api"
import { BannerSlider } from "../components/BannerSlider"
import { CategoryTabs } from "../components/CategoryTabs"
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard"

export function HomePage() {
  const { t } = useTranslation()
  const l = useLocalized()
  const navigate = useNavigate()
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const banners = useBanners()
  const categories = useCategories()
  const products = useProducts(categoryId ? { categoryId, limit: 20 } : { featured: true, limit: 12 })

  const selectedCategory = categories.data?.find((c) => c.id === categoryId)
  const title = selectedCategory ? l(selectedCategory.name) : t("menu.popular")

  function submitSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submitSearch} role="search" className="relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("menu.searchPlaceholder")}
          className="h-12 rounded-full bg-card ps-12 shadow-sm"
          aria-label={t("menu.searchPlaceholder")}
        />
      </form>

      {banners.isPending ? (
        <div className="h-48 animate-pulse rounded-3xl bg-muted md:h-72" />
      ) : (
        banners.data && <BannerSlider banners={banners.data} />
      )}

      {categories.data && (
        <CategoryTabs categories={categories.data} selectedId={categoryId} onSelect={setCategoryId} />
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-bold">{title}</h2>

        {products.isPending ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.isError ? (
          <EmptyState title={t("menu.loadError")} />
        ) : products.data.items.length === 0 ? (
          <EmptyState title={t("menu.empty")} />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {products.data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}