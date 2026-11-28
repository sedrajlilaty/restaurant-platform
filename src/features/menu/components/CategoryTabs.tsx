import { useEffect, useRef, type ReactNode } from "react"
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

type TileProps = {
  selected: boolean
  label: string
  onClick: () => void
  setRef: (el: HTMLButtonElement | null) => void
  children: ReactNode
}

function Tile({ selected, label, onClick, setRef, children }: TileProps) {
  return (
    <li className="shrink-0">
      <button
        ref={setRef}
        type="button"
        aria-pressed={selected}
        onClick={onClick}
        className="group flex w-24 flex-col items-center gap-2 outline-none md:w-28"
      >
        <span
          className={cn(
            "relative grid size-20 place-items-center overflow-hidden rounded-3xl border bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-ring group-active:scale-95 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 md:size-24",
            selected && "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background",
          )}
        >
          {children}
        </span>
        <span className={cn("line-clamp-1 text-sm", selected ? "font-bold text-primary" : "font-medium")}>{label}</span>
      </button>
    </li>
  )
}

const IMAGE_CLASS =
  "size-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"

export function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const buttons = useRef(new Map<string, HTMLButtonElement>())

  useEffect(() => {
    const button = buttons.current.get(selectedId ?? "all")
    if (!button) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    button.scrollIntoView({ inline: "center", block: "nearest", behavior: reduced ? "auto" : "smooth" })
  }, [selectedId, categories])

  function register(key: string) {
    return (el: HTMLButtonElement | null) => {
      if (el) buttons.current.set(key, el)
      else buttons.current.delete(key)
    }
  }

  return (
    <div className="-mx-4 overflow-x-auto px-4 py-3 [mask-image:linear-gradient(to_right,transparent,black_1rem,black_calc(100%_-_1rem),transparent)] [scrollbar-width:none]">
      <ul className="flex w-max gap-3 md:gap-4">
        <Tile selected={selectedId === null} label={t("menu.all")} onClick={() => onSelect(null)} setRef={register("all")}>
          <UtensilsCrossed className="size-8 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none" />
        </Tile>

        {categories.map((category) => {
          const Icon = iconFor(category.name)
          return (
            <Tile
              key={category.id}
              selected={selectedId === category.id}
              label={l(category.name)}
              onClick={() => onSelect(category.id)}
              setRef={register(category.id)}
            >
              {category.imageUrl ? (
                <img src={category.imageUrl} alt="" loading="lazy" className={IMAGE_CLASS} />
              ) : (
                <Icon className="size-8 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none" />
              )}
            </Tile>
          )
        })}
      </ul>
    </div>
  )
}