import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export function useDirection() {
  const { i18n } = useTranslation()
  const lang = i18n.language === "en" ? "en" : "ar"
  const dir = lang === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  return { lang, dir } as const
}