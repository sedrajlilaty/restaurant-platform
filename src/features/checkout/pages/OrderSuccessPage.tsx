import { Link, Navigate } from "react-router"
import { CircleCheck, MessageCircle, Wallet } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useRestaurant, useStoreSettings } from "@/features/tenant"
import { useLang } from "@/hooks/useLang"
import { formatPrice } from "@/lib/format"
import { whatsappLink } from "@/lib/whatsapp"
import { buildWhatsappMessage } from "../buildWhatsappMessage"
import { useCheckout } from "../checkout.store"

export function OrderSuccessPage() {
  const { t } = useTranslation()
  const lang = useLang()
  const restaurant = useRestaurant()
  const settings = useStoreSettings()
  const order = useCheckout((s) => s.lastOrder)

  if (!order) return <Navigate to="/" replace />

  const money = (value: number) => formatPrice(value, order.currency, lang)
  const pick = (text: { ar: string; en: string }) => text[lang] || text.ar || text.en

  const whatsappNumber = settings.data?.whatsappNumber
  const waHref = whatsappNumber
    ? whatsappLink(whatsappNumber, buildWhatsappMessage(order, restaurant.defaultLang))
    : null
  const shamLink =
    order.paymentMethod === "shamcash"
      ? settings.data?.paymentMethods.find((m) => m.method === "shamcash")?.paymentLink
      : null

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="space-y-2 text-center">
        <CircleCheck className="mx-auto size-14 text-primary" />
        <h1 className="text-xl font-bold">{t("orderSuccess.title")}</h1>
        <p className="text-muted-foreground">
          {t("orderSuccess.number")}: <span dir="ltr">#{order.orderNumber}</span>
        </p>
      </div>

      <section className="space-y-3 rounded-3xl border border-primary bg-card p-4 shadow-sm">
        <h2 className="font-bold">{t("orderSuccess.lastStep")}</h2>
        <p className="text-sm text-muted-foreground">{t("orderSuccess.lastStepBody")}</p>
        {waHref ? (
          <Button asChild size="lg" className="h-12 w-full gap-2 rounded-full text-base">
            <a href={waHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5" />
              {t("orderSuccess.sendWhatsapp")}
            </a>
          </Button>
        ) : (
          <p role="alert" className="text-sm text-destructive">
            {t("orderSuccess.noWhatsapp")}
          </p>
        )}
      </section>

      {shamLink && (
        <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm">
          <h2 className="font-bold">{t("checkout.methods.shamcash")}</h2>
          <p className="text-sm text-muted-foreground">{t("orderSuccess.payHint")}</p>
          <Button asChild variant="outline" className="h-11 w-full gap-2 rounded-full">
            <a href={shamLink} target="_blank" rel="noopener noreferrer">
              <Wallet className="size-4" />
              {t("orderSuccess.payShamcash")}
            </a>
          </Button>
        </section>
      )}

      <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm">
        <h2 className="font-bold">{t(`checkout.types.${order.orderType}.label`)}</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between gap-3">
              <span className="min-w-0">
                {item.quantity}× {pick(item.productName)}
                {item.classifyName && ` (${pick(item.classifyName)})`}
                {item.addons.length > 0 && (
                  <span className="block text-xs text-muted-foreground">
                    {item.addons.map((a) => pick(a.name)).join(" · ")}
                  </span>
                )}
              </span>
              <span className="shrink-0">{money(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-1 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t("cart.subtotal")}</dt>
            <dd>{money(order.subtotal)}</dd>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("orderSuccess.discount")}</dt>
              <dd>-{money(order.discountAmount)}</dd>
            </div>
          )}
          {order.orderType === "delivery" && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("orderSuccess.deliveryFee")}</dt>
              <dd>{money(order.deliveryFee)}</dd>
            </div>
          )}
          <div className="flex justify-between text-base font-bold">
            <dt>{t("orderSuccess.total")}</dt>
            <dd className="text-primary">{money(order.total)}</dd>
          </div>
        </dl>
      </section>

      <Button asChild variant="ghost" className="w-full rounded-full">
        <Link to="/">{t("orderSuccess.back")}</Link>
      </Button>
    </div>
  )
}