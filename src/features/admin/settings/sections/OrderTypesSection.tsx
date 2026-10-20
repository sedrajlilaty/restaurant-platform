import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { Switch } from "@/components/ui/switch"
import type { OrderType } from "@/types"
import { useSaveSettings } from "../settings.api"
import type { OrderTypeSetting } from "../settings.types"

const ORDER_TYPES: OrderType[] = ["dine_in", "takeaway", "delivery"]

const schema = z
  .array(z.object({ type: z.enum(["dine_in", "takeaway", "delivery"]), enabled: z.boolean() }))
  .refine((list) => list.some((item) => item.enabled), "settings.orderTypes.atLeastOne")

export function OrderTypesSection({ initial }: { initial: OrderTypeSetting[] }) {
  const { t } = useTranslation()
  const save = useSaveSettings<OrderTypeSetting[]>("order-types")

  const original = ORDER_TYPES.map((type) => ({ type, enabled: initial.find((o) => o.type === type)?.enabled ?? false }))
  const [items, setItems] = useState<OrderTypeSetting[]>(original)
  const [error, setError] = useState<string | null>(null)
  const dirty = JSON.stringify(items) !== JSON.stringify(original)

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const result = schema.safeParse(items)
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }
    save.mutate(items, {
      onSuccess: () => toast.success(t("settings.saved")),
      onError: () => toast.error(t("settings.saveError")),
    })
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <SectionCard title={t("settings.orderTypes.title")} description={t("settings.orderTypes.desc")}>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.type}>
              <label className="flex items-center justify-between gap-3 rounded-2xl border p-3">
                <span>
                  <span className="block font-medium">{t(`checkout.types.${item.type}.label`)}</span>
                  <span className="block text-xs text-muted-foreground">{t(`settings.orderTypes.hint.${item.type}`)}</span>
                </span>
                <Switch
                  checked={item.enabled}
                  onCheckedChange={(checked) => {
                    setError(null)
                    setItems((list) => list.map((o) => (o.type === item.type ? { ...o, enabled: checked } : o)))
                  }}
                />
              </label>
            </li>
          ))}
        </ul>
        <SectionFooter pending={save.isPending} disabled={!dirty} error={error} />
      </SectionCard>
    </form>
  )
}