import type { StoreSettings } from "@/features/tenant"
import type { Lang } from "@/types"

export type WorkingHour = StoreSettings["workingHours"][number]

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// dayOfWeek: 0 = الأحد ... 6 = السبت (نفس getDay بجافاسكربت). اليوم الناقص = مغلق
export function isOpenNow(hours: WorkingHour[], now = new Date()) {
  const day = now.getDay()
  const minutes = now.getHours() * 60 + now.getMinutes()

  return hours.some((slot) => {
    const open = toMinutes(slot.openTime)
    const close = toMinutes(slot.closeTime)

    if (close > open) return slot.dayOfWeek === day && minutes >= open && minutes < close
    // بيسكّر بعد منتصف الليل: الجزء الأول من اليوم نفسو، والباقي بصباح اليوم التالي
    return (slot.dayOfWeek === day && minutes >= open) || (slot.dayOfWeek === (day + 6) % 7 && minutes < close)
  })
}

// ترتيب عرض الأسبوع: بالعربي من السبت، وبالإنكليزي من الاثنين
export const dayOrder = (lang: Lang) => (lang === "ar" ? [6, 0, 1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 0])

export function slotsOfDay(hours: WorkingHour[], day: number) {
  return hours
    .filter((slot) => slot.dayOfWeek === day)
    .sort((a, b) => toMinutes(a.openTime) - toMinutes(b.openTime))
}