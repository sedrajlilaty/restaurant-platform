import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

type Props = { icon: LucideIcon; title: string; children: ReactNode }

export function FormGroup({ icon: Icon, title, children }: Props) {
  return (
    <div role="group" aria-label={title} className="space-y-5 rounded-2xl border bg-muted/30 p-4 md:p-6">
      <h3 className="flex items-center gap-3 font-semibold">
        <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        {title}
      </h3>
      {children}
    </div>
  )
}