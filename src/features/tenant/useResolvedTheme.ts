import { useMemo } from "react"
import { resolveTheme } from "@/features/theme"
import { useRestaurant } from "./useTenant"

export function useResolvedTheme() {
  const restaurant = useRestaurant()
  return useMemo(() => resolveTheme(restaurant.theme, restaurant.features), [restaurant.theme, restaurant.features])
}