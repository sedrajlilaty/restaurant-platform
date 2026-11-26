import { useLayoutEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { setLanguage } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { code: "ar", label: "ع", name: "العربية" },
  { code: "en", label: "EN", name: "English" },
] as const

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n } = useTranslation()
  const current = i18n.language.startsWith("ar") ? "ar" : "en"

  const listRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const placed = useRef(false)

  useLayoutEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    if (!list || !indicator) return

    let cancelled = false

    const place = () => {
      const active = list.querySelector<HTMLElement>('[aria-pressed="true"]')
      if (!active) return

      const first = !placed.current
      if (first) indicator.style.transition = "none"

      indicator.style.width = `${active.offsetWidth}px`
      indicator.style.transform = `translateX(${active.offsetLeft}px)`

      if (first) {
        void indicator.offsetWidth
        indicator.style.transition = ""
        placed.current = true
      }
    }

    place()
    void document.fonts?.ready.then(() => {
      if (!cancelled) place()
    })

    return () => {
      cancelled = true
    }
  }, [current])

  return (
    <div
      ref={listRef}
      dir="ltr"
      role="group"
      aria-label="Language"
      className={cn("relative flex shrink-0 rounded-full bg-muted p-1", className)}
    >
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1 left-0 top-1 rounded-full bg-card shadow-sm transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
      />
      {OPTIONS.map((option) => (
        <button
          key={option.code}
          type="button"
          lang={option.code}
          aria-label={option.name}
          aria-pressed={current === option.code}
          onClick={() => void setLanguage(option.code)}
          className={cn(
            "relative z-10 rounded-full px-3 py-1.5 text-xs font-bold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring active:scale-95 motion-reduce:transition-none",
            current === option.code ? "text-primary" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}