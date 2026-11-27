import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound, Lock } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { FormField } from "@/components/shared/FormField"
import { FormGroup } from "@/components/shared/FormGroup"
import { PasswordInput } from "@/components/shared/PasswordInput"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { cn } from "@/lib/utils"
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

const LEVELS = ["weak", "medium", "strong"] as const
const BAR_COLORS = ["bg-destructive", "bg-brand-accent", "bg-primary"]

function scorePassword(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0
  if (password.length < 6) return 1
  let points = 0
  if (password.length >= 8) points++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++
  if (/\d/.test(password)) points++
  if (/[^A-Za-z0-9]/.test(password)) points++
  return points <= 1 ? 1 : points <= 3 ? 2 : 3
}

function StrengthMeter({ password }: { password: string }) {
  const { t } = useTranslation()
  const level = scorePassword(password)
  if (level === 0) return null

  return (
    <div aria-live="polite" className="space-y-1.5 animate-in fade-in duration-200 motion-reduce:animate-none">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300 motion-reduce:transition-none",
              step <= level ? BAR_COLORS[level - 1] : "bg-muted",
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {t("account.password.strength.label")}:{" "}
        <span className="font-medium text-foreground">{t(`account.password.strength.${LEVELS[level - 1]}`)}</span>
      </p>
    </div>
  )
}

export function PasswordSection() {
  const { t } = useTranslation()
  const save = useChangePassword()

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: EMPTY })
  const { errors, isDirty } = form.formState
  const newPassword = form.watch("newPassword")

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
        <div className="space-y-6">
          <FormGroup icon={Lock} title={t("account.password.groups.current")}>
            <div className="md:max-w-md">
              <FormField label={t("account.password.current")} htmlFor="currentPassword" error={errors.currentPassword?.message}>
                <PasswordInput id="currentPassword" autoComplete="current-password" {...form.register("currentPassword")} />
              </FormField>
            </div>
          </FormGroup>

          <FormGroup icon={KeyRound} title={t("account.password.groups.new")}>
            <div className="grid items-start gap-5 md:grid-cols-2">
              <FormField
                label={t("account.password.new")}
                htmlFor="newPassword"
                hint={t("account.password.newHint")}
                error={errors.newPassword?.message}
              >
                <div className="space-y-3">
                  <PasswordInput id="newPassword" autoComplete="new-password" {...form.register("newPassword")} />
                  <StrengthMeter password={newPassword} />
                </div>
              </FormField>
              <FormField label={t("account.password.confirm")} htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
                <PasswordInput id="confirmPassword" autoComplete="new-password" {...form.register("confirmPassword")} />
              </FormField>
            </div>
          </FormGroup>

          <SectionFooter pending={save.isPending} disabled={!isDirty} />
        </div>
      </SectionCard>
    </form>
  )
}