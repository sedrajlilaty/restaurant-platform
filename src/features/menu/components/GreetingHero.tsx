import { useEffect, useState } from "react"
import { Link } from "react-router"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import "./greeting-hero.css"

export type HeroSlide = { id: string; imageUrl: string; title: string }

type Props = { words: string[]; slides: HeroSlide[] }

export function GreetingHero({ words, slides }: Props) {
  const { t } = useTranslation()
  const [isMorning] = useState(() => new Date().getHours() < 12)
  const [wordIndex, setWordIndex] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (words.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let swap = 0
    const id = window.setInterval(() => {
      setHidden(true)
      swap = window.setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length)
        setHidden(false)
      }, 320)
    }, 2800)

    return () => {
      window.clearInterval(id)
      window.clearTimeout(swap)
    }
  }, [words.length])

  useEffect(() => {
    if (slides.length < 2 || paused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const id = window.setInterval(() => setSlideIndex((i) => (i + 1) % slides.length), 4500)
    return () => window.clearInterval(id)
  }, [slides.length, paused])

  const word = words.length > 0 ? words[wordIndex % words.length] : null
  const current = slides.length > 0 ? slideIndex % slides.length : 0
  const hasSlides = slides.length > 0

  return (
    <section className="relative h-48 overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-sm md:h-60">
      <span className="pointer-events-none absolute -end-10 -top-10 size-48 rounded-full bg-primary-foreground/10" />
      <span className="pointer-events-none absolute -bottom-16 start-1/3 size-40 rounded-full bg-primary-foreground/10" />

      {hasSlides && (
        <div
          className="absolute inset-y-4 end-4 z-10 w-[40%] overflow-hidden rounded-2xl border-2 border-primary-foreground/30 bg-primary shadow-xl md:w-[36%]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {slides.map((slide, i) => (
            <Link
              key={slide.id}
              to={`/product/${slide.id}`}
              tabIndex={i === current ? 0 : -1}
              aria-hidden={i !== current}
              className={cn(
                "absolute inset-0 block overflow-hidden transition-opacity duration-700 motion-reduce:transition-none",
                i === current ? "hero-slide-active opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <img src={slide.imageUrl} alt="" className="size-full object-cover" />
              <span className="absolute inset-x-0 bottom-0 line-clamp-1 bg-gradient-to-t from-black/70 to-transparent px-3 pb-7 pt-10 text-sm font-semibold text-white">
                {slide.title}
              </span>
            </Link>
          ))}

          <span className="pointer-events-none absolute start-2 top-2 z-20 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
            {t("menu.popular")}
          </span>

          {slides.length > 1 && (
            <div className="absolute inset-x-0 bottom-2 z-20 flex justify-center gap-1.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={t("menu.slide", { n: i + 1 })}
                  onClick={() => setSlideIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full bg-white transition-all duration-300 motion-reduce:transition-none",
                    i === current ? "w-5" : "w-1.5 opacity-60 hover:opacity-100",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "relative flex h-full flex-col justify-center gap-2 p-6 md:p-10",
          hasSlides ? "max-w-[58%]" : "max-w-[75%]",
        )}
      >
        <p className="text-sm opacity-90 md:text-base">
          {isMorning ? t("menu.greetingMorning") : t("menu.greetingEvening")}
        </p>
        <h2 className="flex flex-wrap items-baseline gap-x-3 text-2xl font-bold leading-tight md:text-4xl">
          <span>{t("menu.heroQuestion")}</span>
          {word && (
            <span aria-hidden="true" data-hidden={hidden} className="hero-word">
              {t("menu.heroWord", { name: word })}
            </span>
          )}
        </h2>
      </div>
    </section>
  )
}