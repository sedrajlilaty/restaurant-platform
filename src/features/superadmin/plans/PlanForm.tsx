import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { FormField } from "@/components/shared/FormField"
import { MoneyInput } from "@/components/shared/MoneyInput"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useCreatePlan, useUpdatePlan } from "./plans.api"
import { planSchema, toFormValues, toInput, type PlanFormValues } from "./plans.schema"
import type { Plan } from "./plans.types"

type Props = { plan?: Plan; onClose: () => void }

export function PlanForm({ plan, onClose }: Props) {
  const { t } = useTranslation()
  const create = useCreatePlan()
  const update = useUpdatePlan()
  const pending = create.isPending || update.isPending

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: toFormValues(plan),
  })
  const { errors } = form.formState

  function onSubmit(values: PlanFormValues) {
    const input = toInput(values)
    const options = {
      onSuccess: () => {
        toast.success(t(plan ? "plans.toast.updated" : "plans.toast.added"))
        onClose()
      },
      onError: () => form.setError("root", { message: "plans.errors.generic" }),
    }
    if (plan) update.mutate({ id: plan.id, ...input }, options)
    else create.mutate(input, options)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{plan ? t("plans.form.editTitle") : t("plans.form.addTitle")}</DialogTitle>
          <DialogDescription className="sr-only">{t("plans.subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("plans.form.name")} htmlFor="planName" error={errors.name?.message}>
              <Input id="planName" dir="auto" autoFocus {...form.register("name")} />
            </FormField>
            <FormField
              label={t("plans.form.type")}
              htmlFor="planType"
              hint={t("plans.form.typeHint")}
              error={errors.type?.message}
            >
              <Input id="planType" dir="ltr" {...form.register("type")} />
            </FormField>
          </div>

          <FormField label={t("plans.form.description")} htmlFor="planDescription" error={errors.description?.message}>
            <Textarea id="planDescription" dir="auto" {...form.register("description")} />
          </FormField>

          <FormField label={t("plans.form.price")}>
            <Controller
              control={form.control}
              name="price"
              render={({ field }) => (
                <MoneyInput
                  id="planPrice"
                  value={field.value}
                  onChange={field.onChange}
                  errorUsd={errors.price?.usd?.message}
                  errorSyp={errors.price?.syp?.message}
                />
              )}
            />
          </FormField>

          <FormField
            label={t("plans.form.months")}
            htmlFor="planMonths"
            error={errors.durationMonths?.message}
          >
            <Input id="planMonths" dir="ltr" inputMode="numeric" {...form.register("durationMonths")} />
          </FormField>

          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <label className="flex items-center justify-between gap-3 rounded-2xl border p-3">
                <span>
                  <span className="block text-sm font-medium">{t("plans.form.active")}</span>
                  <span className="block text-xs text-muted-foreground">{t("plans.form.activeHint")}</span>
                </span>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </label>
            )}
          />

          {errors.root?.message && (
            <p role="alert" className="text-sm text-destructive">
              {t(errors.root.message)}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}