import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

type CardProps = { title: string; description?: string; children: ReactNode }

export function SectionCard({ title, description, children }: CardProps) {
  return (
    <section className="space-y-4 rounded-3xl border bg-card p-4 shadow-sm md:p-5">
      <header>
        <h2 className="font-bold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </header>
      {children}
    </section>
  )
}

type FooterProps = { pending: boolean; disabled?: boolean; error?: string | null }

export function SectionFooter({ pending, disabled, error }: FooterProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
      <p role="alert" className="text-sm text-destructive">
        {error ? t(error) : ""}
      </p>
      <Button type="submit" disabled={pending || disabled}>
        {pending ? t("common.saving") : t("settings.save")}
      </Button>
    </div>
  )
}