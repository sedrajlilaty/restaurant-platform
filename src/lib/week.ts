import type { Lang } from "@/lib/i18n"

// dayOfWeek: 0 = الأحد ... 6 = السبت. بالعربي بيبدأ الأسبوع من السبت، وبالإنكليزي من الاثنين
export const dayOrder = (lang: Lang) => (lang === "ar" ? [6, 0, 1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6, 0])

export const weekdayName = (day: number, lang: Lang) =>
  new Intl.DateTimeFormat(lang, { weekday: "long" }).format(new Date(2024, 0, 7 + day)) // 7 كانون الثاني 2024 = أحد