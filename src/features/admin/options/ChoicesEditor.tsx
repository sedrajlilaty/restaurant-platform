import { Plus, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { MoneyInput } from "@/components/shared/MoneyInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { newChoice, type ChoiceDraft } from "./options.schema"

export function FieldError({ message }: { message?: string }) {
  const { t } = useTranslation()
  if (!message) return null
  return (
    <p role="alert" className="text-sm text-destructive">
      {t(message)}
    </p>
  )
}

type Props = {
  choices: ChoiceDraft[]
  prefix: string // مسار الأخطاء، مثل "sizes" أو "groups.0.choices"
  errors: Record<string, string>
  single: boolean // بالمجموعة الوحيدة الاختيار، خيار افتراضي واحد فقط
  onChange: (choices: ChoiceDraft[]) => void
}

export function ChoicesEditor({ choices, prefix, errors, single, onChange }: Props) {
  const { t } = useTranslation()

  const patch = (index: number, change: Partial<ChoiceDraft>) =>
    onChange(choices.map((choice, i) => (i === index ? { ...choice, ...change } : choice)))

  const setDefault = (index: number, value: boolean) =>
    onChange(
      choices.map((choice, i) => {
        if (i === index) return { ...choice, isDefault: value }
        return single && value ? { ...choice, isDefault: false } : choice
      }),
    )

  return (
    <div className="space-y-3">
      {choices.map((choice, index) => {
        const at = `${prefix}.${index}`
        return (
          <div key={choice.id} className="space-y-3 rounded-2xl border p-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`${at}-ar`}>{t("options.choice.nameAr")}</Label>
                <Input
                  id={`${at}-ar`}
                  dir="rtl"
                  value={choice.nameAr}
                  onChange={(e) => patch(index, { nameAr: e.target.value })}
                />
                <FieldError message={errors[`${at}.nameAr`]} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${at}-en`}>{t("options.choice.nameEn")}</Label>
                <Input
                  id={`${at}-en`}
                  dir="ltr"
                  value={choice.nameEn}
                  onChange={(e) => patch(index, { nameEn: e.target.value })}
                />
                <FieldError message={errors[`${at}.nameEn`]} />
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-medium">{t("options.choice.price")}</p>
              <MoneyInput
                id={at}
                value={choice.price}
                onChange={(price) => patch(index, { price })}
                errorUsd={errors[`${at}.price.usd`]}
                errorSyp={errors[`${at}.price.syp`]}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={choice.isDefault} onCheckedChange={(value) => setDefault(index, value)} />
                {t("options.choice.default")}
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive"
                aria-label={t("common.delete")}
                onClick={() => onChange(choices.filter((_, i) => i !== index))}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        )
      })}

      <FieldError message={errors[prefix]} />

      <Button type="button" variant="outline" className="gap-2" onClick={() => onChange([...choices, newChoice()])}>
        <Plus className="size-4" />
        {t("options.choice.add")}
      </Button>
    </div>
  )
}