import { Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useLang } from "@/hooks/useLang"
import { formatPrice } from "@/lib/format"
import { REVEAL, stagger } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useUpdatePlan } from "./plans.api"
import type { Plan } from "./plans.types"

type Props = { plan: Plan; index: number; onEdit: () => void }

export function PlanCard({ plan, index, onEdit }: Props) {
  const { t } = useTranslation()
  const lang = useLang()
  const update = useUpdatePlan()
  const monthly = plan.price.usd / plan.durationMonths

  return (
    <li
      style={stagger(index)}
      className={cn(
        REVEAL,
        "group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg",
        !plan.isActive && "border-dashed",
      )}
    >
      <div
        className={cn(
          "h-1.5 bg-linear-to-r from-primary to-brand-accent transition-opacity",
          !plan.isActive && "opacity-30",
        )}
      />

      <div className={cn("flex flex-1 flex-col gap-4 p-5 transition-opacity", !plan.isActive && "opacity-70")}>
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {plan.type}
          </span>
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label={t("common.edit")}>
            <Pencil className="size-4" />
          </Button>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold">{plan.name}</h3>
          <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">{plan.description}</p>
        </div>

        <div>
          <p className="text-3xl font-bold tabular-nums text-primary">{formatPrice(plan.price.usd, "USD", lang)}</p>
          <p className="text-sm text-muted-foreground">{formatPrice(plan.price.syp, "SYP", lang)}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-muted px-2.5 py-1">{t("plans.duration", { months: plan.durationMonths })}</span>
          <span className="rounded-full bg-muted px-2.5 py-1">
            {t("plans.perMonth", { price: formatPrice(monthly, "USD", lang) })}
          </span>
        </div>
      </div>

      <label className="flex items-center justify-between gap-3 border-t bg-muted/40 px-5 py-3 text-sm">
        <span className={cn("font-medium", !plan.isActive && "text-muted-foreground")}>
          {plan.isActive ? t("plans.active") : t("plans.inactive")}
        </span>
        <Switch
          aria-label={t("plans.form.active")}
          checked={plan.isActive}
          disabled={update.isPending}
          onCheckedChange={(checked) =>
            update.mutate(
              { id: plan.id, isActive: checked },
              { onError: () => toast.error(t("plans.errors.generic")) },
            )
          }
        />
      </label>
    </li>
  )
}