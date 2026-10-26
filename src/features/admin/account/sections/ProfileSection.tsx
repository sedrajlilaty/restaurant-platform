import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { FormField } from "@/components/shared/FormField"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { Input } from "@/components/ui/input"
import { useUpdateProfile } from "../account.api"

const schema = z.object({
  name: z.string().trim().min(1, "account.errors.required").max(60, "validation.tooLong"),
})
type Values = z.infer<typeof schema>

export function ProfileSection({ initialName }: { initialName: string }) {
  const { t } = useTranslation()
  const save = useUpdateProfile()

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: initialName },
  })
  const { errors, isDirty } = form.formState

  function onSubmit(values: Values) {
    save.mutate(values, {
      onSuccess: (user) => {
        form.reset({ name: user.name })
        toast.success(t("account.profile.saved"))
      },
      onError: () => toast.error(t("account.saveError")),
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SectionCard title={t("account.profile.title")} description={t("account.profile.desc")}>
        <FormField label={t("account.profile.name")} htmlFor="accountName" error={errors.name?.message}>
          <Input id="accountName" autoComplete="name" {...form.register("name")} />
        </FormField>
        <SectionFooter pending={save.isPending} disabled={!isDirty} />
      </SectionCard>
    </form>
  )
}