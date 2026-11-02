import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Props = { title: string; description?: string; actions?: ReactNode; className?: string }

// قسم علوي ملوّن لصفحات لوحة المنصة، بتدرّج من لون الثيم وزخرفة ناعمة
export function PageHero({ title, description, actions, className }: Props) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-sm md:p-8",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -end-10 -top-12 -z-10 size-48 rounded-full bg-brand-accent/30 blur-2xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 start-1/3 -z-10 size-40 rounded-full bg-primary-foreground/10 blur-2xl"
      />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-1.5">
          <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
          {description && <p className="text-sm text-primary-foreground/80 md:text-base">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </section>
  )
}