import { Link } from "react-router"
import { ArrowRight, Printer } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useRestaurant } from "@/features/tenant"
import { useLang } from "@/hooks/useLang"
import { useTables } from "./tables.api"
import { sortTables, tableUrl } from "./tables.utils"

export function TablesPrintPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const restaurant = useRestaurant()
  const tables = useTables()
  const active = sortTables((tables.data ?? []).filter((table) => table.isActive))

  return (
    <div className="min-h-screen bg-background p-4 text-foreground print:bg-white print:p-0">
      <style>{"@page { size: A4; margin: 12mm; }"}</style>

      <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
        <Button asChild variant="outline" className="gap-2">
          <Link to="/admin/tables">
            <ArrowRight className="size-4 ltr:rotate-180" />
            {t("common.back")}
          </Link>
        </Button>
        <Button className="gap-2" onClick={() => window.print()} disabled={active.length === 0}>
          <Printer className="size-4" />
          {t("tables.print")}
        </Button>
      </div>

      {tables.isPending ? (
        <p className="py-16 text-center text-muted-foreground">{t("common.loading")}</p>
      ) : active.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">{t("tables.empty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 print:gap-3">
          {active.map((table) => (
            <div
              key={table.id}
              className="flex break-inside-avoid flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-neutral-400 bg-white p-5 text-center text-black"
            >
              <p className="text-lg font-bold">{restaurant.name[lang]}</p>
              <p className="text-sm text-neutral-600">{t("tables.scanToOrder")}</p>
              <QRCodeSVG value={tableUrl(table.qrToken)} size={170} level="M" bgColor="#ffffff" fgColor="#000000" />
              <p className="text-2xl font-extrabold">{t("tables.table", { number: table.tableNumber })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}