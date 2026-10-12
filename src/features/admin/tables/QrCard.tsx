import { Download, Pencil, Trash2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useQrDownload } from "@/lib/qr"
import { cn } from "@/lib/utils"
import { useUpdateTable } from "./tables.api"
import type { Table } from "./tables.types"
import { tableUrl } from "./tables.utils"

export function QrImage({ value, size = 120, dimmed }: { value: string; size?: number; dimmed?: boolean }) {
  return (
    <div className={cn("rounded-2xl bg-white p-3", dimmed && "opacity-40")}>
      <QRCodeSVG value={value} size={size} level="M" bgColor="#ffffff" fgColor="#000000" />
    </div>
  )
}

type Props = { table: Table; onEdit: () => void; onDelete: () => void }

export function QrCard({ table, onEdit, onDelete }: Props) {
  const { t } = useTranslation()
  const update = useUpdateTable()
  const { ref, download } = useQrDownload(`table-${table.tableNumber}.png`)

  return (
    <article className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-4 text-center shadow-sm">
      <div ref={ref}>
        <QrImage value={tableUrl(table.qrToken)} dimmed={!table.isActive} />
      </div>

      <h3 className="text-lg font-bold">{t("tables.table", { number: table.tableNumber })}</h3>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Switch
          checked={table.isActive}
          disabled={update.isPending}
          onCheckedChange={(checked) =>
            update.mutate(
              { id: table.id, isActive: checked },
              { onError: () => toast.error(t("tables.errors.generic")) },
            )
          }
        />
        {table.isActive ? t("tables.active") : t("tables.inactive")}
      </label>

      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={download} aria-label={t("tables.downloadQr")}>
          <Download className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label={t("common.edit")}>
          <Pencil className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} aria-label={t("common.delete")} className="text-destructive">
          <Trash2 className="size-4" />
        </Button>
      </div>
    </article>
  )
}