import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react"
import { Link } from "react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useDirection } from "@/hooks/useDirection"
import { cn } from "@/lib/utils"
import "./image-slider.css"

export type SliderSlide = { id: string; imageUrl: string; title: string; to?: string }

const DURATION = 5500
const SWIPE_DISTANCE = 50

// صورتين جنب بعض عالشاشات العريضة، وصورة وحدة عالموبايل
function usePerView() {
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 768px)").matches)

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)")
    const onChange = () => setWide(query.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return wide ? 2 : 1
}

type LinkProps = { to?: string; tabIndex: number; className: string; children: ReactNode }

function SlideLink({ to, tabIndex, className, children }: LinkProps) {
  if (!to) return <div className={className}>{children}</div>

  if (/^https?:\/\//i.test(to)) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" tabIndex={tabIndex} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link to={to} tabIndex={tabIndex} className={className}>
      {children}
    </Link>
  )
}

export function ImageSlider({ slides }: { slides: SliderSlide[] }) {
  const { t } = useTranslation()
  const { dir } = useDirection()
  const perView = usePerView()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const startX = useRef<number | null>(null)
  const swiped = useRef(false)

  const count = slides.length
  const maxIndex = Math.max(0, count - perView)
  const current = Math.min(index, maxIndex)
  const sliding = maxIndex > 0
  const sign = dir === "rtl" ? 1 : -1

  const next = () => setIndex(current >= maxIndex ? 0 : current + 1)
  const prev = () => setIndex(current <= 0 ? maxIndex : current - 1)

  function onPointerDown(e: PointerEvent) {
    startX.current = e.clientX
    swiped.current = false
  }

  function onPointerUp(e: PointerEvent) {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (!sliding || Math.abs(dx) < SWIPE_DISTANCE) return

    swiped.current = true
    const forward = dir === "rtl" ? dx > 0 : dx < 0
    if (forward) next()
    else prev()
  }

  if (count === 0) return null

  return (
    <section
      aria-roledescription="carousel"
      data-paused={paused}
      className="slider group relative touch-pan-y select-none overflow-x-clip"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        startX.current = null
      }}
      onClickCapture={(e) => {
        if (swiped.current) {
          e.preventDefault()
          e.stopPropagation()
          swiped.current = false
        }
      }}
    >
      <ul className="flex gap-4 pb-3">
        {slides.map((slide, i) => {
          const visible = i >= current && i < current + perView
          return (
            <li
              key={slide.id}
              aria-hidden={!visible}
              className={cn(
                "shrink-0 transition-transform duration-700 ease-in-out motion-reduce:transition-none",
                count === 1 ? "basis-full" : "basis-full md:basis-[calc(50%-0.5rem)]",
              )}
              style={{ transform: `translateX(calc(${sign * current} * (100% + 1rem)))` }}
            >
              <SlideLink
                to={slide.to}
                tabIndex={visible ? 0 : -1}
                className="group/card relative block aspect-[16/9] overflow-hidden rounded-3xl bg-muted shadow-lg shadow-primary/20 md:aspect-[2/1]"
              >
                <img
                  src={slide.imageUrl}
                  alt=""
                  draggable={false}
                  className="size-full object-cover transition-transform duration-700 group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="absolute bottom-4 start-4 max-w-[70%] truncate rounded-full bg-black/45 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
                  {slide.title}
                </span>
              </SlideLink>
            </li>
          )
        })}
      </ul>

      {sliding && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={t("menu.prevSlide")}
            className="absolute start-3 top-[calc(50%-0.75rem)] z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-card/85 text-foreground opacity-0 shadow-md outline-none backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-card focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 md:grid motion-reduce:transition-none"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t("menu.nextSlide")}
            className="absolute end-3 top-[calc(50%-0.75rem)] z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-card/85 text-foreground opacity-0 shadow-md outline-none backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-card focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 md:grid motion-reduce:transition-none"
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>

          <div className="mt-1 flex justify-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={t("menu.slide", { n: i + 1 })}
                aria-current={i === current}
                onClick={() => setIndex(i)}
                className="h-1.5 w-8 overflow-hidden rounded-full bg-primary/25 outline-none transition-colors hover:bg-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
              >
                {i === current && (
                  <span className="slider-fill" style={{ animationDuration: `${DURATION}ms` }} onAnimationEnd={next} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}