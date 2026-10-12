import { formatPrice } from "@/lib/format"
import type { Lang } from "@/lib/i18n"
import type { LocalizedText } from "@/types"
import type { PlacedOrder } from "./checkout.types"

const LABELS = {
  ar: {
    newOrder: "طلب جديد",
    type: "نوع الطلب",
    types: { dine_in: "داخل المطعم", takeaway: "تيك أواي", delivery: "توصيل" },
    table: "الطاولة",
    name: "الاسم",
    phone: "الهاتف",
    address: "العنوان",
    note: "ملاحظات",
    subtotal: "المجموع",
    discount: "الخصم",
    delivery: "التوصيل",
    total: "الإجمالي",
    payment: "الدفع",
    methods: { cash: "كاش", shamcash: "شام كاش" },
  },
  en: {
    newOrder: "New order",
    type: "Order type",
    types: { dine_in: "Dine in", takeaway: "Takeaway", delivery: "Delivery" },
    table: "Table",
    name: "Name",
    phone: "Phone",
    address: "Address",
    note: "Notes",
    subtotal: "Subtotal",
    discount: "Discount",
    delivery: "Delivery",
    total: "Total",
    payment: "Payment",
    methods: { cash: "Cash", shamcash: "Sham Cash" },
  },
}

export function buildWhatsappMessage(order: PlacedOrder, lang: Lang) {
  const t = LABELS[lang]
  const money = (value: number) => formatPrice(value, order.currency, lang)
  const pick = (text: LocalizedText) => text[lang] || text.ar || text.en

  const lines: string[] = [
    `*${t.newOrder} #${order.orderNumber}*`,
    `${t.type}: ${t.types[order.orderType]}`,
  ]
  if (order.tableNumber) lines.push(`${t.table}: ${order.tableNumber}`)
  lines.push(`${t.name}: ${order.customerName}`, `${t.phone}: ${order.customerPhone}`)
  if (order.deliveryAddress) lines.push(`${t.address}: ${order.deliveryAddress}`)

  lines.push("", "----------")
  for (const item of order.items) {
    const size = item.classifyName ? ` (${pick(item.classifyName)})` : ""
    lines.push(`${item.quantity}x ${pick(item.productName)}${size} - ${money(item.lineTotal)}`)
    for (const addon of item.addons) {
      lines.push(`   + ${pick(addon.name)}${addon.quantity > 1 ? ` x${addon.quantity}` : ""}`)
    }
    if (item.note) lines.push(`   ${t.note}: ${item.note}`)
  }
  lines.push("----------")

  lines.push(`${t.subtotal}: ${money(order.subtotal)}`)
  if (order.discountAmount > 0) lines.push(`${t.discount}: -${money(order.discountAmount)}`)
  if (order.orderType === "delivery") lines.push(`${t.delivery}: ${money(order.deliveryFee)}`)
  lines.push(`*${t.total}: ${money(order.total)}*`, `${t.payment}: ${t.methods[order.paymentMethod]}`)
  if (order.note) lines.push(`${t.note}: ${order.note}`)

  return lines.join("\n")
}