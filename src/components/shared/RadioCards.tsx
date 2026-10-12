import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type RadioCardOption<T extends string> = {
  value: T
  label: string
  description?: string
  icon?: LucideIcon
}

type Props<T extends string> = {
  name: string
  value: T
  onChange: (value: T) => void
  options: RadioCardOption<T>[]
}

export function RadioCards<T extends string>({ name, value, onChange, options }: Props<T>) {
  return (
    <div role="radiogroup" className="grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
      {options.map((option) => {
        const checked = option.value === value
        const Icon = option.icon
        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border bg-card px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-ring",
              checked && "border-primary bg-muted",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {Icon && (
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-full",
                  checked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
              </span>
            )}
            <span className="flex flex-col">
              <span className="font-semibold">{option.label}</span>
              {option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}
            </span>
          </label>
        )
      })}
    </div>
  )
}