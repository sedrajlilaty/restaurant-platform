import { useRef, type ReactNode } from "react"
import { Navigate, useNavigate } from "react-router"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Armchair, Bike, ShoppingBag, type LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { EmptyState } from "@/components/shared/EmptyState"
import { RadioCards, type RadioCardOption } from "@/components/shared/RadioCards"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { selectCartSubtotal, useCart } from "@/features/cart"
import { useStoreSettings, type StoreSettings } from "@/features/tenant"
import { useLocalized } from "@/hooks/useLocalized"
import { usePrice } from "@/hooks/usePrice"
import type { OrderType } from "@/types"
import { checkoutSchema, type CheckoutValues } from "../checkout.schema"
import { useCheckout } from "../checkout.store"
import { buildOrderPayload, createOrder } from "../orders.api"

const TYPE_ICONS: Record<OrderType, LucideIcon> = {
  dine_in: Armchair,
  takeaway: ShoppingBag,
  delivery: Bike,
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm">
      <h2 className="font-bold">{title}</h2>
      {children}
    </section>
  )
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {t(error)}
        </p>
      )}
    </div>
  )
}

function CheckoutForm({ settings, onSubmitted }: { settings: StoreSettings; onSubmitted: () => void }) {
  const { t } = useTranslation()
  const l = useLocalized()
  const price = usePrice()
  const navigate = useNavigate()
  const items = useCart((s) => s.items)
  const subtotal = useCart(selectCartSubtotal)
  const clearCart = useCart((s) => s.clear)
  const table = useCheckout((s) => s.table)
  const setLastOrder = useCheckout((s) => s.setLastOrder)

  const dineInEnabled = settings.orderTypes.some((o) => o.type === "dine_in" && o.enabled)
  const types = settings.orderTypes
    .filter((o) => o.enabled && (o.type !== "dine_in" || table))
    .map((o) => o.type)
  const methods = settings.paymentMethods.filter((m) => m.enabled)

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      orderType: table && types.includes("dine_in") ? "dine_in" : (types[0] ?? "takeaway"),
      customerName: "",
      customerPhone: "",
      deliveryAddress: "",
      paymentMethod: methods[0]?.method ?? "cash",
      note: "",
    },
  })
  const orderType = form.watch("orderType")
  const { errors } = form.formState

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (order) => {
      onSubmitted()
      setLastOrder(order)
      clearCart()
      navigate("/order-success", { replace: true })
    },
  })

  if (types.length === 0) {
    return <EmptyState title={dineInEnabled ? t("checkout.scanTable") : t("checkout.noTypes")} />
  }
  if (methods.length === 0) return <EmptyState title={t("checkout.noPayment")} />

  const typeOptions: RadioCardOption<OrderType>[] = types.map((type) => ({
    value: type,
    label: t(`checkout.types.${type}.label`),
    description:
      type === "dine_in" && table
        ? t("checkout.table", { number: table.number })
        : t(`checkout.types.${type}.desc`),
    icon: TYPE_ICONS[type],
  }))

  const methodOptions: RadioCardOption<"cash" | "shamcash">[] = methods.map((m) => ({
    value: m.method,
    label: t(`checkout.methods.${m.method}`),
  }))

  const onSubmit = (values: CheckoutValues) => {
    mutation.mutate(buildOrderPayload(values, items, table?.token))
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold">{t("checkout.title")}</h1>

      <div className="space-y-5 md:grid md:grid-cols-[1fr_22rem] md:items-start md:gap-6 md:space-y-0">
        <form id="checkout-form" onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Section title={t("checkout.orderType")}>
            <Controller
              control={form.control}
              name="orderType"
              render={({ field }) => (
                <RadioCards name="orderType" value={field.value} onChange={field.onChange} options={typeOptions} />
              )}
            />
          </Section>

          <Section title={t("checkout.details")}>
            <Field label={t("checkout.name")} htmlFor="customerName" error={errors.customerName?.message}>
              <Input id="customerName" autoComplete="name" {...form.register("customerName")} />
            </Field>
            <Field label={t("checkout.phone")} htmlFor="customerPhone" error={errors.customerPhone?.message}>
              <Input
                id="customerPhone"
                type="tel"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                placeholder="09xxxxxxxx"
                {...form.register("customerPhone")}
              />
            </Field>
            {orderType === "delivery" && (
              <Field label={t("checkout.address")} htmlFor="deliveryAddress" error={errors.deliveryAddress?.message}>
                <Textarea
                  id="deliveryAddress"
                  autoComplete="street-address"
                  placeholder={t("checkout.addressPlaceholder")}
                  {...form.register("deliveryAddress")}
                />
              </Field>
            )}
            <Field label={t("checkout.note")} htmlFor="note" error={errors.note?.message}>
              <Textarea id="note" {...form.register("note")} />
            </Field>
          </Section>

          <Section title={t("checkout.payment")}>
            <Controller
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <RadioCards name="paymentMethod" value={field.value} onChange={field.onChange} options={methodOptions} />
              )}
            />
          </Section>
        </form>

        <aside className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm md:sticky md:top-24">
          <h2 className="font-bold">{t("checkout.summary")}</h2>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="min-w-0">
                  {item.qty}× {l(item.name)}
                  {item.options.length > 0 && (
                    <span className="block text-xs text-muted-foreground">
                      {item.options.map((o) => l(o.name)).join(" · ")}
                    </span>
                  )}
                </span>
                <span className="shrink-0">{price(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-muted-foreground">{t("cart.subtotal")}</span>
            <span className="text-lg font-bold">{price(subtotal)}</span>
          </div>
          {orderType === "delivery" && <p className="text-xs text-muted-foreground">{t("checkout.deliveryNote")}</p>}
          {mutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              {t("checkout.errors.submit")}
            </p>
          )}
          <Button
            type="submit"
            form="checkout-form"
            disabled={mutation.isPending}
            className="h-12 w-full rounded-full text-base"
          >
            {mutation.isPending ? t("checkout.submitting") : t("checkout.submit")}
          </Button>
        </aside>
      </div>
    </div>
  )
}

export function CheckoutPage() {
  const { t } = useTranslation()
  const items = useCart((s) => s.items)
  const settings = useStoreSettings()
  const submitted = useRef(false)

  if (items.length === 0 && !submitted.current) return <Navigate to="/cart" replace />

  if (settings.isPending) {
    return <p className="py-16 text-center text-muted-foreground">{t("common.loading")}</p>
  }
  if (settings.isError) return <EmptyState title={t("menu.loadError")} />

  return (
    <CheckoutForm
      settings={settings.data}
      onSubmitted={() => {
        submitted.current = true
      }}
    />
  )
}