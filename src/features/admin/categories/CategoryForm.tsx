import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { requiredText } from "@/lib/validation"
import { useCreateCategory, useUpdateCategory } from "./categories.api"
import type { AdminCategory } from "./categories.types"

const schema = z.object({
  nameAr: requiredText(60),
  nameEn: requiredText(60),
  imageUrl: z.string().nullable(),
  isActive: z.boolean(),
})
type Values = z.infer<typeof schema>

function FieldError({ message }: { message?: string }) {
  const { t } = useTranslation()
  if (!message) return null
  return (
    <p role="alert" className="text-sm text-destructive">
      {t(message)}
    </p>
  )
}

type Props = { category?: AdminCategory; onClose: () => void }

export function CategoryForm({ category, onClose }: Props) {
  const { t } = useTranslation()
  const create = useCreateCategory()
  const update = useUpdateCategory()
  const pending = create.isPending || update.isPending

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameAr: category?.name.ar ?? "",
      nameEn: category?.name.en ?? "",
      imageUrl: category?.imageUrl ?? null,
      isActive: category?.isActive ?? true,
    },
  })
  const { errors } = form.formState

  function onSubmit(values: Values) {
    const input = {
      name: { ar: values.nameAr, en: values.nameEn },
      imageUrl: values.imageUrl,
      isActive: values.isActive,
    }
    const options = {
      onSuccess: () => {
        toast.success(t(category ? "categories.toast.updated" : "categories.toast.added"))
        onClose()
      },
      onError: () => form.setError("root", { message: "categories.errors.generic" }),
    }
    if (category) update.mutate({ id: category.id, ...input }, options)
    else create.mutate(input, options)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? t("categories.form.editTitle") : t("categories.form.addTitle")}</DialogTitle>
          <DialogDescription className="sr-only">{t("categories.subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nameAr">{t("categories.form.nameAr")}</Label>
            <Input id="nameAr" dir="rtl" autoFocus {...form.register("nameAr")} />
            <FieldError message={errors.nameAr?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameEn">{t("categories.form.nameEn")}</Label>
            <Input id="nameEn" dir="ltr" {...form.register("nameEn")} />
            <FieldError message={errors.nameEn?.message} />
          </div>

          <div className="space-y-2">
            <Label>{t("categories.form.image")}</Label>
            <Controller
              control={form.control}
              name="imageUrl"
              render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
            />
          </div>

          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <label className="flex items-center justify-between gap-3 rounded-2xl border p-3">
                <span className="text-sm font-medium">{t("categories.form.visible")}</span>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </label>
            )}
          />

          <FieldError message={errors.root?.message} />

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