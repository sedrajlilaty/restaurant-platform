import { delay, http, HttpResponse } from "msw"
import { tenants } from "./data"
import { banners, categories, products } from "./menuData"

export const handlers = [
  http.get("/api/public/restaurant", ({ request }) => {
    const host = new URL(request.url).searchParams.get("host") ?? ""
    const tenant = tenants[host]
    if (!tenant) return HttpResponse.json({ message: "Not found" }, { status: 404 })
    return HttpResponse.json(tenant)
  }),

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
    if (q) {
      list = list.filter((p) => `${p.name.ar} ${p.name.en}`.toLowerCase().includes(q))
    }

    const items = list.slice((page - 1) * limit, page * limit).map(({ featured: _f, ...product }) => product)
    return HttpResponse.json({ items, total: list.length })
  }),
]