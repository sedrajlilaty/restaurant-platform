import type { LocalizedText } from "@/types"
import { useLang } from "./useLang"

export function useLocalized() {
  const lang = useLang()
  return (text: LocalizedText | null | undefined) => (text ? text[lang] || text.ar || text.en : "")
}