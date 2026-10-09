import { useEffect, useState } from "react"
import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocalized } from "@/hooks/useLocalized"
import { cn } from "@/lib/utils"
import type { Banner } from "../menu.types"

export function BannerSlider({ banners }: { banners: Banner[] }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (banners.length < 2 || paused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % banners.length), 5000)
    return () => window.clearInterval(id)
  }, [banners.length, paused])

  if (banners.length === 0) return null
  const current = index % banners.length

  return (
    <section
      aria-roledescription="carousel"
      className="relative h-48 overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-sm md:h-72"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="pointer-events-none absolute -end-10 -top-10 size-48 rounded-full bg-primary-foreground/10" />
      <span className="pointer-events-none absolute -bottom-16 end-24 size-40 rounded-full bg-primary-foreground/10" />

      {banners.map((banner, i) => (
        <div
          key={banner.id}
          role="group"
          aria-hidden={i !== current}
          className={cn(
            "absolute inset-0 flex flex-col justify-center gap-2 p-6 transition-opacity duration-500 md:p-10",
            i === current ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {banner.imageUrl && (
            <>
              <img src={banner.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent rtl:bg-gradient-to-l" />
            </>
          )}
          <h2 className="relative max-w-md text-2xl font-bold leading-tight md:text-4xl">{l(banner.title)}</h2>
          {banner.subtitle && <p className="relative max-w-sm text-sm opacity-90 md:text-base">{l(banner.subtitle)}</p>}
          {banner.ctaLabel && banner.ctaLink && (
            <Link
              to={banner.ctaLink}
              tabIndex={i === current ? 0 : -1}
              className="relative mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm"
            >
              {l(banner.ctaLabel)}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          )}
        </div>
      ))}

      {banners.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              aria-label={t("menu.slide", { n: i + 1 })}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full bg-primary-foreground transition-all",
                i === current ? "w-5" : "w-2 opacity-50",
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}