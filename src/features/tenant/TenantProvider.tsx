import { useEffect, type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import axios from "axios"
import { DEFAULT_THEME, applyTheme, resolveTheme, useModeStore } from "@/features/theme"
import { useDirection } from "@/hooks/useDirection"
import { setLanguage } from "@/lib/i18n"
import { fetchTenant } from "./tenant.api"
import { TenantContext } from "./useTenant"

export function TenantProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { lang } = useDirection()
  const override = useModeStore((s) => s.override)

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["tenant"],
    queryFn: fetchTenant,
    staleTime: 5 * 60_000,
  })

  useEffect(() => {
    if (data?.kind === "restaurant") {
      const resolved = resolveTheme(data.theme, data.features)
      const canSwitch = data.features.includes("theme_dark_mode")
      applyTheme({ ...resolved, mode: canSwitch && override ? override : resolved.mode }, lang)
    } else {
      applyTheme({ ...DEFAULT_THEME, mode: override ?? DEFAULT_THEME.mode }, lang)
    }
  }, [data, lang, override])

  useEffect(() => {
    if (data?.kind === "restaurant" && !localStorage.getItem("lang")) {
      void setLanguage(data.defaultLang, false)
    }
  }, [data])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        {t("common.loading")}
      </div>
    )
  }

  if (isError || !data) {
    const notFound = axios.isAxiosError(error) && error.response?.status === 404
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
        <p className="text-lg">{notFound ? t("tenant.notFound") : t("tenant.loadError")}</p>
        {!notFound && (
          <button
            onClick={() => void refetch()}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            {t("common.retry")}
          </button>
        )}
      </div>
    )
  }

  return <TenantContext.Provider value={data}>{children}</TenantContext.Provider>
}