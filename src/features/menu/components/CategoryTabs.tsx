import { Utensils, UtensilsCrossed } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocalized } from "@/hooks/useLocalized"
import { cn } from "@/lib/utils"
import type { Category } from "../menu.types"

type Props = {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

function Circle({ selected, children }: { selected: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "grid size-16 place-items-center overflow-hidden rounded-full border shadow-sm transition-colors",
        selected ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground",
      )}
    >
      {children}
    </span>
  )
}

export function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()

  return (
    <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      <li className="shrink-0">
        <button
          type="button"
          aria-pressed={selectedId === null}
          onClick={() => onSelect(null)}
          className="flex w-[72px] flex-col items-center gap-1.5"
        >
          <Circle selected={selectedId === null}>
            <UtensilsCrossed className="size-6" />
          </Circle>
          <span className={cn("text-xs", selectedId === null ? "font-semibold" : "text-muted-foreground")}>
            {t("menu.all")}
          </span>
        </button>
      </li>
      {categories.map((category) => {
        const selected = selectedId === category.id
        return (
          <li key={category.id} className="shrink-0">
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(category.id)}
              className="flex w-[72px] flex-col items-center gap-1.5"
            >
              <Circle selected={selected}>
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt="" className="size-full object-cover" />
                ) : (
                  <Utensils className="size-6" />
                )}
              </Circle>
              <span className={cn("line-clamp-1 text-xs", selected ? "font-semibold" : "text-muted-foreground")}>
                {l(category.name)}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}