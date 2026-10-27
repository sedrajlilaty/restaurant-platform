import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { FormField } from "@/components/shared/FormField"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { MoneyInput } from "@/components/shared/MoneyInput"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useLang } from "@/hooks/useLang"
import type { AdminCategory } from "../categories/categories.types"
import { useCreateProduct, useUpdateProduct } from "./products.api"
import { productSchema, toFormValues, toInput, type ProductFormValues } from "./products.schema"
import type { AdminProduct } from "./products.types"

const SELECT =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"

type Props = {
  product?: AdminProduct
  categories: AdminCategory[]
  defaultCategoryId?: string
  onClose: () => void
}

export function ProductForm({ product, categories, defaultCategoryId, onClose }: Props) {
  const { t } = useTranslation()
  const lang = useLang()
  const create = useCreateProduct()
  const update = useUpdateProduct()
  const pending = create.isPending || update.isPending

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...toFormValues(product), categoryId: product?.categoryId ?? defaultCategoryId ?? "" },
  })
  const { errors } = form.formState

  function onSubmit(values: ProductFormValues) {
    const input = toInput(values)
    const options = {
      onSuccess: () => {
        toast.success(t(product ? "products.toast.updated" : "products.toast.added"))
        onClose()
      },
      onError: () => form.setError("root", { message: "products.errors.generic" }),
    }
    if (product) update.mutate({ id: product.id, ...input }, options)
    else create.mutate(input, options)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? t("products.form.editTitle") : t("products.form.addTitle")}</DialogTitle>
          <DialogDescription className="sr-only">{t("products.subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("products.form.nameAr")} htmlFor="nameAr" error={errors.nameAr?.message}>
              <Input id="nameAr" dir="rtl" autoFocus {...form.register("nameAr")} />
            </FormField>
            <FormField label={t("products.form.nameEn")} htmlFor="nameEn" error={errors.nameEn?.message}>
              <Input id="nameEn" dir="ltr" {...form.register("nameEn")} />
            </FormField>
            <FormField label={t("products.form.descriptionAr")} htmlFor="descriptionAr" error={errors.descriptionAr?.message}>
              <Textarea id="descriptionAr" dir="rtl" {...form.register("descriptionAr")} />
            </FormField>
            <FormField label={t("products.form.descriptionEn")} htmlFor="descriptionEn" error={errors.descriptionEn?.message}>
              <Textarea id="descriptionEn" dir="ltr" {...form.register("descriptionEn")} />
            </FormField>
          </div>

          <FormField label={t("products.form.category")} htmlFor="categoryId" error={errors.categoryId?.message}>
            <select id="categoryId" className={SELECT} {...form.register("categoryId")}>
              <option value="">{t("products.form.chooseCategory")}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name[lang] || category.name.ar}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label={t("products.form.price")}>
            <Controller
              control={form.control}
              name="price"
              render={({ field }) => (
                <MoneyInput
                  id="price"
                  value={field.value}
                  onChange={field.onChange}
                  errorUsd={errors.price?.usd?.message}
                  errorSyp={errors.price?.syp?.message}
                />
              )}
            />
          </FormField>

          <FormField label={t("products.form.oldPrice")} hint={t("products.form.oldPriceHint")}>
            <Controller
              control={form.control}
              name="oldPrice"
              render={({ field }) => (
                <MoneyInput
                  id="oldPrice"
                  value={field.value}
                  onChange={field.onChange}
                  errorUsd={errors.oldPrice?.usd?.message}
                  errorSyp={errors.oldPrice?.syp?.message}
                />
              )}
            />
          </FormField>

          <FormField label={t("products.form.image")}>
            <Controller
              control={form.control}
              name="imageUrl"
              render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
            />
          </FormField>

          <Controller
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <label className="flex items-center justify-between gap-3 rounded-2xl border p-3">
                <span className="text-sm font-medium">{t("products.form.available")}</span>
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