import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import ar from "@/locales/ar.json"
import en from "@/locales/en.json"

export type Lang = "ar" | "en"

const stored = localStorage.getItem("lang")

void i18n.use(initReactI18next).init({
  resources: { ar: { translation: ar }, en: { translation: en } },
  lng: stored === "en" || stored === "ar" ? stored : "ar",
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
})

export function setLanguage(lang: Lang, persist = true) {
  if (persist) localStorage.setItem("lang", lang)
  return i18n.changeLanguage(lang)
}

export default i18n