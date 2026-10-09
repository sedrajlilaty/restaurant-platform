import { cn } from "@/lib/utils"

export function RestaurantLogo({
  name,
  logoUrl,
  className,
}: {
  name: string
  logoUrl: string | null
  className?: string
}) {
  if (logoUrl) {
    return <img src={logoUrl} alt="" className={cn("size-10 shrink-0 rounded-2xl object-cover", className)} />
  }
  return (
    <span
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-2xl bg-primary font-bold text-primary-foreground",
        className,
      )}
    >
      {name.trim().charAt(0)}
    </span>
  )
}