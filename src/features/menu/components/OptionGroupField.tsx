import { Check } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocalized } from "@/hooks/useLocalized"
import { usePrice } from "@/hooks/usePrice"
import { cn } from "@/lib/utils"
import type { OptionGroup } from "../menu.types"
import { requiredCount, type SelectionError } from "../selection"

type Props = {
  group: OptionGroup
  selected: string[]
  error?: SelectionError
  onToggle: (choiceId: string) => void
}

export function OptionGroupField({ group, selected, error, onToggle }: Props) {
  const { t } = useTranslation()
  const l = useLocalized()
  const price = usePrice()
  const single = group.type === "single"
  const full = !single && group.max !== null && selected.length >= group.max

  const hint = single ? t("product.chooseOne") : group.max !== null ? t("product.chooseUpTo", { count: group.max }) : null
  const errorText =
    error === "min"
      ? t("product.errors.min", { count: requiredCount(group) })
      : error === "max"
        ? t("product.errors.max", { count: group.max ?? 0 })
        : error
          ? t("product.errors.required")
          : null

  return (
    <div id={`group-${group.id}`} role={single ? "radiogroup" : "group"} className="scroll-mt-24 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold">{l(group.name)}</h3>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs",
            group.required ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {group.required ? t("product.required") : t("product.optional")}
        </span>
      </div>

      <div className="space-y-2">
        {group.choices.map((choice) => {
          const checked = selected.includes(choice.id)
          const disabled = !checked && full
          return (
            <label
              key={choice.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border bg-card px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-ring",
                checked && "border-primary bg-muted",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <input
                type={single ? "radio" : "checkbox"}
                name={group.id}
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(choice.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "grid size-5 shrink-0 place-items-center border",
                  single ? "rounded-full" : "rounded-md",
                  checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40",
                )}
              >
                {checked && <Check className="size-3.5" />}
              </span>
              <span className="flex-1">{l(choice.name)}</span>
              {choice.price > 0 && (
                <span dir="ltr" className="text-sm text-muted-foreground">
                  +{price(choice.price)}
                </span>
              )}
            </label>
          )
        })}
      </div>

      {errorText && (
        <p role="alert" className="text-sm text-destructive">
          {errorText}
        </p>
      )}
    </div>
  )
}