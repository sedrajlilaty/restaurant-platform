import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type MoneyDraft = { usd: string; syp: string }

type Props = {
  id: string
  value: MoneyDraft
  onChange: (value: MoneyDraft) => void
  errorUsd?: string
  errorSyp?: string
}

type AmountFieldProps = {
  id: string
  label: string
  suffix: string
  value: string
  mode: "decimal" | "numeric"
  placeholder: string
  error?: string
  onChange: (value: string) => void
}

function AmountField({ id, label, suffix, value, mode, placeholder, error, onChange }: AmountFieldProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {/* dir=ltr حتى تضل الرموز على يمين الرقم بالعربي كمان */}
      <div dir="ltr" className="relative">
        <Input
          id={id}
          inputMode={mode}
          autoComplete="off"
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          className="pe-14"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-muted-foreground">
          {suffix}
        </span>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {t(error)}
        </p>
      )}
    </div>
  )
}

export function MoneyInput({ id, value, onChange, errorUsd, errorSyp }: Props) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AmountField
        id={`${id}-usd`}
        label={t("money.usd")}
        suffix="USD"
        mode="decimal"
        placeholder="0.00"
        value={value.usd}
        error={errorUsd}
        onChange={(usd) => onChange({ ...value, usd })}
      />
      <AmountField
        id={`${id}-syp`}
        label={t("money.syp")}
        suffix="SYP"
        mode="numeric"
        placeholder="0"
        value={value.syp}
        error={errorSyp}
        onChange={(syp) => onChange({ ...value, syp })}
      />
    </div>
  )
}