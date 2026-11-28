import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { Reveal } from "@/components/shared/Reveal"
import { Input } from "@/components/ui/input"
import { useLocalized } from "@/hooks/useLocalized"
import { CategoryTabs } from "../components/CategoryTabs"
import { ImageSlider, type SliderSlide } from "../components/ImageSlider"
import { ProductCard, ProductCardSkeleton } from "../components/ProductCard"
import { useBanners, useCategories, useProducts } from "../menu.api"

const GRID = "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5"

const CARD_HOVER =
  "h-full transition-transform duration-300 ease-out hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 [&>*]:h-full [&>*]:transition-shadow [&>*]:duration-300 hover:[&>*]:shadow-xl"

const MAX_SLIDES = 6

export function HomePage() {
  const { t } = useTranslation()
  const l = useLocalized()
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const banners = useBanners()
  const categories = useCategories()
  const products = useProducts({ limit: 12 })

  // صور البنرات يلي بيرفعها صاحب المطعم من صفحة البنرات
  const slides: SliderSlide[] = (banners.data ?? [])
    .filter((banner) => banner.imageUrl)
    .slice(0, MAX_SLIDES)
    .map((banner) => ({
      id: banner.id,
      imageUrl: banner.imageUrl as string,
      title: l(banner.title),
      to: banner.ctaLink ?? undefined,
    }))

  function submitSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="space-y-8">
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
        <div className="aspect-[16/9] animate-pulse rounded-3xl bg-muted md:aspect-[8/3] md:max-h-[400px]" />
      ) : (
        slides.length > 0 && <ImageSlider slides={slides} />
      )}

      {categories.data && (
        <CategoryTabs
          categories={categories.data}
          selectedId={null}
          onSelect={(id) => {
            if (id) navigate(`/category/${id}`)
          }}
        />
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-bold">{t("menu.popular")}</h2>

        {products.isPending ? (
          <div className={GRID}>
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.isError ? (
          <EmptyState title={t("menu.loadError")} />
        ) : products.data.items.length === 0 ? (
          <EmptyState title={t("menu.empty")} />
        ) : (
          <div className={GRID}>
            {products.data.items.map((product, i) => (
              <Reveal key={product.id} index={Math.min(i, 10)} step={60}>
                <div className={CARD_HOVER}>
                  <ProductCard product={product} />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}