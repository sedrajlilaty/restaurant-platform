import { useCountUp } from "@/hooks/useCountUp"

type Props = {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

export function AnimatedNumber({ value, duration, format, className }: Props) {
  const current = useCountUp(value, duration)
  const text = format ? format(current) : Math.round(current).toLocaleString("en-US")

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {text}
    </span>
  )
}