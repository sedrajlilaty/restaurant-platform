import type { CSSProperties, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  icon: LucideIcon
  label: string
  children: ReactNode
  hint?: string
  className?: string
  style?: CSSProperties
}

export function StatCard({ icon: Icon, label, children, hint, className, style }: Props) {
  return (
    <div
      style={style}
      className={cn(
        "group flex items-center gap-4 rounded-3xl border bg-card p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-primary to-primary/70 text-primary-foreground shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
        <Icon className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="truncate text-2xl font-bold">{children}</p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}