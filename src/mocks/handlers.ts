import { delay, http, HttpResponse } from "msw"
import type { OrderPayload, PlacedOrder, PlacedOrderItem } from "@/features/checkout"
import { storeSettings, tenants } from "./data"
import { banners, categories, optionGroupsByProduct, products } from "./menuData"
import { tablesDb } from "./tablesData"

const money = (value: number) => Math.round(value * 100) / 100
let orderCounter = 1000

export const handlers = [
  // المطعم حسب الدومين
  http.get("/api/public/restaurant", ({ request }) => {
    const host = new URL(request.url).searchParams.get("host") ?? ""
    const tenant = tenants[host]
    if (!tenant) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    return HttpResponse.json(tenant)
  }),

  // تسجيل الدخول
  http.post("/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string }
    if (password === "123456" && email === "admin@demo.com") {
      return HttpResponse.json({ token: "mock-owner-token", user: { id: "u1", name: "Demo Owner", role: "owner" } })
    }
    if (password === "123456" && email === "super@platform.com") {
      return HttpResponse.json({ token: "mock-super-token", user: { id: "u0", name: "Platform Admin", role: "superadmin" } })
    }
    return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 })
  }),

  // المنيو
  http.get("/api/public/banners", async () => {
    await delay(300)
    return HttpResponse.json(banners)
  }),

  http.get("/api/public/categories", async () => {
    await delay(300)
    return HttpResponse.json(categories)
  }),

  http.get("/api/public/products", async ({ request }) => {
    await delay(400)
    const params = new URL(request.url).searchParams
    const categoryId = params.get("categoryId")
    const featured = params.get("featured") === "true"
    const q = (params.get("q") ?? "").trim().toLowerCase()
    const page = Number(params.get("page") ?? 1)
    const limit = Number(params.get("limit") ?? 20)

    let list = products
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId)
    if (featured) list = list.filter((p) => p.featured)
    if (q) list = list.filter((p) => `${p.name.ar} ${p.name.en}`.toLowerCase().includes(q))

    const items = list.slice((page - 1) * limit, page * limit).map(({ featured: _f, ...product }) => product)
    return HttpResponse.json({ items, total: list.length })
  }),

  http.get("/api/public/products/:id", async ({ params }) => {
    await delay(300)
    const found = products.find((p) => p.id === params.id)
    if (!found) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    const { featured: _featured, ...product } = found
    return HttpResponse.json({ ...product, optionGroups: optionGroupsByProduct[found.id] ?? [] })
  }),

  // إعدادات المطعم العامة
  http.get("/api/public/settings", async () => {
    await delay(200)
    return HttpResponse.json(storeSettings)
  }),

  // الطاولة من رمز الـ QR
  http.get("/api/public/tables/:token", async ({ params }) => {
    await delay(200)
    const table = tablesDb.list.find((t) => t.qrToken === params.token && t.isActive)
    if (!table) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    return HttpResponse.json({ tableNumber: table.tableNumber })
  }),

  // إنشاء طلب
  http.post("/api/public/orders", async ({ request }) => {
    await delay(600)
    const body = (await request.json()) as OrderPayload

    const items: PlacedOrderItem[] = []
    for (const line of body.items) {
      const product = products.find((p) => p.id === line.productId)
      if (!product) return HttpResponse.json({ message: "Unknown product" }, { status: 400 })

      const choices = (optionGroupsByProduct[product.id] ?? []).flatMap((g) => g.choices)
      const classify = line.classifyId ? choices.find((c) => c.id === line.classifyId) : undefined
      const addons = line.addons.flatMap((a) => {
        const choice = choices.find((c) => c.id === a.addonId)
        return choice ? [{ name: choice.name, quantity: a.quantity, unitPrice: choice.price }] : []
      })

      const unitPrice = money(
        product.price + (classify?.price ?? 0) + addons.reduce((sum, a) => sum + a.unitPrice * a.quantity, 0),
      )
      items.push({
        productName: product.name,
        classifyName: classify?.name ?? null,
        quantity: line.quantity,
        unitPrice,
        lineTotal: money(unitPrice * line.quantity),
        note: line.note ?? null,
        addons,
      })
    }

    const subtotal = money(items.reduce((sum, i) => sum + i.lineTotal, 0))
    const deliveryFee = body.orderType === "delivery" ? 2 : 0

    const order: PlacedOrder = {
      id: crypto.randomUUID(),
      orderNumber: String(++orderCounter),
      orderType: body.orderType,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      deliveryAddress: body.deliveryAddress ?? null,
      tableNumber: tablesDb.list.find((t) => t.qrToken === body.tableToken)?.tableNumber ?? null,
      paymentMethod: body.paymentMethod,
      note: body.note ?? null,
      currency: "USD",
      subtotal,
      discountAmount: 0,
      deliveryFee,
      total: money(subtotal + deliveryFee),
      items,
      createdAt: new Date().toISOString(),
    }
    return HttpResponse.json(order, { status: 201 })
  }),

  // أدمن: الطاولات
  http.get("/api/admin/tables", async () => {
    await delay(300)
    return HttpResponse.json(tablesDb.list)
  }),

  http.post("/api/admin/tables", async ({ request }) => {
    await delay(400)
    const { tableNumbers } = (await request.json()) as { tableNumbers: string[] }
    const existing = new Set(tablesDb.list.map((t) => t.tableNumber))
    const duplicated = new Set(tableNumbers).size !== tableNumbers.length || tableNumbers.some((n) => existing.has(n))
    if (duplicated) return HttpResponse.json({ message: "Duplicate table number" }, { status: 409 })

    const created = tableNumbers.map((tableNumber) => ({
      id: crypto.randomUUID(),
      tableNumber,
      qrToken: `tbl-${crypto.randomUUID().slice(0, 8)}`,
      isActive: true,
    }))
    tablesDb.list = [...tablesDb.list, ...created]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch("/api/admin/tables/:id", async ({ params, request }) => {
    await delay(300)
    const patch = (await request.json()) as { tableNumber?: string; isActive?: boolean }
    const current = tablesDb.list.find((t) => t.id === params.id)
    if (!current) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    if (patch.tableNumber && tablesDb.list.some((t) => t.id !== current.id && t.tableNumber === patch.tableNumber)) {
      return HttpResponse.json({ message: "Duplicate table number" }, { status: 409 })
    }
    const updated = { ...current, ...patch }
    tablesDb.list = tablesDb.list.map((t) => (t.id === current.id ? updated : t))
    return HttpResponse.json(updated)
  }),

  http.delete("/api/admin/tables/:id", async ({ params }) => {
    await delay(300)
    tablesDb.list = tablesDb.list.filter((t) => t.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]