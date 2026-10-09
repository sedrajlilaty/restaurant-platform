import { useRestaurant } from "@/features/tenant/useTenant"
import { formatPrice } from "@/lib/format"
import { useLang } from "./useLang"

export function usePrice() {
  const { currency } = useRestaurant()
  const lang = useLang()
  return (value: number) => formatPrice(value, currency, lang)
}