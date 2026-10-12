import { useMemo, useState } from "react"
import { Link } from "react-router"
import { Download, Plus, Printer, QrCode } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { PageHeader } from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
import { useQrDownload } from "@/lib/qr"
import { QrCard, QrImage } from "./QrCard"
import { TableForm } from "./TableForm"
import { useDeleteTable, useTables } from "./tables.api"
import type { Table } from "./tables.types"
import { restaurantUrl, sortTables } from "./tables.utils"

function GeneralQrCard() {
  const { t } = useTranslation()
  const { ref, download } = useQrDownload("restaurant-qr.png")

  return (
    <section className="flex flex-col items-center gap-4 rounded-3xl border bg-card p-4 shadow-sm sm:flex-row">
      <div ref={ref}>
        <QrImage value={restaurantUrl()} size={110} />
      </div>
      <div className="flex-1 space-y-2 text-center sm:text-start">
        <h2 className="font-bold">{t("tables.general.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("tables.general.desc")}</p>
        <p dir="ltr" className="break-all text-xs text-muted-foreground">
          {restaurantUrl()}
        </p>
        <Button variant="outline" size="sm" className="gap-2" onClick={download}>
          <Download className="size-4" />
          {t("tables.downloadQr")}
        </Button>
      </div>
    </section>
  )
}

export function TablesPage() {
  const { t } = useTranslation()
  const tables = useTables()
  const remove = useDeleteTable()
  const [dialog, setDialog] = useState<{ table?: Table } | null>(null)
  const [toDelete, setToDelete] = useState<Table | null>(null)

  const sorted = useMemo(() => sortTables(tables.data ?? []), [tables.data])

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("tables.title")}
        description={t("tables.subtitle")}
        actions={
          <>
            {sorted.length > 0 && (
              <Button asChild variant="outline" className="gap-2">
                <Link to="/admin/tables/print">
                  <Printer className="size-4" />
                  {t("tables.print")}
                </Link>
              </Button>
            )}
            <Button className="gap-2" onClick={() => setDialog({})}>
              <Plus className="size-4" />
              {t("tables.add")}
            </Button>
          </>
        }
      />

      <GeneralQrCard />

      {tables.isPending ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : tables.isError ? (
        <EmptyState title={t("tables.errors.generic")} />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={QrCode}
          title={t("tables.empty")}
          action={<p className="text-sm text-muted-foreground">{t("tables.emptyHint")}</p>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sorted.map((table) => (
            <QrCard
              key={table.id}
              table={table}
              onEdit={() => setDialog({ table })}
              onDelete={() => setToDelete(table)}
            />
          ))}
        </div>
      )}

      {dialog && <TableForm table={dialog.table} onClose={() => setDialog(null)} />}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={t("tables.delete.title")}
        description={toDelete ? t("tables.delete.desc", { number: toDelete.tableNumber }) : undefined}
        confirmLabel={t("common.delete")}
        loading={remove.isPending}
        onConfirm={() => {
          if (!toDelete) return
          remove.mutate(toDelete.id, {
            onSuccess: () => {
              toast.success(t("tables.toast.deleted"))
              setToDelete(null)
            },
            onError: () => toast.error(t("tables.errors.generic")),
          })
        }}
      />
    </div>
  )
}