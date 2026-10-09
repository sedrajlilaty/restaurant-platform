import type { ReactNode } from "react"
import { UtensilsCrossed, type LucideIcon } from "lucide-react"

export function EmptyState({
  title,
  icon: Icon = UtensilsCrossed,
  action,
}: {
  title: string
  icon?: LucideIcon
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed bg-card/60 px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <p className="text-muted-foreground">{title}</p>
      {action}
    </div>
  )
}