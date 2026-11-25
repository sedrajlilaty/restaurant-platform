import { useLayoutEffect, useRef, type ReactNode } from "react"
import {
  Beef,
  Cake,
  Coffee,
  Cookie,
  Croissant,
  CupSoda,
  Drumstick,
  Egg,
  Fish,
  Hamburger,
  IceCreamCone,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocalized } from "@/hooks/useLocalized"
import { cn } from "@/lib/utils"
import type { Category } from "../menu.types"

type Props = {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

const ICON_RULES: [RegExp, LucideIcon][] = [
  [/برغر|همبرغر|burger/, Hamburger],
  [/بيتزا|بيتسا|pizza/, Pizza],
  [/سلط|salad/, Salad],
  [/شورب|حساء|soup/, Soup],
  [/سمك|بحري|fish|seafood/, Fish],
  [/ساندويش|سندويش|شاورما|لفائف|sandwich|wrap|shawarma/, Sandwich],
  [/دجاج|فروج|مقرمش|chicken|fried|wings/, Drumstick],
  [/مشاوي|لحم|ستيك|كباب|grill|steak|meat|beef|kebab/, Beef],
  [/قهوة|قهوه|شاي|ساخن|coffee|tea|hot drink/, Coffee],
  [/مشروب|عصير|كوكتيل|drink|juice|soda|smoothie|cocktail/, CupSoda],
  [/بوظة|آيس|ايس|مثلج|ice cream|gelato/, IceCreamCone],
  [/كيك|تورتة|cake/, Cake],
  [/حلو|dessert|sweet/, Cookie],
  [/معجنات|مخبوز|فطائر|pastry|bakery|bread|croissant/, Croissant],
  [/فطور|بيض|breakfast|egg/, Egg],
]

function iconFor(name: Category["name"]): LucideIcon {
  const text = Object.values(name).join(" ").toLowerCase()
  const rule = ICON_RULES.find(([pattern]) => pattern.test(text))
  return rule ? rule[1] : Utensils
}

type TabProps = {
  selected: boolean
  onClick: () => void
  setRef: (el: HTMLButtonElement | null) => void
  children: ReactNode
}

function Tab({ selected, onClick, setRef, children }: TabProps) {
  return (
    <li className="shrink-0">
      <button
        ref={setRef}
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className={cn(
          "group relative z-10 flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
          selected
            ? "border-transparent text-primary-foreground"
            : "bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md",
        )}
      >
        {children}
      </button>
    </li>
  )
}

const ICON_CLASS = "size-5 shrink-0 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"

export function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()

  const listRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>())
  const placed = useRef(false)

  useLayoutEffect(() => {
    const list = listRef.current
    const indicator = indicatorRef.current
    if (!list || !indicator) return

    let cancelled = false

    const place = (scroll: boolean) => {
      const button = buttonRefs.current.get(selectedId ?? "all")
      if (!button) return

      const first = !placed.current
      if (first) indicator.style.transition = "none"

      indicator.style.width = `${button.offsetWidth}px`
      indicator.style.height = `${button.offsetHeight}px`
      indicator.style.transform = `translate(${button.offsetLeft}px, ${button.offsetTop}px)`
      indicator.style.opacity = "1"

      if (first) {
        void indicator.offsetWidth
        indicator.style.transition = ""
        placed.current = true
      }

      if (scroll) {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        button.scrollIntoView({
          inline: "center",
          block: "nearest",
          behavior: first || reduced ? "auto" : "smooth",
        })
      }
    }

    place(true)

    const observer = new ResizeObserver(() => place(false))
    observer.observe(list)
    void document.fonts?.ready.then(() => {
      if (!cancelled) place(false)
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [selectedId, categories])

  function register(key: string) {
    return (el: HTMLButtonElement | null) => {
      if (el) buttonRefs.current.set(key, el)
      else buttonRefs.current.delete(key)
    }
  }

  return (
    <div
      ref={listRef}
      className="relative -mx-4 overflow-x-auto px-4 py-1 [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%_-_1rem),transparent)] [scrollbar-width:none]"
    >
      <span
        ref={indicatorRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-primary opacity-0 shadow-sm transition-[transform,width,height] duration-300 ease-out motion-reduce:transition-none"
      />

      <ul className="flex w-max gap-2">
        <Tab selected={selectedId === null} onClick={() => onSelect(null)} setRef={register("all")}>
          <UtensilsCrossed className={ICON_CLASS} />
          {t("menu.all")}
        </Tab>

        {categories.map((category) => {
          const Icon = iconFor(category.name)
          return (
            <Tab
              key={category.id}
              selected={selectedId === category.id}
              onClick={() => onSelect(category.id)}
              setRef={register(category.id)}
            >
              {category.imageUrl ? (
                <img src={category.imageUrl} alt="" className="size-6 shrink-0 rounded-full object-cover" />
              ) : (
                <Icon className={ICON_CLASS} />
              )}
              {l(category.name)}
            </Tab>
          )
        })}
      </ul>
    </div>
  )
}