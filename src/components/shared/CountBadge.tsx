export function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span
      key={count}
      className="absolute -top-1 -end-1 grid min-w-5 animate-in place-items-center rounded-full bg-brand-accent px-1 text-[11px] font-bold leading-5 text-brand-accent-foreground duration-300 zoom-in-50 motion-reduce:animate-none"
    >
      {count > 99 ? "99+" : count}
    </span>
  )
}