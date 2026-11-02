import { useEffect, useRef, useState } from "react"

type Props = {
  value: number
  decimals?: number
  duration?: number
  format?: (value: number) => string
}

const plain = (value: number, decimals: number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)

// رقم بيعدّ من القيمة السابقة للجديدة، وبيظهر مباشرة لمن فعّل تقليل الحركة
export function AnimatedNumber({ value, decimals = 0, duration = 900, format }: Props) {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const [shown, setShown] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    if (reduce) return

    const begin = from.current
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = begin + (value - begin) * eased
      from.current = current
      setShown(current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration, reduce])

  const current = reduce ? value : shown
  return <span className="tabular-nums">{format ? format(current) : plain(current, decimals)}</span>
}