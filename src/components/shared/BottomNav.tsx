import type { LucideIcon } from "lucide-react"
import { NavLink } from "react-router"
import { cn } from "@/lib/utils"
import { CountBadge } from "./CountBadge"

export type BottomNavItem = {
  key: string
  label: string
  icon: LucideIcon
  to?: string
  end?: boolean
  onClick?: () => void
  badge?: number
  raised?: boolean
}

const base =
  "mx-auto flex w-fit flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 text-[11px] font-medium transition-colors"

export function BottomNav({ items }: { items: BottomNavItem[] }) {
  return (
    <nav
      aria-label="main"
      className="fixed inset-x-3 z-40 md:hidden"
      style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <ul className="mx-auto flex max-w-md items-end justify-around rounded-3xl border bg-card px-2 py-2 shadow-lg">
        {items.map((item) => {
          const Icon = item.icon

          if (item.raised && item.to) {
            return (
              <li key={item.key} className="flex-1">
                <NavLink
                  to={item.to}
                  aria-label={item.label}
                  className="relative mx-auto -mt-8 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background"
                >
                  <Icon className="size-6" />
                  <CountBadge count={item.badge ?? 0} />
                </NavLink>
              </li>
            )
          }

          const content = (
            <>
              <Icon className="size-5" />
              <span>{item.label}</span>
            </>
          )

          return (
            <li key={item.key} className="flex-1">
              {item.to ? (
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(base, isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground")
                  }
                >
                  {content}
                </NavLink>
              ) : (
                <button type="button" onClick={item.onClick} className={cn(base, "text-muted-foreground")}>
                  {content}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}