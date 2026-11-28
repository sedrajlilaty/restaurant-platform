import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { FormField } from "@/components/shared/FormField"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { requiredText } from "@/lib/validation"
import { useCreateBanner, useUpdateBanner } from "./banners.api"
import type { AdminBanner, BannerInput } from "./banners.types"

const optionalText = (max: number) => z.string().trim().max(max, "validation.tooLong")

// مسار داخلي (بيبدأ بـ / مش //) أو رابط https كامل، وغير هيك مرفوض
const isSafeLink = (value: string) => value === "" || /^\/(?!\/)\S*$/.test(value) || /^https:\/\/\S+$/i.test(value)

const schema = z.object({
  titleAr: requiredText(60),
  titleEn: requiredText(60),
  subtitleAr: optionalText(120),
  subtitleEn: optionalText(120),
  ctaLabelAr: optionalText(30),
  ctaLabelEn: optionalText(30),
  ctaLink: z.string().trim().max(300, "validation.tooLong").refine(isSafeLink, "banners.errors.link"),
  imageUrl: z.string().nullable().refine((value) => Boolean(value), "banners.errors.imageRequired"),
  isActive: z.boolean(),
})
type Values = z.infer<typeof schema>

type Props = { banner?: AdminBanner; onClose: () => void }

export function BannerForm({ banner, onClose }: Props) {
  const { t } = useTranslation()
  const create = useCreateBanner()
  const update = useUpdateBanner()
  const pending = create.isPending || update.isPending

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      titleAr: banner?.title.ar ?? "",
      titleEn: banner?.title.en ?? "",
      subtitleAr: banner?.subtitle?.ar ?? "",
      subtitleEn: banner?.subtitle?.en ?? "",
      ctaLabelAr: banner?.ctaLabel?.ar ?? "",
      ctaLabelEn: banner?.ctaLabel?.en ?? "",
      ctaLink: banner?.ctaLink ?? "",
      imageUrl: banner?.imageUrl ?? null,
      isActive: banner?.isActive ?? true,
    },
  })
  const { errors } = form.formState

  function onSubmit(values: Values) {
    const pair = (ar: string, en: string) => (ar || en ? { ar, en } : null)

    const input: BannerInput = {
      title: { ar: values.titleAr, en: values.titleEn },
      subtitle: pair(values.subtitleAr, values.subtitleEn),
      ctaLabel: pair(values.ctaLabelAr, values.ctaLabelEn),
      ctaLink: values.ctaLink || null,
      imageUrl: values.imageUrl,
      isActive: values.isActive,
    }
    const options = {
      onSuccess: () => {
        toast.success(t(banner ? "banners.toast.updated" : "banners.toast.added"))
        onClose()
      },
      onError: () => form.setError("root", { message: "banners.errors.generic" }),
    }
    if (banner) update.mutate({ id: banner.id, ...input }, options)
    else create.mutate(input, options)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{banner ? t("banners.form.editTitle") : t("banners.form.addTitle")}</DialogTitle>
          <DialogDescription className="sr-only">{t("banners.subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormField label={t("banners.form.image")} hint={t("banners.form.imageHint")} error={errors.imageUrl?.message}>
            <Controller
              control={form.control}
              name="imageUrl"
              render={({ field }) => <ImageUpload variant="wide" value={field.value} onChange={field.onChange} />}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("banners.form.titleAr")} htmlFor="titleAr" error={errors.titleAr?.message}>
              <Input id="titleAr" dir="rtl" autoFocus {...form.register("titleAr")} />
            </FormField>
            <FormField label={t("banners.form.titleEn")} htmlFor="titleEn" error={errors.titleEn?.message}>
              <Input id="titleEn" dir="ltr" {...form.register("titleEn")} />
            </FormField>
            <FormField label={t("banners.form.subtitleAr")} htmlFor="subtitleAr" error={errors.subtitleAr?.message}>
              <Input id="subtitleAr" dir="rtl" {...form.register("subtitleAr")} />
            </FormField>
            <FormField label={t("banners.form.subtitleEn")} htmlFor="subtitleEn" error={errors.subtitleEn?.message}>
              <Input id="subtitleEn" dir="ltr" {...form.register("subtitleEn")} />
            </FormField>
            <FormField label={t("banners.form.ctaLabelAr")} htmlFor="ctaLabelAr" error={errors.ctaLabelAr?.message}>
              <Input id="ctaLabelAr" dir="rtl" {...form.register("ctaLabelAr")} />
            </FormField>
            <FormField label={t("banners.form.ctaLabelEn")} htmlFor="ctaLabelEn" error={errors.ctaLabelEn?.message}>
              <Input id="ctaLabelEn" dir="ltr" {...form.register("ctaLabelEn")} />
            </FormField>
          </div>

          <FormField
            label={t("banners.form.link")}
            htmlFor="ctaLink"
            hint={t("banners.form.linkHint")}
            error={errors.ctaLink?.message}
          >
            <Input id="ctaLink" dir="ltr" placeholder="/category/..." {...form.register("ctaLink")} />
          </FormField>

          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <label className="flex items-center justify-between gap-3 rounded-2xl border p-3">
                <span className="text-sm font-medium">{t("banners.form.visible")}</span>
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