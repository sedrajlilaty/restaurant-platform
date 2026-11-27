import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { Search } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { Reveal } from "@/components/shared/Reveal"
import { Input } from "@/components/ui/input"
import { useLocalized } from "@/hooks/useLocalized"
import { CategoryTabs } from "../components/CategoryTabs"
import { GreetingHero, type HeroSlide } from "../components/GreetingHero"
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

  // العروض يلي بيضيفها صاحب المطعم أولاً، وبعدها صور الأصناف الأكثر طلباً
  const offerSlides: HeroSlide[] = (banners.data ?? [])
    .filter((banner) => banner.imageUrl)
    .map((banner) => ({
      id: `offer-${banner.id}`,
      kind: "offer" as const,
      imageUrl: banner.imageUrl as string,
      title: l(banner.title),
      subtitle: banner.subtitle ? l(banner.subtitle) : undefined,
      to: banner.ctaLink ?? undefined,
    }))

  const popularSlides: HeroSlide[] = (products.data?.items ?? [])
    .filter((product) => product.available && product.imageUrl)
    .map((product) => ({
      id: `popular-${product.id}`,
      kind: "popular" as const,
      imageUrl: product.imageUrl as string,
      title: l(product.name),
      to: `/product/${product.id}`,
    }))

  const slides = [...offerSlides, ...popularSlides].slice(0, MAX_SLIDES)

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

      {categories.isPending ? (
        <div className="h-48 animate-pulse rounded-3xl bg-muted md:h-60" />
      ) : (
        <GreetingHero words={(categories.data ?? []).map((c) => l(c.name))} slides={slides} />
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