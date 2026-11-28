import { useRef, useState, type PointerEvent, type ReactNode } from "react"
import { Link } from "react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useDirection } from "@/hooks/useDirection"
import { cn } from "@/lib/utils"
import "./image-slider.css"

export type SliderSlide = { id: string; imageUrl: string; title: string; to?: string }

const DURATION = 5500
const SWIPE_DISTANCE = 50

type WrapperProps = { to?: string; tabIndex: number; className: string; children: ReactNode }

function SlideLink({ to, tabIndex, className, children }: WrapperProps) {
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
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const startX = useRef<number | null>(null)
  const swiped = useRef(false)

  const count = slides.length
  const current = count > 0 ? index % count : 0
  const many = count > 1

  const next = () => setIndex((i) => (i + 1) % count)
  const prev = () => setIndex((i) => (i - 1 + count) % count)

  function onPointerDown(e: PointerEvent) {
    startX.current = e.clientX
    swiped.current = false
  }

  function onPointerUp(e: PointerEvent) {
    if (startX.current === null) return
    const dx = e.clientX - startX.current
    startX.current = null
    if (!many || Math.abs(dx) < SWIPE_DISTANCE) return

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
      className="slider group relative aspect-[16/9] touch-pan-y select-none overflow-hidden rounded-3xl bg-muted shadow-xl shadow-primary/25 md:aspect-[8/3] md:max-h-[400px]"
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
      {slides.map((slide, i) => (
        <SlideLink
          key={slide.id}
          to={slide.to}
          tabIndex={i === current ? 0 : -1}
          className={cn(
            "slider-slide absolute inset-0 block overflow-hidden transition-opacity duration-1000 motion-reduce:transition-none",
            i === current ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <span data-active={i === current} className="slider-slide absolute inset-0 block">
            <img src={slide.imageUrl} alt="" draggable={false} className="size-full object-cover" />
          </span>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
          <span
            className={cn(
              "absolute bottom-4 start-4 max-w-[60%] truncate rounded-full bg-black/45 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur transition-all duration-700 motion-reduce:transition-none md:bottom-5 md:start-5",
              i === current ? "translate-y-0 opacity-100 delay-300" : "translate-y-2 opacity-0",
            )}
          >
            {slide.title}
          </span>
        </SlideLink>
      ))}

      {many && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={t("menu.prevSlide")}
            className="absolute start-3 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-card/80 text-foreground opacity-0 shadow-md outline-none backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-card focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 md:grid motion-reduce:transition-none"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t("menu.nextSlide")}
            className="absolute end-3 top-1/2 z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-card/80 text-foreground opacity-0 shadow-md outline-none backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-card focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 md:grid motion-reduce:transition-none"
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>

          <div className="absolute bottom-5 end-4 z-20 flex gap-1.5 md:end-5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={t("menu.slide", { n: i + 1 })}
                aria-current={i === current}
                onClick={() => setIndex(i)}
                className="h-1.5 w-8 overflow-hidden rounded-full bg-white/40 outline-none transition-colors hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-white"
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