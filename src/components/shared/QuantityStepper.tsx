import { Minus, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"

type Props = { value: number; onChange: (value: number) => void; min?: number; max?: number }

export function QuantityStepper({ value, onChange, min = 1, max = 20 }: Props) {
  const { t } = useTranslation()
  const btn = "grid size-9 place-items-center rounded-full hover:bg-muted disabled:opacity-40"

  return (
    <div className="flex items-center gap-1 rounded-full border bg-background p-1">
      <button type="button" aria-label={t("common.decrease")} disabled={value <= min} onClick={() => onChange(value - 1)} className={btn}>
        <Minus className="size-4" />
      </button>
      <span aria-live="polite" className="min-w-6 text-center font-semibold tabular-nums">
        {value}
      </span>
      <button type="button" aria-label={t("common.increase")} disabled={value >= max} onClick={() => onChange(value + 1)} className={btn}>
        <Plus className="size-4" />
      </button>
    </div>
  )
}