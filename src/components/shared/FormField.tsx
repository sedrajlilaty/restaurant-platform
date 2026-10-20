import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"

type Props = { label: string; htmlFor?: string; hint?: string; error?: string; children: ReactNode }

export function FormField({ label, htmlFor, hint, error, children }: Props) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {t(error)}
        </p>
      )}
    </div>
  )
}