import type { ReactNode } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Globe, MapPin, Palette, type LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { FormField } from "@/components/shared/FormField"
import { ImageUpload } from "@/components/shared/ImageUpload"
import { RadioCards } from "@/components/shared/RadioCards"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { optionalPhone } from "@/lib/validation"
import { useSaveSettings } from "../settings.api"
import type { SettingsInfo } from "../settings.types"

const text = (max: number) => z.string().trim().max(max, "validation.tooLong")

const schema = z.object({
  descriptionAr: text(500),
  descriptionEn: text(500),
  addressAr: text(200),
  addressEn: text(200),
  phoneNumber: optionalPhone,
  whatsappNumber: optionalPhone,
  defaultLang: z.enum(["ar", "en"]),
  logoUrl: z.string().nullable(),
  coverUrl: z.string().nullable(),
})
type Values = z.infer<typeof schema>

function Group({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={title} className="space-y-5 rounded-2xl border bg-muted/30 p-4 md:p-6">
      <h3 className="flex items-center gap-3 font-semibold">
        <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        {title}
      </h3>
      {children}
    </div>
  )
}

export function InfoSection({ initial }: { initial: SettingsInfo }) {
  const { t } = useTranslation()
  const save = useSaveSettings<SettingsInfo>("info")

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      descriptionAr: initial.description.ar,
      descriptionEn: initial.description.en,
      addressAr: initial.address.ar,
      addressEn: initial.address.en,
      phoneNumber: initial.phoneNumber,
      whatsappNumber: initial.whatsappNumber,
      defaultLang: initial.defaultLang,
      logoUrl: initial.logoUrl,
      coverUrl: initial.coverUrl,
    },
  })
  const { errors, isDirty } = form.formState

  function onSubmit(values: Values) {
    save.mutate(
      {
        description: { ar: values.descriptionAr, en: values.descriptionEn },
        address: { ar: values.addressAr, en: values.addressEn },
        phoneNumber: values.phoneNumber,
        whatsappNumber: values.whatsappNumber,
        defaultLang: values.defaultLang,
        logoUrl: values.logoUrl,
        coverUrl: values.coverUrl,
      },
      {
        onSuccess: () => toast.success(t("settings.saved")),
        onError: () => toast.error(t("settings.saveError")),
      },
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SectionCard title={t("settings.info.title")} description={t("settings.info.desc")}>
        <div className="space-y-6">
          <Group icon={Palette} title={t("settings.info.groups.brand")}>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label={t("settings.info.logo")}>
                <Controller
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
                />
              </FormField>
              <FormField label={t("settings.info.cover")} hint={t("settings.info.coverHint")}>
                <Controller
                  control={form.control}
                  name="coverUrl"
                  render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
                />
              </FormField>
            </div>
          </Group>

          <Group icon={FileText} title={t("settings.info.groups.about")}>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label={t("settings.info.descriptionAr")} htmlFor="descriptionAr" error={errors.descriptionAr?.message}>
                <Textarea id="descriptionAr" dir="rtl" rows={4} {...form.register("descriptionAr")} />
              </FormField>
              <FormField label={t("settings.info.descriptionEn")} htmlFor="descriptionEn" error={errors.descriptionEn?.message}>
                <Textarea id="descriptionEn" dir="ltr" rows={4} {...form.register("descriptionEn")} />
              </FormField>
            </div>
          </Group>

          <Group icon={MapPin} title={t("settings.info.groups.contact")}>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label={t("settings.info.addressAr")} htmlFor="addressAr" error={errors.addressAr?.message}>
                <Input id="addressAr" dir="rtl" {...form.register("addressAr")} />
              </FormField>
              <FormField label={t("settings.info.addressEn")} htmlFor="addressEn" error={errors.addressEn?.message}>
                <Input id="addressEn" dir="ltr" {...form.register("addressEn")} />
              </FormField>
              <FormField label={t("settings.info.phone")} htmlFor="phoneNumber" error={errors.phoneNumber?.message}>
                <Input id="phoneNumber" type="tel" dir="ltr" inputMode="tel" {...form.register("phoneNumber")} />
              </FormField>
              <FormField
                label={t("settings.info.whatsapp")}
                htmlFor="whatsappNumber"
                hint={t("settings.info.whatsappHint")}
                error={errors.whatsappNumber?.message}
              >
                <Input id="whatsappNumber" type="tel" dir="ltr" inputMode="tel" {...form.register("whatsappNumber")} />
              </FormField>
            </div>
          </Group>

          <Group icon={Globe} title={t("settings.info.groups.site")}>
            <FormField label={t("settings.info.language")}>
              <Controller
                control={form.control}
                name="defaultLang"
                render={({ field }) => (
                  <RadioCards
                    name="defaultLang"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "ar", label: t("settings.info.langAr") },
                      { value: "en", label: t("settings.info.langEn") },
                    ]}
                  />
                )}
              />
            </FormField>
          </Group>

          <SectionFooter pending={save.isPending} disabled={!isDirty} />
        </div>
      </SectionCard>
    </form>
  )
}