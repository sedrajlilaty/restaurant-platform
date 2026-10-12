import { Navigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { useCheckout } from "../checkout.store"
import { fetchTable } from "../orders.api"

export function TableEntryPage() {
  const { token = "" } = useParams()
  const { t } = useTranslation()
  const setTable = useCheckout((s) => s.setTable)

  const query = useQuery({
    queryKey: ["table", token],
    queryFn: async () => {
      const table = await fetchTable(token)
      setTable({ token, number: table.tableNumber })
      return table
    },
    enabled: token !== "",
    retry: false,
  })

  if (query.isPending) {
    return <p className="py-16 text-center text-muted-foreground">{t("common.loading")}</p>
  }
  if (query.isError) return <EmptyState title={t("table.invalid")} />

  return <Navigate to="/" replace />
}