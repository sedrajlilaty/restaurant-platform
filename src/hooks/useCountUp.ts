import { useEffect, useRef, useState } from "react"

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    const total = reducedMotion() ? 0 : duration
    let frame = 0
    let start: number | null = null

    const tick = (now: number) => {
      if (start === null) start = now
      const t = total === 0 ? 1 : Math.min((now - start) / total, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = from + (target - from) * eased
      fromRef.current = current
      setValue(current)
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}