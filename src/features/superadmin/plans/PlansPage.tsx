import { useState } from "react"
import { Layers, Pencil, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useLang } from "@/hooks/useLang"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import { PlanForm } from "./PlanForm"
import { usePlans, useUpdatePlan } from "./plans.api"
import type { Plan } from "./plans.types"

function PlanRow({ plan, onEdit }: { plan: Plan; onEdit: () => void }) {
  const { t } = useTranslation()
  const lang = useLang()
  const update = useUpdatePlan()

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-3xl border bg-card p-4 shadow-sm",
        !plan.isActive && "opacity-70",
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold">{plan.name}</p>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{plan.type}</span>
        </div>
        {plan.description && <p className="line-clamp-2 text-sm text-muted-foreground">{plan.description}</p>}
        <p className="flex flex-wrap items-center gap-x-3 text-sm">
          <span className="font-medium text-primary">{formatPrice(plan.price.usd, "USD", lang)}</span>
          <span className="text-muted-foreground">{formatPrice(plan.price.syp, "SYP", lang)}</span>
          <span className="text-xs text-muted-foreground">{t("plans.duration", { months: plan.durationMonths })}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
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
        <span className="hidden w-16 text-xs text-muted-foreground sm:inline">
          {plan.isActive ? t("plans.active") : t("plans.inactive")}
        </span>
      </div>

      <Button variant="ghost" size="icon" onClick={onEdit} aria-label={t("common.edit")}>
        <Pencil className="size-4" />
      </Button>
    </li>
  )
}

export function PlansPage() {
  const { t } = useTranslation()
  const query = usePlans()
  const [dialog, setDialog] = useState<{ plan?: Plan } | null>(null)
  const plans = query.data ?? []

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <PageHeader
        title={t("plans.title")}
        description={t("plans.subtitle")}
        actions={
          <Button className="gap-2" onClick={() => setDialog({})}>
            <Plus className="size-4" />
            {t("plans.add")}
          </Button>
        }
      />

      {query.isPending ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[96px] animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : query.isError ? (
        <EmptyState title={t("plans.errors.generic")} />
      ) : plans.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={t("plans.empty")}
          action={<p className="text-sm text-muted-foreground">{t("plans.emptyHint")}</p>}
        />
      ) : (
        <ul className="space-y-2">
          {plans.map((plan) => (
            <PlanRow key={plan.id} plan={plan} onEdit={() => setDialog({ plan })} />
          ))}
        </ul>
      )}

      {dialog && <PlanForm key={dialog.plan?.id ?? "new"} plan={dialog.plan} onClose={() => setDialog(null)} />}
    </div>
  )
}