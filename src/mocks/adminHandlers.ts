import { delay, http, HttpResponse } from "msw"
import type { AdminCategory,AdminSettings } from "@/features/admin"
import { categoriesDb } from "./categoriesData"
import { products } from "./menuData"
import { tablesDb } from "./tablesData"
import { settingsDb } from "./settingsData"
import { ordersDb } from "./ordersData"
type CategoryInput = Pick<AdminCategory, "name" | "imageUrl" | "isActive">

export const adminHandlers = [
  // رفع الصور: بالتجربة بيرجع رابط مؤقت للملف (بيختفي بتحديث الصفحة)
  http.post("/api/admin/uploads", async ({ request }) => {
    await delay(500)
    const form = await request.formData()
    const file = form.get("file")
    if (!(file instanceof File)) return HttpResponse.json({ message: "No file" }, { status: 400 })
    return HttpResponse.json({ url: URL.createObjectURL(file) })
  }),

  // الطاولات
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

  // التصنيفات
  http.get("/api/admin/categories", async () => {
    await delay(300)
    return HttpResponse.json([...categoriesDb.list].sort((a, b) => a.sortOrder - b.sortOrder))
  }),

  http.post("/api/admin/categories", async ({ request }) => {
    await delay(400)
    const input = (await request.json()) as CategoryInput
    const created: AdminCategory = {
      id: crypto.randomUUID(),
      ...input,
      sortOrder: Math.max(-1, ...categoriesDb.list.map((c) => c.sortOrder)) + 1,
    }
    categoriesDb.list = [...categoriesDb.list, created]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.put("/api/admin/categories/reorder", async ({ request }) => {
    await delay(200)
    const { ids } = (await request.json()) as { ids: string[] }
    const order = new Map(ids.map((id, index) => [id, index]))
    categoriesDb.list = categoriesDb.list.map((c) => ({ ...c, sortOrder: order.get(c.id) ?? c.sortOrder }))
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch("/api/admin/categories/:id", async ({ params, request }) => {
    await delay(300)
    const patch = (await request.json()) as Partial<CategoryInput>
    const current = categoriesDb.list.find((c) => c.id === params.id)
    if (!current) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    const updated = { ...current, ...patch }
    categoriesDb.list = categoriesDb.list.map((c) => (c.id === current.id ? updated : c))
    return HttpResponse.json(updated)
  }),

  http.delete("/api/admin/categories/:id", async ({ params }) => {
    await delay(300)
    if (products.some((p) => p.categoryId === params.id)) {
      return HttpResponse.json({ code: "HAS_PRODUCTS" }, { status: 409 })
    }
    categoriesDb.list = categoriesDb.list.filter((c) => c.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
    // الإعدادات
  http.get("/api/admin/settings", async () => {
    await delay(300)
    return HttpResponse.json(settingsDb.value)
  }),

  http.put("/api/admin/settings/:section", async ({ params, request }) => {
    await delay(400)
    const body = await request.json()
    const current = settingsDb.value
    const apply: Record<string, () => AdminSettings> = {
      info: () => ({ ...current, info: body as AdminSettings["info"] }),
      "order-types": () => ({ ...current, orderTypes: body as AdminSettings["orderTypes"] }),
      "payment-methods": () => ({ ...current, paymentMethods: body as AdminSettings["paymentMethods"] }),
      "working-hours": () => ({ ...current, workingHours: body as AdminSettings["workingHours"] }),
      "social-links": () => ({ ...current, socialLinks: body as AdminSettings["socialLinks"] }),
    }
    const update = apply[String(params.section)]
    if (!update) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    settingsDb.value = update()
    return new HttpResponse(null, { status: 204 })
  }),
    // رئيسية الأدمن
  http.get("/api/admin/dashboard", async () => {
    await delay(300)
    const today = new Date().toDateString()
    return HttpResponse.json({
      categories: categoriesDb.list.length,
      products: products.length,
      tables: tablesDb.list.length,
      ordersToday: ordersDb.list.filter((order) => new Date(order.createdAt).toDateString() === today).length,
    })
  }),
]