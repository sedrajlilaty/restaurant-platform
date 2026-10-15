import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { Search, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { Input } from "@/components/ui/input"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import { InfiniteProductGrid } from "../components/InfiniteProductGrid"

export function SearchPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const urlQuery = params.get("q") ?? ""
  const [text, setText] = useState(urlQuery)
  const debounced = useDebouncedValue(text.trim(), 300)

  // الرابط بيتحدّث بعد ما يوقف الكتابة (مع الاحتفاظ بإمكانية مشاركة الرابط)
  useEffect(() => {
    if (debounced !== urlQuery) setParams(debounced ? { q: debounced } : {}, { replace: true })
  }, [debounced, urlQuery, setParams])

  return (
    <div className="space-y-5">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          autoFocus={urlQuery === ""}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          className="h-12 rounded-full bg-card ps-12 pe-12 shadow-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {text && (
          <button
            type="button"
            onClick={() => setText("")}
            aria-label={t("search.clear")}
            className="absolute end-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {urlQuery === "" ? (
        <EmptyState icon={Search} title={t("search.hint")} />
      ) : (
        <InfiniteProductGrid
          key={urlQuery}
          params={{ q: urlQuery }}
          emptyTitle={t("search.noResults", { q: urlQuery })}
        />
      )}
    </div>
  )
}