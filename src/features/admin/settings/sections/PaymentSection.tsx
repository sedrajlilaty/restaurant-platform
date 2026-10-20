import { useState, type FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"
import { FormField } from "@/components/shared/FormField"
import { SectionCard, SectionFooter } from "@/components/shared/SectionCard"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useSaveSettings } from "../settings.api"
import type { PaymentMethodSetting } from "../settings.types"

const schema = z
  .object({ cash: z.boolean(), shamcash: z.boolean(), link: z.string().trim() })
  .superRefine((values, ctx) => {
    if (!values.cash && !values.shamcash) {
      ctx.addIssue({ code: "custom", path: ["form"], message: "settings.payment.atLeastOne" })
    }
    if (values.shamcash && !/^https:\/\/\S+$/i.test(values.link)) {
      ctx.addIssue({ code: "custom", path: ["link"], message: "settings.errors.url" })
    }
  })

type State = z.infer<typeof schema>

export function PaymentSection({ initial }: { initial: PaymentMethodSetting[] }) {
  const { t } = useTranslation()
  const save = useSaveSettings<PaymentMethodSetting[]>("payment-methods")

  const sham = initial.find((m) => m.method === "shamcash")
  const original: State = {
    cash: initial.find((m) => m.method === "cash")?.enabled ?? false,
    shamcash: sham?.enabled ?? false,
    link: sham?.paymentLink ?? "",
  }
  const [state, setState] = useState<State>(original)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const dirty = JSON.stringify(state) !== JSON.stringify(original)

  const update = (patch: Partial<State>) => {
    setErrors({})
    setState((s) => ({ ...s, ...patch }))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const result = schema.safeParse(state)
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message])))
      return
    }
    save.mutate(
      [
        { method: "cash", enabled: state.cash, paymentLink: null },
        { method: "shamcash", enabled: state.shamcash, paymentLink: state.link.trim() || null },
      ],
      {
        onSuccess: () => toast.success(t("settings.saved")),
        onError: () => toast.error(t("settings.saveError")),
      },
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <SectionCard title={t("settings.payment.title")} description={t("settings.payment.desc")}>
        <label className="flex items-center justify-between gap-3 rounded-2xl border p-3">
          <span>
            <span className="block font-medium">{t("checkout.methods.cash")}</span>
            <span className="block text-xs text-muted-foreground">{t("settings.payment.cashHint")}</span>
          </span>
          <Switch checked={state.cash} onCheckedChange={(cash) => update({ cash })} />
        </label>

        <div className="space-y-3 rounded-2xl border p-3">
          <label className="flex items-center justify-between gap-3">
            <span>
              <span className="block font-medium">{t("checkout.methods.shamcash")}</span>
              <span className="block text-xs text-muted-foreground">{t("settings.payment.shamcashHint")}</span>
            </span>
            <Switch checked={state.shamcash} onCheckedChange={(shamcash) => update({ shamcash })} />
          </label>

          {state.shamcash && (
            <FormField
              label={t("settings.payment.link")}
              htmlFor="shamLink"
              hint={t("settings.payment.linkHint")}
              error={errors.link}
            >
              <Input
                id="shamLink"
                type="url"
                dir="ltr"
                placeholder="https://..."
                value={state.link}
                onChange={(e) => update({ link: e.target.value })}
              />
            </FormField>
          )}
        </div>

        <SectionFooter pending={save.isPending} disabled={!dirty} error={errors.form} />
      </SectionCard>
    </form>
  )
}