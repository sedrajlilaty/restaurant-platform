import { delay, http, HttpResponse } from "msw"
import type { AdminBanner, BannerInput } from "@/features/admin/banners/banners.types"
import { bannersDb } from "./bannersData"

export const bannerHandlers = [
  http.get("/api/admin/banners", async () => {
    await delay(300)
    return HttpResponse.json([...bannersDb.list].sort((a, b) => a.sortOrder - b.sortOrder))
  }),

  http.post("/api/admin/banners", async ({ request }) => {
    await delay(400)
    const input = (await request.json()) as BannerInput
    const created: AdminBanner = {
      id: crypto.randomUUID(),
      ...input,
      sortOrder: Math.max(-1, ...bannersDb.list.map((b) => b.sortOrder)) + 1,
    }
    bannersDb.list = [...bannersDb.list, created]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.put("/api/admin/banners/reorder", async ({ request }) => {
    await delay(200)
    const { ids } = (await request.json()) as { ids: string[] }
    const order = new Map(ids.map((id, index) => [id, index]))
    bannersDb.list = bannersDb.list.map((b) => ({ ...b, sortOrder: order.get(b.id) ?? b.sortOrder }))
    return new HttpResponse(null, { status: 204 })
  }),

  http.patch("/api/admin/banners/:id", async ({ params, request }) => {
    await delay(300)
    const patch = (await request.json()) as Partial<BannerInput>
    const current = bannersDb.list.find((b) => b.id === params.id)
    if (!current) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    const updated = { ...current, ...patch }
    bannersDb.list = bannersDb.list.map((b) => (b.id === current.id ? updated : b))
    return HttpResponse.json(updated)
  }),

  http.delete("/api/admin/banners/:id", async ({ params }) => {
    await delay(300)
    bannersDb.list = bannersDb.list.filter((b) => b.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]