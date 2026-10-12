import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { requiredText } from "@/lib/validation"
import { useCreateTables, useUpdateTable } from "./tables.api"
import type { Table } from "./tables.types"

type Mode = "single" | "range"

const singleSchema = z.object({ tableNumber: requiredText(20) })
type SingleValues = z.infer<typeof singleSchema>

const rangeSchema = z
  .object({
    from: z.string().regex(/^\d{1,3}$/, "validation.number"),
    to: z.string().regex(/^\d{1,3}$/, "validation.number"),
  })
  .superRefine((values, ctx) => {
    const from = Number(values.from)
    const to = Number(values.to)
    if (to < from) {
      ctx.addIssue({ code: "custom", path: ["to"], message: "tables.errors.range" })
    } else if (to - from + 1 > 100) {
      ctx.addIssue({ code: "custom", path: ["to"], message: "tables.errors.tooMany" })
    }
  })
type RangeValues = z.infer<typeof rangeSchema>

function FieldError({ message }: { message?: string }) {
  const { t } = useTranslation()
  if (!message) return null
  return (
    <p role="alert" className="text-sm text-destructive">
      {t(message)}
    </p>
  )
}

function FormFooter({ pending, onCancel }: { pending: boolean; onCancel: () => void }) {
  const { t } = useTranslation()
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel}>
        {t("common.cancel")}
      </Button>
      <Button type="submit" disabled={pending}>
        {pending ? t("common.saving") : t("common.save")}
      </Button>
    </DialogFooter>
  )
}

function SingleForm({ table, onDone }: { table?: Table; onDone: () => void }) {
  const { t } = useTranslation()
  const create = useCreateTables()
  const update = useUpdateTable()
  const form = useForm<SingleValues>({
    resolver: zodResolver(singleSchema),
    defaultValues: { tableNumber: table?.tableNumber ?? "" },
  })
  const { errors } = form.formState

  function handleError(error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      form.setError("tableNumber", { message: "tables.errors.duplicate" })
    } else {
      form.setError("root", { message: "tables.errors.generic" })
    }
  }

  function onSubmit(values: SingleValues) {
    const options = {
      onSuccess: () => {
        toast.success(t(table ? "tables.toast.updated" : "tables.toast.added"))
        onDone()
      },
      onError: handleError,
    }
    if (table) update.mutate({ id: table.id, tableNumber: values.tableNumber }, options)
    else create.mutate([values.tableNumber], options)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tableNumber">{t("tables.form.number")}</Label>
        <Input id="tableNumber" autoFocus {...form.register("tableNumber")} />
        <FieldError message={errors.tableNumber?.message} />
      </div>
      <FieldError message={errors.root?.message} />
      <FormFooter pending={create.isPending || update.isPending} onCancel={onDone} />
    </form>
  )
}

function RangeForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  const create = useCreateTables()
  const form = useForm<RangeValues>({
    resolver: zodResolver(rangeSchema),
    defaultValues: { from: "1", to: "10" },
  })
  const { errors } = form.formState

  function onSubmit(values: RangeValues) {
    const from = Number(values.from)
    const to = Number(values.to)
    const numbers = Array.from({ length: to - from + 1 }, (_, i) => String(from + i))

    create.mutate(numbers, {
      onSuccess: () => {
        toast.success(t("tables.toast.added"))
        onDone()
      },
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          form.setError("from", { message: "tables.errors.duplicate" })
        } else {
          form.setError("root", { message: "tables.errors.generic" })
        }
      },
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="from">{t("tables.form.from")}</Label>
          <Input id="from" inputMode="numeric" dir="ltr" {...form.register("from")} />
          <FieldError message={errors.from?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">{t("tables.form.to")}</Label>
          <Input id="to" inputMode="numeric" dir="ltr" {...form.register("to")} />
          <FieldError message={errors.to?.message} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{t("tables.form.rangeHint")}</p>
      <FieldError message={errors.root?.message} />
      <FormFooter pending={create.isPending} onCancel={onDone} />
    </form>
  )
}

export function TableForm({ table, onClose }: { table?: Table; onClose: () => void }) {
  const { t } = useTranslation()
  const [mode, setMode] = useState<Mode>("single")

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{table ? t("tables.form.editTitle") : t("tables.form.addTitle")}</DialogTitle>
          <DialogDescription className="sr-only">{t("tables.subtitle")}</DialogDescription>
        </DialogHeader>

        {!table && (
          <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
            {(["single", "range"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === value ? "bg-card shadow-sm" : "text-muted-foreground",
                )}
              >
                {t(`tables.form.${value}`)}
              </button>
            ))}
          </div>
        )}

        {mode === "single" || table ? <SingleForm table={table} onDone={onClose} /> : <RangeForm onDone={onClose} />}
      </DialogContent>
    </Dialog>
  )
}