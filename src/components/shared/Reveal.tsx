import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type Props = {
  index?: number
  step?: number
  className?: string
  children: ReactNode
}

export function Reveal({ index = 0, step = 70, className, children }: Props) {
  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500 motion-reduce:animate-none",
        className
      )}
      style={{ animationDelay: `${index * step}ms` }}
    >
      {children}
    </div>
  )
}
