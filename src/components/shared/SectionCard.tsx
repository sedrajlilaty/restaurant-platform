import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

type CardProps = { title: string; description?: string; children: ReactNode }

export function SectionCard({ title, description, children }: CardProps) {
  return (
    <section className="space-y-6 rounded-3xl border bg-card p-5 shadow-sm md:p-8">
      <header className="space-y-1 border-b pb-4">
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </header>
      {children}
    </section>
  )
}

type FooterProps = { pending: boolean; disabled?: boolean; error?: string | null }

export function SectionFooter({ pending, disabled, error }: FooterProps) {
  const { t } = useTranslation()
  const unsaved = disabled === false && !pending

  return (
    <div className="sticky bottom-24 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur md:bottom-4">
      <div className="min-h-5 text-sm">
        {error ? (
          <p role="alert" className="text-destructive">
            {t(error)}
          </p>
        ) : unsaved ? (
          <p className="flex items-center gap-2 text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none">
            <span aria-hidden="true" className="size-2 rounded-full bg-brand-accent" />
            {t("settings.unsaved")}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={pending || disabled}>
        {pending ? t("common.saving") : t("settings.save")}
      </Button>
    </div>
  )
}