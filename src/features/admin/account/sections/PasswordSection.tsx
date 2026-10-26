import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { FormField } from "@/components/shared/FormField"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { Input } from "@/components/ui/input"
import { useChangePassword } from "../account.api"

const schema = z
  .object({
    currentPassword: z.string().min(1, "account.errors.required"),
    newPassword: z.string().min(6, "account.errors.passwordShort").max(72, "validation.tooLong"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "account.errors.mismatch",
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "account.errors.same",
  })
type Values = z.infer<typeof schema>

const EMPTY: Values = { currentPassword: "", newPassword: "", confirmPassword: "" }

export function PasswordSection() {
  const { t } = useTranslation()
  const save = useChangePassword()

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })
  const { errors, isDirty } = form.formState

  function onSubmit(values: Values) {
    save.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          form.reset(EMPTY)
          toast.success(t("account.password.saved"))
        },
        onError: (error) => {
          if (axios.isAxiosError<{ code?: string }>(error) && error.response?.data?.code === "WRONG_PASSWORD") {
            form.setError("currentPassword", { message: "account.password.wrong" })
            return
          }
          toast.error(t("account.saveError"))
        },
      },
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <SectionCard title={t("account.password.title")} description={t("account.password.desc")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField label={t("account.password.current")} htmlFor="currentPassword" error={errors.currentPassword?.message}>
              <Input
                id="currentPassword"
                type="password"
                dir="ltr"
                autoComplete="current-password"
                {...form.register("currentPassword")}
              />
            </FormField>
          </div>
          <FormField
            label={t("account.password.new")}
            htmlFor="newPassword"
            hint={t("account.password.newHint")}
            error={errors.newPassword?.message}
          >
            <Input id="newPassword" type="password" dir="ltr" autoComplete="new-password" {...form.register("newPassword")} />
          </FormField>
          <FormField label={t("account.password.confirm")} htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
            <Input
              id="confirmPassword"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              {...form.register("confirmPassword")}
            />
          </FormField>
        </div>
        <SectionFooter pending={save.isPending} disabled={!isDirty} />
      </SectionCard>
    </form>
  )
}